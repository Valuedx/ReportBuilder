from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from authentication.models import UserProfile

User = get_user_model()

class Command(BaseCommand):
    help = 'Create test users for development'

    def handle(self, *args, **options):
        test_users = [
            {
                'username': 'admin_user',
                'email': 'admin@company.com',
                'first_name': 'John',
                'last_name': 'Smith',
                'role': 'admin',
                'is_active': True,
                'password': 'admin123',
                'department': 'IT',
                'job_title': 'System Administrator'
            },
            {
                'username': 'report_creator',
                'email': 'creator@company.com',
                'first_name': 'Sarah',
                'last_name': 'Johnson',
                'role': 'report_creator',
                'is_active': True,
                'password': 'creator123',
                'department': 'Business Intelligence',
                'job_title': 'Data Analyst'
            },
            {
                'username': 'report_viewer',
                'email': 'viewer@company.com',
                'first_name': 'Mike',
                'last_name': 'Chen',
                'role': 'report_viewer',
                'is_active': True,
                'password': 'viewer123',
                'department': 'Sales',
                'job_title': 'Sales Manager'
            },
            {
                'username': 'inactive_user',
                'email': 'inactive@company.com',
                'first_name': 'Emily',
                'last_name': 'Davis',
                'role': 'report_viewer',
                'is_active': False,
                'password': 'inactive123',
                'department': 'Marketing',
                'job_title': 'Marketing Coordinator'
            },
            {
                'username': 'david_wilson',
                'email': 'david.wilson@company.com',
                'first_name': 'David',
                'last_name': 'Wilson',
                'role': 'admin',
                'is_active': True,
                'password': 'david123',
                'department': 'Executive',
                'job_title': 'VP of Operations'
            }
        ]

        for user_data in test_users:
            username = user_data['username']
            
            # Check if user already exists
            if User.objects.filter(username=username).exists():
                self.stdout.write(
                    self.style.WARNING(f'User {username} already exists, skipping...')
                )
                continue
            
            # Create user
            password = user_data.pop('password')
            user = User.objects.create_user(**user_data)
            user.set_password(password)
            user.save()
            
            # Create user profile
            UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'email_notifications': True,
                    'report_email_notifications': True,
                    'default_report_format': 'PDF',
                    'timezone': 'UTC'
                }
            )
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created user: {username} ({user.get_role_display()})')
            )
        
        self.stdout.write(
            self.style.SUCCESS('\nTest users created successfully!')
        )
        self.stdout.write('You can now log in with:')
        self.stdout.write('  Admin: admin_user / admin123')
        self.stdout.write('  Creator: report_creator / creator123')
        self.stdout.write('  Viewer: report_viewer / viewer123')
