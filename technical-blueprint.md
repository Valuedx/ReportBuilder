# Enterprise Report Builder - Technical Blueprint

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Design](#architecture-design)
3. [Technology Stack](#technology-stack)
4. [Component Architecture](#component-architecture)
5. [Data Models](#data-models)
6. [API Specifications](#api-specifications)
7. [Database Schema](#database-schema)
8. [Security & Authentication](#security--authentication)
9. [Deployment Architecture](#deployment-architecture)
10. [Performance Considerations](#performance-considerations)
11. [Development Guidelines](#development-guidelines)

---

## System Overview

### Purpose
Enterprise Report Builder is a comprehensive business intelligence platform that enables organizations to create, schedule, and distribute automated reports with advanced data visualization and email distribution capabilities.

### Key Features
- **Visual Report Builder**: 5-step wizard for creating business reports
- **Automated Scheduling**: Time-based report generation and distribution
- **Email Distribution**: Multi-recipient report delivery with custom templates
- **Multiple Export Formats**: PDF, Excel, CSV, PowerPoint support
- **Data Source Integration**: PostgreSQL, MySQL, REST APIs connectivity
- **Enterprise Templates**: Professional business report formatting

### System Requirements
- **Frontend**: React 18+, Node.js 16+
- **Backend**: Django 4.2+, Python 3.9+
- **Database**: PostgreSQL 13+
- **Message Queue**: Redis + Celery
- **Storage**: AWS S3 or equivalent
- **Email**: SendGrid, AWS SES, or SMTP

---

## Architecture Design

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React SPA     │◄──►│  Django REST    │◄──►│   PostgreSQL    │
│   (Frontend)    │    │     API         │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐    ┌─────────────────┐
         │              │   Celery        │    │   Redis         │
         └──────────────│   (Background   │◄──►│   (Cache/Queue) │
                        │    Tasks)       │    │                 │
                        └─────────────────┘    └─────────────────┘
                                 │
                        ┌─────────────────┐    ┌─────────────────┐
                        │   Report        │    │   Email         │
                        │   Generator     │◄──►│   Service       │
                        │   (PDF/Excel)   │    │   (SendGrid)    │
                        └─────────────────┘    └─────────────────┘
```

### Component Layers

#### 1. Presentation Layer (React Frontend)
- **Report Builder Wizard**: Multi-step form interface
- **Dashboard**: Report management and analytics
- **Authentication**: User login and session management
- **State Management**: Context API for global state

#### 2. API Layer (Django REST Framework)
- **Report Management APIs**: CRUD operations for reports
- **Data Source APIs**: Database connectivity and schema introspection
- **Execution APIs**: Report generation and scheduling
- **Authentication APIs**: JWT-based user authentication

#### 3. Business Logic Layer
- **Report Configuration**: Query building and validation
- **Schedule Management**: Cron-like scheduling system
- **Data Processing**: SQL query generation and execution
- **Template Engine**: Report formatting and layout

#### 4. Data Access Layer
- **ORM Models**: Django models for data persistence
- **Database Connectors**: Multi-database connectivity
- **Query Builders**: Dynamic SQL generation
- **Schema Introspection**: Database metadata extraction

#### 5. Integration Layer
- **Email Services**: SMTP/API-based email delivery
- **File Storage**: Cloud storage for generated reports
- **Background Tasks**: Asynchronous job processing
- **Monitoring**: Logging and error tracking

---

## Technology Stack

### Frontend Technologies
```json
{
  "core": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0"
  },
  "styling": {
    "tailwindcss": "^3.2.0",
    "autoprefixer": "^10.4.13"
  },
  "state_management": {
    "react-context": "built-in",
    "@tanstack/react-query": "^4.24.0"
  },
  "forms": {
    "react-hook-form": "^7.43.0",
    "yup": "^1.0.0"
  },
  "utilities": {
    "axios": "^1.3.0",
    "date-fns": "^2.29.0",
    "lodash": "^4.17.21"
  }
}
```

### Backend Technologies
```python
# requirements.txt
Django==4.2.0
djangorestframework==3.14.0
django-cors-headers==3.14.0
celery==5.2.0
redis==4.5.0
psycopg2-binary==2.9.5
django-extensions==3.2.0
django-filter==22.1
python-decouple==3.7
reportlab==3.6.0
openpyxl==3.1.0
pandas==1.5.3
sqlalchemy==2.0.0
sendgrid==6.9.0
boto3==1.26.0
```

### Infrastructure Technologies
- **Web Server**: Nginx
- **Application Server**: Gunicorn
- **Database**: PostgreSQL 13+
- **Cache/Queue**: Redis
- **Storage**: AWS S3
- **Monitoring**: Sentry, New Relic
- **CI/CD**: GitHub Actions, Docker

---

## Component Architecture

### Frontend Component Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   └── LoadingSpinner.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── report-builder/
│   │   ├── DataSourceStep.jsx
│   │   ├── FieldsStep.jsx
│   │   ├── FiltersStep.jsx
│   │   ├── SettingsStep.jsx
│   │   └── PreviewStep.jsx
│   └── dashboard/
│       ├── StatsCards.jsx
│       ├── RecentReports.jsx
│       └── QuickActions.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── ReportBuilderPage.jsx
│   ├── MyReportsPage.jsx
│   └── AnalyticsPage.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useReports.js
│   └── useDataSources.js
├── services/
│   ├── api.js
│   ├── auth.js
│   └── reports.js
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   └── validators.js
└── contexts/
    ├── AuthContext.jsx
    └── AppContext.jsx
```

### Backend Project Structure
```
enterprise_reports/
├── apps/
│   ├── authentication/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── reports/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── tasks.py
│   │   └── urls.py
│   ├── data_sources/
│   │   ├── models.py
│   │   ├── connectors.py
│   │   └── schemas.py
│   └── notifications/
│       ├── models.py
│       ├── email_service.py
│       └── templates/
├── core/
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   ├── production.py
│   │   └── testing.py
│   ├── urls.py
│   └── wsgi.py
├── utils/
│   ├── report_generators/
│   │   ├── pdf_generator.py
│   │   ├── excel_generator.py
│   │   └── csv_generator.py
│   ├── query_builders/
│   │   ├── sql_builder.py
│   │   └── query_optimizer.py
│   └── validators.py
└── tests/
    ├── test_reports.py
    ├── test_auth.py
    └── test_generators.py
```

---

## Data Models

### Core Models

#### Report Model
```python
class Report(models.Model):
    """Main report configuration model"""
    
    # Basic Information
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Configuration
    data_sources = models.JSONField()  # Selected tables and joins
    fields = models.JSONField()        # Selected columns and formatting
    filters = models.JSONField()       # WHERE conditions
    
    # Report Settings
    report_format = models.CharField(max_length=20, choices=FORMAT_CHOICES)
    template = models.CharField(max_length=50, choices=TEMPLATE_CHOICES)
    layout = models.CharField(max_length=20, choices=LAYOUT_CHOICES)
    
    # Status
    is_active = models.BooleanField(default=True)
    last_executed = models.DateTimeField(null=True, blank=True)
    execution_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
```

#### Schedule Model
```python
class ReportSchedule(models.Model):
    """Report scheduling configuration"""
    
    report = models.OneToOneField(Report, on_delete=models.CASCADE)
    is_enabled = models.BooleanField(default=False)
    
    # Frequency Configuration
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    day_of_week = models.IntegerField(null=True, blank=True)  # 0-6
    day_of_month = models.IntegerField(null=True, blank=True)  # 1-31
    time = models.TimeField()
    timezone = models.CharField(max_length=50)
    
    # Execution Control
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    next_execution = models.DateTimeField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

#### Email Distribution Model
```python
class EmailDistribution(models.Model):
    """Email delivery configuration"""
    
    report = models.OneToOneField(Report, on_delete=models.CASCADE)
    is_enabled = models.BooleanField(default=False)
    
    # Email Configuration
    subject_template = models.CharField(max_length=500)
    body_template = models.TextField()
    attach_format = models.CharField(max_length=20, choices=FORMAT_CHOICES)
    
    # Recipients
    recipients = models.JSONField()  # List of {name, email, role}
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

#### Execution History Model
```python
class ReportExecution(models.Model):
    """Track report execution history"""
    
    report = models.ForeignKey(Report, on_delete=models.CASCADE)
    
    # Execution Details
    started_at = models.DateTimeField()
    completed_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    
    # Results
    file_path = models.CharField(max_length=500, blank=True)
    file_size = models.BigIntegerField(null=True, blank=True)
    row_count = models.IntegerField(null=True, blank=True)
    
    # Email Delivery
    emails_sent = models.IntegerField(default=0)
    email_status = models.CharField(max_length=20, blank=True)
    
    # Error Handling
    error_message = models.TextField(blank=True)
    retry_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-started_at']
```

### Data Source Models

#### DataSource Model
```python
class DataSource(models.Model):
    """Database connection configurations"""
    
    name = models.CharField(max_length=200)
    db_type = models.CharField(max_length=20, choices=DB_TYPE_CHOICES)
    
    # Connection Details
    host = models.CharField(max_length=255)
    port = models.IntegerField()
    database = models.CharField(max_length=100)
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=255)  # Encrypted
    
    # SSL Configuration
    use_ssl = models.BooleanField(default=False)
    ssl_cert_path = models.CharField(max_length=500, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    last_tested = models.DateTimeField(null=True, blank=True)
    connection_status = models.CharField(max_length=20, blank=True)
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
```

---

## API Specifications

### Authentication APIs

#### POST /api/auth/login/
```json
{
  "request": {
    "email": "user@company.com",
    "password": "secure_password"
  },
  "response": {
    "access_token": "jwt_token_here",
    "refresh_token": "refresh_token_here",
    "user": {
      "id": 1,
      "email": "user@company.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "admin"
    }
  }
}
```

### Report Management APIs

#### GET /api/reports/
```json
{
  "response": {
    "count": 25,
    "next": "http://api/reports/?page=2",
    "previous": null,
    "results": [
      {
        "id": 1,
        "name": "Monthly Sales Report",
        "description": "Comprehensive sales analysis",
        "created_at": "2024-01-15T10:30:00Z",
        "last_executed": "2024-01-15T10:30:00Z",
        "status": "active",
        "schedule": {
          "frequency": "monthly",
          "next_execution": "2024-02-15T10:30:00Z"
        },
        "email_recipients": 12
      }
    ]
  }
}
```

#### POST /api/reports/
```json
{
  "request": {
    "name": "Weekly Sales Report",
    "description": "Weekly sales performance analysis",
    "data_sources": [
      {
        "data_source_id": "pg1",
        "table_name": "sales_transactions",
        "columns": [
          {
            "name": "sale_date",
            "type": "datetime",
            "label": "Sale Date",
            "format": "MM/DD/YYYY"
          }
        ]
      }
    ],
    "fields": [
      {
        "id": "sales_transactions.amount",
        "name": "amount",
        "table": "sales_transactions",
        "label": "Sale Amount",
        "type": "currency",
        "format": "$#,##0.00",
        "aggregation": "sum"
      }
    ],
    "filters": [
      {
        "field": "sales_transactions.sale_date",
        "operator": "greater_than",
        "value": "2024-01-01"
      }
    ],
    "report_settings": {
      "format": "PDF",
      "template": "business_standard",
      "layout": "table",
      "include_charts": true
    },
    "schedule_settings": {
      "enabled": true,
      "frequency": "weekly",
      "day_of_week": "monday",
      "time": "09:00",
      "timezone": "America/New_York"
    },
    "email_settings": {
      "enabled": true,
      "recipients": [
        {"name": "John Doe", "email": "john@company.com"},
        {"name": "Jane Smith", "email": "jane@company.com"}
      ],
      "subject": "Weekly Sales Report - {{week_ending}}",
      "body": "Please find attached the weekly sales report."
    }
  },
  "response": {
    "id": 26,
    "name": "Weekly Sales Report",
    "status": "created",
    "schedule_id": "schedule_123",
    "next_execution": "2024-01-22T09:00:00Z"
  }
}
```

#### POST /api/reports/{id}/execute/
```json
{
  "response": {
    "execution_id": "exec_456",
    "status": "running",
    "estimated_completion": "2024-01-15T10:32:00Z",
    "message": "Report generation started"
  }
}
```

### Data Source APIs

#### GET /api/data-sources/
```json
{
  "response": [
    {
      "id": "pg1",
      "name": "Sales Database",
      "type": "PostgreSQL",
      "status": "connected",
      "tables": 7,
      "last_tested": "2024-01-15T09:00:00Z"
    }
  ]
}
```

#### GET /api/data-sources/{id}/tables/
```json
{
  "response": [
    {
      "name": "sales_transactions",
      "row_count": 150000,
      "columns": 8,
      "last_updated": "2024-01-15T08:30:00Z"
    }
  ]
}
```

#### GET /api/data-sources/{id}/tables/{table}/columns/
```json
{
  "response": [
    {
      "name": "transaction_id",
      "type": "number",
      "label": "Transaction ID",
      "nullable": false,
      "primary_key": true
    },
    {
      "name": "sale_date",
      "type": "datetime",
      "label": "Sale Date",
      "nullable": false,
      "indexed": true
    }
  ]
}
```

---

## Database Schema

### PostgreSQL Schema Design

#### Core Tables
```sql
-- Users and Authentication
CREATE TABLE auth_user (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data Sources
CREATE TABLE data_sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    db_type VARCHAR(20) NOT NULL,
    host VARCHAR(255) NOT NULL,
    port INTEGER NOT NULL,
    database_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password_encrypted TEXT NOT NULL,
    use_ssl BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    connection_status VARCHAR(20),
    last_tested TIMESTAMP,
    created_by INTEGER REFERENCES auth_user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    data_sources JSONB NOT NULL,
    fields JSONB NOT NULL,
    filters JSONB DEFAULT '[]',
    report_format VARCHAR(20) DEFAULT 'PDF',
    template VARCHAR(50) DEFAULT 'business_standard',
    layout VARCHAR(20) DEFAULT 'table',
    is_active BOOLEAN DEFAULT true,
    last_executed TIMESTAMP,
    execution_count INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES auth_user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Report Schedules
CREATE TABLE report_schedules (
    id SERIAL PRIMARY KEY,
    report_id INTEGER UNIQUE REFERENCES reports(id) ON DELETE CASCADE,
    is_enabled BOOLEAN DEFAULT false,
    frequency VARCHAR(20) NOT NULL,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
    day_of_month INTEGER CHECK (day_of_month BETWEEN 1 AND 31),
    time TIME NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    next_execution TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email Distribution
CREATE TABLE email_distributions (
    id SERIAL PRIMARY KEY,
    report_id INTEGER UNIQUE REFERENCES reports(id) ON DELETE CASCADE,
    is_enabled BOOLEAN DEFAULT false,
    subject_template VARCHAR(500),
    body_template TEXT,
    attach_format VARCHAR(20) DEFAULT 'PDF',
    recipients JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Execution History
CREATE TABLE report_executions (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    file_path VARCHAR(500),
    file_size BIGINT,
    row_count INTEGER,
    emails_sent INTEGER DEFAULT 0,
    email_status VARCHAR(20),
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Indexes for Performance
```sql
-- Performance Indexes
CREATE INDEX idx_reports_created_by ON reports(created_by);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_reports_is_active ON reports(is_active);

CREATE INDEX idx_executions_report_id ON report_executions(report_id);
CREATE INDEX idx_executions_started_at ON report_executions(started_at DESC);
CREATE INDEX idx_executions_status ON report_executions(status);

CREATE INDEX idx_schedules_next_execution ON report_schedules(next_execution);
CREATE INDEX idx_schedules_is_enabled ON report_schedules(is_enabled);

-- JSON Indexes for JSONB columns
CREATE INDEX idx_reports_data_sources_gin ON reports USING GIN(data_sources);
CREATE INDEX idx_reports_fields_gin ON reports USING GIN(fields);
CREATE INDEX idx_reports_filters_gin ON reports USING GIN(filters);
```

---

## Security & Authentication

### Authentication Strategy
- **JWT-based Authentication**: Stateless token authentication
- **Role-based Access Control**: Admin, Manager, User roles
- **Password Security**: bcrypt hashing with salt
- **Session Management**: Token refresh mechanism

### Security Measures

#### API Security
```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    }
}

# JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

#### Data Protection
```python
# Database Encryption
from cryptography.fernet import Fernet

class EncryptedCharField(models.CharField):
    """Custom field for encrypting sensitive data"""
    
    def __init__(self, *args, **kwargs):
        self.cipher_suite = Fernet(settings.ENCRYPTION_KEY)
        super().__init__(*args, **kwargs)
    
    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        return self.cipher_suite.decrypt(value.encode()).decode()
    
    def to_python(self, value):
        if isinstance(value, str):
            return value
        return self.cipher_suite.decrypt(value.encode()).decode()
    
    def get_prep_value(self, value):
        if value is None:
            return value
        return self.cipher_suite.encrypt(value.encode()).decode()
```

#### Input Validation
```python
# serializers.py
class ReportSerializer(serializers.ModelSerializer):
    """Report serializer with validation"""
    
    class Meta:
        model = Report
        fields = '__all__'
    
    def validate_name(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError(
                "Report name must be at least 3 characters long"
            )
        return value.strip()
    
    def validate_data_sources(self, value):
        if not isinstance(value, list) or len(value) == 0:
            raise serializers.ValidationError(
                "At least one data source must be specified"
            )
        return value
    
    def validate_fields(self, value):
        if not isinstance(value, list) or len(value) == 0:
            raise serializers.ValidationError(
                "At least one field must be specified"
            )
        return value
```

### Permission Classes
```python
# permissions.py
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
```

---

## Deployment Architecture

### Production Infrastructure

#### Docker Configuration
```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Start command
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "core.wsgi:application"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: enterprise_reports
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  web:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    environment:
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/enterprise_reports
      - REDIS_URL=redis://redis:6379/0
      - SECRET_KEY=${SECRET_KEY}
    volumes:
      - ./media:/app/media

  celery:
    build: .
    command: celery -A core worker --loglevel=info
    depends_on:
      - db
      - redis
    environment:
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/enterprise_reports
      - REDIS_URL=redis://redis:6379/0

  celery-beat:
    build: .
    command: celery -A core beat --loglevel=info
    depends_on:
      - db
      - redis
    environment:
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/enterprise_reports
      - REDIS_URL=redis://redis:6379/0

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web

volumes:
  postgres_data:
```

#### Kubernetes Deployment
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: enterprise-reports
  labels:
    app: enterprise-reports
spec:
  replicas: 3
  selector:
    matchLabels:
      app: enterprise-reports
  template:
    metadata:
      labels:
        app: enterprise-reports
    spec:
      containers:
      - name: web
        image: enterprise-reports:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: secret-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health/
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready/
            port: 8000
          initialDelay