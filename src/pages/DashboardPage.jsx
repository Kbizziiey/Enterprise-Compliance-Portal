import { useEffect, useState } from 'react'
import { FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { documentService } from '../services/documentService.js'
import KPIChart from '../components/KPIChart.jsx'
import ExpiryAlerts from '../components/ExpiryAlerts.jsx'
import StatCard from '../components/StatCard.jsx'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    documentService
      .getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message))
  }, [])

  if (error) return <p className="text-sm text-danger">{error}</p>
  if (!stats) return <p className="text-sm text-muted">Loading dashboard…</p>

  const total = stats.active + stats.expiringSoon + stats.expired

  const statusChartData = {
    labels: ['Active', 'Expiring Soon', 'Expired'],
    datasets: [
      {
        label: 'Documents',
        data: [stats.active, stats.expiringSoon, stats.expired],
        backgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
        borderWidth: 0
      }
    ]
  }

  const regionChartData = {
    labels: Object.keys(stats.byRegion || {}),
    datasets: [
      {
        label: 'Documents by Region',
        data: Object.values(stats.byRegion || {}),
        backgroundColor: '#2563EB',
        borderRadius: 8
      }
    ]
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-hero text-ink dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">A live overview of your organization's OHS compliance status.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FileText size={20} />}
          label="Total Documents"
          value={total}
          description="Across all regions"
          color="primary"
        />
        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Active"
          value={stats.active}
          description="Currently compliant"
          color="success"
        />
        <StatCard
          icon={<Clock size={20} />}
          label="Expiring Soon"
          value={stats.expiringSoon}
          description="Within 30 days"
          color="warning"
        />
        <StatCard
          icon={<AlertTriangle size={20} />}
          label="Expired"
          value={stats.expired}
          description="Needs immediate attention"
          color="danger"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <KPIChart type="doughnut" title="Compliance Status" data={statusChartData} />
        <KPIChart type="bar" title="Regional Distribution" data={regionChartData} />
      </div>

      <ExpiryAlerts documents={stats.expiringDocuments || []} />
    </div>
  )
}
