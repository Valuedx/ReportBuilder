from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile
from django.utils import timezone

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create user profile
        UserProfile.objects.create(user=user)
        
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['avatar', 'bio', 'timezone', 'email_notifications', 
                 'report_email_notifications', 'default_report_format', 
                 'default_email_schedule']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()
    reports_access_count = serializers.ReadOnlyField()
    last_login_display = serializers.SerializerMethodField()
    role_display = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'full_name', 'role', 'role_display', 'is_active', 'phone', 
                 'department', 'job_title', 'date_joined', 'last_login', 
                 'last_login_display', 'reports_access_count', 'profile']
        read_only_fields = ['id', 'date_joined', 'last_login']
    
    def get_full_name(self, obj):
        return obj.get_full_name_or_username()
    
    def get_last_login_display(self, obj):
        if not obj.last_login:
            return 'Never'
        
        now = timezone.now()
        diff = now - obj.last_login
        
        if diff.days > 0:
            if diff.days == 1:
                return '1 day ago'
            elif diff.days < 7:
                return f'{diff.days} days ago'
            elif diff.days < 30:
                weeks = diff.days // 7
                return f'{weeks} week{"s" if weeks > 1 else ""} ago'
            else:
                months = diff.days // 30
                return f'{months} month{"s" if months > 1 else ""} ago'
        
        hours = diff.seconds // 3600
        if hours > 0:
            return f'{hours} hour{"s" if hours > 1 else ""} ago'
        
        minutes = diff.seconds // 60
        if minutes > 0:
            return f'{minutes} minute{"s" if minutes > 1 else ""} ago'
        
        return 'Just now'
    
    def get_role_display(self, obj):
        return obj.get_role_display()

class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 
                 'password_confirm', 'role', 'phone', 'department', 'job_title']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create user profile
        UserProfile.objects.create(user=user)
        
        return user

class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'role', 'is_active',
                 'phone', 'department', 'job_title']
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance