import StatusPill from './StatusPill.jsx'

export default function ExpiryAlerts({ documents }) {
  const alerts = documents.filter((d) => d.status !== 'active')

  if (alerts.length === 0) {
    return (
      <div className="card px-6 py-6">
        <p className="text-sm text-success">All records current — nothing expiring soon.</p>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <h3 className="text-cardTitle mb-4 text-ink dark:text-white">Expiry Alerts</h3>
      <ul className="divide-y divide-border dark:divide-slate-700">
        {alerts.map((doc) => (
          <li key={doc.id} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink dark:text-white">{doc.fileName}</p>
              <p className="text-xs text-muted">{doc.subsidiary}</p>
            </div>
            <StatusPill status={doc.status} />
          </li>
        ))}
      </ul>
    </div>
  )
}
