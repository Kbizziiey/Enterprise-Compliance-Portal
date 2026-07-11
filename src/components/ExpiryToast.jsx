import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, X } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext.jsx'

const AUTO_DISMISS_MS = 10000

/**
 * The auto-popup shown once per login session when there are expiring/
 * expired documents. Reads from NotificationContext rather than fetching
 * its own data, so dismissing this doesn't affect the bell icon in TopNav —
 * that can still reopen the same information any time afterward.
 */
export default function ExpiryToast() {
  const { stats, shouldAutoShow, markAutoShown } = useNotifications()
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (shouldAutoShow && !mounted) {
      setMounted(true)
      markAutoShown()
      requestAnimationFrame(() => setVisible(true))
    }
  }, [shouldAutoShow, mounted, markAutoShown])

  useEffect(() => {
    if (!mounted) return
    const timer = setTimeout(handleDismiss, AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  const handleDismiss = () => {
    setVisible(false)
    setTimeout(() => setMounted(false), 200)
  }

  const handleClick = () => {
    handleDismiss()
    navigate('/')
  }

  if (!mounted || !stats) return null

  const isUrgent = stats.expired > 0

  return (
    <div
      className={`fixed right-4 top-4 z-50 w-full max-w-sm transition-all duration-200 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
      }`}
    >
      <div
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        className={`card flex cursor-pointer items-start gap-3 border-l-4 p-4 hover:bg-canvas dark:hover:bg-slate-700 ${
          isUrgent ? 'border-l-danger' : 'border-l-warning'
        }`}
      >
        <div
          className={`icon-badge shrink-0 ${
            isUrgent ? 'bg-danger-soft text-danger' : 'bg-warning-soft text-warning'
          }`}
        >
          <AlertTriangle size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink dark:text-white">
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
                <span className="font-medium text-warning">{stats.expiringSoon}</span> expiring within 30
                days
              </>
            )}
          </p>
          <p className="mt-1.5 text-xs font-medium text-primary">View dashboard →</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDismiss()
          }}
          className="shrink-0 text-muted hover:text-ink dark:hover:text-white"
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}