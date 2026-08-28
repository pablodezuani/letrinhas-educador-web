'use client'

import { useEffect, useState } from 'react'
import { Loader2, MapPin, School as SchoolIcon, Search } from 'lucide-react'
import { api } from '@/services/api'
import type { School } from '@/lib/types'
import { colors } from '@/theme'

interface SchoolPickerProps {
  onSelect: (school: School) => void
  excludeId?: string | null
}

/** Busca com debounce contra GET /schools (picker público, só unidades ativas). */
export function SchoolPicker({ onSelect, excludeId }: SchoolPickerProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<School[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const timer = setTimeout(() => {
      api
        .get('/schools', { params: query ? { search: query } : undefined })
        .then(res => {
          if (!cancelled) setResults(res.data)
        })
        .catch(() => {
          if (!cancelled) setResults([])
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  const filtered = results.filter(s => s.id !== excludeId)

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex items-center gap-sm bg-surface-alt border border-divider rounded-md px-md h-11">
        <Search size={16} className="text-text-muted shrink-0" />
        <input
          className="flex-1 min-w-0 bg-transparent text-body-small text-text-primary outline-none placeholder:text-text-muted"
          placeholder="Buscar unidade por nome..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {loading && <Loader2 size={14} className="animate-spin text-text-muted shrink-0" />}
      </div>

      <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
        {!loading && filtered.length === 0 && (
          <p className="text-caption text-text-muted text-center py-md">Nenhuma unidade ativa encontrada.</p>
        )}
        {filtered.map(school => (
          <button
            key={school.id}
            type="button"
            onClick={() => onSelect(school)}
            className="flex items-center gap-sm p-sm rounded-md border border-divider text-left transition-colors active:scale-[0.99]"
          >
            <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 bg-primary-soft">
              <SchoolIcon size={16} color={colors.primaryLight} />
            </div>
            <div className="min-w-0">
              <p className="text-body-small font-medium text-text-primary truncate">{school.name}</p>
              {(school.address || school.city) && (
                <p className="text-label text-text-muted truncate flex items-center gap-1">
                  <MapPin size={10} className="shrink-0" />
                  {[school.address, school.city, school.state].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
