import { useEffect, useState } from 'react'
import { UserPlus, Save, Check } from 'lucide-react'
import { apiClient } from '../api/apiClient.js'

const ROLES = ['viewer', 'auditor', 'regional_manager', 'compliance_officer', 'admin']

export default function AdminPanelPage() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState('viewer')
  const [newRegion, setNewRegion] = useState('')
  const [adding, setAdding] = useState(false)

  // Role edits are staged locally per row and only sent to the backend when
  // "Save" is clicked — prevents accidental role changes from firing the
  // moment someone touches the dropdown.
  const [pendingRoles, setPendingRoles] = useState({}) // { [email]: role }
  const [savingEmail, setSavingEmail] = useState(null)
  const [justSavedEmail, setJustSavedEmail] = useState(null)

  useEffect(() => {
    apiClient
      .call('listUsers')
      .then((data) => setUsers(data.users || []))
      .catch((err) => setError(err.message))
  }, [])

  const roleFor = (u) => (u.email in pendingRoles ? pendingRoles[u.email] : u.role)
  const isDirty = (u) => u.email in pendingRoles && pendingRoles[u.email] !== u.role

  const handleRoleSelect = (email, role) => {
    setPendingRoles((prev) => ({ ...prev, [email]: role }))
  }

  const handleSaveRole = async (email) => {
    setError(null)
    setSavingEmail(email)
    try {
      const role = pendingRoles[email]
      await apiClient.call('updateUserRole', { email, role })
      setUsers((prev) => prev.map((u) => (u.email === email ? { ...u, role } : u)))
      setPendingRoles((prev) => {
        const next = { ...prev }
        delete next[email]
        return next
      })
      setJustSavedEmail(email)
      setTimeout(() => setJustSavedEmail(null), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingEmail(null)
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setError(null)
    setAdding(true)
    try {
      const added = await apiClient.call('addUser', { email: newEmail, role: newRole, region: newRegion })
      setUsers((prev) => [...prev, added])
      setNewEmail('')
      setNewRole('viewer')
      setNewRegion('')
    } catch (err) {
      setError(err.message)
    } finally {
      setAdding(false)
    }
  }

  const inputClass =
    'rounded-xl2 border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-section text-ink dark:text-white">Users</h1>
        <p className="mt-1 text-sm text-muted">
          Access is allow-list only — a Google account can only sign in if its email is listed
          here. Add new users below rather than editing the spreadsheet directly.
        </p>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <form onSubmit={handleAddUser} className="card flex flex-wrap items-end gap-3 p-5">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1.5 block text-xs font-medium text-muted">Email</label>
          <input
            required
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="name@company.com"
            className={`w-full ${inputClass}`}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Role</label>
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className={inputClass}>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Region</label>
          <input
            value={newRegion}
            onChange={(e) => setNewRegion(e.target.value)}
            placeholder="ALL or a region"
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={adding}
          className="flex items-center gap-2 rounded-xl2 bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
        >
          <UserPlus size={16} /> {adding ? 'Saving…' : 'Save'}
        </button>
      </form>

      <div className="card overflow-x-auto">
        <table className="data-table min-w-full">
          <thead className="sticky top-0 bg-surface dark:bg-slate-800">
            <tr>
              <th>Email</th>
              <th>Region</th>
              <th>Role</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="transition-colors duration-250 hover:bg-canvas dark:hover:bg-slate-700">
                <td className="font-medium text-ink dark:text-white">{u.email}</td>
                <td className="text-muted">{u.region}</td>
                <td>
                  <select
                    value={roleFor(u)}
                    onChange={(e) => handleRoleSelect(u.email, e.target.value)}
                    className="rounded-xl2 border border-border bg-surface px-2.5 py-1.5 text-sm text-ink focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td className="text-right">
                  {justSavedEmail === u.email ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                      <Check size={14} /> Saved
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSaveRole(u.email)}
                      disabled={!isDirty(u) || savingEmail === u.email}
                      className="inline-flex items-center gap-1.5 rounded-xl2 border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
                    >
                      <Save size={13} /> {savingEmail === u.email ? 'Saving…' : 'Save'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
