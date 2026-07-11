import { AlertTriangle } from 'lucide-react'

/**
 * Lightweight confirmation modal. Used before destructive actions like
 * deleting a document — the delete only proceeds after explicit
 * confirmation via onConfirm.
 */
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden="true" />
      <div className="card relative w-full max-w-sm p-6">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl2 bg-danger-soft text-danger dark:bg-danger/10">
          <AlertTriangle size={20} />
        </div>
        <h2 className="text-cardTitle mb-2 text-ink dark:text-white">{title}</h2>
        <p className="mb-6 text-sm text-muted">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl2 border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-canvas dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl2 bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
