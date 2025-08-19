from django.db import models
from django.conf import settings
from django.utils import timezone


class Report(models.Model):
    """Main report configuration model"""
    
    FORMAT_CHOICES = [
        ('PDF', 'PDF Document'),
        ('Excel', 'Excel Spreadsheet'),
        ('CSV', 'CSV File'),
        ('PowerPoint', 'PowerPoint Presentation'),
    ]
    
    TEMPLATE_CHOICES = [
        ('business_standard', 'Business Standard'),
        ('executive_summary', 'Executive Summary'),
        ('detailed_analysis', 'Detailed Analysis'),
        ('financial', 'Financial Report'),
        ('marketing', 'Marketing Report'),
    ]
    
    LAYOUT_CHOICES = [
        ('table', 'Table Layout'),
        ('chart', 'Chart Layout'),
        ('dashboard', 'Dashboard Layout'),
        ('summary', 'Summary Layout'),
    ]
    
    # Basic Information
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Configuration
    data_sources = models.JSONField()  # Selected tables and joins
    table_relationships = models.JSONField(default=list)  # JOIN configurations between tables
    fields = models.JSONField()        # Selected columns and formatting
    calculated_fields = models.JSONField(default=list)  # Custom calculated fields and expressions
    cte_definitions = models.JSONField(default=list)   # Common Table Expressions (WITH clauses)
    filters = models.JSONField(default=list)       # WHERE conditions
    
    # Report Settings
    report_format = models.CharField(max_length=20, choices=FORMAT_CHOICES, default='PDF')
    template = models.CharField(max_length=50, choices=TEMPLATE_CHOICES, default='business_standard')
    layout = models.CharField(max_length=20, choices=LAYOUT_CHOICES, default='table')
    
    # Status
    is_active = models.BooleanField(default=True)
    last_executed = models.DateTimeField(null=True, blank=True)
    execution_count = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'reports'
        ordering = ['-created_at']
        verbose_name = 'Report'
        verbose_name_plural = 'Reports'
    
    def __str__(self):
        return self.name
    
    def increment_execution_count(self):
        """Increment execution count and update last executed time"""
        self.execution_count += 1
        self.last_executed = timezone.now()
        self.save(update_fields=['execution_count', 'last_executed'])


class ReportSchedule(models.Model):
    """Report scheduling configuration"""
    
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
    ]
    
    report = models.OneToOneField(Report, on_delete=models.CASCADE, related_name='schedule')
    is_enabled = models.BooleanField(default=False)
    
    # Frequency Configuration
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    day_of_week = models.IntegerField(null=True, blank=True)  # 0-6 (Monday=0)
    day_of_month = models.IntegerField(null=True, blank=True)  # 1-31
    time = models.TimeField()
    timezone = models.CharField(max_length=50, default='UTC')
    
    # Execution Control
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    next_execution = models.DateTimeField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'report_schedules'
        verbose_name = 'Report Schedule'
        verbose_name_plural = 'Report Schedules'
    
    def __str__(self):
        return f"Schedule for {self.report.name}"


class EmailDistribution(models.Model):
    """Email delivery configuration"""
    
    FORMAT_CHOICES = [
        ('PDF', 'PDF'),
        ('Excel', 'Excel'),
        ('CSV', 'CSV'),
    ]
    
    report = models.OneToOneField(Report, on_delete=models.CASCADE, related_name='email_distribution')
    is_enabled = models.BooleanField(default=False)
    
    # Email Configuration
    subject_template = models.CharField(max_length=500)
    body_template = models.TextField()
    attach_format = models.CharField(max_length=20, choices=FORMAT_CHOICES, default='PDF')
    
    # Recipients
    recipients = models.JSONField(default=list)  # List of {name, email, role}
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'email_distributions'
        verbose_name = 'Email Distribution'
        verbose_name_plural = 'Email Distributions'
    
    def __str__(self):
        return f"Email distribution for {self.report.name}"


class ReportExecution(models.Model):
    """Track report execution history"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='executions')
    
    # Execution Details
    started_at = models.DateTimeField()
    completed_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    
    # Results
    file_path = models.CharField(max_length=500, blank=True)
    file_size = models.BigIntegerField(null=True, blank=True)
    row_count = models.IntegerField(null=True, blank=True)
    
    # Email Delivery
    emails_sent = models.IntegerField(default=0)
    email_status = models.CharField(max_length=20, blank=True)
    
    # Error Handling
    error_message = models.TextField(blank=True)
    retry_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'report_executions'
        ordering = ['-started_at']
        verbose_name = 'Report Execution'
        verbose_name_plural = 'Report Executions'
    
    def __str__(self):
        return f"Execution {self.id} of {self.report.name}"
    
    def mark_completed(self, file_path=None, file_size=None, row_count=None):
        """Mark execution as completed"""
        self.status = 'completed'
        self.completed_at = timezone.now()
        if file_path:
            self.file_path = file_path
        if file_size:
            self.file_size = file_size
        if row_count:
            self.row_count = row_count
        self.save()
    
    def mark_failed(self, error_message):
        """Mark execution as failed"""
        self.status = 'failed'
        self.completed_at = timezone.now()
        self.error_message = error_message
        self.save()
