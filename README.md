# Enterprise Reports Builder

A comprehensive business intelligence and reporting platform that enables users to create, schedule, and distribute sophisticated reports from multiple data sources.

## 🚀 Features

### Core Reporting
- **Multi-Table Reports**: Build reports using data from multiple database tables with automatic JOIN detection
- **Advanced SQL Support**: Common Table Expressions (CTEs), calculated fields, and complex aggregations
- **Flexible Data Sources**: Connect to PostgreSQL, MySQL, SQL Server, and other databases
- **Report Templates**: Pre-built templates for common business reports
- **Multiple Export Formats**: PDF, Excel, CSV, and HTML outputs

### Advanced Analytics
- **Calculated Fields**: Create custom fields with SQL expressions and mathematical formulas
- **Date Intelligence**: Built-in wizards for period analysis, year-over-year growth, and date parsing
- **Aggregation Functions**: SUM, COUNT, AVG, MIN, MAX with conditional logic (CASE WHEN)
- **Data Transformations**: Type casting, string parsing, and normalization

### User Management & Security
- **Role-Based Access Control**: Admin, Report Creator, and Report Viewer roles
- **JWT Authentication**: Secure login with username or email support
- **User Profiles**: Customizable user settings and preferences
- **Audit Logging**: Track user actions and report executions

### Automation & Distribution
- **Scheduled Reports**: Automated generation and delivery
- **Email Distribution**: Customizable email templates and recipient lists
- **Background Processing**: Celery-based asynchronous report generation
- **Execution History**: Track report runs and performance metrics

## 🏗️ Architecture

### Backend (Django)
- **Framework**: Django 5.2+ with Django REST Framework
- **Database**: PostgreSQL (production) / SQLite (development)
- **Authentication**: Custom JWT implementation with username/email flexibility
- **Background Tasks**: Celery with Redis message broker
- **Data Processing**: Pandas, SQLAlchemy for database operations

### Frontend (React)
- **Framework**: React 18+ with Vite build tool
- **State Management**: React Context API for authentication
- **UI Components**: Custom component library with Tailwind CSS
- **Routing**: React Router DOM for navigation
- **Animations**: Framer Motion for smooth transitions

## 📋 Prerequisites

- **Python**: 3.9+
- **Node.js**: 18+
- **Database**: PostgreSQL (recommended) or SQLite
- **Redis**: For Celery message broker (optional for development)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd ReportBuilder
```

### 2. Backend Setup
```bash
# Navigate to backend
cd enterprise_reports

# Create virtual environment
python -m venv backend-env

# Activate environment (Windows)
backend-env\Scripts\activate

# Activate environment (Linux/Mac)
source backend-env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment for SQLite development
$env:USE_SQLITE="true"  # Windows PowerShell
export USE_SQLITE=true   # Linux/Mac

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create test users
python manage.py create_test_users

# Start Django server
python manage.py runserver
```

### 3. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:8000/api
- **Admin Panel**: http://127.0.0.1:8000/admin

## 🔐 Authentication

### Test Credentials
The application comes with pre-configured test users:

| Username | Email | Password | Role |
|----------|-------|----------|------|
| `admin_user` | `admin@company.com` | `admin123` | Admin |
| `report_creator` | `creator@company.com` | `creator123` | Report Creator |
| `report_viewer` | `viewer@company.com` | `viewer123` | Report Viewer |

### Login Options
- **Username**: Use any username from the table above
- **Email**: Use any email from the table above
- **Password**: Use the corresponding password

## 📊 Creating Your First Report

### 1. Login
- Navigate to the login page
- Use test credentials (e.g., `admin_user` / `admin123`)

### 2. Access Report Builder
- Click "Create New Report" on the dashboard
- Or navigate to `/report-builder`

### 3. Configure Data Sources
- Select database tables
- Configure table relationships (JOINs)
- Preview data structure

### 4. Define Fields
- Choose columns to include
- Set formatting options
- Add calculated fields with custom expressions

### 5. Apply Filters
- Set WHERE conditions
- Use dynamic parameters
- Test filter logic

### 6. Configure Output
- Choose export format (PDF, Excel, CSV)
- Select report template
- Set scheduling options

### 7. Execute & Save
- Preview the report
- Execute to see results
- Save configuration for future use

## 🔧 Advanced Features

### Multi-Table Queries
```sql
-- Automatic JOIN detection and relationship management
SELECT 
    customers.name,
    orders.order_date,
    SUM(order_items.quantity * order_items.price) as total_amount
FROM customers
JOIN orders ON customers.id = orders.customer_id
JOIN order_items ON orders.id = order_items.order_id
GROUP BY customers.name, orders.order_date
```

### Calculated Fields
```sql
-- Growth calculations with date intelligence
ROUND(
    (SUM(CASE WHEN year = 2025 THEN amount ELSE 0 END) - 
     SUM(CASE WHEN year = 2024 THEN amount ELSE 0 END)) * 100.0 / 
    NULLIF(SUM(CASE WHEN year = 2024 THEN amount ELSE 0 END), 0), 2
) AS growth_percentage
```

### Common Table Expressions (CTEs)
```sql
WITH monthly_totals AS (
    SELECT 
        DATE_TRUNC('month', order_date) as month,
        SUM(amount) as total
    FROM orders
    GROUP BY DATE_TRUNC('month', order_date)
)
SELECT 
    month,
    total,
    LAG(total) OVER (ORDER BY month) as prev_month_total
FROM monthly_totals
```

## 🛠️ Development

### Backend Development
```bash
cd enterprise_reports

# Run tests
python manage.py test

# Check code quality
flake8
black .
isort .

# Database operations
python manage.py makemigrations
python manage.py migrate
python manage.py shell
```

### Frontend Development
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### API Development
```bash
# Test API endpoints
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"login": "admin_user", "password": "admin123"}'
```

## 📁 Project Structure

```
ReportBuilder/
├── enterprise_reports/          # Django backend
│   ├── authentication/         # User management & auth
│   ├── reports/               # Report models & logic
│   ├── data_sources/          # Database connections
│   ├── schedules/             # Report scheduling
│   └── email_distributions/   # Email delivery
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Application pages
│   │   ├── contexts/         # React contexts
│   │   ├── services/         # API services
│   │   └── utils/            # Helper functions
│   └── public/               # Static assets
├── requirements.txt            # Python dependencies
├── package.json               # Node.js dependencies
└── README.md                  # This file
```

## 🔍 Troubleshooting

### Common Issues

#### Login Problems
- **"Invalid credentials"**: Verify username/password combination
- **"Email field required"**: Ensure you're on the login page, not registration
- **Token errors**: Clear browser localStorage and try again

#### Database Connection
- **Connection refused**: Check if database server is running
- **Migration errors**: Run `python manage.py migrate` after schema changes
- **SQLite mode**: Set `USE_SQLITE=true` environment variable

#### Frontend Issues
- **Build errors**: Run `npm install` to update dependencies
- **Hot reload not working**: Check Vite configuration and port conflicts
- **API calls failing**: Verify backend server is running on port 8000

### Debug Mode
```bash
# Backend debugging
python manage.py runserver --verbosity=2

# Frontend debugging
# Check browser console and network tab
# Enable React DevTools extension
```

## 🚀 Deployment

### Production Setup
1. **Environment Variables**
   ```bash
   DEBUG=False
   SECRET_KEY=<your-secret-key>
   DATABASE_URL=<production-database-url>
   REDIS_URL=<redis-url>
   ```

2. **Static Files**
   ```bash
   python manage.py collectstatic
   ```

3. **Database**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

4. **Process Management**
   ```bash
   # Use Gunicorn or uWSGI for Django
   # Use PM2 or systemd for Node.js
   # Configure Nginx as reverse proxy
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint for JavaScript/React code
- Write tests for new features
- Update documentation for API changes
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Django community for the excellent web framework
- React team for the powerful frontend library
- Contributors and testers who helped improve the application

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the API documentation
- Contact the development team

---

**Enterprise Reports Builder** - Empowering businesses with intelligent reporting solutions.
