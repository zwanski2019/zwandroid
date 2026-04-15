import axios from 'axios'
import { useStore } from './store'

function getBase(): string {
  const settings = useStore.getState().settings
  return settings.apiBase || import.meta.env.VITE_API_BASE || 'http://localhost:8000'
}

export const api = {
  get: (path: string, config?: object) => axios.get(getBase() + path, config),
  post: (path: string, data?: object) => axios.post(getBase() + path, data),
  delete: (path: string) => axios.delete(getBase() + path),
}

export const irAPI = {
  search: (q: string, brand?: string) => api.get('/ir/search', { params: { q, brand } }).then((r) => r.data),
  brands: () => api.get('/ir/brands').then((r) => r.data),
  getByBrand: (brand: string) => api.get(`/ir/brand/${brand}`).then((r) => r.data),
}

export const signalsAPI = {
  save: (signal: object) => api.post('/signals', signal).then((r) => r.data),
  list: () => api.get('/signals').then((r) => r.data),
  community: (q: string) => api.get('/signals/community', { params: { q } }).then((r) => r.data),
}

export const subghzAPI = {
  wsUrl: () => getRTLSDRRelay(),
}

export function getSupabaseConfig() {
  const { supabaseUrl, supabaseAnonKey } = useStore.getState().settings
  return { supabaseUrl, supabaseAnonKey }
}

export function getRTLSDRRelay(): string {
  const { rtlsdrRelayUrl, apiBase } = useStore.getState().settings
  return rtlsdrRelayUrl || (apiBase || '').replace('https', 'wss').replace('http', 'ws') + '/subghz/ws/scan'
}

