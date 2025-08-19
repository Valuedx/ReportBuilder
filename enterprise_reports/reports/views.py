from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Report, ReportSchedule, EmailDistribution, ReportExecution
from .serializers import (
    ReportSerializer, ReportScheduleSerializer, EmailDistributionSerializer,
    ReportExecutionSerializer, ReportListSerializer
)
from .permissions import IsOwnerOrReadOnly
from .tasks import generate_report_task


class ReportViewSet(viewsets.ModelViewSet):
    """ViewSet for Report CRUD operations"""
    
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    filterset_fields = ['is_active', 'report_format', 'template', 'layout']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'updated_at', 'last_executed', 'execution_count']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter reports by user ownership"""
        if self.request.user.is_staff:
            return Report.objects.all()
        return Report.objects.filter(created_by=self.request.user)
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'list':
            return ReportListSerializer
        return ReportSerializer
    
    @action(detail=True, methods=['post'])
    def execute(self, request, pk=None):
        """Execute a report generation"""
        report = self.get_object()
        
        # Create execution record
        execution = ReportExecution.objects.create(
            report=report,
            started_at=timezone.now(),
            status='running'
        )
        
        # Queue report generation task with Celery
        generate_report_task.delay(execution.id)
        
        return Response({
            'execution_id': execution.id,
            'status': 'running',
            'message': 'Report generation started'
        }, status=status.HTTP_202_ACCEPTED)
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate an existing report"""
        original_report = self.get_object()
        
        # Create duplicate with new name
        duplicate_data = {
            'name': f"{original_report.name} (Copy)",
            'description': original_report.description,
            'data_sources': original_report.data_sources,
            'fields': original_report.fields,
            'filters': original_report.filters,
            'report_format': original_report.report_format,
            'template': original_report.template,
            'layout': original_report.layout,
        }
        
        serializer = self.get_serializer(data=duplicate_data)
        serializer.is_valid(raise_exception=True)
        duplicate_report = serializer.save()
        
        return Response({
            'id': duplicate_report.id,
            'name': duplicate_report.name,
            'message': 'Report duplicated successfully'
        }, status=status.HTTP_201_CREATED)


class ReportScheduleViewSet(viewsets.ModelViewSet):
    """ViewSet for Report Schedule management"""
    
    queryset = ReportSchedule.objects.all()
    serializer_class = ReportScheduleSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        """Filter schedules by user ownership"""
        if self.request.user.is_staff:
            return ReportSchedule.objects.all()
        return ReportSchedule.objects.filter(report__created_by=self.request.user)
    
    def perform_create(self, serializer):
        """Set report owner when creating schedule"""
        report = get_object_or_404(Report, id=self.request.data.get('report'))
        if report.created_by != self.request.user:
            raise permissions.PermissionDenied("You can only schedule your own reports")
        serializer.save()


class EmailDistributionViewSet(viewsets.ModelViewSet):
    """ViewSet for Email Distribution management"""
    
    queryset = EmailDistribution.objects.all()
    serializer_class = EmailDistributionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        """Filter distributions by user ownership"""
        if self.request.user.is_staff:
            return EmailDistribution.objects.all()
        return EmailDistribution.objects.filter(report__created_by=self.request.user)
    
    def perform_create(self, serializer):
        """Set report owner when creating distribution"""
        report = get_object_or_404(Report, id=self.request.data.get('report'))
        if report.created_by != self.request.user:
            raise permissions.PermissionDenied("You can only configure email for your own reports")
        serializer.save()


class ReportExecutionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Report Execution history (read-only)"""
    
    queryset = ReportExecution.objects.all()
    serializer_class = ReportExecutionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    ordering = ['-started_at']
    
    def get_queryset(self):
        """Filter executions by user ownership"""
        if self.request.user.is_staff:
            return ReportExecution.objects.all()
        return ReportExecution.objects.filter(report__created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def retry(self, request, pk=None):
        """Retry a failed report execution"""
        execution = self.get_object()
        
        if execution.status != 'failed':
            return Response({
                'error': 'Only failed executions can be retried'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create new execution
        new_execution = ReportExecution.objects.create(
            report=execution.report,
            started_at=timezone.now(),
            status='running'
        )
        
        # Queue report generation task with Celery
        generate_report_task.delay(new_execution.id)
        
        return Response({
            'execution_id': new_execution.id,
            'status': 'running',
            'message': 'Report generation restarted'
        }, status=status.HTTP_202_ACCEPTED)
