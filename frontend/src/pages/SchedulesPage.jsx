import { motion } from 'framer-motion'
import { Calendar, Clock, Plus } from 'lucide-react'
import { Button } from '../components/ui'

export default function SchedulesPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16 max-w-md mx-auto"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-10 h-10 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Schedule Management</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Set up automated report scheduling to deliver insights to your team at the perfect time. 
          Configure daily, weekly, or monthly reports with custom delivery options.
        </p>
        <div className="space-y-4">
          <Button 
            icon={<Plus className="w-4 h-4" />}
            size="lg"
            disabled
          >
            Create Schedule
          </Button>
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <Clock className="w-4 h-4 mr-1" />
            Coming soon in the next release
          </p>
        </div>
      </motion.div>
    </div>
  )
}


