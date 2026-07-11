import { useState } from 'react'
import StatusPill from './StatusPill.jsx'
import RoleGuard from './RoleGuard.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'

export default function DocumentTable({ documents, onDelete }) {
  const [pendingDelete, setPendingDelete] = useState(null) // holds the doc being confirmed

  if (documents.length === 0) {
    return (
      <div className="card px-6 py-12 text-center">
        <p className="text-sm text-muted">No documents found.</p>
      </div>
    )
  }

  const handleConfirm = () => {
    onDelete(pendingDelete.id)
    setPendingDelete(null)
  }

  return (
    <>
      <div className="card overflow-x-auto">
        <table className="data-table min-w-full">
          <thead className="sticky top-0 bg-surface dark:bg-slate-800">
            <tr>
              <th>File</th>
              <th>Subsidiary</th>
              <th>Region</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Uploaded By</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="transition-colors duration-250 hover:bg-canvas dark:hover:bg-slate-700">
                <td>
                  <a
                    href={doc.driveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-ink hover:text-primary dark:text-white"
                  >
                    {doc.fileName}
                  </a>
                </td>
                <td className="text-muted">{doc.subsidiary}</td>
                <td className="text-muted">{doc.region}</td>
                <td className="text-xs text-muted">{doc.expiryDate}</td>
                <td>
                  <StatusPill status={doc.status} />
                </td>
                <td className="text-xs text-muted">{doc.uploadedBy}</td>
                <td className="text-right">
                  <RoleGuard allow={['admin', 'compliance_officer']}>
                    <button
                      onClick={() => setPendingDelete(doc)}
                      className="text-sm font-medium text-danger hover:text-red-600"
                    >
                      Delete
                    </button>
                  </RoleGuard>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this document?"
        message={
          pendingDelete
            ? `"${pendingDelete.fileName}" will be permanently deleted from the register and removed from Drive. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={handleConfirm}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
