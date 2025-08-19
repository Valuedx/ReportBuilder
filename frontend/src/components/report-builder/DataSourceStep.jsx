import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Database, Table, Columns, X, Link, Settings } from 'lucide-react'
import { reportsAPI } from '../../services/reports.js'
import { Button, LoadingSpinner, Card, CardContent } from '../ui'

export default function DataSourceStep({ reportConfig, setReportConfig, isLoading, setIsLoading, availableDataSources }) {
  const [selectedDataSource, setSelectedDataSource] = useState('')
  const [availableTables, setAvailableTables] = useState([])
  const [selectedTables, setSelectedTables] = useState([])
  const [tableColumns, setTableColumns] = useState({})
  const [tableRelationships, setTableRelationships] = useState([])
  const [showRelationshipManager, setShowRelationshipManager] = useState(false)
  const [suggestedRelationships, setSuggestedRelationships] = useState([])
  const [foreignKeys, setForeignKeys] = useState({})

  useEffect(() => {
    if (selectedDataSource) {
      setIsLoading(true)
      reportsAPI
        .getSchema(selectedDataSource)
        .then((schema) => {
          setAvailableTables(schema?.tables || [])
          setTableColumns(schema?.columns_by_table || {})
          setSuggestedRelationships(schema?.suggested_relationships || [])
          setForeignKeys(schema?.foreign_keys || {})
        })
        .finally(() => setIsLoading(false))
    }
  }, [selectedDataSource])

  const loadTableColumns = async (tableName) => {
    // columns are preloaded via schema; keep function for compatibility
    if (!tableColumns[tableName]) {
      const schema = await reportsAPI.getSchema(selectedDataSource)
      setTableColumns(schema?.columns_by_table || {})
    }
  }

  const addTable = async (tableName) => {
    if (!selectedTables.includes(tableName)) {
      setSelectedTables((prev) => [...prev, tableName])
      await loadTableColumns(tableName)
      setReportConfig((prev) => ({
        ...prev,
        dataSources: [
          ...(prev.dataSources || []),
          {
            dataSourceId: selectedDataSource,
            tableName: tableName,
            columns: tableColumns[tableName] || [],
            joins: [],
          },
        ],
        tableRelationships: tableRelationships,
      }))
    }
  }

  const removeTable = (tableName) => {
    setSelectedTables((prev) => prev.filter((t) => t !== tableName))
    
    // Remove relationships involving this table
    const updatedRelationships = tableRelationships.filter(
      (rel) => rel.sourceTable !== tableName && rel.targetTable !== tableName
    )
    setTableRelationships(updatedRelationships)
    
    setReportConfig((prev) => ({
      ...prev,
      dataSources: prev.dataSources?.filter((ds) => ds.tableName !== tableName) || [],
      tableRelationships: updatedRelationships,
    }))
  }

  const addRelationship = (sourceTable, targetTable, joinType, sourceColumn, targetColumn) => {
    const newRelationship = {
      id: `${sourceTable}_${targetTable}_${Date.now()}`,
      sourceTable,
      targetTable,
      joinType,
      sourceColumn,
      targetColumn,
      onCondition: `${sourceTable}.${sourceColumn} = ${targetTable}.${targetColumn}`,
    }
    
    const updatedRelationships = [...tableRelationships, newRelationship]
    setTableRelationships(updatedRelationships)
    
    setReportConfig((prev) => ({
      ...prev,
      tableRelationships: updatedRelationships,
    }))
  }

  const removeRelationship = (relationshipId) => {
    const updatedRelationships = tableRelationships.filter((rel) => rel.id !== relationshipId)
    setTableRelationships(updatedRelationships)
    
    setReportConfig((prev) => ({
      ...prev,
      tableRelationships: updatedRelationships,
    }))
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 1: Choose Your Data Sources</h2>
        <p className="text-gray-600">Select the databases and tables for your report</p>
      </motion.div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Database className="w-5 h-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold">Available Data Sources</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {availableDataSources.map((ds, index) => (
              <motion.button
                key={ds.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedDataSource(ds.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl text-left transition-all border-2 group ${
                  selectedDataSource === ds.id
                    ? 'bg-primary-50 border-primary-300 text-primary-700 shadow-sm'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-lg">{ds.name}</div>
                  <Database className={`w-4 h-4 transition-colors ${
                    selectedDataSource === ds.id ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                </div>
                <div className="text-sm text-gray-500">{formatDbType(ds.db_type || ds.type)}</div>
                <div className="text-xs text-gray-400 mt-2">
                  {selectedDataSource === ds.id ? 'Selected' : 'Click to select'}
                </div>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedDataSource && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Table className="w-5 h-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-semibold">Select Tables</h3>
              </div>
              {isLoading ? (
                <div className="text-center py-12">
                  <LoadingSpinner size="lg" className="mx-auto mb-4" />
                  <p className="text-gray-600">Loading tables...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {availableTables.map((table, index) => (
                    <motion.button
                      key={table}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => addTable(table)}
                      disabled={selectedTables.includes(table)}
                      whileHover={{ scale: selectedTables.includes(table) ? 1 : 1.02 }}
                      whileTap={{ scale: selectedTables.includes(table) ? 1 : 0.98 }}
                      className={`p-3 rounded-lg text-sm font-medium transition-all group ${
                        selectedTables.includes(table)
                          ? 'bg-success-100 text-success-700 border border-success-300 cursor-default'
                          : 'bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <Table className={`w-3 h-3 mr-2 ${
                          selectedTables.includes(table) ? 'text-success-600' : 'text-gray-500 group-hover:text-gray-700'
                        }`} />
                        {table}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {selectedTables.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Columns className="w-5 h-5 text-success-600 mr-2" />
                <h3 className="text-lg font-semibold">Selected Tables ({selectedTables.length})</h3>
              </div>
              <div className="space-y-3">
                {selectedTables.map((table, index) => (
                  <motion.div
                    key={table}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-4 group hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <Table className="w-4 h-4 text-success-600 mr-3" />
                      <div>
                        <span className="font-medium text-gray-900">{table}</span>
                        <div className="text-sm text-gray-500">
                          {tableColumns[table]?.length || 0} columns available
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => removeTable(table)}
                      variant="ghost"
                      size="sm"
                      icon={<X className="w-4 h-4" />}
                      className="text-gray-400 hover:text-danger-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                    </Button>
                  </motion.div>
                ))}
              </div>
              
              {selectedTables.length > 1 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Link className="w-5 h-5 text-primary-600 mr-2" />
                      <h4 className="text-md font-semibold">Table Relationships</h4>
                    </div>
                    <Button
                      onClick={() => setShowRelationshipManager(true)}
                      variant="outline"
                      size="sm"
                      icon={<Settings className="w-4 h-4" />}
                    >
                      Manage Joins
                    </Button>
                  </div>
                  
                  {tableRelationships.length > 0 ? (
                    <div className="space-y-2">
                      {tableRelationships.map((rel, index) => (
                        <motion.div
                          key={rel.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between bg-blue-50 rounded-lg p-3 group hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex items-center">
                            <Link className="w-3 h-3 text-blue-600 mr-2" />
                            <span className="text-sm text-gray-700">
                              <span className="font-medium">{rel.sourceTable}</span>
                              <span className="text-gray-500 mx-2">{rel.joinType}</span>
                              <span className="font-medium">{rel.targetTable}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                ({rel.sourceColumn} = {rel.targetColumn})
                              </span>
                            </span>
                          </div>
                          <Button
                            onClick={() => removeRelationship(rel.id)}
                            variant="ghost"
                            size="sm"
                            icon={<X className="w-3 h-3" />}
                            className="text-gray-400 hover:text-danger-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No table relationships defined. Click "Manage Joins" to create relationships between your tables.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Relationship Manager Modal */}
      {showRelationshipManager && (
        <RelationshipManager
          selectedTables={selectedTables}
          tableColumns={tableColumns}
          tableRelationships={tableRelationships}
          suggestedRelationships={suggestedRelationships}
          foreignKeys={foreignKeys}
          onAddRelationship={addRelationship}
          onRemoveRelationship={removeRelationship}
          onClose={() => setShowRelationshipManager(false)}
        />
      )}
    </div>
  )
}


function formatDbType(t) {
  if (!t) return ''
  const map = {
    postgresql: 'PostgreSQL',
    mysql: 'MySQL',
    sqlserver: 'SQL Server',
    oracle: 'Oracle',
    rest_api: 'REST API',
    mongodb: 'MongoDB',
  }
  return map[String(t).toLowerCase()] || t
}

// Relationship Manager Modal Component
function RelationshipManager({ 
  selectedTables, 
  tableColumns, 
  tableRelationships, 
  suggestedRelationships, 
  foreignKeys, 
  onAddRelationship, 
  onRemoveRelationship, 
  onClose 
}) {
  const [sourceTable, setSourceTable] = useState('')
  const [targetTable, setTargetTable] = useState('')
  const [joinType, setJoinType] = useState('LEFT JOIN')
  const [sourceColumn, setSourceColumn] = useState('')
  const [targetColumn, setTargetColumn] = useState('')

  const handleAddRelationship = () => {
    if (sourceTable && targetTable && sourceColumn && targetColumn) {
      onAddRelationship(sourceTable, targetTable, joinType, sourceColumn, targetColumn)
      // Reset form
      setSourceTable('')
      setTargetTable('')
      setSourceColumn('')
      setTargetColumn('')
    }
  }

  const applySuggestedRelationship = (suggestion) => {
    onAddRelationship(
      suggestion.source_table,
      suggestion.target_table,
      suggestion.join_type,
      suggestion.source_columns[0],
      suggestion.target_columns[0]
    )
  }

  // Filter suggestions to only show relationships between selected tables
  const relevantSuggestions = suggestedRelationships.filter(suggestion =>
    selectedTables.includes(suggestion.source_table) && selectedTables.includes(suggestion.target_table)
  )

  const joinTypes = [
    { value: 'INNER JOIN', label: 'Inner Join' },
    { value: 'LEFT JOIN', label: 'Left Join' },
    { value: 'RIGHT JOIN', label: 'Right Join' },
    { value: 'FULL OUTER JOIN', label: 'Full Outer Join' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Manage Table Relationships</h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            icon={<X className="w-4 h-4" />}
            className="text-gray-400 hover:text-gray-600"
          />
        </div>

        {/* Add New Relationship Form */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h4 className="text-lg font-medium mb-4">Add New Relationship</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source Table</label>
                <select
                  value={sourceTable}
                  onChange={(e) => setSourceTable(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select source table</option>
                  {selectedTables.map((table) => (
                    <option key={table} value={table}>{table}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Table</label>
                <select
                  value={targetTable}
                  onChange={(e) => setTargetTable(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select target table</option>
                  {selectedTables.filter(table => table !== sourceTable).map((table) => (
                    <option key={table} value={table}>{table}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Join Type</label>
                <select
                  value={joinType}
                  onChange={(e) => setJoinType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {joinTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Source Column</label>
                <select
                  value={sourceColumn}
                  onChange={(e) => setSourceColumn(e.target.value)}
                  disabled={!sourceTable}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                >
                  <option value="">Select source column</option>
                  {sourceTable && tableColumns[sourceTable]?.map((column) => (
                    <option key={column.name} value={column.name}>{column.name} ({column.type})</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Column</label>
                <select
                  value={targetColumn}
                  onChange={(e) => setTargetColumn(e.target.value)}
                  disabled={!targetTable}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                >
                  <option value="">Select target column</option>
                  {targetTable && tableColumns[targetTable]?.map((column) => (
                    <option key={column.name} value={column.name}>{column.name} ({column.type})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleAddRelationship}
                disabled={!sourceTable || !targetTable || !sourceColumn || !targetColumn}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                Add Relationship
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Suggested Relationships */}
        {relevantSuggestions.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <h4 className="text-lg font-medium mb-4">Suggested Relationships ({relevantSuggestions.length})</h4>
              <div className="space-y-3">
                {relevantSuggestions.map((suggestion, index) => {
                  // Check if this suggestion is already implemented
                  const alreadyExists = tableRelationships.some(rel =>
                    rel.sourceTable === suggestion.source_table &&
                    rel.targetTable === suggestion.target_table &&
                    rel.sourceColumn === suggestion.source_columns[0] &&
                    rel.targetColumn === suggestion.target_columns[0]
                  )

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between rounded-lg p-4 border transition-colors ${
                        alreadyExists
                          ? 'bg-success-50 border-success-200'
                          : suggestion.confidence === 'high'
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-yellow-50 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          alreadyExists
                            ? 'bg-success-500'
                            : suggestion.confidence === 'high'
                            ? 'bg-blue-500'
                            : 'bg-yellow-500'
                        }`} />
                        <div>
                          <div className="font-medium text-gray-900">
                            {suggestion.source_table} → {suggestion.target_table}
                          </div>
                          <div className="text-sm text-gray-600">
                            {suggestion.description}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              suggestion.confidence === 'high'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {suggestion.confidence} confidence
                            </span>
                            <span className="ml-2">
                              {suggestion.reason === 'foreign_key' ? '🔗 Foreign Key' : '📝 Naming Pattern'}
                            </span>
                          </div>
                        </div>
                      </div>
                      {alreadyExists ? (
                        <span className="text-success-600 text-sm font-medium">Applied ✓</span>
                      ) : (
                        <Button
                          onClick={() => applySuggestedRelationship(suggestion)}
                          size="sm"
                          className="bg-primary-600 hover:bg-primary-700 text-white"
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Relationships */}
        <div>
          <h4 className="text-lg font-medium mb-4">Current Relationships ({tableRelationships.length})</h4>
          {tableRelationships.length > 0 ? (
            <div className="space-y-3">
              {tableRelationships.map((rel) => (
                <div
                  key={rel.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-4 group hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Link className="w-4 h-4 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {rel.sourceTable} {rel.joinType} {rel.targetTable}
                      </div>
                      <div className="text-sm text-gray-500">
                        ON {rel.onCondition}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => onRemoveRelationship(rel.id)}
                    variant="ghost"
                    size="sm"
                    icon={<X className="w-4 h-4" />}
                    className="text-gray-400 hover:text-danger-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Link className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No relationships defined yet.</p>
              <p className="text-sm">Add relationships to join your tables together.</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="outline">
            Done
          </Button>
        </div>
      </motion.div>
    </div>
  )
}


