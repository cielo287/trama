
const RUTAS_SIN_REFRESH_AUTOMATICO = ['/auth/login', '/auth/register', '/auth/verificar', '/auth/reenviar-codigo']

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

const esRutaSinRefresh = RUTAS_SIN_REFRESH_AUTOMATICO.some(ruta => url.includes(ruta))

if (res.status === 401 && !url.endsWith('/auth/refresh') && !esRutaSinRefresh) {

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
    let code: string | undefined
    try {
      const json = JSON.parse(text)
      message = json.message || message
      code = json.code
    } catch {
      message = text || message
    }

    const error: any = new Error(message)
    error.code = code
    throw error
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