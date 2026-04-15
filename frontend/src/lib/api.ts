import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export const api = axios.create({ baseURL: BASE })

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
  wsUrl: () => BASE.replace('http', 'ws') + '/subghz/ws/scan',
}

