import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, TrendingUp, X, Wand2, Check } from 'lucide-react'
import { Button } from '../ui'

export default function DateIntelligenceWizard({ 
  isOpen, 
  onClose, 
  onAddCalculatedField, 
  availableFields 
}) {
  const [wizardType, setWizardType] = useState('')
  const [selectedField, setSelectedField] = useState('')
  const [periodType, setPeriodType] = useState('month')
  const [comparisonType, setComparisonType] = useState('year_over_year')
  const [customPeriods, setCustomPeriods] = useState({ current: '', previous: '' })
  const [monthRange, setMonthRange] = useState({ start: 1, end: 6 })
  const [dateFormat, setDateFormat] = useState('auto')

  // Available date fields from the data sources
  const dateFields = availableFields.filter(field => 
    field.type && (
      field.type.toLowerCase().includes('date') ||
      field.type.toLowerCase().includes('time') ||
      field.name.toLowerCase().includes('date') ||
      field.name.toLowerCase().includes('month') ||
      field.name.toLowerCase().includes('year')
    )
  )

  const wizardTypes = [
    {
      id: 'month_extraction',
      title: 'Month Number Extraction',
      description: 'Extract month numbers (1-12) from various date formats',
      icon: Calendar,
      color: 'blue'
    },
    {
      id: 'period_comparison',
      title: 'Period Comparison',
      description: 'Compare values between different time periods',
      icon: TrendingUp,
      color: 'green'
    },
    {
      id: 'date_parsing',
      title: 'Date Format Parsing',
      description: 'Handle multiple date formats and extract components',
      icon: Clock,
      color: 'purple'
    },
    {
      id: 'conditional_aggregation',
      title: 'Period-Based Aggregation',
      description: 'Sum/count values for specific date ranges',
      icon: Wand2,
      color: 'orange'
    }
  ]

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const generateMonthExtractionSQL = () => {
    const fieldName = selectedField
    return `CASE
  WHEN "${fieldName}" ~ '^[0-9]{1,2}/[0-9]{4}$' THEN SPLIT_PART("${fieldName}", '/', 1)::int
  WHEN "${fieldName}" IN ('Jan','January') THEN 1
  WHEN "${fieldName}" IN ('Feb','February') THEN 2
  WHEN "${fieldName}" IN ('Mar','March') THEN 3
  WHEN "${fieldName}" IN ('Apr','April') THEN 4
  WHEN "${fieldName}" = 'May' THEN 5
  WHEN "${fieldName}" IN ('Jun','June') THEN 6
  WHEN "${fieldName}" IN ('Jul','July') THEN 7
  WHEN "${fieldName}" IN ('Aug','August') THEN 8
  WHEN "${fieldName}" IN ('Sep','Sept','September') THEN 9
  WHEN "${fieldName}" IN ('Oct','October') THEN 10
  WHEN "${fieldName}" IN ('Nov','November') THEN 11
  WHEN "${fieldName}" IN ('Dec','December') THEN 12
  ELSE 
    CASE 
      WHEN "${fieldName}"::text ~ '^[0-9]{4}-[0-9]{1,2}' THEN EXTRACT(MONTH FROM "${fieldName}"::date)
      ELSE NULL 
    END
END`
  }

  const generatePeriodComparisonSQL = () => {
    const valueField = availableFields.find(f => f.type && (
      f.type.toLowerCase().includes('numeric') || 
      f.type.toLowerCase().includes('int') ||
      f.type.toLowerCase().includes('decimal')
    ))?.qualified || 'value_field'

    if (comparisonType === 'year_over_year') {
      return `ROUND(
  (SUM(CASE WHEN year_field = ${new Date().getFullYear()} AND month_field BETWEEN ${monthRange.start} AND ${monthRange.end} THEN ${valueField} ELSE 0 END) - 
   SUM(CASE WHEN year_field = ${new Date().getFullYear() - 1} AND month_field BETWEEN ${monthRange.start} AND ${monthRange.end} THEN ${valueField} ELSE 0 END)) * 100.0 
  / NULLIF(SUM(CASE WHEN year_field = ${new Date().getFullYear() - 1} AND month_field BETWEEN ${monthRange.start} AND ${monthRange.end} THEN ${valueField} ELSE 0 END), 0), 2
)`
    } else if (comparisonType === 'custom_periods') {
      return `ROUND(
  (current_period_value - previous_period_value) * 100.0 
  / NULLIF(previous_period_value, 0), 2
)`
    }
    return ''
  }

  const generateDateParsingSQL = () => {
    const fieldName = selectedField
    
    if (dateFormat === 'year_extraction') {
      return `CASE
  WHEN "${fieldName}" ~ '^[0-9]{4}' THEN SUBSTRING("${fieldName}", 1, 4)::int
  WHEN "${fieldName}" ~ '/[0-9]{4}$' THEN SUBSTRING("${fieldName}", LENGTH("${fieldName}") - 3, 4)::int
  ELSE EXTRACT(YEAR FROM "${fieldName}"::date)
END`
    } else if (dateFormat === 'quarter_extraction') {
      return `CASE
  WHEN EXTRACT(MONTH FROM "${fieldName}"::date) BETWEEN 1 AND 3 THEN 1
  WHEN EXTRACT(MONTH FROM "${fieldName}"::date) BETWEEN 4 AND 6 THEN 2
  WHEN EXTRACT(MONTH FROM "${fieldName}"::date) BETWEEN 7 AND 9 THEN 3
  WHEN EXTRACT(MONTH FROM "${fieldName}"::date) BETWEEN 10 AND 12 THEN 4
  ELSE NULL
END`
    }
    return `"${fieldName}"::date`
  }

  const generateConditionalAggregationSQL = () => {
    const valueField = availableFields.find(f => f.type && (
      f.type.toLowerCase().includes('numeric') || 
      f.type.toLowerCase().includes('int') ||
      f.type.toLowerCase().includes('decimal')
    ))?.qualified || 'value_field'

    return `SUM(CASE 
  WHEN year_field = 2024 AND month_field BETWEEN ${monthRange.start} AND ${monthRange.end} THEN ${valueField} 
  ELSE 0 
END)`
  }

  const generateCalculatedField = () => {
    let expression = ''
    let fieldName = ''
    let label = ''
    let description = ''

    switch (wizardType) {
      case 'month_extraction':
        expression = generateMonthExtractionSQL()
        fieldName = 'month_number'
        label = 'Month Number'
        description = 'Extracted month number (1-12) from date field'
        break
      case 'period_comparison':
        expression = generatePeriodComparisonSQL()
        fieldName = 'growth_percentage'
        label = 'Growth %'
        description = `${comparisonType === 'year_over_year' ? 'Year-over-year' : 'Period'} growth percentage`
        break
      case 'date_parsing':
        expression = generateDateParsingSQL()
        fieldName = dateFormat === 'year_extraction' ? 'year_parsed' : 
                   dateFormat === 'quarter_extraction' ? 'quarter_parsed' : 'date_parsed'
        label = dateFormat === 'year_extraction' ? 'Year' : 
                dateFormat === 'quarter_extraction' ? 'Quarter' : 'Parsed Date'
        description = 'Parsed date component'
        break
      case 'conditional_aggregation':
        expression = generateConditionalAggregationSQL()
        fieldName = 'period_total'
        label = 'Period Total'
        description = `Sum for ${monthNames[monthRange.start - 1]} to ${monthNames[monthRange.end - 1]}`
        break
    }

    if (expression && fieldName) {
      onAddCalculatedField({
        id: Date.now(),
        name: fieldName,
        label: label,
        expression: expression,
        dataType: wizardType === 'date_parsing' && dateFormat !== 'year_extraction' ? 'date' : 'numeric',
        description: description,
        isValid: true,
        generatedBy: 'date_intelligence_wizard'
      })
      
      // Reset wizard
      setWizardType('')
      setSelectedField('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Wand2 className="w-6 h-6 text-primary-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Date Intelligence Wizard</h3>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            icon={<X className="w-4 h-4" />}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {!wizardType ? (
            /* Wizard Type Selection */
            <div className="p-6">
              <h4 className="text-lg font-medium mb-4">Choose a Date Intelligence Pattern</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wizardTypes.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <motion.button
                      key={type.id}
                      onClick={() => setWizardType(type.id)}
                      className={`p-6 border-2 rounded-xl text-left hover:shadow-lg transition-all ${
                        type.color === 'blue' ? 'border-blue-200 hover:border-blue-400' :
                        type.color === 'green' ? 'border-green-200 hover:border-green-400' :
                        type.color === 'purple' ? 'border-purple-200 hover:border-purple-400' :
                        'border-orange-200 hover:border-orange-400'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start">
                        <div className={`p-3 rounded-lg mr-4 ${
                          type.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                          type.color === 'green' ? 'bg-green-100 text-green-600' :
                          type.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">{type.title}</h5>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Wizard Configuration */
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">
                  {wizardTypes.find(t => t.id === wizardType)?.title}
                </h4>
                <Button
                  onClick={() => setWizardType('')}
                  variant="outline"
                  size="sm"
                >
                  Back to Selection
                </Button>
              </div>

              {/* Field Selection */}
              {(wizardType === 'month_extraction' || wizardType === 'date_parsing') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date Field
                  </label>
                  <select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Choose a date field...</option>
                    {dateFields.map(field => (
                      <option key={field.id} value={field.name}>
                        {field.qualified} ({field.type})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date Format Options */}
              {wizardType === 'date_parsing' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What to Extract
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="year_extraction"
                        checked={dateFormat === 'year_extraction'}
                        onChange={(e) => setDateFormat(e.target.value)}
                        className="mr-2"
                      />
                      Extract Year (YYYY)
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="quarter_extraction"
                        checked={dateFormat === 'quarter_extraction'}
                        onChange={(e) => setDateFormat(e.target.value)}
                        className="mr-2"
                      />
                      Extract Quarter (1-4)
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="auto"
                        checked={dateFormat === 'auto'}
                        onChange={(e) => setDateFormat(e.target.value)}
                        className="mr-2"
                      />
                      Normalize to Standard Date
                    </label>
                  </div>
                </div>
              )}

              {/* Period Comparison Settings */}
              {wizardType === 'period_comparison' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comparison Type
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="year_over_year"
                          checked={comparisonType === 'year_over_year'}
                          onChange={(e) => setComparisonType(e.target.value)}
                          className="mr-2"
                        />
                        Year over Year (e.g., 2024 vs 2023)
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="custom_periods"
                          checked={comparisonType === 'custom_periods'}
                          onChange={(e) => setComparisonType(e.target.value)}
                          className="mr-2"
                        />
                        Custom Period Comparison
                      </label>
                    </div>
                  </div>

                  {comparisonType === 'year_over_year' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Month Range
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">From Month</label>
                          <select
                            value={monthRange.start}
                            onChange={(e) => setMonthRange(prev => ({ ...prev, start: parseInt(e.target.value) }))}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          >
                            {monthNames.map((month, index) => (
                              <option key={index} value={index + 1}>
                                {index + 1} - {month}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">To Month</label>
                          <select
                            value={monthRange.end}
                            onChange={(e) => setMonthRange(prev => ({ ...prev, end: parseInt(e.target.value) }))}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          >
                            {monthNames.map((month, index) => (
                              <option key={index} value={index + 1} disabled={index + 1 < monthRange.start}>
                                {index + 1} - {month}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Conditional Aggregation Settings */}
              {wizardType === 'conditional_aggregation' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Period Range
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Month</label>
                      <select
                        value={monthRange.start}
                        onChange={(e) => setMonthRange(prev => ({ ...prev, start: parseInt(e.target.value) }))}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        {monthNames.map((month, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1} - {month}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Month</label>
                      <select
                        value={monthRange.end}
                        onChange={(e) => setMonthRange(prev => ({ ...prev, end: parseInt(e.target.value) }))}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        {monthNames.map((month, index) => (
                          <option key={index} value={index + 1} disabled={index + 1 < monthRange.start}>
                            {index + 1} - {month}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    This will create a SUM that only includes values from {monthNames[monthRange.start - 1]} to {monthNames[monthRange.end - 1]}
                  </p>
                </div>
              )}

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Generated Expression Preview:</h5>
                <pre className="text-xs font-mono bg-white p-3 rounded border overflow-x-auto">
                  {wizardType === 'month_extraction' && selectedField ? generateMonthExtractionSQL() :
                   wizardType === 'period_comparison' ? generatePeriodComparisonSQL() :
                   wizardType === 'date_parsing' && selectedField ? generateDateParsingSQL() :
                   wizardType === 'conditional_aggregation' ? generateConditionalAggregationSQL() :
                   'Select options above to see the generated SQL...'}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {wizardType && (
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <Button
              onClick={onClose}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={generateCalculatedField}
              variant="primary"
              icon={<Check className="w-4 h-4" />}
              disabled={
                (wizardType === 'month_extraction' && !selectedField) ||
                (wizardType === 'date_parsing' && !selectedField)
              }
            >
              Add Calculated Field
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
