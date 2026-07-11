import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { apiClient } from '../api/apiClient.js'

const AuthContext = createContext(null)

// Dev-only bypass: lets you preview every page locally without wiring up
// Google OAuth / Sheets / Apps Script first. Controlled entirely by an env
// var so it can never be active unless someone explicitly opts in — see
// frontend/.env.example. NEVER set this in a real deployment.
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'
const DEV_ROLE = import.meta.env.VITE_DEV_ROLE || 'admin'

const MOCK_USER = {
  email: 'dev.preview@example.com',
  role: DEV_ROLE,
  region: 'ALL'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEV_MODE ? MOCK_USER : null)
  const [loading, setLoading] = useState(!DEV_MODE)

  const restoreSession = useCallback(async () => {
    if (DEV_MODE) return // already set synchronously above
    const idToken = localStorage.getItem('ecp_id_token')
    if (!idToken) {
      setLoading(false)
      return
    }
    try {
      const data = await apiClient.call('login')
      setUser(data)
    } catch (err) {
      console.error('Session restore failed', err)
      localStorage.removeItem('ecp_id_token')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  const login = useCallback(async (googleIdToken) => {
    localStorage.setItem('ecp_id_token', googleIdToken)
    const data = await apiClient.call('login')
    setUser(data)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('ecp_id_token')
    sessionStorage.removeItem('ecp_expiry_toast_shown')
    setUser(DEV_MODE ? MOCK_USER : null) // dev mode: logout is a no-op, always "signed in"
  }, [])

  const hasRole = useCallback(
    (roles) => {
      if (!user) return false
      return roles.includes(user.role)
    },
    [user]
  )

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole, devMode: DEV_MODE }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
