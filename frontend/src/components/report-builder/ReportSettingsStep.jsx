import { useEffect, useState } from 'react'
import { Button } from '../ui'
import { Plus, X } from 'lucide-react'

export default function ReportSettingsStep({ reportConfig, setReportConfig }) {
  const [reportSettings, setReportSettings] = useState({
    name: '',
    description: '',
    format: 'PDF',
    layout: 'table',
    template: 'business_standard',
    includeCharts: true,
    includeSummary: true,
    pageOrientation: 'portrait',
  })

  const [scheduleSettings, setScheduleSettings] = useState({
    enabled: false,
    frequency: 'weekly',
    dayOfWeek: 'monday',
    dayOfMonth: 1,
    time: '09:00',
    timezone: 'UTC',
    endDate: '',
  })

  const [emailSettings, setEmailSettings] = useState({ enabled: false, recipients: [], subject: '', body: '', attachFormat: 'PDF' })
  const [newRecipient, setNewRecipient] = useState({ name: '', email: '' })

  const addRecipient = () => {
    if (newRecipient.email && newRecipient.name) {
      setEmailSettings((prev) => ({ ...prev, recipients: [...prev.recipients, { ...newRecipient, id: Date.now() }] }))
      setNewRecipient({ name: '', email: '' })
    }
  }

  const removeRecipient = (recipientId) => {
    setEmailSettings((prev) => ({ ...prev, recipients: prev.recipients.filter((r) => r.id !== recipientId) }))
  }

  useEffect(() => {
    setReportConfig((prev) => ({ ...prev, reportSettings, scheduleSettings, emailSettings }))
  }, [reportSettings, scheduleSettings, emailSettings])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 4: Report Settings & Schedule</h2>
        <p className="text-gray-600">Configure your report format, scheduling, and distribution</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Report Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Name *</label>
            <input type="text" value={reportSettings.name} onChange={(e) => setReportSettings((p) => ({ ...p, name: e.target.value }))} placeholder="e.g., Monthly Sales Report" className="w-full p-3 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select value={reportSettings.format} onChange={(e) => setReportSettings((p) => ({ ...p, format: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg">
              <option value="PDF">PDF Document</option>
              <option value="Excel">Excel Spreadsheet</option>
              <option value="CSV">CSV File</option>
              <option value="PowerPoint">PowerPoint Presentation</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea value={reportSettings.description} onChange={(e) => setReportSettings((p) => ({ ...p, description: e.target.value }))} placeholder="Brief description of what this report contains..." rows={3} className="w-full p-3 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
            <select value={reportSettings.layout} onChange={(e) => setReportSettings((p) => ({ ...p, layout: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg">
              <option value="table">Table Layout</option>
              <option value="chart">Chart Layout</option>
              <option value="dashboard">Dashboard Layout</option>
              <option value="summary">Summary Layout</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
            <select value={reportSettings.template} onChange={(e) => setReportSettings((p) => ({ ...p, template: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg">
              <option value="business_standard">Business Standard</option>
              <option value="executive_summary">Executive Summary</option>
              <option value="detailed_analysis">Detailed Analysis</option>
              <option value="financial">Financial Report</option>
              <option value="marketing">Marketing Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
            <select value={reportSettings.pageOrientation} onChange={(e) => setReportSettings((p) => ({ ...p, pageOrientation: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg">
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-6 mt-6">
          <label className="flex items-center"><input type="checkbox" checked={reportSettings.includeCharts} onChange={(e) => setReportSettings((p) => ({ ...p, includeCharts: e.target.checked }))} className="mr-2" />Include Charts & Visualizations</label>
          <label className="flex items-center"><input type="checkbox" checked={reportSettings.includeSummary} onChange={(e) => setReportSettings((p) => ({ ...p, includeSummary: e.target.checked }))} className="mr-2" />Include Executive Summary</label>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Schedule Settings</h3>
          <label className="flex items-center"><input type="checkbox" checked={scheduleSettings.enabled} onChange={(e) => setScheduleSettings((p) => ({ ...p, enabled: e.target.checked }))} className="mr-2" />Enable Scheduling</label>
        </div>
        {scheduleSettings.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select value={scheduleSettings.frequency} onChange={(e) => setScheduleSettings((p) => ({ ...p, frequency: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            {scheduleSettings.frequency === 'weekly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day of Week</label>
                <select value={scheduleSettings.dayOfWeek} onChange={(e) => setScheduleSettings((p) => ({ ...p, dayOfWeek: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>
            )}
            {scheduleSettings.frequency === 'monthly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day of Month</label>
                <input type="number" min="1" max="31" value={scheduleSettings.dayOfMonth} onChange={(e) => setScheduleSettings((p) => ({ ...p, dayOfMonth: parseInt(e.target.value) }))} className="w-full p-3 border border-gray-300 rounded-lg" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input type="time" value={scheduleSettings.time} onChange={(e) => setScheduleSettings((p) => ({ ...p, time: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select value={scheduleSettings.timezone} onChange={(e) => setScheduleSettings((p) => ({ ...p, timezone: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg">
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Email Distribution</h3>
          <label className="flex items-center"><input type="checkbox" checked={emailSettings.enabled} onChange={(e) => setEmailSettings((p) => ({ ...p, enabled: e.target.checked }))} className="mr-2" />Send via Email</label>
        </div>
        {emailSettings.enabled && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Recipients</label>
              <div className="flex space-x-3">
                <input type="text" placeholder="Name" value={newRecipient.name} onChange={(e) => setNewRecipient((p) => ({ ...p, name: e.target.value }))} className="flex-1 p-3 border border-gray-300 rounded-lg" />
                <input type="email" placeholder="Email address" value={newRecipient.email} onChange={(e) => setNewRecipient((p) => ({ ...p, email: e.target.value }))} className="flex-1 p-3 border border-gray-300 rounded-lg" />
                <Button 
                  onClick={addRecipient} 
                  disabled={!newRecipient.email || !newRecipient.name} 
                  variant="success"
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add
                </Button>
              </div>
            </div>
            {emailSettings.recipients.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients ({emailSettings.recipients.length})</label>
                <div className="space-y-2">
                  {emailSettings.recipients.map((recipient) => (
                    <div key={recipient.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div>
                        <div className="font-medium">{recipient.name}</div>
                        <div className="text-sm text-gray-500">{recipient.email}</div>
                      </div>
                      <Button 
                        onClick={() => removeRecipient(recipient.id)} 
                        variant="ghost"
                        size="sm"
                        className="text-danger-500 hover:text-danger-700"
                        icon={<X className="w-4 h-4" />}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                <input type="text" value={emailSettings.subject} onChange={(e) => setEmailSettings((p) => ({ ...p, subject: e.target.value }))} placeholder="e.g., Monthly Sales Report - {{month}} {{year}}" className="w-full p-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attachment Format</label>
                <select value={emailSettings.attachFormat} onChange={(e) => setEmailSettings((p) => ({ ...p, attachFormat: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="PDF">PDF</option>
                  <option value="Excel">Excel</option>
                  <option value="CSV">CSV</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Body</label>
              <textarea value={emailSettings.body} onChange={(e) => setEmailSettings((p) => ({ ...p, body: e.target.value }))} placeholder={'Dear team,\n\nPlease find the attached report...\n\nBest regards'} rows={4} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


