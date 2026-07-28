

let refreshPromise: Promise<void> | null = null

async function renovarSesion() {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error('Sesión expirada')
  }
}



export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
let res = await fetch(url, {
  credentials: 'include',
  ...options,
})

if (res.status === 401 && !url.endsWith('/auth/refresh')) {

  if (!refreshPromise) {
    refreshPromise = renovarSesion().finally(() => {
      refreshPromise = null
    })
  }

  await refreshPromise

  res = await fetch(url, {
    credentials: 'include',
    ...options,
  })
}

  if (!res.ok) {
    const text = await res.text()
    let message = 'Error en la petición'
    try {
  const json = JSON.parse(text)
  message = json.message || message
    } catch {
      message = text || message
    }

  throw new Error(message)}

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