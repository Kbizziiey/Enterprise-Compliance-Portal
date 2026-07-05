export default function ProgressBar({ percent, label }) {
  return (
    <div className="w-full">
      {label && <p className="mb-2 text-xs text-muted">{label}</p>}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-primary transition-all duration-250"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
