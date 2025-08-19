import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Play, Settings, BarChart3, FileText, Filter } from 'lucide-react'
import { Button, Input, Card, CardContent, CardFooter } from '../components/ui'

export default function MyReportsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const reports = useMemo(
    () => [
      { id: 1, name: 'Monthly Sales Report', description: 'Comprehensive sales analysis', lastRun: '2024-01-15T10:30:00Z', nextRun: '2024-02-15T10:30:00Z', status: 'Active', schedule: 'Monthly', recipients: 12, format: 'PDF' },
      { id: 2, name: 'Customer Analytics', description: 'Customer engagement metrics', lastRun: '2024-01-14T09:00:00Z', nextRun: '2024-01-21T09:00:00Z', status: 'Active', schedule: 'Weekly', recipients: 8, format: 'Excel' },
      { id: 3, name: 'Inventory Status', description: 'Current stock levels', lastRun: '2024-01-13T08:00:00Z', nextRun: null, status: 'Paused', schedule: 'Daily', recipients: 5, format: 'PDF' },
    ],
    []
  )

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) || report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || report.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Reports</h1>
          <p className="text-gray-600">Manage and monitor your automated reports</p>
        </div>
        <Button 
          icon={<Plus className="w-4 h-4" />}
          size="lg"
          className="bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700"
        >
          Create New Report
        </Button>
      </motion.div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Reports</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="secondary" 
                icon={<Filter className="w-4 h-4" />}
                className="w-full"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{report.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                      Schedule:
                    </span>
                    <span className="font-medium">{report.schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                      Recipients:
                    </span>
                    <span className="font-medium">{report.recipients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                      Format:
                    </span>
                    <span className="font-medium">{report.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                      Last Run:
                    </span>
                    <span className="font-medium">{new Date(report.lastRun).toLocaleDateString()}</span>
                  </div>
                  {report.nextRun && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                        Next Run:
                      </span>
                      <span className="font-medium">{new Date(report.nextRun).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 flex space-x-2">
                <Button 
                  size="sm" 
                  icon={<Play className="w-3 h-3" />}
                  className="flex-1"
                >
                  Run Now
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={<Settings className="w-3 h-3" />}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={<BarChart3 className="w-3 h-3" />}
                >
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reports Found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search criteria or create a new report</p>
          <Button icon={<Plus className="w-4 h-4" />}>
            Create Your First Report
          </Button>
        </motion.div>
      )}
    </div>
  )
}

function getStatusStyles(status) {
  const styles = {
    Active: 'bg-success-100 text-success-700',
    Paused: 'bg-warning-100 text-warning-700',
    Disabled: 'bg-danger-100 text-danger-700',
  }
  return styles[status] || 'bg-gray-100 text-gray-700'
}


