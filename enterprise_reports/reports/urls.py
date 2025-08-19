from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ReportViewSet, ReportScheduleViewSet, 
    EmailDistributionViewSet, ReportExecutionViewSet
)

router = DefaultRouter()
router.register(r'reports', ReportViewSet, basename='report')
router.register(r'schedules', ReportScheduleViewSet, basename='schedule')
router.register(r'email-distributions', EmailDistributionViewSet, basename='email-distribution')
router.register(r'executions', ReportExecutionViewSet, basename='execution')

urlpatterns = [
    path('', include(router.urls)),
]
