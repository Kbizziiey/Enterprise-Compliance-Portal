import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, Sun, Moon, ChevronDown, AlertTriangle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useNotifications } from '../context/NotificationContext.jsx'

export default function TopNav({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { stats, hasAlerts } = useNotifications()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const navigate = useNavigate()

  const initials = user?.email ? user.email[0].toUpperCase() : '?'
  const isUrgent = hasAlerts && stats.expired > 0

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-surface px-4 dark:border-slate-700 dark:bg-slate-800 sm:px-6">
      <button
        onClick={onMenuClick}
        className="text-muted hover:text-ink dark:text-slate-400 dark:hover:text-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <div className="hidden flex-1 max-w-md sm:block">
        <button
          onClick={() => navigate('/search')}
          className="flex w-full items-center gap-2 rounded-xl2 border border-border bg-canvas px-3.5 py-2 text-left text-sm text-muted transition-colors hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
        >
          Search documents…
        </button>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleTheme}
          className="rounded-xl2 p-2 text-muted hover:bg-canvas hover:text-ink dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative rounded-xl2 p-2 text-muted hover:bg-canvas hover:text-ink dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {hasAlerts && (
              <span
                className={`absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full ${
                  isUrgent ? 'bg-danger' : 'bg-warning'
                }`}
              />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl2 border border-border bg-surface py-1 shadow-card dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-border px-4 py-3 dark:border-slate-700">
                <p className="text-sm font-semibold text-ink dark:text-white">Notifications</p>
              </div>

              {!hasAlerts ? (
                <p className="px-4 py-6 text-center text-sm text-muted">
                  No expiring or expired documents right now.
                </p>
              ) : (
                <button
                  onClick={() => {
                    setNotifOpen(false)
                    navigate('/')
                  }}
                  className="flex w-full items-start gap-3 px-4 py-3.5 text-left hover:bg-canvas dark:hover:bg-slate-700"
                >
                  <div
                    className={`icon-badge shrink-0 ${
                      isUrgent ? 'bg-danger-soft text-danger' : 'bg-warning-soft text-warning'
                    }`}
                  >
                    <AlertTriangle size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink dark:text-white">
                      {isUrgent ? 'Documents need attention' : 'Documents expiring soon'}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {stats.expired > 0 && (
                        <>
                          <span className="font-medium text-danger">{stats.expired}</span> expired
                          {stats.expiringSoon > 0 && ', '}
                        </>
                      )}
                      {stats.expiringSoon > 0 && (
                        <>
                          <span className="font-medium text-warning">{stats.expiringSoon}</span> expiring
                          within 30 days
                        </>
                      )}
                    </p>
                    <p className="mt-1.5 text-xs font-medium text-primary">View dashboard →</p>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-xl2 p-1.5 hover:bg-canvas dark:hover:bg-slate-700"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-white">
              {initials}
            </div>
            <ChevronDown size={16} className="hidden text-muted sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl2 border border-border bg-surface py-1 shadow-card dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-border px-4 py-3 dark:border-slate-700">
                <p className="truncate text-sm font-medium text-ink dark:text-white">{user?.email}</p>
                <p className="text-xs capitalize text-muted">{user?.role?.replace('_', ' ')}</p>
              </div>
              <button
                onClick={() => { setMenuOpen(false); navigate('/settings') }}
                className="block w-full px-4 py-2 text-left text-sm text-ink hover:bg-canvas dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Settings
              </button>
              <button
                onClick={logout}
                className="block w-full px-4 py-2 text-left text-sm text-danger hover:bg-canvas dark:hover:bg-slate-700"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}