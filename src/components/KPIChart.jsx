import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

export default function KPIChart({ type = 'bar', title, data, options = {} }) {
  const ChartComponent = type === 'doughnut' ? Doughnut : Bar

  return (
    <div className="card p-5">
      {title && <h3 className="text-cardTitle mb-4 text-ink dark:text-white">{title}</h3>}
      <ChartComponent data={data} options={{ responsive: true, ...options }} />
    </div>
  )
}
