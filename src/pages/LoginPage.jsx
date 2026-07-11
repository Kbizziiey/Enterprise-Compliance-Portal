import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import logoHorizontalLight from '../assets/logo-horizontal-light.svg'
import logoHorizontalDark from '../assets/logo-horizontal-dark.svg'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function LoginPage() {
  const buttonRef = useRef(null)
  const { login, user } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
      return
    }

    if (!window.google || !buttonRef.current) {
      setError(
        'Google sign-in script did not load. Check that the accounts.google.com script tag is present in index.html and that you are not blocking it (ad blocker, offline, etc).'
      )
      return
    }

    if (!GOOGLE_CLIENT_ID) {
      setError('VITE_GOOGLE_CLIENT_ID is missing. Check frontend/.env and restart the dev server.')
      return
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
        setError(null)
        try {
          await login(response.credential)
          navigate('/', { replace: true })
        } catch (err) {
          console.error('Login failed', err)
          setError(
            err.message ||
              'Sign-in succeeded with Google but the backend rejected the request. Check VITE_API_URL and that the Apps Script deployment is live.'
          )
        }
      }
    })

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      shape: 'pill'
    })
  }, [user, login, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 dark:bg-slate-900">
      <div className="card w-full max-w-sm px-8 py-10 text-center">
        {/*
          CHANGED: replaced the generic lucide ShieldCheck icon-in-a-box
          placeholder with the real horizontal brand lockup, swapped based
          on the current theme so it stays legible against the card's
          background in both light and dark mode.
        */}
        <img
          src={theme === 'dark' ? logoHorizontalDark : logoHorizontalLight}
          alt="Enterprise Compliance Portal"
          className="mx-auto mb-8 h-16"
        />

        <p className="mb-8 text-sm leading-relaxed text-muted">
          Sign in with your organization's Google account to view and manage
          OHS compliance records for your region.
        </p>

        <div ref={buttonRef} className="flex justify-center" />

        {error && (
          <div className="mt-5 flex items-start gap-2 rounded-xl2 bg-danger-soft px-4 py-3 text-left text-xs text-danger dark:bg-danger/10">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <p className="mt-8 text-xs text-muted">Access is logged for audit purposes.</p>
      </div>
    </div>
  )
}