import api from './api'

export const reportsAPI = {
  // Data Sources
  getDataSources: async () => {
    const res = await api.get('/data-sources/')
    return res.data?.results || res.data || []
  },
  createDataSource: async (payload) => {
    const res = await api.post('/data-sources/', payload)
    return res.data
  },
  testDataSource: async (id) => {
    const res = await api.post(`/data-sources/${id}/test_connection/`)
    return res.data
  },
  getSchema: async (id) => {
    const res = await api.get(`/data-sources/${id}/schema/`)
    return res.data
  },

  // Reports
  saveReport: async (config) => {
    const payload = {
      name: config?.reportSettings?.name,
      description: config?.reportSettings?.description || '',
      data_sources: (config?.dataSources || []).map((ds) => ({
        dataSourceId: ds.dataSourceId,
        tableName: ds.tableName,
        columns: ds.columns,
        joins: ds.joins || [],
      })),
      table_relationships: config?.tableRelationships || [],
      fields: config?.fields || [],
      calculated_fields: config?.calculatedFields || [],
      cte_definitions: config?.cteDefinitions || [],
      filters: config?.filters || [],
      report_format: config?.reportSettings?.format || 'PDF',
      template: config?.reportSettings?.template || 'business_standard',
      layout: config?.reportSettings?.layout || 'table',
    }
    const res = await api.post('/reports/', payload)
    const report = res.data
    // Optionally create schedule and email
    if (config?.scheduleSettings?.enabled) {
      const s = config.scheduleSettings
      await api.post('/schedules/', {
        report: report.id,
        is_enabled: true,
        frequency: s.frequency,
        day_of_week: s.frequency === 'weekly' ? dayOfWeekToIndex(s.dayOfWeek) : null,
        day_of_month: s.frequency === 'monthly' ? Number(s.dayOfMonth || 1) : null,
        time: s.time || '09:00',
        timezone: s.timezone || 'UTC',
        start_date: new Date().toISOString().slice(0, 10),
      })
    }
    if (config?.emailSettings?.enabled) {
      const e = config.emailSettings
      await api.post('/email-distributions/', {
        report: report.id,
        is_enabled: true,
        subject_template: e.subject || 'Report',
        body_template: e.body || 'Attached is your requested report.',
        attach_format: e.attachFormat || 'PDF',
        recipients: (e.recipients || []).map((r) => ({ name: r.name, email: r.email })),
      })
    }
    return report
  },

  executeReport: async (config) => {
    // Save if there is no id
    let reportId = config?.id
    if (!reportId) {
      const saved = await reportsAPI.saveReport(config)
      reportId = saved.id
    }
    const execRes = await api.post(`/reports/${reportId}/execute/`)
    const executionId = execRes.data?.execution_id
    // Simple polling until completion
    let attempts = 0
    while (attempts < 20) {
      const detail = await api.get(`/executions/${executionId}/`)
      const e = detail.data
      if (e.status === 'completed') {
        return {
          executionId,
          fileUrl: e.file_path ? `${baseMediaUrl()}/${e.file_path.replace(/^\//, '')}` : '#',
          status: e.status,
          generatedAt: e.completed_at,
        }
      }
      if (e.status === 'failed') {
        throw new Error(e.error_message || 'Report generation failed')
      }
      await delay(1000)
      attempts += 1
    }
    return { executionId, status: 'running' }
  },

  sendReportEmail: async (emailConfig, _fileUrl) => {
    // Email is sent server-side as part of generation if configured; provide a mock response for UI
    return {
      emailId: `email_${Date.now()}`,
      recipients: emailConfig?.recipients?.length || 0,
      status: 'sent',
      sentAt: new Date().toISOString(),
    }
  },
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function dayOfWeekToIndex(key) {
  const map = { monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6 }
  return map[String(key || '').toLowerCase()] ?? 0
}

function baseMediaUrl() {
  const apiBase = 'http://127.0.0.1:8000'
  return `${apiBase}`
}

