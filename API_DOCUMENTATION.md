# Enterprise Reports API Documentation

This document provides comprehensive API documentation for the Enterprise Reports Builder application.

## 🔐 Authentication

All API endpoints (except authentication endpoints) require a valid JWT token in the Authorization header.

### Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Token Management
- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for getting new access tokens
- **Auto-refresh**: Frontend automatically refreshes expired tokens

## 📋 API Endpoints

### Authentication Endpoints

#### POST /api/auth/login/
Login with username or email.

**Request Body:**
```json
{
  "login": "admin_user",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin_user",
    "email": "admin@company.com",
    "first_name": "Admin",
    "last_name": "User",
    "role": "admin",
    "role_display": "Admin"
  }
}
```

**Response (400):**
```json
{
  "non_field_errors": ["Invalid login credentials"]
}
```

#### POST /api/auth/register/
Register a new user account.

**Request Body:**
```json
{
  "username": "new_user",
  "email": "new@company.com",
  "password": "password123",
  "first_name": "New",
  "last_name": "User"
}
```

**Response (201):**
```json
{
  "id": 2,
  "username": "new_user",
  "email": "new@company.com",
  "first_name": "New",
  "last_name": "User"
}
```

#### POST /api/auth/refresh/
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### GET /api/auth/me/
Get current user profile.

**Response (200):**
```json
{
  "id": 1,
  "username": "admin_user",
  "email": "admin@company.com",
  "first_name": "Admin",
  "last_name": "User",
  "role": "admin",
  "role_display": "Admin",
  "profile": {
    "avatar": null,
    "bio": null,
    "timezone": "UTC",
    "email_notifications": true,
    "report_email_notifications": true,
    "default_report_format": "PDF",
    "default_email_schedule": null
  }
}
```

### User Management Endpoints

#### GET /api/users/
List all users (admin only).

**Query Parameters:**
- `search`: Search by username, email, first_name, or last_name
- `role`: Filter by role (admin, report_creator, report_viewer)
- `page`: Page number for pagination
- `page_size`: Number of users per page

**Response (200):**
```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "admin_user",
      "email": "admin@company.com",
      "first_name": "Admin",
      "last_name": "User",
      "role": "admin",
      "role_display": "Admin",
      "is_active": true,
      "date_joined": "2025-08-18T19:00:00Z"
    }
  ]
}
```

#### POST /api/users/
Create a new user (admin only).

**Request Body:**
```json
{
  "username": "new_user",
  "email": "new@company.com",
  "password": "password123",
  "first_name": "New",
  "last_name": "User",
  "role": "report_creator"
}
```

#### GET /api/users/{id}/
Get user details.

**Response (200):**
```json
{
  "id": 1,
  "username": "admin_user",
  "email": "admin@company.com",
  "first_name": "Admin",
  "last_name": "User",
  "role": "admin",
  "role_display": "Admin",
  "is_active": true,
  "date_joined": "2025-08-18T19:00:00Z",
  "profile": {
    "avatar": null,
    "bio": null,
    "timezone": "UTC",
    "email_notifications": true,
    "report_email_notifications": true,
    "default_report_format": "PDF",
    "default_email_schedule": null
  }
}
```

#### PUT /api/users/{id}/
Update user information.

**Request Body:**
```json
{
  "first_name": "Updated",
  "last_name": "Name",
  "role": "report_creator"
}
```

#### DELETE /api/users/{id}/
Delete user (admin only).

**Response (204):** No content

#### POST /api/users/{id}/toggle-status/
Toggle user active status (admin only).

**Response (200):**
```json
{
  "id": 1,
  "is_active": false,
  "message": "User deactivated successfully"
}
```

#### GET /api/users/stats/
Get user statistics (admin only).

**Response (200):**
```json
{
  "total_users": 3,
  "active_users": 2,
  "admin_users": 1,
  "email_recipients": 2
}
```

#### GET /api/users/roles/
Get available user roles.

**Response (200):**
```json
[
  {
    "value": "admin",
    "label": "Admin"
  },
  {
    "value": "report_creator",
    "label": "Report Creator"
  },
  {
    "value": "report_viewer",
    "label": "Report Viewer"
  }
]
```

### Report Endpoints

#### GET /api/reports/
List all reports.

**Query Parameters:**
- `search`: Search by name or description
- `created_by`: Filter by creator
- `status`: Filter by status
- `page`: Page number for pagination

**Response (200):**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Sales Report",
      "description": "Monthly sales analysis",
      "created_by": 1,
      "created_at": "2025-08-18T19:00:00Z",
      "status": "active"
    }
  ]
}
```

#### POST /api/reports/
Create a new report.

**Request Body:**
```json
{
  "name": "Sales Report",
  "description": "Monthly sales analysis",
  "data_sources": [
    {
      "dataSourceId": 1,
      "tableName": "sales",
      "columns": ["id", "amount", "date"],
      "joins": []
    }
  ],
  "table_relationships": [],
  "fields": [
    {
      "table": "sales",
      "name": "amount",
      "alias": "total_amount"
    }
  ],
  "calculated_fields": [
    {
      "name": "monthly_total",
      "expression": "SUM(amount)",
      "data_type": "numeric"
    }
  ],
  "cte_definitions": [
    {
      "name": "monthly_data",
      "query": "SELECT DATE_TRUNC('month', date) as month, SUM(amount) as total FROM sales GROUP BY DATE_TRUNC('month', date)"
    }
  ],
  "filters": [
    {
      "field": "date",
      "operator": "gte",
      "value": "2025-01-01"
    }
  ],
  "report_format": "PDF",
  "template": "business_standard",
  "layout": "table"
}
```

#### GET /api/reports/{id}/
Get report details.

**Response (200):**
```json
{
  "id": 1,
  "name": "Sales Report",
  "description": "Monthly sales analysis",
  "data_sources": [...],
  "table_relationships": [...],
  "fields": [...],
  "calculated_fields": [...],
  "cte_definitions": [...],
  "filters": [...],
  "report_format": "PDF",
  "template": "business_standard",
  "layout": "table",
  "created_by": 1,
  "created_at": "2025-08-18T19:00:00Z",
  "status": "active"
}
```

#### PUT /api/reports/{id}/
Update report.

**Request Body:** Same as POST /api/reports/

#### DELETE /api/reports/{id}/
Delete report.

**Response (204):** No content

#### POST /api/reports/{id}/execute/
Execute report and return results.

**Response (200):**
```json
{
  "report_id": 1,
  "execution_id": "exec_123",
  "status": "completed",
  "data": [
    {
      "month": "2025-01-01",
      "total_amount": 15000.00,
      "monthly_total": 15000.00
    }
  ],
  "metadata": {
    "total_rows": 1,
    "execution_time": "0.5s",
    "sql_query": "SELECT ..."
  }
}
```

#### POST /api/reports/{id}/duplicate/
Duplicate existing report.

**Response (201):**
```json
{
  "id": 2,
  "name": "Sales Report (Copy)",
  "description": "Monthly sales analysis",
  "created_by": 1,
  "created_at": "2025-08-18T19:30:00Z"
}
```

### Data Source Endpoints

#### GET /api/data-sources/
List available data sources.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Production Database",
    "type": "postgresql",
    "host": "localhost",
    "port": 5432,
    "database": "enterprise_db",
    "status": "connected"
  }
]
```

#### POST /api/data-sources/
Create data source connection.

**Request Body:**
```json
{
  "name": "Test Database",
  "type": "postgresql",
  "host": "localhost",
  "port": 5432,
  "database": "test_db",
  "username": "test_user",
  "password": "test_pass"
}
```

### Schedule Endpoints

#### GET /api/schedules/
List report schedules.

**Response (200):**
```json
[
  {
    "id": 1,
    "report": 1,
    "frequency": "daily",
    "time": "09:00:00",
    "timezone": "UTC",
    "is_active": true,
    "next_run": "2025-08-19T09:00:00Z"
  }
]
```

#### POST /api/schedules/
Create new schedule.

**Request Body:**
```json
{
  "report": 1,
  "frequency": "daily",
  "time": "09:00:00",
  "timezone": "UTC",
  "is_active": true
}
```

### Email Distribution Endpoints

#### GET /api/email-distributions/
List email distribution configurations.

**Response (200):**
```json
[
  {
    "id": 1,
    "report": 1,
    "recipients": ["user@company.com"],
    "subject": "Monthly Sales Report",
    "template": "default",
    "is_active": true
  }
]
```

#### POST /api/email-distributions/
Create email distribution configuration.

**Request Body:**
```json
{
  "report": 1,
  "recipients": ["user@company.com"],
  "subject": "Monthly Sales Report",
  "template": "default",
  "is_active": true
}
```

### Execution Endpoints

#### GET /api/executions/
List report executions.

**Query Parameters:**
- `report`: Filter by report ID
- `status`: Filter by execution status
- `date_from`: Filter by start date
- `date_to`: Filter by end date

**Response (200):**
```json
[
  {
    "id": "exec_123",
    "report": 1,
    "status": "completed",
    "started_at": "2025-08-18T19:00:00Z",
    "completed_at": "2025-08-18T19:00:05Z",
    "execution_time": "5.0s",
    "rows_processed": 1000
  }
]
```

#### GET /api/executions/{id}/
Get execution details.

**Response (200):**
```json
{
  "id": "exec_123",
  "report": 1,
  "status": "completed",
  "started_at": "2025-08-18T19:00:00Z",
  "completed_at": "2025-08-18T19:00:05Z",
  "execution_time": "5.0s",
  "rows_processed": 1000,
  "error_message": null,
  "output_file": "/reports/exec_123.pdf"
}
```

#### POST /api/executions/{id}/retry/
Retry failed execution.

**Response (200):**
```json
{
  "id": "exec_124",
  "status": "queued",
  "message": "Execution queued for retry"
}
```

## 🔍 Error Handling

### Standard Error Response Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

### Common HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

### Validation Error Example
```json
{
  "login": ["This field is required."],
  "password": ["This field is required."]
}
```

## 📊 Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **API endpoints**: 100 requests per minute per user
- **Report execution**: 10 executions per hour per user

## 🔒 Security

### JWT Token Security
- Access tokens expire after 15 minutes
- Refresh tokens expire after 7 days
- Tokens are automatically rotated
- Invalid tokens are immediately rejected

### Role-Based Access Control
- **Admin**: Full access to all endpoints
- **Report Creator**: Can create, edit, and execute reports
- **Report Viewer**: Can view and execute reports only

### Data Validation
- All input is validated and sanitized
- SQL injection protection through parameterized queries
- XSS protection through content type validation

## 📝 Examples

### Complete Report Creation Flow

1. **Login to get token**
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"login": "admin_user", "password": "admin123"}'
```

2. **Create report using token**
```bash
curl -X POST http://127.0.0.1:8000/api/reports/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sales Analysis",
    "description": "Monthly sales report with growth calculations",
    "data_sources": [...],
    "fields": [...],
    "calculated_fields": [...],
    "filters": [...]
  }'
```

3. **Execute report**
```bash
curl -X POST http://127.0.0.1:8000/api/reports/1/execute/ \
  -H "Authorization: Bearer <access_token>"
```

### Python Client Example
```python
import requests

# Login
response = requests.post('http://127.0.0.1:8000/api/auth/login/', {
    'login': 'admin_user',
    'password': 'admin123'
})
tokens = response.json()

# Use token for API calls
headers = {
    'Authorization': f"Bearer {tokens['access']}",
    'Content-Type': 'application/json'
}

# Create report
report_data = {
    'name': 'Test Report',
    'description': 'Test description',
    'data_sources': [],
    'fields': [],
    'calculated_fields': [],
    'filters': []
}

response = requests.post(
    'http://127.0.0.1:8000/api/reports/',
    json=report_data,
    headers=headers
)
```

## 🔄 WebSocket Endpoints

### Real-time Updates
- **Report execution progress**: `/ws/reports/{id}/progress/`
- **User notifications**: `/ws/users/{id}/notifications/`

### WebSocket Message Format
```json
{
  "type": "execution_progress",
  "data": {
    "report_id": 1,
    "progress": 75,
    "status": "processing",
    "message": "Processing data..."
  }
}
```

## 📚 Additional Resources

- **Frontend Documentation**: See `frontend/README.md`
- **Backend Documentation**: See `enterprise_reports/README.md`
- **Database Schema**: See `enterprise_reports/reports/models.py`
- **API Tests**: See `enterprise_reports/tests/`

---

For questions or support, please create an issue in the repository or contact the development team.
