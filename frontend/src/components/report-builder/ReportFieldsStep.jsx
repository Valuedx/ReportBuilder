import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Table, Columns, Plus, X, Settings } from 'lucide-react'
import { Button } from '../ui'

export default function ReportFieldsStep({ reportConfig, setReportConfig }) {
  const [selectedFields, setSelectedFields] = useState([])
  const dataSources = reportConfig.dataSources || []
  const allColumns = dataSources.flatMap((ds) => ds.columns.map((col) => ({ ...col, table: ds.tableName, dataSource: ds.dataSourceId })))

  const getDefaultFormat = (type) => {
    switch (type) {
      case 'currency':
        return '$#,##0.00'
      case 'number':
        return '#,##0'
      case 'datetime':
        return 'MM/DD/YYYY'
      default:
        return ''
    }
  }

  const addField = (column) => {
    const fieldId = `${column.table}.${column.name}`
    if (!selectedFields.find((f) => f.id === fieldId)) {
      const newField = { id: fieldId, ...column, label: column.label || column.name, format: getDefaultFormat(column.type), aggregation: 'none' }
      setSelectedFields((prev) => [...prev, newField])
    }
  }

  const removeField = (fieldId) => {
    setSelectedFields((prev) => prev.filter((f) => f.id !== fieldId))
  }

  const updateFieldConfig = (fieldId, config) => {
    setSelectedFields((prev) => prev.map((f) => (f.id === fieldId ? { ...f, ...config } : f)))
  }

  useEffect(() => {
    setReportConfig((prev) => ({ ...prev, fields: selectedFields }))
  }, [selectedFields])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 2: Configure Report Fields</h2>
        <p className="text-gray-600">Choose and configure the data fields for your report</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center mb-4">
            <Table className="w-5 h-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold">Available Fields</h3>
            <span className="ml-2 text-sm text-gray-500">({allColumns.length} total)</span>
          </div>
          
          {dataSources.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Table className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No tables selected yet.</p>
              <p className="text-sm">Go back to Step 1 to select your data sources.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {dataSources.map((ds, dsIndex) => (
                <motion.div
                  key={ds.tableName}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dsIndex * 0.1 }}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-center mb-3">
                    <Table className="w-4 h-4 text-success-600 mr-2" />
                    <h4 className="font-medium text-gray-700">{ds.tableName}</h4>
                    <span className="ml-2 text-xs text-gray-500">({ds.columns?.length || 0} columns)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {ds.columns?.map((column, colIndex) => {
                      const isSelected = selectedFields.some(f => f.id === `${ds.tableName}.${column.name}`)
                      return (
                        <motion.button
                          key={column.name}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (dsIndex * 0.1) + (colIndex * 0.05) }}
                          onClick={() => addField({ ...column, table: ds.tableName, dataSource: ds.dataSourceId })}
                          disabled={isSelected}
                          className={`flex items-center justify-between p-3 text-left rounded-lg border transition-all ${
                            isSelected
                              ? 'border-success-300 bg-success-50 text-success-700 cursor-default'
                              : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50 hover:shadow-sm'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-sm">{column.label || column.name}</div>
                            <div className="text-xs text-gray-500">{column.type}</div>
                          </div>
                          {isSelected ? (
                            <span className="text-success-600 text-sm">✓</span>
                          ) : (
                            <Plus className="w-4 h-4 text-primary-500" />
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center mb-4">
            <Columns className="w-5 h-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold">Report Fields ({selectedFields.length})</h3>
          </div>
          
          {selectedFields.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Columns className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No fields selected yet</p>
              <p className="text-sm">Click on fields from the available tables to add them.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Table className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium">{field.label}</div>
                        <div className="text-sm text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs mr-2">{field.table}</span>
                          {field.name} ({field.type})
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => removeField(field.id)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-danger-600 transition-colors"
                      icon={<X className="w-4 h-4" />}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateFieldConfig(field.id, { label: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter display name"
                      />
                    </div>
                    
                    {(field.type === 'number' || field.type === 'currency') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Aggregation</label>
                        <select
                          value={field.aggregation}
                          onChange={(e) => updateFieldConfig(field.id, { aggregation: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="none">No Aggregation</option>
                          <option value="sum">Sum</option>
                          <option value="avg">Average</option>
                          <option value="count">Count</option>
                          <option value="min">Minimum</option>
                          <option value="max">Maximum</option>
                        </select>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                      <input
                        type="text"
                        value={field.format}
                        onChange={(e) => updateFieldConfig(field.id, { format: e.target.value })}
                        placeholder="e.g., $#,##0.00 or MM/DD/YYYY"
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      {field.type === 'currency' && (
                        <div className="text-xs text-gray-500 mt-1">
                          Try: $#,##0.00 or €#,##0.00
                        </div>
                      )}
                      {field.type === 'datetime' && (
                        <div className="text-xs text-gray-500 mt-1">
                          Try: MM/DD/YYYY or DD/MM/YYYY HH:mm
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}


