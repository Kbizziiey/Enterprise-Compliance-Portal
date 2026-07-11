import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  FolderOpen,
  UploadCloud,
  ClipboardCheck,
  Users,
  Settings,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useBranding } from '../context/BrandingContext.jsx'
import RoleGuard from './RoleGuard.jsx'
import logoIconDark from '../assets/icon-dark.svg'

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl2 px-3.5 py-2.5 text-sm font-medium transition-colors duration-250 ${
    isActive ? 'bg-sidebar-active text-white' : 'text-slate-300 hover:bg-sidebar-hover hover:text-white'
  }`


export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const { branding } = useBranding()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col bg-sidebar text-white transition-transform duration-250 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            {/*
              CHANGED: replaced the generic lucide ShieldCheck placeholder
              with the real brand mark. The sidebar's background is always
              dark navy regardless of the app's light/dark theme toggle, so
              it always uses the dark-background icon variant.
            */}
            <img src={logoIconDark} alt="" className="h-9 w-9 shrink-0" />
            <span
              className="text-base font-semibold"
              style={{ color: branding.color !== '#2563EB' ? branding.color : undefined }}
            >
              {branding.name}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          <NavLink to="/" end className={linkClass} onClick={onClose}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/documents" className={linkClass} onClick={onClose}>
            <FolderOpen size={18} /> Documents
          </NavLink>
          <RoleGuard allow={['admin', 'compliance_officer']}>
            <NavLink to="/upload" className={linkClass} onClick={onClose}>
              <UploadCloud size={18} /> Upload Center
            </NavLink>
          </RoleGuard>
          <NavLink to="/search" className={linkClass} onClick={onClose}>
            <Search size={18} /> Search
          </NavLink>
          <RoleGuard allow={['admin', 'auditor']}>
            <NavLink to="/audit-logs" className={linkClass} onClick={onClose}>
              <ClipboardCheck size={18} /> Audit Logs
            </NavLink>
          </RoleGuard>
          <RoleGuard allow={['admin']}>
            <NavLink to="/admin" className={linkClass} onClick={onClose}>
              <Users size={18} /> Users
            </NavLink>
          </RoleGuard>
          <NavLink to="/settings" className={linkClass} onClick={onClose}>
            <Settings size={18} /> Settings
          </NavLink>
        </nav>

        <div className="mx-3 mb-5 rounded-xl2 bg-sidebar-hover px-4 py-3.5">
          {user && (
            <p className="mb-2 truncate text-xs text-slate-400">
              {user.email}
              <br />
              <span className="font-medium text-white">{user.role}</span>
            </p>
          )}
          <button onClick={logout} className="text-sm font-medium text-white hover:text-slate-300">
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}