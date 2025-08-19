from django.db import models
from django.conf import settings
from django.utils import timezone
from sqlalchemy import create_engine, inspect
from sqlalchemy.engine import URL
from sqlalchemy.exc import SQLAlchemyError


class DataSource(models.Model):
    """Database connection configurations"""
    
    DB_TYPE_CHOICES = [
        ('postgresql', 'PostgreSQL'),
        ('mysql', 'MySQL'),
        ('sqlserver', 'SQL Server'),
        ('oracle', 'Oracle'),
        ('rest_api', 'REST API'),
        ('mongodb', 'MongoDB'),
    ]
    
    STATUS_CHOICES = [
        ('connected', 'Connected'),
        ('disconnected', 'Disconnected'),
        ('error', 'Connection Error'),
        ('testing', 'Testing'),
    ]
    
    name = models.CharField(max_length=200)
    db_type = models.CharField(max_length=20, choices=DB_TYPE_CHOICES)
    
    # Connection Details
    host = models.CharField(max_length=255)
    port = models.IntegerField()
    database = models.CharField(max_length=100)
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=255)  # Encrypted in production
    
    # SSL Configuration
    use_ssl = models.BooleanField(default=False)
    ssl_cert_path = models.CharField(max_length=500, blank=True)
    
    # Additional Configuration
    connection_string = models.TextField(blank=True)  # For complex connections
    options = models.JSONField(default=dict)  # Additional connection options
    
    # Status
    is_active = models.BooleanField(default=True)
    last_tested = models.DateTimeField(null=True, blank=True)
    connection_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='disconnected')
    
    # Metadata
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'data_sources'
        ordering = ['-created_at']
        verbose_name = 'Data Source'
        verbose_name_plural = 'Data Sources'
    
    def __str__(self):
        return f"{self.name} ({self.get_db_type_display()})"
    
    def get_connection_params(self):
        """Get connection parameters for database connection"""
        return {
            'host': self.host,
            'port': self.port,
            'database': self.database,
            'username': self.username,
            'password': self.password,
            'use_ssl': self.use_ssl,
            'ssl_cert_path': self.ssl_cert_path if self.use_ssl else None,
            **self.options
        }
    
    def test_connection(self):
        """Test database connection and update status"""
        try:
            engine = self._build_sqlalchemy_engine()
            if engine is None:
                # Unsupported types are marked as error
                self.connection_status = 'error'
                self.last_tested = timezone.now()
                self.save(update_fields=['connection_status', 'last_tested'])
                return False
            with engine.connect() as conn:
                conn.execute("SELECT 1")
            self.connection_status = 'connected'
            self.last_tested = timezone.now()
            self.save(update_fields=['connection_status', 'last_tested'])
            return True
        except Exception as e:
            self.connection_status = 'error'
            self.last_tested = timezone.now()
            self.save(update_fields=['connection_status', 'last_tested'])
            return False
    
    def get_schema_info(self):
        """Get database schema information (tables, columns, foreign keys, suggested relationships)"""
        try:
            engine = self._build_sqlalchemy_engine()
            if engine is None:
                return {'tables': [], 'views': [], 'procedures': [], 'columns_by_table': {}, 'foreign_keys': {}, 'suggested_relationships': []}
            
            insp = inspect(engine)
            tables = insp.get_table_names()
            views = getattr(insp, 'get_view_names', lambda: [])()
            columns_by_table = {}
            foreign_keys = {}
            
            # Get columns and foreign keys for each table
            for table_name in tables:
                try:
                    cols = insp.get_columns(table_name)
                    columns_by_table[table_name] = [
                        {
                            'name': c.get('name'),
                            'type': str(c.get('type')),
                            'label': c.get('name'),
                            'nullable': c.get('nullable', True),
                            'primary_key': c.get('primary_key', False),
                        }
                        for c in cols
                    ]
                    
                    # Get foreign keys
                    try:
                        fks = insp.get_foreign_keys(table_name)
                        foreign_keys[table_name] = [
                            {
                                'constrained_columns': fk.get('constrained_columns', []),
                                'referred_table': fk.get('referred_table'),
                                'referred_columns': fk.get('referred_columns', []),
                                'name': fk.get('name'),
                            }
                            for fk in fks
                        ]
                    except Exception:
                        foreign_keys[table_name] = []
                        
                except Exception:
                    columns_by_table[table_name] = []
                    foreign_keys[table_name] = []
            
            # Generate suggested relationships based on foreign keys and naming patterns
            suggested_relationships = self._suggest_table_relationships(tables, columns_by_table, foreign_keys)
            
            return {
                'tables': tables,
                'views': views or [],
                'procedures': [],
                'columns_by_table': columns_by_table,
                'foreign_keys': foreign_keys,
                'suggested_relationships': suggested_relationships,
            }
        except SQLAlchemyError:
            return {'tables': [], 'views': [], 'procedures': [], 'columns_by_table': {}, 'foreign_keys': {}, 'suggested_relationships': []}

    def _suggest_table_relationships(self, tables, columns_by_table, foreign_keys):
        """Suggest relationships between tables based on foreign keys and naming patterns"""
        suggestions = []
        
        # Add explicit foreign key relationships
        for table_name, fks in foreign_keys.items():
            for fk in fks:
                if fk['referred_table'] in tables:
                    suggestions.append({
                        'source_table': table_name,
                        'target_table': fk['referred_table'],
                        'source_columns': fk['constrained_columns'],
                        'target_columns': fk['referred_columns'],
                        'join_type': 'LEFT JOIN',
                        'confidence': 'high',
                        'reason': 'foreign_key',
                        'description': f"Foreign key relationship: {table_name}.{','.join(fk['constrained_columns'])} → {fk['referred_table']}.{','.join(fk['referred_columns'])}"
                    })
        
        # Add pattern-based suggestions
        for table1 in tables:
            columns1 = {col['name']: col for col in columns_by_table.get(table1, [])}
            
            for table2 in tables:
                if table1 >= table2:  # Avoid duplicates and self-joins
                    continue
                    
                columns2 = {col['name']: col for col in columns_by_table.get(table2, [])}
                
                # Check for common ID patterns
                patterns = [
                    # table1.id = table2.{table1}_id
                    ('id', f"{table1}_id"),
                    # table1.{table2}_id = table2.id
                    (f"{table2}_id", 'id'),
                    # Singular forms: users.id = user_profiles.user_id
                    ('id', f"{table1[:-1]}_id" if table1.endswith('s') else f"{table1}_id"),
                    (f"{table2[:-1]}_id" if table2.endswith('s') else f"{table2}_id", 'id'),
                ]
                
                for col1_name, col2_name in patterns:
                    if col1_name in columns1 and col2_name in columns2:
                        # Skip if already covered by foreign keys
                        already_exists = any(
                            s['source_table'] == table1 and s['target_table'] == table2 and 
                            col1_name in s['source_columns'] and col2_name in s['target_columns']
                            for s in suggestions
                        )
                        
                        if not already_exists:
                            suggestions.append({
                                'source_table': table1,
                                'target_table': table2,
                                'source_columns': [col1_name],
                                'target_columns': [col2_name],
                                'join_type': 'LEFT JOIN',
                                'confidence': 'medium',
                                'reason': 'naming_pattern',
                                'description': f"Suggested based on naming pattern: {table1}.{col1_name} → {table2}.{col2_name}"
                            })
        
        return suggestions

    def _build_sqlalchemy_engine(self):
        """Build SQLAlchemy engine for supported db types."""
        db_type = self.db_type
        username = self.username
        password = self.password
        host = self.host
        port = self.port
        database = self.database

        try:
            if db_type == 'postgresql':
                url = URL.create(
                    drivername='postgresql+psycopg2',
                    username=username,
                    password=password,
                    host=host,
                    port=port,
                    database=database,
                )
                return create_engine(url, pool_pre_ping=True)
            if db_type == 'mysql':
                # Requires mysqlclient or pymysql; fallback to pymysql
                url = URL.create(
                    drivername='mysql+pymysql',
                    username=username,
                    password=password,
                    host=host,
                    port=port,
                    database=database,
                )
                return create_engine(url, pool_pre_ping=True)
            if db_type == 'sqlserver':
                # Requires pyodbc; DSN might be system dependent
                # Try a generic ODBC+Driver 17 connection string
                dsn = f"DRIVER=ODBC Driver 17 for SQL Server;SERVER={host},{port};DATABASE={database};UID={username};PWD={password}"
                url = f"mssql+pyodbc:///?odbc_connect={dsn}"
                return create_engine(url, pool_pre_ping=True)
            if db_type == 'oracle':
                # Requires cx_Oracle
                url = f"oracle+cx_oracle://{username}:{password}@{host}:{port}/?service_name={database}"
                return create_engine(url, pool_pre_ping=True)
        except Exception:
            return None
        return None
