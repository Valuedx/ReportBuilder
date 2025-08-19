# Enterprise Reports Backend

Django-based backend for the Enterprise Report Builder application.

## Features

- **Multi-Table Reports**: Build reports using data from multiple database tables with automatic JOIN detection
- **Advanced SQL Support**: Common Table Expressions (CTEs), calculated fields, and complex aggregations
- **Data Source Integration**: Connect to various databases (PostgreSQL, MySQL, SQL Server, etc.)
- **Calculated Fields**: Create custom fields with SQL expressions and mathematical formulas
- **Date Intelligence**: Built-in wizards for period analysis, year-over-year growth, and date parsing
- **Scheduling**: Automated report generation and delivery
- **Email Distribution**: Send reports via email with customizable templates
- **Background Processing**: Celery-based asynchronous report generation
- **Role-based Access Control**: Admin, Report Creator, and Report Viewer roles
- **User Management**: Full CRUD operations for user accounts and profiles
- **RESTful API**: Full CRUD operations via Django REST Framework
- **JWT Authentication**: Secure login with username or email support

## Technology Stack

- **Django 5.2+**: Web framework
- **Django REST Framework**: API development
- **PostgreSQL**: Primary database
- **Redis**: Caching and message broker
- **Celery**: Background task processing
- **ReportLab**: PDF generation
- **OpenPyXL**: Excel file handling
- **Pandas**: Data manipulation
- **SendGrid**: Email delivery

## Setup Instructions

### Prerequisites

- Python 3.9+
- PostgreSQL
- Redis
- Virtual environment

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd enterprise_reports
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv backend-env
   backend-env\Scripts\activate  # Windows
   source backend-env/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   ```bash
   # For development with SQLite (recommended for testing)
   $env:USE_SQLITE="true"  # Windows PowerShell
   export USE_SQLITE=true   # Linux/Mac
   
   # For production with PostgreSQL
   # cp env.example .env
   # Edit .env with your configuration
   ```

5. **Database Setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create Test Users**
   ```bash
   python manage.py create_test_users
   ```

7. **Run Development Server**
   ```bash
   python manage.py runserver
   ```

### Celery Setup

1. **Start Redis** (in a separate terminal)
   ```bash
   redis-server
   ```

2. **Start Celery Worker** (in a separate terminal)
   ```bash
   celery -A enterprise_reports worker --loglevel=info
   ```

3. **Start Celery Beat** (in a separate terminal)
   ```bash
   celery -A enterprise_reports beat --loglevel=info
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Login with username or email
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/refresh/` - Refresh JWT token
- `GET /api/auth/me/` - Get current user profile

### Users
- `GET /api/users/` - List users (admin only)
- `POST /api/users/` - Create user (admin only)
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user (admin only)
- `POST /api/users/{id}/toggle-status/` - Toggle user active status
- `GET /api/users/stats/` - Get user statistics
- `GET /api/users/roles/` - Get available user roles

### Reports
- `GET /api/reports/` - List reports
- `POST /api/reports/` - Create report
- `GET /api/reports/{id}/` - Get report details
- `PUT /api/reports/{id}/` - Update report
- `DELETE /api/reports/{id}/` - Delete report
- `POST /api/reports/{id}/execute/` - Execute report
- `POST /api/reports/{id}/duplicate/` - Duplicate report

### Data Sources
- `GET /api/data-sources/` - List available data sources
- `POST /api/data-sources/` - Create data source connection
- `GET /api/data-sources/{id}/` - Get data source details
- `PUT /api/data-sources/{id}/` - Update data source
- `DELETE /api/data-sources/{id}/` - Delete data source

### Schedules
- `GET /api/schedules/` - List schedules
- `POST /api/schedules/` - Create schedule
- `GET /api/schedules/{id}/` - Get schedule details
- `PUT /api/schedules/{id}/` - Update schedule
- `DELETE /api/schedules/{id}/` - Delete schedule

### Email Distributions
- `GET /api/email-distributions/` - List email configurations
- `POST /api/email-distributions/` - Create email configuration
- `GET /api/email-distributions/{id}/` - Get email configuration
- `PUT /api/email-distributions/{id}/` - Update email configuration
- `DELETE /api/email-distributions/{id}/` - Delete email configuration

### Executions
- `GET /api/executions/` - List executions
- `GET /api/executions/{id}/` - Get execution details
- `POST /api/executions/{id}/retry/` - Retry failed execution

## Development

### Running Tests
```bash
python manage.py test
```

### Code Quality
```bash
# Install pre-commit hooks
pre-commit install

# Run linting
flake8
black .
isort .
```

### Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

## Deployment

### Production Settings
- Set `DEBUG=False`
- Configure production database
- Set up proper secret key
- Configure static file serving
- Set up SSL/TLS
- Configure logging

### Docker Deployment
```bash
docker-compose up -d
```

## Troubleshooting

### Common Issues

#### Authentication Problems
- **"Invalid credentials"**: Verify username/password combination
- **"Email field required"**: Ensure you're on the login page, not registration
- **Token errors**: Clear browser localStorage and try again

#### Database Connection
- **Connection refused**: Check if database server is running
- **Migration errors**: Run `python manage.py migrate` after schema changes
- **SQLite mode**: Set `USE_SQLITE=true` environment variable

#### Development Issues
- **Module not found**: Ensure virtual environment is activated
- **Port conflicts**: Check if port 8000 is available
- **Hot reload issues**: Restart Django server after model changes

### Debug Mode
```bash
# Verbose server output
python manage.py runserver --verbosity=2

# Check migrations
python manage.py showmigrations

# Database shell
python manage.py dbshell
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
