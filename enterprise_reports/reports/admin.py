from django.contrib import admin
from .models import Report, ReportSchedule, EmailDistribution, ReportExecution


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_by', 'report_format', 'template', 'is_active', 'created_at', 'execution_count']
    list_filter = ['is_active', 'report_format', 'template', 'layout', 'created_at']
    search_fields = ['name', 'description', 'created_by__email']
    readonly_fields = ['created_at', 'updated_at', 'last_executed', 'execution_count']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'created_by')
        }),
        ('Configuration', {
            'fields': ('data_sources', 'fields', 'filters')
        }),
        ('Report Settings', {
            'fields': ('report_format', 'template', 'layout')
        }),
        ('Status', {
            'fields': ('is_active', 'last_executed', 'execution_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ReportSchedule)
class ReportScheduleAdmin(admin.ModelAdmin):
    list_display = ['report', 'is_enabled', 'frequency', 'time', 'timezone', 'next_execution']
    list_filter = ['is_enabled', 'frequency', 'timezone', 'created_at']
    search_fields = ['report__name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Schedule Configuration', {
            'fields': ('report', 'is_enabled', 'frequency', 'day_of_week', 'day_of_month', 'time', 'timezone')
        }),
        ('Execution Control', {
            'fields': ('start_date', 'end_date', 'next_execution')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(EmailDistribution)
class EmailDistributionAdmin(admin.ModelAdmin):
    list_display = ['report', 'is_enabled', 'attach_format', 'recipients_count']
    list_filter = ['is_enabled', 'attach_format', 'created_at']
    search_fields = ['report__name']
    readonly_fields = ['created_at', 'updated_at', 'recipients_count']
    
    def recipients_count(self, obj):
        return len(obj.recipients) if obj.recipients else 0
    recipients_count.short_description = 'Recipients'
    
    fieldsets = (
        ('Email Configuration', {
            'fields': ('report', 'is_enabled', 'subject_template', 'body_template', 'attach_format')
        }),
        ('Recipients', {
            'fields': ('recipients',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ReportExecution)
class ReportExecutionAdmin(admin.ModelAdmin):
    list_display = ['report', 'status', 'started_at', 'completed_at', 'file_size', 'emails_sent']
    list_filter = ['status', 'started_at', 'completed_at']
    search_fields = ['report__name']
    readonly_fields = ['started_at', 'created_at']
    ordering = ['-started_at']
    
    fieldsets = (
        ('Execution Details', {
            'fields': ('report', 'status', 'started_at', 'completed_at')
        }),
        ('Results', {
            'fields': ('file_path', 'file_size', 'row_count')
        }),
        ('Email Delivery', {
            'fields': ('emails_sent', 'email_status')
        }),
        ('Error Handling', {
            'fields': ('error_message', 'retry_count'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
