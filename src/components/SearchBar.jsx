import { Search } from 'lucide-react'
import { useState } from 'react'

export default function SearchBar({ onQueryChange, placeholder = 'Search documents…' }) {
  const [value, setValue] = useState('')

  const handleChange = (e) => {
    const next = e.target.value
    setValue(next)
    onQueryChange(next)
  }

  return (
    <div className="relative">
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-xl2 border border-border bg-surface py-3 pl-11 pr-4 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
    </div>
  )
}
