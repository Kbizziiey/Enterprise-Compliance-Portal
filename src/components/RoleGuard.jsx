import { useAuth } from '../context/AuthContext.jsx'

/**
 * UI-layer convenience only. The backend independently re-checks role
 * permissions on every request (see design/architecture.md - Security Notes),
 * so hiding a control here is not itself a security boundary.
 */
export default function RoleGuard({ allow, children, fallback = null }) {
  const { hasRole } = useAuth()
  return hasRole(allow) ? children : fallback
}
