const STATUS_CONFIG = {
  active: { label: 'Active', text: 'text-success', bg: 'bg-success-soft dark:bg-success/10' },
  'expiring-soon': { label: 'Expiring soon', text: 'text-warning', bg: 'bg-warning-soft dark:bg-warning/10' },
  expired: { label: 'Expired', text: 'text-danger', bg: 'bg-danger-soft dark:bg-danger/10' }
}

export default function StatusPill({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.active

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}
