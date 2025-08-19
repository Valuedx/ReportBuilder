import { motion } from 'framer-motion'
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react'
import { Button } from '../components/ui'

export default function AnalyticsPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16 max-w-md mx-auto"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <TrendingUp className="w-10 h-10 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Report Analytics</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Gain deep insights into your report performance, user engagement, and delivery metrics. 
          Track usage patterns and optimize your reporting strategy.
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: BarChart3, label: 'Usage Stats' },
            { icon: PieChart, label: 'Performance' },
            { icon: Activity, label: 'Insights' }
          ].map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="p-4 bg-gray-50 rounded-xl"
            >
              <Icon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">{label}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="space-y-4">
          <Button 
            variant="outline"
            size="lg"
            disabled
          >
            View Analytics Dashboard
          </Button>
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <Activity className="w-4 h-4 mr-1" />
            Advanced analytics coming soon
          </p>
        </div>
      </motion.div>
    </div>
  )
}


