import { useState } from 'react'
import { Button } from '../ui'
import { Save, Play } from 'lucide-react'

export default function ReportPreviewStep({ reportConfig, onSave, onExecute }) {
  const [executionResult, setExecutionResult] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)

  const handleSaveReport = async () => {
    setIsSaving(true)
    try {
      const result = await onSave(reportConfig)
      alert(`Report saved successfully! ID: ${result.id}`)
    } catch (error) {
      alert('Error saving report: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExecuteReport = async () => {
    setIsExecuting(true)
    try {
      const result = await onExecute(reportConfig)
      setExecutionResult(result)
    } catch (error) {
      alert('Error executing report: ' + error.message)
    } finally {
      setIsExecuting(false)
    }
  }

  const getScheduleSummary = () => {
    const schedule = reportConfig.scheduleSettings
    if (!schedule?.enabled) return 'No scheduling'
    let summary = `${schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)}`
    if (schedule.frequency === 'weekly') {
      summary += ` on ${schedule.dayOfWeek}s`
    } else if (schedule.frequency === 'monthly') {
      summary += ` on day ${schedule.dayOfMonth}`
    }
    summary += ` at ${schedule.time} ${schedule.timezone}`
    return summary
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 5: Review & Finalize</h2>
        <p className="text-gray-600">Review your report configuration and save or execute</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-xl font-semibold mb-6">Report Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Basic Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Name:</span><span className="font-medium">{reportConfig.reportSettings?.name || 'Untitled Report'}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Format:</span><span className="font-medium">{reportConfig.reportSettings?.format || 'PDF'}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Layout:</span><span className="font-medium">{reportConfig.reportSettings?.layout || 'Table'}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Template:</span><span className="font-medium">{reportConfig.reportSettings?.template || 'Business Standard'}</span></div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Data Configuration</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Data Sources:</span><span className="font-medium">{reportConfig.dataSources?.length || 0}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Fields:</span><span className="font-medium">{reportConfig.fields?.length || 0}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Filters:</span><span className="font-medium">{reportConfig.filters?.length || 0}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Schedule:</span><span className="font-medium">{getScheduleSummary()}</span></div>
            </div>
          </div>
        </div>
        {reportConfig.emailSettings?.enabled && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-700 mb-3">Email Distribution</h4>
            <div className="text-sm">
              <div className="flex justify-between mb-2"><span className="text-gray-600">Recipients:</span><span className="font-medium">{reportConfig.emailSettings.recipients?.length || 0}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Subject:</span><span className="font-medium">{reportConfig.emailSettings.subject || 'Not set'}</span></div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={handleSaveReport} 
            disabled={isSaving || !reportConfig.reportSettings?.name} 
            loading={isSaving}
            variant="primary"
            size="lg"
            className="w-full"
            icon={<Save className="w-5 h-5" />}
          >
            {isSaving ? 'Saving...' : 'Save Report'}
          </Button>
          <Button 
            onClick={handleExecuteReport} 
            disabled={isExecuting || !reportConfig.reportSettings?.name} 
            loading={isExecuting}
            variant="success"
            size="lg"
            className="w-full"
            icon={<Play className="w-5 h-5" />}
          >
            {isExecuting ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>
      {executionResult && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">✅ Report Generated Successfully!</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center"><span className="text-green-700">Execution ID:</span><span className="font-mono text-sm bg-white px-2 py-1 rounded">{executionResult.executionId}</span></div>
            <div className="flex justify-between items-center"><span className="text-green-700">Generated at:</span><span className="font-medium">{new Date(executionResult.generatedAt).toLocaleString()}</span></div>
            <div className="flex justify-between items-center"><span className="text-green-700">Download:</span><a href={executionResult.fileUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">📄 Download Report</a></div>
          </div>
        </div>
      )}
    </div>
  )
}


