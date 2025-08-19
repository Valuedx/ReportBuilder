from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class User(AbstractUser):
    """Extended User model with additional fields for enterprise reporting."""
    
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('report_creator', 'Report Creator'),
        ('report_viewer', 'Report Viewer'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='report_viewer')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_at = models.DateTimeField(null=True, blank=True)
    
    # Additional profile fields
    phone = models.CharField(max_length=20, blank=True)
    department = models.CharField(max_length=100, blank=True)
    job_title = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    def get_full_name_or_username(self):
        """Return full name if available, otherwise username."""
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name if full_name else self.username
    
    @property
    def reports_access_count(self):
        """Count of reports this user has access to."""
        if self.role == 'admin':
            from reports.models import Report
            return Report.objects.count()
        else:
            # Users have access to reports they created or are shared with them
            from reports.models import Report
            return Report.objects.filter(created_by=self).count()


class UserProfile(models.Model):
    """Additional profile information for users."""
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(blank=True)
    timezone = models.CharField(max_length=50, default='UTC')
    email_notifications = models.BooleanField(default=True)
    report_email_notifications = models.BooleanField(default=True)
    
    # Report preferences
    default_report_format = models.CharField(max_length=20, default='PDF')
    default_email_schedule = models.CharField(max_length=20, default='manual')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Profile for {self.user.username}"