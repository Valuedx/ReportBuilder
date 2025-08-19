from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import DataSource
from .serializers import DataSourceSerializer
from reports.permissions import IsOwnerOrReadOnly


class DataSourceViewSet(viewsets.ModelViewSet):
    queryset = DataSource.objects.all()
    serializer_class = DataSourceSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    filterset_fields = ['db_type', 'is_active', 'connection_status']
    search_fields = ['name', 'host', 'database']
    ordering = ['-created_at']

    def get_queryset(self):
        if self.request.user.is_staff:
            return DataSource.objects.all()
        return DataSource.objects.filter(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def test_connection(self, request, pk=None):
        ds = self.get_object()
        ok = ds.test_connection()
        return Response({
            'status': 'connected' if ok else 'error',
            'last_tested': ds.last_tested,
            'connection_status': ds.connection_status,
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def schema(self, request, pk=None):
        ds = self.get_object()
        schema = ds.get_schema_info()
        return Response(schema, status=status.HTTP_200_OK)

