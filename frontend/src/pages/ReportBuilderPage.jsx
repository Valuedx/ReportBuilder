import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { reportsAPI } from '../services/reports.js'
import { Button, LoadingSpinner } from '../components/ui'
import DataSourceStep from '../components/report-builder/DataSourceStep.jsx'
import ReportFieldsStep from '../components/report-builder/ReportFieldsStep.jsx'
import CalculatedFieldsStep from '../components/report-builder/CalculatedFieldsStep.jsx'
import ReportFiltersStep from '../components/report-builder/ReportFiltersStep.jsx'
import ReportSettingsStep from '../components/report-builder/ReportSettingsStep.jsx'
import ReportPreviewStep from '../components/report-builder/ReportPreviewStep.jsx'

export default function ReportBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [reportConfig, setReportConfig] = useState({
    dataSources: [],
    fields: [],
    calculatedFields: [],
    filters: [],
    reportSettings: { name: '', description: '', format: 'PDF', layout: 'table', template: 'business_standard' },
    scheduleSettings: { enabled: false },
    emailSettings: { enabled: false, recipients: [] },
  })
  const [availableDataSources, setAvailableDataSources] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    reportsAPI.getDataSources().then(setAvailableDataSources).finally(() => setIsLoading(false))
  }, [])

  const steps = [
    { id: 1, title: 'Data Sources' },
    { id: 2, title: 'Report Fields' },
    { id: 3, title: 'Calculated Fields' },
    { id: 4, title: 'Filters' },
    { id: 5, title: 'Settings' },
    { id: 6, title: 'Review' },
  ]

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (reportConfig.dataSources?.length || 0) > 0
      case 2:
        return (reportConfig.fields?.length || 0) > 0
      case 5:
        return !!reportConfig.reportSettings?.name?.trim()
      default:
        return true
    }
  }

  const handleSaveReport = async (config) => reportsAPI.saveReport(config)
  const handleExecuteReport = async (config) => {
    const execution = await reportsAPI.executeReport(config)
    if (config.emailSettings?.enabled && config.emailSettings.recipients.length > 0) {
      await reportsAPI.sendReportEmail(config.emailSettings, execution.fileUrl)
    }
    return execution
  }

  const stepsConfig = [
    { id: 1, component: DataSourceStep },
    { id: 2, component: ReportFieldsStep },
    { id: 3, component: CalculatedFieldsStep },
    { id: 4, component: ReportFiltersStep },
    { id: 5, component: ReportSettingsStep },
    { id: 6, component: ReportPreviewStep },
  ]

  const CurrentStepComponent = stepsConfig.find((s) => s.id === currentStep)?.component || (() => null)

  if (isLoading && availableDataSources.length === 0) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading data sources...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Progress Steps */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-soft border border-gray-200/50">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <motion.button
                onClick={() => setCurrentStep(step.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentStep === step.id
                    ? 'bg-primary-500 text-white shadow-sm'
                    : currentStep > step.id
                    ? 'bg-success-100 text-success-700 hover:bg-success-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center">
                  {currentStep > step.id && (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {step.title}
                </div>
              </motion.button>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-3 transition-all duration-300 ${
                  currentStep > step.id ? 'bg-success-400' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <motion.div 
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-gray-200/50 p-8"
      >
        <CurrentStepComponent
          reportConfig={reportConfig}
          setReportConfig={setReportConfig}
          availableDataSources={availableDataSources}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onSave={currentStep === 6 ? handleSaveReport : undefined}
          onExecute={currentStep === 6 ? handleExecuteReport : undefined}
        />
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          variant="outline"
          icon={<ChevronLeft className="w-4 h-4" />}
          size="lg"
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
          disabled={currentStep === 5 || !canProceed()}
          icon={currentStep < 5 ? <ChevronRight className="w-4 h-4" /> : undefined}
          size="lg"
          className="bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700"
        >
          {currentStep === 5 ? 'Complete Report' : 'Next Step'}
        </Button>
      </div>
    </motion.div>
  )
}


