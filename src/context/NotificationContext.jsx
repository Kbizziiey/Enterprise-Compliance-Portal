import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext.jsx'
import { documentService } from '../services/documentService.js'

const NotificationContext = createContext(null)

// Cleared on logout in AuthContext, so a fresh login always re-fetches
// instead of reusing a previous session's "already auto-shown" state.
const SESSION_FLAG = 'ecp_expiry_toast_shown'

/**
 * Single source of truth for the expiring/expired document counts, shared
 * between ExpiryToast (the auto-popup shown once at login) and the bell
 * icon in TopNav (which can reopen the same information any time,
 * regardless of whether the auto-popup was already dismissed).
 */
export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [stats, setStats] = useState(null) // { expired, expiringSoon, expiringDocuments } | null
  const [autoShownAlready, setAutoShownAlready] = useState(() => !!sessionStorage.getItem(SESSION_FLAG))

  const fetchStats = useCallback(() => {
    return documentService.getDashboardStats().then((data) => {
      setStats({
        expired: data.expired || 0,
        expiringSoon: data.expiringSoon || 0,
        expiringDocuments: data.expiringDocuments || []
      })
      return data
    })
  }, [])

  useEffect(() => {
    if (!user) {
      setStats(null)
      setAutoShownAlready(false) // logout() already cleared the sessionStorage flag
      return
    }
    fetchStats().catch((err) => console.error('Failed to check for expiring documents', err))
  }, [user, fetchStats])

  const hasAlerts = !!stats && stats.expired + stats.expiringSoon > 0

  const shouldAutoShow = hasAlerts && !autoShownAlready

  const markAutoShown = useCallback(() => {
    sessionStorage.setItem(SESSION_FLAG, 'true')
    setAutoShownAlready(true)
  }, [])

  return (
    <NotificationContext.Provider
      value={{ stats, hasAlerts, shouldAutoShow, markAutoShown, refresh: fetchStats }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}