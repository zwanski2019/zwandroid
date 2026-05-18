import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export const api = axios.create({ baseURL: BASE })

export const irAPI = {
  search: (q: string, brand?: string) => api.get('/ir/search', { params: { q, brand } }).then((r) => r.data),
  brands: () => api.get('/ir/brands').then((r) => r.data),
  getByBrand: (brand: string) => api.get(`/ir/brand/${brand}`).then((r) => r.data),
}

export const signalsAPI = {
  save: (signal: object) => api.post('/signals/', signal).then((r) => r.data),
  list: (type?: string) => api.get('/signals/', { params: { type } }).then((r) => r.data),
  delete: (id: string) => api.delete(`/signals/${id}`).then((r) => r.data),
}

export const subghzAPI = {
  wsUrl: () => BASE.replace('http', 'ws') + '/subghz/ws/scan',
}

