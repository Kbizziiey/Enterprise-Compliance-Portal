import { TrendingUp, TrendingDown } from 'lucide-react'

const COLOR_MAP = {
  primary: { bg: 'bg-primary-soft dark:bg-primary/10', text: 'text-primary' },
  success: { bg: 'bg-success-soft dark:bg-success/10', text: 'text-success' },
  warning: { bg: 'bg-warning-soft dark:bg-warning/10', text: 'text-warning' },
  danger: { bg: 'bg-danger-soft dark:bg-danger/10', text: 'text-danger' }
}

/**
 * KPI tile: icon, large statistic, supporting description, and a trend
 * indicator. Trend is optional — pass `trend` as a signed number (e.g. 4 or
 * -2); omitted when there's nothing meaningful to compare against yet.
 */
export default function StatCard({ icon, label, value, description, trend, color = 'primary' }) {
  const c = COLOR_MAP[color] || COLOR_MAP.primary
  const isPositive = typeof trend === 'number' && trend >= 0

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className={`icon-badge ${c.bg} ${c.text}`}>{icon}</div>
        {typeof trend === 'number' && (
          <span className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold text-ink dark:text-white">{value}</p>
      <p className="mt-1 text-sm font-medium text-ink/80 dark:text-slate-300">{label}</p>
      {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
    </div>
  )
}
