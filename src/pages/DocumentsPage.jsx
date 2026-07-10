import { useEffect, useState } from 'react'
import DocumentTable from '../components/DocumentTable.jsx'
import { documentService } from '../services/documentService.js'

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    documentService
      .listDocuments()
      .then((data) => setDocuments(data.documents || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    const previous = documents
    setDocuments((prev) => prev.filter((d) => d.id !== id)) // optimistic delete
    try {
      await documentService.deleteDocument(id)
    } catch (err) {
      setDocuments(previous) // roll back on failure
      setError(err.message)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-section text-ink dark:text-white">Documents</h1>
        <p className="mt-1 text-sm text-muted">Every compliance record currently on file.</p>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <DocumentTable documents={documents} onDelete={handleDelete} />
      )}
    </div>
  )
}
