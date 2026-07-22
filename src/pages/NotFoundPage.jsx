import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-warning-soft text-warning">
        <AlertTriangle size={26} />
      </div>
      <h1 className="text-section mb-2 text-ink dark:text-white">Page not found</h1>
      <p className="mb-6 max-w-sm text-sm text-muted">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="rounded-xl2 bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
