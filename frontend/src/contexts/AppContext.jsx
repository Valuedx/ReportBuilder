import { createContext, useContext, useMemo, useState } from 'react'

const AppContext = createContext(null)

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}

export function AppProvider({ children }) {
  const [appState, setAppState] = useState({
    userId: `user-${Math.random().toString(36).slice(2, 9)}`,
    reports: [],
    schedules: [],
    analytics: {},
  })

  const updateAppState = (updates) => setAppState((prev) => ({ ...prev, ...updates }))

  const value = useMemo(() => ({ appState, updateAppState }), [appState])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}


