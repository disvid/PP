/**
 * Base URL of the backend. Production builds read it from VITE_API_URL (see .env.production); in development it is
 * empty, so requests stay on the page's origin and the Vite dev server proxies them to the backend.
 */
export const API_URL = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/+$/, '')

const TOKEN_KEY = 'pp_token'
const NAME_KEY = 'pp_name'

const read = (k: string) => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const write = (k: string, v: string | null) => {
  try {
    if (v === null) localStorage.removeItem(k)
    else localStorage.setItem(k, v)
  } catch {
    /* storage unavailable: the session just won't persist */
  }
}

export const session = {
  token: () => read(TOKEN_KEY),
  name: () => read(NAME_KEY),
  set: (name: string, token: string) => {
    write(NAME_KEY, name)
    write(TOKEN_KEY, token)
  },
  clear: () => {
    write(NAME_KEY, null)
    write(TOKEN_KEY, null)
  },
}

export async function api<T = unknown>(path: string, body?: unknown): Promise<{ ok: boolean; status: number; data: T }> {
  const token = session.token()
  const res = await fetch(API_URL + path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  return { ok: res.ok, status: res.status, data: (await res.json()) as T }
}

export interface BoardRow { rank: number; name: string; points: number; optimality: number; speed: number; solved: number }
