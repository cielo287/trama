export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    ...options,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Error en la petición')
  }

  return res.json()
}