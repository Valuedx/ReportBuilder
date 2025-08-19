from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from .models import Report, ReportExecution, ReportSchedule
from data_sources.models import DataSource
import logging
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from pathlib import Path
from sqlalchemy import text as sql_text
import pandas as pd
import os

logger = logging.getLogger(__name__)


@shared_task(bind=True)
def generate_report_task(self, execution_id):
    """Generate a report asynchronously"""
    try:
        execution = ReportExecution.objects.get(id=execution_id)
        execution.status = 'running'
        execution.save()
        
        report = execution.report

        # Execute query to retrieve data
        query_result = _execute_report_query(report)
        df = query_result.get('dataframe')
        selected_fields = query_result.get('selected_fields') or []
        used_tables = query_result.get('tables') or []
        
        media_root = Path(getattr(settings, 'MEDIA_ROOT', Path.cwd()))
        reports_dir = media_root / 'reports'
        reports_dir.mkdir(parents=True, exist_ok=True)
        file_ext = _ext_for_format(report.report_format)
        file_name = f'report_{execution.id}.{file_ext}'
        file_path = reports_dir / file_name

        if report.report_format == 'CSV':
            (df or pd.DataFrame()).to_csv(str(file_path), index=False)
        elif report.report_format == 'Excel':
            (df or pd.DataFrame()).to_excel(str(file_path), index=False)
        else:
            # PDF or other formats: simple PDF summary and sample rows
            page_size = landscape(A4) if getattr(report, 'layout', 'table') in ['dashboard', 'chart'] else A4
            c = canvas.Canvas(str(file_path), pagesize=page_size)
            width, height = page_size
            c.setFont("Helvetica-Bold", 18)
            c.drawString(50, height - 50, f"Report: {report.name}")
            c.setFont("Helvetica", 12)
            c.drawString(50, height - 80, f"Generated at: {timezone.now().strftime('%Y-%m-%d %H:%M:%S %Z')}")
            c.drawString(50, height - 100, f"Layout: {report.layout} | Template: {report.template}")
            if used_table:
                c.drawString(50, height - 120, f"Source table: {used_table}")
            c.drawString(50, height - 145, "Fields:")
            y = height - 165
            for field_label in [f.get('label') or f.get('name') for f in (selected_fields or [])][:20]:
                c.drawString(70, y, f"- {field_label}")
                y -= 14
                if y < 80:
                    c.showPage()
                    c.setFont("Helvetica", 12)
                    y = height - 60
            # Sample data rows
            if df is not None and not df.empty:
                c.showPage()
                c.setFont("Helvetica-Bold", 14)
                c.drawString(50, height - 50, "Sample Data (first 25 rows)")
                c.setFont("Helvetica", 10)
                y = height - 70
                col_names = list(df.columns)
                header = ", ".join(col_names[:6])
                c.drawString(50, y, header)
                y -= 14
                for _, row in df.head(25).iterrows():
                    line = ", ".join([str(row.get(col))[:30] for col in col_names[:6]])
                    c.drawString(50, y, line)
                    y -= 12
                    if y < 60:
                        c.showPage()
                        c.setFont("Helvetica", 10)
                        y = height - 60
            c.showPage()
            c.save()

        stat = os.stat(file_path)
        # Mark as completed with URL path under MEDIA_URL
        media_url = getattr(settings, 'MEDIA_URL', '/media/')
        url_path = f"{media_url.rstrip('/')}/reports/{file_name}"
        execution.mark_completed(
            file_path=url_path,
            file_size=stat.st_size,
            row_count=(0 if df is None else int(df.shape[0]))
        )
        
        # Update report execution count
        execution.report.increment_execution_count()
        
        # Send email if configured
        if hasattr(execution.report, 'email_distribution') and execution.report.email_distribution.is_enabled:
            send_report_email_task.delay(execution.id)
        
        logger.info(f"Report {execution.report.name} generated successfully")
        return True
        
    except Exception as e:
        logger.error(f"Error generating report: {str(e)}")
        if execution:
            execution.mark_failed(str(e))
        return False


@shared_task
def send_report_email_task(execution_id):
    """Send report via email"""
    try:
        execution = ReportExecution.objects.get(id=execution_id)
        email_config = execution.report.email_distribution
        
        # TODO: Implement actual email sending with SendGrid or similar
        # For now, use Django's console email backend
        
        subject = email_config.subject_template
        message = email_config.body_template
        
        for recipient in email_config.recipients:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[recipient['email']],
                fail_silently=False,
            )
        
        execution.emails_sent = len(email_config.recipients)
        execution.email_status = 'sent'
        execution.save()
        
        logger.info(f"Email sent for report {execution.report.name}")
        return True
        
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        if execution:
            execution.email_status = 'failed'
            execution.save()
        return False


@shared_task
def check_scheduled_reports():
    """Check for reports that need to be executed based on schedule"""
    try:
        now = timezone.now()
        schedules = ReportSchedule.objects.filter(
            is_enabled=True,
            next_execution__lte=now
        )
        
        for schedule in schedules:
            # Create execution record
            execution = ReportExecution.objects.create(
                report=schedule.report,
                started_at=now,
                status='pending'
            )
            
            # Queue report generation
            generate_report_task.delay(execution.id)
            
            # Update next execution time
            # Compute next execution based on schedule settings
            freq = schedule.frequency
            if freq == 'daily':
                schedule.next_execution = now + timezone.timedelta(days=1)
            elif freq == 'weekly':
                schedule.next_execution = now + timezone.timedelta(weeks=1)
            elif freq == 'monthly':
                schedule.next_execution = now + timezone.timedelta(days=30)
            elif freq == 'quarterly':
                schedule.next_execution = now + timezone.timedelta(days=90)
            else:
                schedule.next_execution = now + timezone.timedelta(days=1)
            schedule.save()
            
            logger.info(f"Scheduled report {schedule.report.name} queued for execution")
        
        return f"Checked {schedules.count()} scheduled reports"
        
    except Exception as e:
        logger.error(f"Error checking scheduled reports: {str(e)}")
        return False


@shared_task
def cleanup_old_executions():
    """Clean up old execution records to prevent database bloat"""
    try:
        # Keep executions for 90 days
        cutoff_date = timezone.now() - timezone.timedelta(days=90)
        old_executions = ReportExecution.objects.filter(
            created_at__lt=cutoff_date,
            status__in=['completed', 'failed']
        )
        
        count = old_executions.count()
        old_executions.delete()
        
        logger.info(f"Cleaned up {count} old execution records")
        return count
        
    except Exception as e:
        logger.error(f"Error cleaning up old executions: {str(e)}")
        return False


def _ext_for_format(fmt):
    mapping = {
        'PDF': 'pdf',
        'Excel': 'xlsx',
        'CSV': 'csv',
        'PowerPoint': 'pdf',  # not implemented; fall back to pdf
    }
    return mapping.get(str(fmt), 'pdf')


def _execute_report_query(report: Report):
    """Enhanced query execution supporting multiple tables with JOIN operations.

    Expects report.data_sources to include objects like:
    { dataSourceId, tableName, columns: [{ name, label, ... }], joins: [{ targetTable, joinType, onCondition }] }
    """
    try:
        data_sources = report.data_sources if isinstance(report.data_sources, list) else []
        if not data_sources:
            return {'dataframe': None, 'selected_fields': [], 'tables': []}

        # Group data sources by dataSourceId to handle multiple databases
        ds_groups = {}
        for ds_config in data_sources:
            ds_id = ds_config.get('dataSourceId')
            if ds_id:
                if ds_id not in ds_groups:
                    ds_groups[ds_id] = []
                ds_groups[ds_id].append(ds_config)

        # For now, handle single data source with multiple tables
        # TODO: Extend to support cross-database queries
        if len(ds_groups) > 1:
            logger.warning("Cross-database queries not yet supported, using first data source")
        
        first_ds_id = list(ds_groups.keys())[0]
        ds_tables = ds_groups[first_ds_id]
        
        try:
            ds = DataSource.objects.get(id=first_ds_id)
        except Exception:
            return {'dataframe': None, 'selected_fields': [], 'tables': []}

        engine = ds._build_sqlalchemy_engine()
        if engine is None:
            return {'dataframe': None, 'selected_fields': [], 'tables': []}

        # Build the SQL query for multiple tables
        table_relationships = getattr(report, 'table_relationships', []) or []
        calculated_fields = getattr(report, 'calculated_fields', []) or []
        cte_definitions = getattr(report, 'cte_definitions', []) or []
        sql_parts = _build_multi_table_query(ds_tables, report.fields, report.filters, table_relationships, calculated_fields, cte_definitions)
        
        if not sql_parts['select_clause'] or not sql_parts['from_clause']:
            return {'dataframe': None, 'selected_fields': [], 'tables': [table['tableName'] for table in ds_tables]}

        # Build complete SQL with CTEs if present
        cte_clause = sql_parts.get('cte_clause', '')
        main_query = f"SELECT {sql_parts['select_clause']} FROM {sql_parts['from_clause']}{sql_parts['where_clause']}"
        
        # Add GROUP BY if calculated fields contain aggregations
        group_by_clause = sql_parts.get('group_by_clause', '')
        
        sql = f"{cte_clause}{main_query}{group_by_clause} LIMIT 1000"
        
        logger.info(f"Executing multi-table query: {sql}")

        with engine.connect() as conn:
            result = conn.execute(sql_text(sql), sql_parts['params'])
            df = pd.DataFrame(result.fetchall(), columns=result.keys())
        
        return {
            'dataframe': df, 
            'selected_fields': sql_parts['selected_fields'], 
            'tables': [table['tableName'] for table in ds_tables]
        }
    except Exception as e:
        logger.error(f"Multi-table query execution error: {e}")
        return {'dataframe': None, 'selected_fields': [], 'tables': []}


def _build_multi_table_query(ds_tables, fields, filters, table_relationships=None, calculated_fields=None, cte_definitions=None):
    """Build SQL query components for multiple tables with proper JOINs, calculated fields, and CTEs."""
    
    if not ds_tables:
        return {'select_clause': '', 'from_clause': '', 'where_clause': '', 'params': {}, 'selected_fields': []}
    
    # Start with the first table as the base
    primary_table = ds_tables[0]['tableName']
    from_clause = primary_table
    
    # Use stored table relationships if available
    relationships_dict = {}
    if table_relationships:
        for rel in table_relationships:
            key = f"{rel.get('sourceTable')}_{rel.get('targetTable')}"
            relationships_dict[key] = rel
    
    # Process additional tables and their joins
    for table_config in ds_tables[1:]:
        table_name = table_config['tableName']
        
        # Check for stored relationship first
        rel_key1 = f"{primary_table}_{table_name}"
        rel_key2 = f"{table_name}_{primary_table}"
        
        relationship = relationships_dict.get(rel_key1) or relationships_dict.get(rel_key2)
        
        if relationship:
            # Use stored relationship
            join_type = relationship.get('joinType', 'LEFT JOIN')
            on_condition = relationship.get('onCondition')
            if on_condition:
                from_clause += f" {join_type} {table_name} ON {on_condition}"
            else:
                # Build condition from source/target columns
                source_col = relationship.get('sourceColumn')
                target_col = relationship.get('targetColumn')
                source_table = relationship.get('sourceTable')
                target_table = relationship.get('targetTable')
                if source_col and target_col and source_table and target_table:
                    from_clause += f" {join_type} {table_name} ON {source_table}.{source_col} = {target_table}.{target_col}"
        else:
            # Fallback to auto-detection
            joins = table_config.get('joins', [])
            
            if not joins:
                join_condition = _detect_auto_join(primary_table, table_name)
                if join_condition:
                    from_clause += f" LEFT JOIN {table_name} ON {join_condition}"
                else:
                    # Cross join as fallback (be careful with large datasets)
                    from_clause += f" CROSS JOIN {table_name}"
            else:
                # Use explicit join configuration
                for join in joins:
                    join_type = join.get('joinType', 'LEFT JOIN')
                    on_condition = join.get('onCondition', '')
                    if on_condition:
                        from_clause += f" {join_type} {table_name} ON {on_condition}"
    
    # Build SELECT clause from fields and calculated fields
    selected_fields = []
    select_parts = []
    
    # Add regular fields
    if isinstance(fields, list) and fields:
        for field in fields:
            table_name = field.get('table')
            field_name = field.get('name')
            field_alias = field.get('label', field_name)
            
            if field_name and table_name:
                # Use table-qualified field names
                qualified_field = f"{table_name}.{field_name}"
                if field_alias and field_alias != field_name:
                    select_parts.append(f"{qualified_field} AS \"{field_alias}\"")
                else:
                    select_parts.append(qualified_field)
                selected_fields.append(field)
    
    # Add calculated fields
    if isinstance(calculated_fields, list) and calculated_fields:
        for calc_field in calculated_fields:
            field_name = calc_field.get('name')
            field_label = calc_field.get('label', field_name)
            expression = calc_field.get('expression')
            
            if field_name and expression:
                # Add calculated field expression with alias
                if field_label and field_label != field_name:
                    select_parts.append(f"({expression}) AS \"{field_label}\"")
                else:
                    select_parts.append(f"({expression}) AS \"{field_name}\"")
                
                # Add to selected fields for tracking
                selected_fields.append({
                    'name': field_name,
                    'label': field_label,
                    'type': calc_field.get('dataType', 'numeric'),
                    'isCalculated': True,
                    'expression': expression
                })
    
    select_clause = ", ".join(select_parts) if select_parts else "*"
    
    # Build WHERE clause from filters
    where_clauses = []
    params = {}
    
    if isinstance(filters, list):
        for i, flt in enumerate(filters):
            field_id = flt.get('field', '')
            operator = flt.get('operator')
            value = flt.get('value')
            
            if not field_id or operator is None:
                continue
            
            # Handle table.field format
            if '.' in field_id:
                table_field = field_id
            else:
                # Try to find the table for this field
                table_field = _find_field_table(field_id, ds_tables)
                if not table_field:
                    continue
            
            param_name = f"param_{i}"
            
            if operator == 'equals':
                where_clauses.append(f"{table_field} = :{param_name}")
                params[param_name] = value
            elif operator == 'not_equals':
                where_clauses.append(f"{table_field} <> :{param_name}")
                params[param_name] = value
            elif operator == 'greater_than':
                where_clauses.append(f"{table_field} > :{param_name}")
                params[param_name] = value
            elif operator == 'less_than':
                where_clauses.append(f"{table_field} < :{param_name}")
                params[param_name] = value
            elif operator == 'contains':
                where_clauses.append(f"{table_field} LIKE :{param_name}")
                params[param_name] = f"%{value}%"
            elif operator == 'starts_with':
                where_clauses.append(f"{table_field} LIKE :{param_name}")
                params[param_name] = f"{value}%"
            elif operator == 'is_null':
                where_clauses.append(f"{table_field} IS NULL")
            elif operator == 'not_null':
                where_clauses.append(f"{table_field} IS NOT NULL")
    
    where_clause = (" WHERE " + " AND ".join(where_clauses)) if where_clauses else ""
    
    # Build CTE clause if CTEs are defined
    cte_clause = ""
    if isinstance(cte_definitions, list) and cte_definitions:
        cte_parts = []
        for cte in cte_definitions:
            cte_name = cte.get('name')
            cte_query = cte.get('query')
            if cte_name and cte_query:
                cte_parts.append(f"{cte_name} AS ({cte_query})")
        
        if cte_parts:
            cte_clause = "WITH " + ", ".join(cte_parts) + " "
    
    # Detect if we need GROUP BY for aggregations
    group_by_clause = ""
    has_aggregations = False
    non_agg_fields = []
    
    if isinstance(calculated_fields, list):
        for calc_field in calculated_fields:
            expression = calc_field.get('expression', '').upper()
            if any(agg in expression for agg in ['SUM(', 'COUNT(', 'AVG(', 'MIN(', 'MAX(']):
                has_aggregations = True
                break
    
    # If we have aggregations, we need to group by non-aggregate fields
    if has_aggregations:
        # Get regular (non-calculated) fields for GROUP BY
        if isinstance(fields, list):
            for field in fields:
                table_name = field.get('table')
                field_name = field.get('name')
                if field_name and table_name:
                    non_agg_fields.append(f"{table_name}.{field_name}")
        
        # Add non-aggregate calculated fields to GROUP BY
        if isinstance(calculated_fields, list):
            for calc_field in calculated_fields:
                expression = calc_field.get('expression', '').upper()
                if not any(agg in expression for agg in ['SUM(', 'COUNT(', 'AVG(', 'MIN(', 'MAX(']):
                    field_name = calc_field.get('name')
                    if field_name:
                        non_agg_fields.append(f'"{field_name}"')
        
        if non_agg_fields:
            group_by_clause = " GROUP BY " + ", ".join(non_agg_fields)
    
    return {
        'select_clause': select_clause,
        'from_clause': from_clause,
        'where_clause': where_clause,
        'cte_clause': cte_clause,
        'group_by_clause': group_by_clause,
        'params': params,
        'selected_fields': selected_fields
    }


def _detect_auto_join(table1, table2):
    """Attempt to detect join conditions between two tables based on common column patterns."""
    
    # Common patterns for join relationships
    join_patterns = [
        f"{table1}.id = {table2}.{table1}_id",
        f"{table1}.{table2}_id = {table2}.id",
        f"{table1}.id = {table2}.{table1[:-1]}_id" if table1.endswith('s') else None,  # users -> user_id
        f"{table1}.customer_id = {table2}.id" if 'customer' in table2 else None,
        f"{table1}.user_id = {table2}.id" if 'user' in table2 else None,
        f"{table1}.product_id = {table2}.id" if 'product' in table2 else None,
    ]
    
    # Filter out None values and return the first valid pattern
    # In a real implementation, you'd inspect the actual table schema
    valid_patterns = [p for p in join_patterns if p is not None]
    
    # For now, return a basic id-based join as default
    # This should be enhanced to actually inspect table schemas
    return f"{table1}.id = {table2}.{table1}_id" if valid_patterns else None


def _find_field_table(field_name, ds_tables):
    """Find which table contains the specified field."""
    
    for table_config in ds_tables:
        table_name = table_config['tableName']
        columns = table_config.get('columns', [])
        
        for column in columns:
            if column.get('name') == field_name:
                return f"{table_name}.{field_name}"
    
    # If not found in table configs, assume it's in the first table
    if ds_tables:
        return f"{ds_tables[0]['tableName']}.{field_name}"
    
    return None
