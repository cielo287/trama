
import { useEffect, useState } from 'react'
import { getMateriales, type Material } from '@/api/materiales'

export function useMateriales() {
  const [materiales, setMateriales] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMateriales()
      .then(setMateriales)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { materiales, loading, error }
}