import { useEffect, useState } from 'react'
import { documentService } from '../services/documentService.js'

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    documentService
      .getAuditLogs()
      .then((data) => setLogs(data.logs || []))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-section text-ink dark:text-white">Audit Logs</h1>
        <p className="mt-1 text-sm text-muted">A complete, append-only trail of every document action.</p>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="card overflow-x-auto">
        <table className="data-table min-w-full">
          <thead className="sticky top-0 bg-surface dark:bg-slate-800">
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Document ID</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="transition-colors duration-250 hover:bg-canvas dark:hover:bg-slate-700">
                <td className="text-xs text-muted">{log.timestamp}</td>
                <td className="font-medium text-ink dark:text-white">{log.user}</td>
                <td className="text-primary">{log.action}</td>
                <td className="text-xs text-muted">{log.documentId || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
