# 🚀 Quick Setup Guide

This guide will get you up and running with the Enterprise Reports Builder in under 10 minutes.

## 📋 Prerequisites

- **Python 3.9+** installed
- **Node.js 18+** installed
- **Git** installed
- **PowerShell** (Windows) or **Terminal** (Mac/Linux)

## ⚡ Quick Start

### 1. Clone & Navigate
```bash
git clone <repository-url>
cd ReportBuilder
```

### 2. Backend Setup (5 minutes)
```bash
# Navigate to backend
cd enterprise_reports

# Create virtual environment
python -m venv backend-env

# Activate environment (Windows)
backend-env\Scripts\activate

# Activate environment (Mac/Linux)
source backend-env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set SQLite mode for development
$env:USE_SQLITE="true"  # Windows
export USE_SQLITE=true   # Mac/Linux

# Setup database
python manage.py makemigrations
python manage.py migrate

# Create test users
python manage.py create_test_users

# Start server
python manage.py runserver
```

### 3. Frontend Setup (3 minutes)
```bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:8000/api
- **Test Login**: `admin_user` / `admin123`

## 🔐 Test Credentials

| Username | Password | Role |
|----------|----------|------|
| `admin_user` | `admin123` | Admin |
| `report_creator` | `creator123` | Report Creator |
| `report_viewer` | `viewer123` | Report Viewer |

## 🎯 What You Can Do Now

1. **Login** with test credentials
2. **Create Reports** using the Report Builder
3. **Manage Users** via the Users page
4. **Test Multi-Table Queries** with calculated fields
5. **Explore the API** at http://127.0.0.1:8000/api

## 🚨 Common Issues & Solutions

### Backend Issues
- **"Module not found"**: Ensure virtual environment is activated
- **"Port 8000 in use"**: Kill existing process or use different port
- **"Database connection failed"**: Check if `USE_SQLITE=true` is set

### Frontend Issues
- **"Port 5173 in use"**: Vite will automatically use next available port
- **"Build errors"**: Run `npm install` to update dependencies
- **"API calls failing"**: Ensure backend is running on port 8000

## 🔧 Development Commands

### Backend
```bash
cd enterprise_reports
backend-env\Scripts\activate  # Windows
source backend-env/bin/activate  # Mac/Linux

# Run tests
python manage.py test

# Check migrations
python manage.py showmigrations

# Django shell
python manage.py shell
```

### Frontend
```bash
cd frontend

# Development
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## 📚 Next Steps

1. **Read the main README.md** for comprehensive documentation
2. **Check API_DOCUMENTATION.md** for endpoint details
3. **Explore the codebase** starting with `frontend/src/` and `enterprise_reports/`
4. **Try creating a report** with multiple tables and calculated fields
5. **Check the user management** features

## 🆘 Need Help?

- **Documentation**: Check `README.md` and `API_DOCUMENTATION.md`
- **Issues**: Create an issue in the repository
- **Code**: Review the troubleshooting sections in the docs

---

**You're all set! 🎉** The Enterprise Reports Builder is now running locally.
