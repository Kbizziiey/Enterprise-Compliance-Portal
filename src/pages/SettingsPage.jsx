import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useBranding } from '../context/BrandingContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import RoleGuard from '../components/RoleGuard.jsx'

const PRESET_COLORS = ['#2563EB', '#4F46E5', '#0F766E', '#B45309', '#BE123C']

export default function SettingsPage() {
  const { branding, updateBranding } = useBranding()
  const { theme, toggleTheme } = useTheme()
  const [name, setName] = useState(branding.name)

  const handleSave = (e) => {
    e.preventDefault()
    updateBranding({ ...branding, name })
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-section text-ink dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-muted">Manage appearance and organization branding.</p>
      </div>

      {/* Theme is a personal display preference — available to every role */}
      <div className="card p-6">
        <h2 className="text-cardTitle mb-4 text-ink dark:text-white">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink dark:text-white">Theme</p>
            <p className="text-xs text-muted">Switch between light and dark mode.</p>
          </div>
          <button
            onClick={toggleTheme}
            className="rounded-xl2 border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-canvas dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
          >
            {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          </button>
        </div>
      </div>

      {/* Branding affects how the app looks/is named for the organization —
          admin only. Everyone else sees a explanation instead of the form. */}
      <RoleGuard
        allow={['admin']}
        fallback={
          <div className="card flex items-start gap-3 p-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl2 bg-canvas text-muted dark:bg-slate-700">
              <ShieldAlert size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink dark:text-white">Branding</p>
              <p className="mt-1 text-xs text-muted">
                Organization name and accent color are managed by your administrator.
              </p>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSave} className="card space-y-4 p-6">
          <h2 className="text-cardTitle text-ink dark:text-white">Branding</h2>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Organization name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl2 border border-border bg-surface px-3 py-2.5 text-sm text-ink focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Accent color</label>
            <div className="flex gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateBranding({ ...branding, color })}
                  className={`h-8 w-8 rounded-full border-2 ${
                    branding.color === color ? 'border-ink dark:border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Use ${color} as accent color`}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="rounded-xl2 bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Save changes
          </button>
        </form>
      </RoleGuard>

      {/* Admin-only account management shortcut, so Settings is genuinely
          more useful for admins rather than just less restricted. */}
      <RoleGuard allow={['admin']}>
        <div className="card p-6">
          <h2 className="text-cardTitle mb-1 text-ink dark:text-white">User Access</h2>
          <p className="mb-4 text-xs text-muted">
            Add, remove, or change roles for who can sign in to this portal.
          </p>
          <Link
            to="/admin"
            className="inline-block rounded-xl2 bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Manage Users
          </Link>
        </div>
      </RoleGuard>
    </div>
  )
}
