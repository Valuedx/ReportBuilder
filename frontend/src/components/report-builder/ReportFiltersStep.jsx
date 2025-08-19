import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, Table, Plus, X } from 'lucide-react'
import { Button } from '../ui'

export default function ReportFiltersStep({ reportConfig, setReportConfig }) {
  const [filters, setFilters] = useState([])
  const [newFilter, setNewFilter] = useState({ field: '', operator: 'equals', value: '', label: '' })
  const availableFields = reportConfig.fields || []
  
  // Get available fields from all tables including ones not yet selected as report fields
  const dataSources = reportConfig.dataSources || []
  const allAvailableFields = [
    ...availableFields, // Selected report fields
    ...dataSources.flatMap((ds) => 
      ds.columns
        .filter(col => !availableFields.some(f => f.id === `${ds.tableName}.${col.name}`))
        .map(col => ({
          id: `${ds.tableName}.${col.name}`,
          name: col.name,
          label: col.label || col.name,
          type: col.type,
          table: ds.tableName,
          dataSource: ds.dataSourceId,
          isFilterOnly: true, // Mark as filter-only field
        }))
    )
  ]

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'in_range', label: 'Date Range' },
    { value: 'is_null', label: 'Is Empty' },
    { value: 'not_null', label: 'Is Not Empty' },
  ]

  const addFilter = () => {
    if (newFilter.field && (newFilter.value || ['is_null', 'not_null'].includes(newFilter.operator))) {
      const selectedField = allAvailableFields.find((f) => f.id === newFilter.field)
      const filter = { 
        id: Date.now(), 
        ...newFilter, 
        fieldLabel: selectedField?.label || newFilter.field, 
        fieldType: selectedField?.type || 'text',
        tableName: selectedField?.table,
        isFilterOnly: selectedField?.isFilterOnly || false,
      }
      setFilters((prev) => [...prev, filter])
      setNewFilter({ field: '', operator: 'equals', value: '', label: '' })
    }
  }

  const removeFilter = (filterId) => setFilters((prev) => prev.filter((f) => f.id !== filterId))

  useEffect(() => {
    setReportConfig((prev) => ({ ...prev, filters }))
  }, [filters])

  // Group fields by table for better organization
  const fieldsByTable = allAvailableFields.reduce((acc, field) => {
    const tableName = field.table || 'Unknown'
    if (!acc[tableName]) {
      acc[tableName] = []
    }
    acc[tableName].push(field)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 3: Set Report Criteria</h2>
        <p className="text-gray-600">Add filters to control what data appears in your report from any selected table</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold">Add Filter</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field</label>
            <select 
              value={newFilter.field} 
              onChange={(e) => setNewFilter((p) => ({ ...p, field: e.target.value }))} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select Field</option>
              {Object.entries(fieldsByTable).map(([tableName, fields]) => (
                <optgroup key={tableName} label={tableName}>
                  {fields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.label} ({field.type}) {field.isFilterOnly ? '(Filter Only)' : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
            <select 
              value={newFilter.operator} 
              onChange={(e) => setNewFilter((p) => ({ ...p, operator: e.target.value }))} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {operators.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
            <input 
              type="text" 
              placeholder="Filter value" 
              value={newFilter.value} 
              onChange={(e) => setNewFilter((p) => ({ ...p, value: e.target.value }))} 
              disabled={['is_null', 'not_null'].includes(newFilter.operator)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100" 
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={addFilter} 
              disabled={!newFilter.field || (!newFilter.value && !['is_null', 'not_null'].includes(newFilter.operator))} 
              className="w-full"
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
            >
              Add Filter
            </Button>
          </div>
        </div>
      </motion.div>
      {filters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-success-600 mr-2" />
            <h3 className="text-lg font-semibold">Active Filters ({filters.length})</h3>
          </div>
          <div className="space-y-3">
            {filters.map((filter, index) => (
              <motion.div
                key={filter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-4 group hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Table className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800">{filter.fieldLabel}</span>
                        {filter.isFilterOnly && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Filter Only
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="bg-gray-200 px-2 py-1 rounded text-xs mr-2">{filter.tableName}</span>
                        {filter.fieldType}
                      </div>
                    </div>
                  </div>
                  <span className="text-primary-600 font-medium">
                    {operators.find((op) => op.value === filter.operator)?.label}
                  </span>
                  {!['is_null', 'not_null'].includes(filter.operator) && (
                    <span className="bg-white px-3 py-1 rounded-full text-sm border">
                      {filter.value}
                    </span>
                  )}
                </div>
                <Button 
                  onClick={() => removeFilter(filter.id)} 
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-danger-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  icon={<X className="w-4 h-4" />}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      
      {filters.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center"
        >
          <Filter className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Filters Added</h3>
          <p className="text-gray-500">Add filters to control what data appears in your report</p>
          <p className="text-sm text-gray-400 mt-2">
            You can filter by any field from your selected tables, even if not included in the report output
          </p>
        </motion.div>
      )}
    </div>
  )
}


