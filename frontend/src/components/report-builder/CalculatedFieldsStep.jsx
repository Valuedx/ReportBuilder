import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Plus, X, Code, Save, Eye, ChevronDown, ChevronRight, Wand2 } from 'lucide-react'
import { Button } from '../ui'
import DateIntelligenceWizard from './DateIntelligenceWizard.jsx'

export default function CalculatedFieldsStep({ reportConfig, setReportConfig }) {
  const [calculatedFields, setCalculatedFields] = useState([])
  const [showEditor, setShowEditor] = useState(false)
  const [showWizard, setShowWizard] = useState(false)
  const [currentField, setCurrentField] = useState(null)
  const [expandedSections, setExpandedSections] = useState({
    functions: true,
    fields: true,
    operators: true,
    templates: false
  })

  // Available data sources and fields
  const dataSources = reportConfig.dataSources || []
  const availableFields = dataSources.flatMap(ds => 
    ds.columns?.map(col => ({
      id: `${ds.tableName}.${col.name}`,
      name: col.name,
      label: col.label || col.name,
      type: col.type,
      table: ds.tableName,
      qualified: `${ds.tableName}.${col.name}`
    })) || []
  )

  // SQL Functions categorized
  const sqlFunctions = {
    aggregation: [
      { name: 'SUM', syntax: 'SUM(field)', description: 'Sum of values' },
      { name: 'COUNT', syntax: 'COUNT(field)', description: 'Count of records' },
      { name: 'AVG', syntax: 'AVG(field)', description: 'Average value' },
      { name: 'MIN', syntax: 'MIN(field)', description: 'Minimum value' },
      { name: 'MAX', syntax: 'MAX(field)', description: 'Maximum value' },
      { name: 'COUNT(DISTINCT)', syntax: 'COUNT(DISTINCT field)', description: 'Count unique values' }
    ],
    date: [
      { name: 'EXTRACT', syntax: 'EXTRACT(YEAR FROM date_field)', description: 'Extract date part' },
      { name: 'DATE_PART', syntax: 'DATE_PART(\'month\', date_field)', description: 'Get date component' },
      { name: 'DATE_TRUNC', syntax: 'DATE_TRUNC(\'month\', date_field)', description: 'Truncate to period' },
      { name: 'CURRENT_DATE', syntax: 'CURRENT_DATE', description: 'Current date' },
      { name: 'AGE', syntax: 'AGE(date1, date2)', description: 'Calculate age/difference' }
    ],
    string: [
      { name: 'CONCAT', syntax: 'CONCAT(field1, field2)', description: 'Concatenate strings' },
      { name: 'UPPER', syntax: 'UPPER(field)', description: 'Convert to uppercase' },
      { name: 'LOWER', syntax: 'LOWER(field)', description: 'Convert to lowercase' },
      { name: 'SUBSTRING', syntax: 'SUBSTRING(field, start, length)', description: 'Extract substring' },
      { name: 'SPLIT_PART', syntax: 'SPLIT_PART(field, delimiter, position)', description: 'Split and extract part' }
    ],
    math: [
      { name: 'ROUND', syntax: 'ROUND(field, decimals)', description: 'Round to decimals' },
      { name: 'ABS', syntax: 'ABS(field)', description: 'Absolute value' },
      { name: 'COALESCE', syntax: 'COALESCE(field1, field2, default)', description: 'First non-null value' },
      { name: 'NULLIF', syntax: 'NULLIF(field, value)', description: 'Return NULL if equal' }
    ],
    conditional: [
      { name: 'CASE WHEN', syntax: 'CASE WHEN condition THEN value ELSE default END', description: 'Conditional logic' },
      { name: 'IF', syntax: 'CASE WHEN condition THEN true_value ELSE false_value END', description: 'Simple condition' }
    ]
  }

  // Common calculation templates
  const calculationTemplates = [
    {
      name: 'Year over Year Growth %',
      description: 'Calculate percentage growth between two periods',
      expression: `ROUND(
  (current_period_value - previous_period_value) * 100.0 
  / NULLIF(previous_period_value, 0), 2
) AS growth_percent`
    },
    {
      name: 'Month Number from Date',
      description: 'Extract month number (1-12) from various date formats',
      expression: `CASE
  WHEN date_field ~ '^[0-9]{1,2}/[0-9]{4}$' THEN SPLIT_PART(date_field, '/', 1)::int
  WHEN date_field IN ('Jan','January') THEN 1
  WHEN date_field IN ('Feb','February') THEN 2
  /* Add more months as needed */
  ELSE EXTRACT(MONTH FROM date_field::date)
END AS month_number`
    },
    {
      name: 'Period Range Filter',
      description: 'Filter data for specific month ranges (e.g., Jan-Jun)',
      expression: `CASE 
  WHEN year_field = 2024 AND month_field BETWEEN 1 AND 6 THEN value_field 
  ELSE 0 
END AS period_value`
    },
    {
      name: 'Running Total',
      description: 'Calculate running sum over ordered data',
      expression: `SUM(value_field) OVER (
  PARTITION BY group_field 
  ORDER BY date_field 
  ROWS UNBOUNDED PRECEDING
) AS running_total`
    }
  ]

  const operators = [
    { symbol: '+', description: 'Addition' },
    { symbol: '-', description: 'Subtraction' },
    { symbol: '*', description: 'Multiplication' },
    { symbol: '/', description: 'Division' },
    { symbol: '=', description: 'Equals' },
    { symbol: '!=', description: 'Not equals' },
    { symbol: '>', description: 'Greater than' },
    { symbol: '<', description: 'Less than' },
    { symbol: '>=', description: 'Greater or equal' },
    { symbol: '<=', description: 'Less or equal' },
    { symbol: 'AND', description: 'Logical AND' },
    { symbol: 'OR', description: 'Logical OR' },
    { symbol: 'NOT', description: 'Logical NOT' },
    { symbol: 'BETWEEN', description: 'Range check' },
    { symbol: 'IN', description: 'Value in list' }
  ]

  const createNewField = () => {
    const newField = {
      id: Date.now(),
      name: '',
      label: '',
      expression: '',
      dataType: 'numeric',
      description: '',
      isValid: false
    }
    setCurrentField(newField)
    setShowEditor(true)
  }

  const editField = (field) => {
    setCurrentField({ ...field })
    setShowEditor(true)
  }

  const saveField = () => {
    if (!currentField.name || !currentField.expression) return

    const updatedFields = currentField.id && calculatedFields.find(f => f.id === currentField.id)
      ? calculatedFields.map(f => f.id === currentField.id ? currentField : f)
      : [...calculatedFields, currentField]

    setCalculatedFields(updatedFields)
    setShowEditor(false)
    setCurrentField(null)

    // Update report config
    setReportConfig(prev => ({
      ...prev,
      calculatedFields: updatedFields
    }))
  }

  const addCalculatedFieldFromWizard = (field) => {
    const updatedFields = [...calculatedFields, field]
    setCalculatedFields(updatedFields)
    setReportConfig(prev => ({
      ...prev,
      calculatedFields: updatedFields
    }))
  }

  const deleteField = (fieldId) => {
    const updatedFields = calculatedFields.filter(f => f.id !== fieldId)
    setCalculatedFields(updatedFields)
    setReportConfig(prev => ({
      ...prev,
      calculatedFields: updatedFields
    }))
  }

  const insertIntoExpression = (text) => {
    if (!currentField) return
    setCurrentField(prev => ({
      ...prev,
      expression: prev.expression + text
    }))
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Load existing calculated fields
  useEffect(() => {
    if (reportConfig.calculatedFields) {
      setCalculatedFields(reportConfig.calculatedFields)
    }
  }, [])

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Calculated Fields</h2>
        <p className="text-gray-600">Create custom calculations, expressions, and analytical measures</p>
      </motion.div>

      {/* Calculated Fields List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calculator className="w-5 h-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold">Calculated Fields ({calculatedFields.length})</h3>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => setShowWizard(true)}
              variant="outline"
              icon={<Wand2 className="w-4 h-4" />}
            >
              Date Intelligence
            </Button>
            <Button
              onClick={createNewField}
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
            >
              New Field
            </Button>
          </div>
        </div>

        {calculatedFields.length === 0 ? (
          <div className="text-center py-12">
            <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Calculated Fields</h3>
            <p className="text-gray-500 mb-4">Create custom calculations to enhance your reports</p>
            <Button onClick={createNewField} variant="outline">
              Create Your First Calculated Field
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {calculatedFields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="font-medium text-gray-900">{field.label || field.name}</h4>
                      <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {field.dataType}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{field.description}</div>
                    <div className="font-mono text-xs bg-gray-50 p-2 rounded border">
                      {field.expression}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      onClick={() => editField(field)}
                      variant="ghost"
                      size="sm"
                      icon={<Code className="w-4 h-4" />}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteField(field.id)}
                      variant="ghost"
                      size="sm"
                      className="text-danger-600 hover:text-danger-700"
                      icon={<X className="w-4 h-4" />}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Calculated Field Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Editor Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {currentField?.id ? 'Edit' : 'Create'} Calculated Field
              </h3>
              <Button
                onClick={() => setShowEditor(false)}
                variant="ghost"
                size="sm"
                icon={<X className="w-4 h-4" />}
              />
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Expression Builder */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                  {/* Field Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Field Name</label>
                      <input
                        type="text"
                        value={currentField?.name || ''}
                        onChange={(e) => setCurrentField(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., growth_rate"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Display Label</label>
                      <input
                        type="text"
                        value={currentField?.label || ''}
                        onChange={(e) => setCurrentField(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="e.g., Growth Rate %"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
                      <select
                        value={currentField?.dataType || 'numeric'}
                        onChange={(e) => setCurrentField(prev => ({ ...prev, dataType: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="numeric">Numeric</option>
                        <option value="text">Text</option>
                        <option value="date">Date</option>
                        <option value="boolean">Boolean</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <input
                        type="text"
                        value={currentField?.description || ''}
                        onChange={(e) => setCurrentField(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of this calculation"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  {/* Expression Editor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SQL Expression</label>
                    <textarea
                      value={currentField?.expression || ''}
                      onChange={(e) => setCurrentField(prev => ({ ...prev, expression: e.target.value }))}
                      placeholder="Enter your SQL expression here..."
                      rows={8}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      onClick={() => setShowEditor(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={saveField}
                      variant="primary"
                      icon={<Save className="w-4 h-4" />}
                      disabled={!currentField?.name || !currentField?.expression}
                    >
                      Save Calculated Field
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sidebar - Functions & Fields */}
              <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
                <div className="p-4 space-y-4">
                  
                  {/* Available Fields */}
                  <div>
                    <button
                      onClick={() => toggleSection('fields')}
                      className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2"
                    >
                      Available Fields
                      {expandedSections.fields ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    {expandedSections.fields && (
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {availableFields.map(field => (
                          <button
                            key={field.id}
                            onClick={() => insertIntoExpression(field.qualified)}
                            className="block w-full text-left text-xs p-2 hover:bg-white rounded border text-gray-700 hover:text-gray-900 transition-colors"
                          >
                            <div className="font-medium">{field.qualified}</div>
                            <div className="text-gray-500">{field.type}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Operators */}
                  <div>
                    <button
                      onClick={() => toggleSection('operators')}
                      className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2"
                    >
                      Operators
                      {expandedSections.operators ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    {expandedSections.operators && (
                      <div className="grid grid-cols-3 gap-1">
                        {operators.map(op => (
                          <button
                            key={op.symbol}
                            onClick={() => insertIntoExpression(` ${op.symbol} `)}
                            className="text-xs p-1 bg-white hover:bg-gray-100 rounded border text-center font-mono"
                            title={op.description}
                          >
                            {op.symbol}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SQL Functions */}
                  <div>
                    <button
                      onClick={() => toggleSection('functions')}
                      className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2"
                    >
                      SQL Functions
                      {expandedSections.functions ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    {expandedSections.functions && (
                      <div className="space-y-3">
                        {Object.entries(sqlFunctions).map(([category, functions]) => (
                          <div key={category}>
                            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                              {category}
                            </div>
                            <div className="space-y-1">
                              {functions.map(func => (
                                <button
                                  key={func.name}
                                  onClick={() => insertIntoExpression(func.syntax)}
                                  className="block w-full text-left text-xs p-2 hover:bg-white rounded border"
                                  title={func.description}
                                >
                                  <div className="font-mono font-medium">{func.name}</div>
                                  <div className="text-gray-500 truncate">{func.description}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Calculation Templates */}
                  <div>
                    <button
                      onClick={() => toggleSection('templates')}
                      className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2"
                    >
                      Templates
                      {expandedSections.templates ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    {expandedSections.templates && (
                      <div className="space-y-2">
                        {calculationTemplates.map((template, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentField(prev => ({ ...prev, expression: template.expression }))}
                            className="block w-full text-left text-xs p-2 hover:bg-white rounded border"
                          >
                            <div className="font-medium">{template.name}</div>
                            <div className="text-gray-500">{template.description}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Date Intelligence Wizard */}
      <DateIntelligenceWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onAddCalculatedField={addCalculatedFieldFromWizard}
        availableFields={availableFields}
      />
    </div>
  )
}
