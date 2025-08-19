from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class CustomTokenObtainPairSerializer(serializers.Serializer):
    """
    Custom token serializer that allows login with either username or email.
    """
    login = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        login = attrs.get('login')
        password = attrs.get('password')
        
        if not login or not password:
            raise serializers.ValidationError('Must include login and password')
        
        user = None
        
        # Try to authenticate with username first
        user = authenticate(
            request=self.context.get('request'),
            username=login,
            password=password
        )
        
        # If authentication failed and login looks like an email, try email-based auth
        if not user and '@' in login:
            try:
                # Find user by email and try authentication with username
                user_by_email = User.objects.get(email=login)
                user = authenticate(
                    request=self.context.get('request'),
                    username=user_by_email.username,
                    password=password
                )
            except User.DoesNotExist:
                pass
        
        if not user:
            raise serializers.ValidationError('Invalid login credentials')
        
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled')
        
        # Generate tokens using the TokenObtainPairSerializer logic
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'role_display': user.get_role_display(),
            }
        }
