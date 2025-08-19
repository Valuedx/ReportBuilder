import { BrowserRouter, Routes, Route, Link, Navigate, NavLink as RRNavLink } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { BarChart3, Home, FileText, Calendar, TrendingUp, Plus, LogOut, Users } from 'lucide-react'
import Dashboard from './pages/Dashboard.jsx'
import ReportBuilderPage from './pages/ReportBuilderPage.jsx'
import MyReportsPage from './pages/MyReportsPage.jsx'
import SchedulesPage from './pages/SchedulesPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import { LoadingSpinner } from './components/ui'

const queryClient = new QueryClient()

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function AppContent() {
  const { isAuthenticated, logout, user } = useAuth()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <motion.nav 
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              className="bg-white/80 backdrop-blur-lg shadow-soft border-b border-gray-200/50 sticky top-0 z-50"
            >
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                  <Link to="/" className="flex items-center group">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-200">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-800">Enterprise Reports</div>
                      <div className="text-xs text-gray-500">Business Intelligence Platform</div>
                    </div>
                  </Link>
                  <div className="flex items-center space-x-1">
                                    <NavLink to="/" icon={Home}>Dashboard</NavLink>
                <NavLink to="/report-builder" icon={Plus}>Report Builder</NavLink>
                <NavLink to="/reports" icon={FileText}>My Reports</NavLink>
                <NavLink to="/schedules" icon={Calendar}>Schedules</NavLink>
                <NavLink to="/analytics" icon={TrendingUp}>Analytics</NavLink>
                <NavLink to="/users" icon={Users}>Users</NavLink>
                    
                    <div className="flex items-center ml-6 pl-6 border-l border-gray-200">
                      <span className="text-sm text-gray-600 mr-3">
                        Welcome, {user?.first_name || user?.username || 'User'}
                      </span>
                      <button
                        onClick={logout}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-1" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.nav>
            <main className="max-w-7xl mx-auto px-4 py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/report-builder" element={<ReportBuilderPage />} />
                  <Route path="/reports" element={<MyReportsPage />} />
                  <Route path="/schedules" element={<SchedulesPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </motion.div>
            </main>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

function NavLink({ to, children, icon: Icon }) {
  return (
    <RRNavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive 
            ? 'bg-primary-100 text-primary-700 shadow-sm' 
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/80'
        }`
      }
    >
      <Icon className="w-4 h-4 mr-2" />
      {children}
    </RRNavLink>
  )
}
