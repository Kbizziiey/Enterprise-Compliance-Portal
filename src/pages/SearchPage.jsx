import { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar.jsx'
import DocumentTable from '../components/DocumentTable.jsx'
import { documentService } from '../services/documentService.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 300)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([])
      return
    }
    setLoading(true)
    documentService
      .search(debouncedQuery)
      .then((data) => setResults(data.documents || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [debouncedQuery])

  const handleDelete = async (id) => {
    const previous = results
    setResults((prev) => prev.filter((d) => d.id !== id)) // optimistic delete
    try {
      await documentService.deleteDocument(id)
    } catch (err) {
      setResults(previous) // roll back on failure
      setError(err.message)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-section text-ink dark:text-white">Search</h1>
        <p className="mt-1 text-sm text-muted">Find documents by name, region, or subsidiary.</p>
      </div>
      <SearchBar onQueryChange={setQuery} placeholder="Search by name, region, or subsidiary…" />
      {error && <p className="text-sm text-danger">{error}</p>}
      {loading && <p className="text-sm text-muted">Searching…</p>}
      {!loading && debouncedQuery && (
        <DocumentTable documents={results} onDelete={handleDelete} />
      )}
    </div>
  )
}
