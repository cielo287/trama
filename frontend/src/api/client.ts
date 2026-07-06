export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    ...options,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Error en la petición')
  }

  // No Content
  if (res.status === 204) {
    return undefined as T
  }

  const text = await res.text()

  if (!text) {
    return undefined as T
  }

  return JSON.parse(text)
}