import { useState, useRef, useEffect } from 'react'

interface ComboboxOption {
  id: number
  label: string
}

interface Props<T extends ComboboxOption> {
  options: T[]
  value: string
  onChange: (text: string) => void
  onSelect: (option: T) => void
  placeholder?: string
  label?: string
}

export default function ComboboxCreatable<T extends ComboboxOption>({
  options,
  value,
  onChange,
  onSelect,
  placeholder,
  label,
}: Props<T>) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const query = value.trim().toLowerCase()
  const filtered = query
    ? options.filter(o => o.label.toLowerCase().includes(query))
    : options

  const existeExacto = options.some(o => o.label.toLowerCase() === query)

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-[10px] uppercase tracking-[0.15em] text-[#6B7280] mb-1">
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={e => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full border border-black/10 rounded-sm px-2 py-1.5 text-[13px] outline-none focus:border-[#A44A3F]"
      />

      {open && (filtered.length > 0 || (query && !existeExacto)) && (
        <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto border border-black/10 bg-white rounded-sm shadow-sm">
          {filtered.map(o => (
            <button
              key={o.id}
              type="button"
              onMouseDown={e => e.preventDefault()} // evita perder el foco antes del click
              onClick={() => {
                onSelect(o)
                setOpen(false)
              }}
              className="block w-full text-left px-2 py-1.5 text-[13px] hover:bg-black/5"
            >
              {o.label}
            </button>
          ))}

          {query && !existeExacto && (
            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => setOpen(false)}
              className="block w-full text-left px-2 py-1.5 text-[13px] italic text-[#A44A3F] hover:bg-black/5"
            >
              + Añadir "{value}"
            </button>
          )}
        </div>
      )}
    </div>
  )
}