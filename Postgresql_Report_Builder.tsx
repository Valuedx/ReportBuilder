              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select
              value={reportSettings.format}
              onChange={(e) => setReportSettings(prev => ({ ...prev, format: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="PDF">PDF Document</option>
              <option value="Excel">Excel Spreadsheet</option>
              <option value="CSV">CSV File</option>
              <option value="PowerPoint">PowerPoint Presentation</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={reportSettings.description}
              onChange={(e) => setReportSettings(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of what this report contains..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
            <select
              value={reportSettings.layout}
              onChange={(e) => setReportSettings(prev => ({ ...prev, layout: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="table">Table Layout</option>
              <option value="chart">Chart Layout</option>
              <option value="dashboard">Dashboard Layout</option>
              <option value="summary">Summary Layout</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
            <select
              value={reportSettings.template}
              onChange={(e) => setReportSettings(prev => ({ ...prev, template: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="business_standard">Business Standard</option>
              <option value="executive_summary">Executive Summary</option>
              <option value="detailed_analysis">Detailed Analysis</option>
              <option value="financial">Financial Report</option>
              <option value="marketing">Marketing Report</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
            <select
              value={reportSettings.pageOrientation}
              onChange={(e) => setReportSettings(prev => ({ ...prev, pageOrientation: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={reportSettings.includeCharts}
              onChange={(e) => setReportSettings(prev => ({ ...prev, includeCharts: e.target.checked }))}
              className="mr-2"
            />
            Include Charts & Visualizations
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={reportSettings.includeSummary}
              onChange={(e) => setReportSettings(prev => ({ ...prev, includeSummary: e.target.checked }))}
              className="mr-2"
            />
            Include Executive Summary
          </label>
        </div>
      </div>

      {/* Scheduling Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Schedule Settings</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={scheduleSettings.enabled}
              onChange={(e) => setScheduleSettings(prev => ({ ...prev, enabled: e.target.checked }))}
              className="mr-2"
            />
            Enable Scheduling
          </label>
        </div>
        
        {scheduleSettings.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select
                value={scheduleSettings.frequency}
                onChange={(e) => setScheduleSettings(prev => ({ ...prev, frequency: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            
            {scheduleSettings.frequency === 'weekly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day of Week</label>
                <select
                  value={scheduleSettings.dayOfWeek}
                  onChange={(e) => setScheduleSettings(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
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
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={scheduleSettings.dayOfMonth}
                  onChange={(e) => setScheduleSettings(prev => ({ ...prev, dayOfMonth: parseInt(e.target.value) }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={scheduleSettings.time}
                onChange={(e) => setScheduleSettings(prev => ({ ...prev, time: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={scheduleSettings.timezone}
                onChange={(e) => setScheduleSettings(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
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

      {/* Email Distribution Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Email Distribution</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={emailSettings.enabled}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, enabled: e.target.checked }))}
              className="mr-2"
            />
            Send via Email
          </label>
        </div>
        
        {emailSettings.enabled && (
          <div className="space-y-6">
            {/* Add Recipients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Recipients</label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={newRecipient.name}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1 p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={newRecipient.email}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, email: e.target.value }))}
                  className="flex-1 p-3 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={addRecipient}
                  disabled={!newRecipient.email || !newRecipient.name}
                  className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
            
            {/* Recipients List */}
            {emailSettings.recipients.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients ({emailSettings.recipients.length})
                </label>
                <div className="space-y-2">
                  {emailSettings.recipients.map(recipient => (
                    <div key={recipient.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div>
                        <div className="font-medium">{recipient.name}</div>
                        <div className="text-sm text-gray-500">{recipient.email}</div>
                      </div>
                      <button
                        onClick={() => removeRecipient(recipient.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Email Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                <input
                  type="text"
                  value={emailSettings.subject}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="e.g., Monthly Sales Report - {{month}} {{year}}"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attachment Format</label>
                <select
                  value={emailSettings.attachFormat}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, attachFormat: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="PDF">PDF</option>
                  <option value="Excel">Excel</option>
                  <option value="CSV">CSV</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Body</label>
              <textarea
                value={emailSettings.body}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, body: e.target.value }))}
                placeholder="Dear team,&#10;&#10;Please find the attached report...&#10;&#10;Best regards"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ReportPreviewStep = ({ reportConfig, onSave, onExecute, isLoading }) => {
  const [executionResult, setExecutionResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleSaveReport = async () => {
    setIsSaving(true);
    try {
      const result = await onSave(reportConfig);
      alert(`Report saved successfully! ID: ${result.id}`);
    } catch (error) {
      alert('Error saving report: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExecuteReport = async () => {
    setIsExecuting(true);
    try {
      const result = await onExecute(reportConfig);
      setExecutionResult(result);
    } catch (error) {
      alert('Error executing report: ' + error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const getScheduleSummary = () => {
    const schedule = reportConfig.scheduleSettings;
    if (!schedule?.enabled) return 'No scheduling';
    
    let summary = `${schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)}`;
    if (schedule.frequency === 'weekly') {
      summary += ` on ${schedule.dayOfWeek}s`;
    } else if (schedule.frequency === 'monthly') {
      summary += ` on day ${schedule.dayOfMonth}`;
    }
    summary += ` at ${schedule.time} ${schedule.timezone}`;
    return summary;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 5: Review & Finalize</h2>
        <p className="text-gray-600">Review your report configuration and save or execute</p>
      </div>

      {/* Report Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-xl font-semibold mb-6">Report Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Basic Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{reportConfig.reportSettings?.name || 'Untitled Report'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Format:</span>
                <span className="font-medium">{reportConfig.reportSettings?.format || 'PDF'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Layout:</span>
                <span className="font-medium">{reportConfig.reportSettings?.layout || 'Table'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Template:</span>
                <span className="font-medium">{reportConfig.reportSettings?.template || 'Business Standard'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Data Configuration</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Data Sources:</span>
                <span className="font-medium">{reportConfig.dataSources?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fields:</span>
                <span className="font-medium">{reportConfig.fields?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Filters:</span>
                <span className="font-medium">{reportConfig.filters?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Schedule:</span>
                <span className="font-medium">{getScheduleSummary()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {reportConfig.emailSettings?.enabled && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-700 mb-3">Email Distribution</h4>
            <div className="text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Recipients:</span>
                <span className="font-medium">{reportConfig.emailSettings.recipients?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subject:</span>
                <span className="font-medium">{reportConfig.emailSettings.subject || 'Not set'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleSaveReport}
            disabled={isSaving || !reportConfig.reportSettings?.name}
            className="flex items-center justify-center px-6 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                💾 Save Report
              </>
            )}
          </button>
          
          <button
            onClick={handleExecuteReport}
            disabled={isExecuting || !reportConfig.reportSettings?.name}
            className="flex items-center justify-center px-6 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isExecuting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                🚀 Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Execution Result */}
      {executionResult && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">✅ Report Generated Successfully!</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-green-700">Execution ID:</span>
              <span className="font-mono text-sm bg-white px-2 py-1 rounded">{executionResult.executionId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700">Generated at:</span>
              <span className="font-medium">{new Date(executionResult.generatedAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700">Download:</span>
              <a 
                href={executionResult.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
              >
                📄 Download Report
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Report Builder Component
const ReportBuilder = ({ appState, updateAppState }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [reportConfig, setReportConfig] = useState({
    dataSources: [],
    fields: [],
    filters: [],
    reportSettings: {
      name: '',
      description: '',
      format: 'PDF',
      layout: 'table',
      template: 'business_standard'
    },
    scheduleSettings: {
      enabled: false
    },
    emailSettings: {
      enabled: false,
      recipients: []
    }
  });
  const [availableDataSources, setAvailableDataSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDataSources();
  }, []);

  const loadDataSources = async () => {
    setIsLoading(true);
    try {
      const dataSources = await mockReportAPI.getDataSources();
      setAvailableDataSources(dataSources);
    } catch (error) {
      console.error('Failed to load data sources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveReport = async (config) => {
    return await mockReportAPI.saveReport(config);
  };

  const handleExecuteReport = async (config) => {
    const execution = await mockReportAPI.executeReport(config);
    
    // If email is enabled, send emails
    if (config.emailSettings?.enabled && config.emailSettings.recipients.length > 0) {
      await mockReportAPI.sendReportEmail(config.emailSettings, execution.fileUrl);
    }
    
    return execution;
  };

  const steps = [
    { id: 1, title: 'Data Sources', icon: '🗃️', component: DataSourceStep },
    { id: 2, title: 'Report Fields', icon: '📋', component: ReportFieldsStep },
    { id: 3, title: 'Filters', icon: '🔍', component: ReportFiltersStep },
    { id: 4, title: 'Settings', icon: '⚙️', component: ReportSettingsStep },
    { id: 5, title: 'Review', icon: '👁️', component: ReportPreviewStep }
  ];

  const getCurrentStepComponent = () => {
    const step = steps.find(s => s.id === currentStep);
    const Component = step.component;
    
    const props = {
      reportConfig,
      setReportConfig,
      availableDataSources,
      isLoading,
      setIsLoading
    };

    if (currentStep === 5) {
      props.onSave = handleSaveReport;
      props.onExecute = handleExecuteReport;
    }

    return <Component {...props} />;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return reportConfig.dataSources?.length > 0;
      case 2: return reportConfig.fields?.length > 0;
      case 3: return true; // Filters are optional
      case 4: return reportConfig.reportSettings?.name?.trim();
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="flex items-center space-x-4 bg-white rounded-2xl p-4 shadow-lg border">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      currentStep === step.id
                        ? 'bg-blue-500 text-white shadow-md'
                        : currentStep > step.id
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2 text-lg">{step.icon}</span>
                    {step.title}
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${currentStep > step.id ? 'bg-green-400' : 'bg-gray-300'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-xl border p-8 mb-8">
          {getCurrentStepComponent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-8 py-3 rounded-xl font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            ← Previous
          </button>
          
          <button
            onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
            disabled={currentStep === 5 || !canProceed()}
            className="px-8 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {currentStep === 5 ? 'Complete' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Page Components
const HomePage = () => {
  const { navigate } = useAppContext();

  const stats = [
    { label: 'Total Reports', value: '156', change: '+12%', color: 'blue' },
    { label: 'Scheduled Reports', value: '43', change: '+8%', color: 'green' },
    { label: 'Email Recipients', value: '1,247', change: '+23%', color: 'purple' },
    { label: 'Reports This Month', value: '89', change: '+15%', color: 'orange' }
  ];

  const recentReports = [
    { id: 1, name: 'Monthly Sales Report', lastRun: '2 hours ago', status: 'Completed', recipients: 12 },
    { id: 2, name: 'Customer Analytics', lastRun: '1 day ago', status: 'Completed', recipients: 8 },
    { id: 3, name: 'Inventory Summary', lastRun: '2 days ago', status: 'Failed', recipients: 5 },
    { id: 4, name: 'Financial Overview', lastRun: '3 days ago', status: 'Completed', recipients: 15 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 mb-4">
            Enterprise Report Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Create, schedule, and distribute powerful business reports with automated delivery and advanced analytics
          </p>
          <button
            onClick={() => navigate('report-builder')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            📊 Create New Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`text-${stat.color}-500 text-sm font-medium bg-${stat.color}-50 px-2 py-1 rounded-full`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-2xl shadow-lg border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Reports</h2>
            <button
              onClick={() => navigate('reports')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Reports →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Report Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Last Run</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Recipients</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map(report => (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{report.name}</td>
                    <td className="py-3 px-4 text-gray-600">{report.lastRun}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'Completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{report.recipients}</td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            className="bg-white rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all cursor-pointer"
            onClick={() => navigate('report-builder')}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white text-xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Create Report</h3>
            <p className="text-gray-600 text-sm">Build new reports with our visual report builder</p>
          </div>
          
          <div 
            className="bg-white rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all cursor-pointer"
            onClick={() => navigate('schedules')}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white text-xl">⏰</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Manage Schedules</h3>
            <p className="text-gray-600 text-sm">View and configure automated report schedules</p>
          </div>
          
          <div 
            className="bg-white rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all cursor-pointer"
            onClick={() => navigate('analytics')}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white text-xl">📈</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">View Analytics</h3>
            <p className="text-gray-600 text-sm">Analyze report performance and usage metrics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportBuilderPage = () => {
  const { appState, updateAppState } = useAppContext();
  
  return (
    <ReportBuilder 
      appState={appState} 
      updateAppState={updateAppState} 
    />
  );
};

const MyReportsPage = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      name: 'Monthly Sales Report',
      description: 'Comprehensive sales analysis with regional breakdown',
      lastRun: '2024-01-15T10:30:00Z',
      nextRun: '2024-02-15T10:30:00Z',
      status: 'Active',
      schedule: 'Monthly',
      recipients: 12,
      format: 'PDF'
    },
    {
      id: 2,
      name: 'Customer Analytics Dashboard',
      description: 'Customer behavior and engagement metrics',
      lastRun: '2024-01-14T09:00:00Z',
      nextRun: '2024-01-21T09:00:00Z',
      status: 'Active',
      schedule: 'Weekly',
      recipients: 8,
      format: 'Excel'
    },
    {
      id: 3,
      name: 'Inventory Status Report',
      description: 'Current stock levels and reorder alerts',
      lastRun: '2024-01-13T08:00:00Z',
      nextRun: null,
      status: 'Paused',
      schedule: 'Daily',
      recipients: 5,
      format: 'PDF'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Reports</h1>
            <p className="text-gray-600">Manage and monitor your automated reports</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
            📊 Create New Report
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Reports</label>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all">
                🔍 Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReports.map(report => (
            <div key={report.id} className="bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-all">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{report.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    report.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : report.status === 'Paused'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {report.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Schedule:</span>
                    <span className="font-medium">{report.schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Recipients:</span>
                    <span className="font-medium">{report.recipients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Format:</span>
                    <span className="font-medium">{report.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Run:</span>
                    <span className="font-medium">{new Date(report.lastRun).toLocaleDateString()}</span>
                  </div>
                  {report.nextRun && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Next Run:</span>
                      <span className="font-medium">{new Date(report.nextRun).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-all">
                    ▶️ Run Now
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-all">
                    ⚙️ Edit
                  </button>
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-all">
                    📊
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reports Found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or create a new report</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SchedulesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Schedule Management</h2>
          <p className="text-gray-600">Advanced scheduling features coming soon!</p>
        </div>
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📈</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Report Analytics</h2>
          <p className="text-gray-600">Performance analytics and insights coming soon!</p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [appState, setAppState] = useState({
    userId: `user-${Math.random().toString(36).substr(2, 9)}`,
    reports: [],
    schedules: [],
    analytics: {}
  });

  const updateAppState = (updates) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider value={{ appState, updateAppState }}>
      <Router>
        <AppContent />
      </Router>
    </AppContext.Provider>
  );
};

const AppContent = ({ currentPage, navigate }) => {
  const contextValue = { ...useAppContext(), navigate };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <NavigationHeader currentPage={currentPage} navigate={navigate} />
        
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'report-builder' && <ReportBuilderPage />}
        {currentPage === 'reports' && <MyReportsPage />}
        {currentPage === 'schedules' && <SchedulesPage />}
        {currentPage === 'analytics' && <AnalyticsPage />}
      </div>
    </AppContext.Provider>
  );
};

export default App;import React, { useState, useEffect, createContext, useContext } from 'react';

// Global App Context
const AppContext = createContext();

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// Mock Backend APIs
const mockReportAPI = {
  // Data source operations
  getDataSources: () => new Promise(resolve => 
    setTimeout(() => resolve([
      { id: 'pg1', name: 'Sales Database', type: 'PostgreSQL', tables: 7 },
      { id: 'mysql1', name: 'Customer Database', type: 'MySQL', tables: 12 },
      { id: 'api1', name: 'Analytics API', type: 'REST API', endpoints: 5 }
    ]), 500)
  ),

  getTables: (datasourceId) => new Promise(resolve => 
    setTimeout(() => resolve([
      'sales_transactions', 'customers', 'products', 'inventory', 
      'suppliers', 'categories', 'sales_reports', 'user_analytics'
    ]), 500)
  ),

  getColumns: (datasourceId, tableName) => new Promise(resolve => {
    const columns = {
      'sales_transactions': [
        { name: 'transaction_id', type: 'number', label: 'Transaction ID' },
        { name: 'customer_id', type: 'number', label: 'Customer ID' },
        { name: 'product_id', type: 'number', label: 'Product ID' },
        { name: 'sale_date', type: 'datetime', label: 'Sale Date' },
        { name: 'amount', type: 'currency', label: 'Sale Amount' },
        { name: 'quantity', type: 'number', label: 'Quantity' },
        { name: 'region', type: 'text', label: 'Sales Region' },
        { name: 'sales_rep', type: 'text', label: 'Sales Representative' }
      ],
      'customers': [
        { name: 'customer_id', type: 'number', label: 'Customer ID' },
        { name: 'company_name', type: 'text', label: 'Company Name' },
        { name: 'contact_name', type: 'text', label: 'Contact Name' },
        { name: 'email', type: 'email', label: 'Email Address' },
        { name: 'phone', type: 'text', label: 'Phone Number' },
        { name: 'address', type: 'text', label: 'Address' },
        { name: 'city', type: 'text', label: 'City' },
        { name: 'country', type: 'text', label: 'Country' },
        { name: 'registration_date', type: 'datetime', label: 'Registration Date' },
        { name: 'customer_tier', type: 'text', label: 'Customer Tier' }
      ],
      'products': [
        { name: 'product_id', type: 'number', label: 'Product ID' },
        { name: 'product_name', type: 'text', label: 'Product Name' },
        { name: 'category', type: 'text', label: 'Category' },
        { name: 'price', type: 'currency', label: 'Unit Price' },
        { name: 'cost', type: 'currency', label: 'Unit Cost' },
        { name: 'supplier_id', type: 'number', label: 'Supplier ID' },
        { name: 'launch_date', type: 'datetime', label: 'Launch Date' },
        { name: 'status', type: 'text', label: 'Product Status' }
      ]
    };
    setTimeout(() => resolve(columns[tableName] || []), 500);
  }),

  // Report operations
  saveReport: (reportConfig) => new Promise(resolve => 
    setTimeout(() => resolve({
      id: `report_${Date.now()}`,
      name: reportConfig.name,
      status: 'saved',
      created_at: new Date().toISOString()
    }), 1000)
  ),

  scheduleReport: (reportId, scheduleConfig) => new Promise(resolve =>
    setTimeout(() => resolve({
      scheduleId: `schedule_${Date.now()}`,
      nextExecution: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled'
    }), 800)
  ),

  executeReport: (reportConfig) => new Promise(resolve =>
    setTimeout(() => resolve({
      executionId: `exec_${Date.now()}`,
      fileUrl: `/reports/generated_report_${Date.now()}.pdf`,
      status: 'completed',
      generatedAt: new Date().toISOString()
    }), 2000)
  ),

  sendReportEmail: (emailConfig, fileUrl) => new Promise(resolve =>
    setTimeout(() => resolve({
      emailId: `email_${Date.now()}`,
      recipients: emailConfig.recipients.length,
      status: 'sent',
      sentAt: new Date().toISOString()
    }), 1500)
  )
};

// Navigation and Routing
const Router = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home');
  
  const navigate = (page) => {
    setCurrentPage(page);
    window.history.pushState({}, '', `/${page === 'home' ? '' : page}`);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1) || 'home';
      setCurrentPage(path);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div>
      {React.Children.map(children, child =>
        React.cloneElement(child, { currentPage, navigate })
      )}
    </div>
  );
};

const NavigationHeader = ({ currentPage, navigate }) => {
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: '🏠' },
    { id: 'report-builder', label: 'Report Builder', icon: '📊' },
    { id: 'reports', label: 'My Reports', icon: '📋' },
    { id: 'schedules', label: 'Schedules', icon: '⏰' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('home')}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">📊</span>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">Enterprise Reports</div>
              <div className="text-xs text-gray-500">Business Intelligence Platform</div>
            </div>
          </div>

          <div className="flex space-x-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === item.id
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              <div className="font-medium">Admin User</div>
              <div className="text-xs">Premium Plan</div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">AU</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Report Builder Steps
const DataSourceStep = ({ reportConfig, setReportConfig, availableDataSources, isLoading }) => {
  const [selectedDataSource, setSelectedDataSource] = useState('');
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [tableColumns, setTableColumns] = useState({});

  useEffect(() => {
    if (selectedDataSource) {
      setIsLoading(true);
      mockReportAPI.getTables(selectedDataSource)
        .then(tables => {
          setAvailableTables(tables);
          setIsLoading(false);
        });
    }
  }, [selectedDataSource]);

  const loadTableColumns = async (tableName) => {
    if (!tableColumns[tableName]) {
      const columns = await mockReportAPI.getColumns(selectedDataSource, tableName);
      setTableColumns(prev => ({ ...prev, [tableName]: columns }));
    }
  };

  const addTable = async (tableName) => {
    if (!selectedTables.includes(tableName)) {
      setSelectedTables(prev => [...prev, tableName]);
      await loadTableColumns(tableName);
      
      setReportConfig(prev => ({
        ...prev,
        dataSources: [...(prev.dataSources || []), {
          dataSourceId: selectedDataSource,
          tableName: tableName,
          columns: tableColumns[tableName] || []
        }]
      }));
    }
  };

  const removeTable = (tableName) => {
    setSelectedTables(prev => prev.filter(t => t !== tableName));
    setReportConfig(prev => ({
      ...prev,
      dataSources: prev.dataSources?.filter(ds => ds.tableName !== tableName) || []
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 1: Choose Your Data Sources</h2>
        <p className="text-gray-600">Select the databases and tables for your report</p>
      </div>

      {/* Data Source Selection */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Available Data Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableDataSources.map(ds => (
            <button
              key={ds.id}
              onClick={() => setSelectedDataSource(ds.id)}
              className={`p-4 rounded-xl text-left transition-all border-2 ${
                selectedDataSource === ds.id
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium text-lg">{ds.name}</div>
              <div className="text-sm text-gray-500">{ds.type}</div>
              <div className="text-xs text-gray-400 mt-2">{ds.tables} tables available</div>
            </button>
          ))}
        </div>
      </div>

      {/* Table Selection */}
      {selectedDataSource && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Select Tables</h3>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Loading tables...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableTables.map(table => (
                <button
                  key={table}
                  onClick={() => addTable(table)}
                  disabled={selectedTables.includes(table)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    selectedTables.includes(table)
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {table}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Tables Summary */}
      {selectedTables.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Selected Tables ({selectedTables.length})</h3>
          <div className="space-y-3">
            {selectedTables.map(table => (
              <div key={table} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center">
                  <span className="font-medium">{table}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    {tableColumns[table]?.length || 0} columns
                  </span>
                </div>
                <button
                  onClick={() => removeTable(table)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ReportFieldsStep = ({ reportConfig, setReportConfig }) => {
  const [selectedFields, setSelectedFields] = useState([]);
  const [fieldConfig, setFieldConfig] = useState({});

  const dataSources = reportConfig.dataSources || [];
  const allColumns = dataSources.flatMap(ds => 
    ds.columns.map(col => ({ ...col, table: ds.tableName, dataSource: ds.dataSourceId }))
  );

  const addField = (column) => {
    const fieldId = `${column.table}.${column.name}`;
    if (!selectedFields.find(f => f.id === fieldId)) {
      const newField = {
        id: fieldId,
        ...column,
        label: column.label || column.name,
        format: getDefaultFormat(column.type),
        aggregation: 'none'
      };
      setSelectedFields(prev => [...prev, newField]);
    }
  };

  const removeField = (fieldId) => {
    setSelectedFields(prev => prev.filter(f => f.id !== fieldId));
  };

  const updateFieldConfig = (fieldId, config) => {
    setSelectedFields(prev => 
      prev.map(f => f.id === fieldId ? { ...f, ...config } : f)
    );
  };

  const getDefaultFormat = (type) => {
    switch (type) {
      case 'currency': return '$#,##0.00';
      case 'number': return '#,##0';
      case 'datetime': return 'MM/DD/YYYY';
      default: return '';
    }
  };

  useEffect(() => {
    setReportConfig(prev => ({
      ...prev,
      fields: selectedFields
    }));
  }, [selectedFields]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 2: Configure Report Fields</h2>
        <p className="text-gray-600">Choose and configure the data fields for your report</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Available Fields */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Available Fields</h3>
          <div className="space-y-4">
            {dataSources.map(ds => (
              <div key={ds.tableName}>
                <h4 className="font-medium text-gray-700 mb-2">{ds.tableName}</h4>
                <div className="grid grid-cols-1 gap-2">
                  {ds.columns.map(column => (
                    <button
                      key={column.name}
                      onClick={() => addField(column)}
                      className="flex items-center justify-between p-3 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <div>
                        <div className="font-medium text-sm">{column.label}</div>
                        <div className="text-xs text-gray-500">{column.type}</div>
                      </div>
                      <span className="text-blue-500 text-sm">+</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Fields Configuration */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Report Fields ({selectedFields.length})</h3>
          {selectedFields.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📋</div>
              <p>No fields selected yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedFields.map(field => (
                <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">{field.label}</div>
                      <div className="text-sm text-gray-500">{field.table}.{field.name}</div>
                    </div>
                    <button
                      onClick={() => removeField(field.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateFieldConfig(field.id, { label: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    
                    {field.type === 'number' || field.type === 'currency' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Aggregation
                        </label>
                        <select
                          value={field.aggregation}
                          onChange={(e) => updateFieldConfig(field.id, { aggregation: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="none">No Aggregation</option>
                          <option value="sum">Sum</option>
                          <option value="avg">Average</option>
                          <option value="count">Count</option>
                          <option value="min">Minimum</option>
                          <option value="max">Maximum</option>
                        </select>
                      </div>
                    ) : null}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Format
                      </label>
                      <input
                        type="text"
                        value={field.format}
                        onChange={(e) => updateFieldConfig(field.id, { format: e.target.value })}
                        placeholder="e.g., $#,##0.00"
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReportFiltersStep = ({ reportConfig, setReportConfig }) => {
  const [filters, setFilters] = useState([]);
  const [newFilter, setNewFilter] = useState({
    field: '',
    operator: 'equals',
    value: '',
    label: ''
  });

  const availableFields = reportConfig.fields || [];
  
  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'in_range', label: 'Date Range' },
    { value: 'is_null', label: 'Is Empty' },
    { value: 'not_null', label: 'Is Not Empty' }
  ];

  const addFilter = () => {
    if (newFilter.field && (newFilter.value || ['is_null', 'not_null'].includes(newFilter.operator))) {
      const selectedField = availableFields.find(f => f.id === newFilter.field);
      const filter = {
        id: Date.now(),
        ...newFilter,
        fieldLabel: selectedField?.label || newFilter.field,
        fieldType: selectedField?.type || 'text'
      };
      setFilters(prev => [...prev, filter]);
      setNewFilter({ field: '', operator: 'equals', value: '', label: '' });
    }
  };

  const removeFilter = (filterId) => {
    setFilters(prev => prev.filter(f => f.id !== filterId));
  };

  useEffect(() => {
    setReportConfig(prev => ({
      ...prev,
      filters: filters
    }));
  }, [filters]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 3: Set Report Criteria</h2>
        <p className="text-gray-600">Add filters to control what data appears in your report</p>
      </div>

      {/* Add New Filter */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Add Filter</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field</label>
            <select
              value={newFilter.field}
              onChange={(e) => setNewFilter(prev => ({ ...prev, field: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select Field</option>
              {availableFields.map(field => (
                <option key={field.id} value={field.id}>
                  {field.label} ({field.type})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
            <select
              value={newFilter.operator}
              onChange={(e) => setNewFilter(prev => ({ ...prev, operator: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              {operators.map(op => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
            <input
              type="text"
              placeholder="Filter value"
              value={newFilter.value}
              onChange={(e) => setNewFilter(prev => ({ ...prev, value: e.target.value }))}
              disabled={['is_null', 'not_null'].includes(newFilter.operator)}
              className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={addFilter}
              disabled={!newFilter.field || (!newFilter.value && !['is_null', 'not_null'].includes(newFilter.operator))}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Add Filter
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Active Filters ({filters.length})</h3>
          <div className="space-y-3">
            {filters.map(filter => (
              <div key={filter.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-800">{filter.fieldLabel}</span>
                  <span className="text-blue-600 font-medium">
                    {operators.find(op => op.value === filter.operator)?.label}
                  </span>
                  {!['is_null', 'not_null'].includes(filter.operator) && (
                    <span className="bg-white px-3 py-1 rounded-full text-sm border">
                      {filter.value}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {filters.length === 0 && (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Filters Added</h3>
          <p className="text-gray-500">Add filters to control what data appears in your report</p>
        </div>
      )}
    </div>
  );
};

const ReportSettingsStep = ({ reportConfig, setReportConfig }) => {
  const [reportSettings, setReportSettings] = useState({
    name: '',
    description: '',
    format: 'PDF',
    layout: 'table',
    template: 'business_standard',
    includeCharts: true,
    includeSummary: true,
    pageOrientation: 'portrait'
  });

  const [scheduleSettings, setScheduleSettings] = useState({
    enabled: false,
    frequency: 'weekly',
    dayOfWeek: 'monday',
    dayOfMonth: 1,
    time: '09:00',
    timezone: 'UTC',
    endDate: ''
  });

  const [emailSettings, setEmailSettings] = useState({
    enabled: false,
    recipients: [],
    subject: '',
    body: '',
    attachFormat: 'PDF'
  });

  const [newRecipient, setNewRecipient] = useState({ name: '', email: '' });

  const addRecipient = () => {
    if (newRecipient.email && newRecipient.name) {
      setEmailSettings(prev => ({
        ...prev,
        recipients: [...prev.recipients, { ...newRecipient, id: Date.now() }]
      }));
      setNewRecipient({ name: '', email: '' });
    }
  };

  const removeRecipient = (recipientId) => {
    setEmailSettings(prev => ({
      ...prev,
      recipients: prev.recipients.filter(r => r.id !== recipientId)
    }));
  };

  useEffect(() => {
    setReportConfig(prev => ({
      ...prev,
      reportSettings,
      scheduleSettings,
      emailSettings
    }));
  }, [reportSettings, scheduleSettings, emailSettings]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 4: Report Settings & Schedule</h2>
        <p className="text-gray-600">Configure your report format, scheduling, and distribution</p>
      </div>

      {/* Report Basic Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Report Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Name *</label>
            <input
              type="text"
              value={reportSettings.name}
              onChange={(e) => setReportSettings(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Monthly Sales Report"
              className="w-full p-3 border border-