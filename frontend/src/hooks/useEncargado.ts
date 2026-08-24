import { getEncargados, type Encargado } from "@/api/encargados"
import { useEffect, useState } from "react"

export function useEncargados() {
  const [encargado, setEncargado] = useState<Encargado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getEncargados().then(setEncargado).finally(() => setLoading(false))
  }, [])

  return { encargado, loading, error }
}