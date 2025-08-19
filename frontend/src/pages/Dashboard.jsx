import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FileText, Calendar, Users, TrendingUp, Plus, Activity } from 'lucide-react'
import { Button } from '../components/ui'
import { Card, CardContent } from '../components/ui'

export default function Dashboard() {
  const navigate = useNavigate()
  
  const handleCreateReport = () => {
    navigate('/report-builder')
  }
  
  const handleViewAnalytics = () => {
    navigate('/analytics')
  }
  
  const handleQuickAction = (actionTitle) => {
    switch(actionTitle) {
      case 'New Report':
        navigate('/report-builder')
        break
      case 'Schedule':
        navigate('/schedules')
        break
      case 'Analytics':
        navigate('/analytics')
        break
      case 'Recipients':
        navigate('/users')
        break
      default:
        console.log(`Quick action: ${actionTitle}`)
    }
  }
  
  const stats = [
    { label: 'Total Reports', value: '24', icon: FileText, trend: '+12%', color: 'text-primary-600' },
    { label: 'Scheduled Reports', value: '8', icon: Calendar, trend: '+3', color: 'text-success-600' },
    { label: 'Email Recipients', value: '156', icon: Users, trend: '+18%', color: 'text-purple-600' },
    { label: 'Reports This Month', value: '47', icon: TrendingUp, trend: '+23%', color: 'text-orange-600' }
  ]

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-primary-800 mb-4">
          Enterprise Report Builder
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
          Create, schedule, and distribute powerful business reports with automated delivery and analytics
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            onClick={handleCreateReport}
            icon={<Plus className="w-4 h-4" />} 
            size="lg"
          >
            Create New Report
          </Button>
          <Button 
            onClick={handleViewAnalytics}
            variant="outline" 
            icon={<Activity className="w-4 h-4" />} 
            size="lg"
          >
            View Analytics
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className={`text-sm font-medium mt-1 ${stat.color}`}>
                      {stat.trend} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${getGradientClass(stat.color)}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'Sales Report generated', time: '2 minutes ago', status: 'success' },
                { action: 'Monthly Analytics scheduled', time: '1 hour ago', status: 'info' },
                { action: 'Customer Data export completed', time: '3 hours ago', status: 'success' },
                { action: 'Weekly Summary sent to 24 recipients', time: '1 day ago', status: 'success' },
              ].map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'New Report', desc: 'Create a new report', icon: Plus, color: 'bg-primary-500' },
                { title: 'Schedule', desc: 'Set up automation', icon: Calendar, color: 'bg-success-500' },
                { title: 'Analytics', desc: 'View insights', icon: TrendingUp, color: 'bg-purple-500' },
                { title: 'Recipients', desc: 'Manage users', icon: Users, color: 'bg-orange-500' },
              ].map((action, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleQuickAction(action.title)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-medium transition-all text-left group"
                >
                  <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm">{action.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getGradientClass(color) {
  const gradients = {
    'text-primary-600': 'from-primary-500 to-primary-600',
    'text-success-600': 'from-success-500 to-success-600',
    'text-purple-600': 'from-purple-500 to-purple-600',
    'text-orange-600': 'from-orange-500 to-orange-600',
  }
  return gradients[color] || 'from-gray-500 to-gray-600'
}

function getStatusColor(status) {
  const colors = {
    success: 'bg-success-500',
    info: 'bg-primary-500',
    warning: 'bg-warning-500',
    error: 'bg-danger-500',
  }
  return colors[status] || 'bg-gray-500'
}


