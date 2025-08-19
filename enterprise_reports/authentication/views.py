from django.shortcuts import render
from rest_framework import permissions, status, viewsets, filters
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.db.models import Q
from .serializers import (
    RegisterSerializer, UserSerializer, CreateUserSerializer, UpdateUserSerializer
)
from .models import UserProfile
from .authentication import CustomTokenObtainPairSerializer

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom token view that accepts both username and email for login.
    """
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing users with full CRUD operations.
    """
    queryset = User.objects.all().select_related('profile')
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['username', 'email', 'date_joined', 'last_login']
    ordering = ['-date_joined']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateUserSerializer
        elif self.action in ['update', 'partial_update']:
            return UpdateUserSerializer
        return UserSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by role if provided
        role = self.request.query_params.get('role', None)
        if role and role != 'all':
            queryset = queryset.filter(role=role)
        
        # Filter by status if provided
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            is_active_bool = is_active.lower() == 'true'
            queryset = queryset.filter(is_active=is_active_bool)
        
        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        """Create a new user with profile."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Return full user data
        response_serializer = UserSerializer(user)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        """Toggle user active status."""
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get user statistics."""
        queryset = self.get_queryset()
        
        total_users = queryset.count()
        active_users = queryset.filter(is_active=True).count()
        admin_users = queryset.filter(role='admin').count()
        
        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'admin_users': admin_users,
            'email_recipients': active_users,  # Active users can receive emails
        })
    
    @action(detail=False, methods=['get'])
    def roles(self, request):
        """Get available user roles."""
        return Response([
            {'value': choice[0], 'label': choice[1]} 
            for choice in User.ROLE_CHOICES
        ])