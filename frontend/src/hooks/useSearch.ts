// src/hooks/useSearch.ts
import { useState, useMemo } from 'react'

export function useSearch<T>(items: T[], searchFields: (keyof T)[]) {
  const [query, setQuery] = useState('')

  const filteredItems = useMemo(() => {
    if (!query) return items

    return items.filter(item =>
      searchFields.some(field => String(item[field]).toLowerCase().includes(query.toLowerCase()))
    )
  }, [items, query, searchFields])

  return { query, setQuery, filteredItems }
}
