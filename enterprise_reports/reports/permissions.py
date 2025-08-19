from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners to edit reports"""
    
    def has_object_permission(self, request, view, obj):
        # Read permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only to the owner
        return obj.created_by == request.user


class IsAdminOrManager(permissions.BasePermission):
    """Permission for admin and manager roles only"""
    
    def has_permission(self, request, view):
        return request.user.role in ['admin', 'manager']


class IsOwnerOrAdmin(permissions.BasePermission):
    """Permission for owners or admins"""
    
    def has_object_permission(self, request, view, obj):
        # Admin can access everything
        if request.user.role == 'admin':
            return True
        
        # Owner can access their own reports
        if hasattr(obj, 'created_by'):
            return obj.created_by == request.user
        
        # For related objects, check the report owner
        if hasattr(obj, 'report'):
            return obj.report.created_by == request.user
        
        return False
