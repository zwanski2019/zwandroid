import { createClient } from '@supabase/supabase-js'
import type { Signal } from './store'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null

export async function saveSignal(signal: Omit<Signal, 'id' | 'createdAt'>) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from('signals').insert([signal]).select().single()
  if (error) throw error
  return data
}

export async function getSignals(type?: string) {
  if (!supabase) throw new Error('Supabase not configured')
  let query = supabase.from('signals').select('*').order('created_at', { ascending: false })
  if (type) query = query.eq('type', type)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function searchCommunityDB(query: string, type?: string) {
  if (!supabase) throw new Error('Supabase not configured')
  let q = supabase.from('community_signals').select('*').ilike('name', `%${query}%`)
  if (type) q = q.eq('type', type)
  const { data, error } = await q.limit(50)
  if (error) throw error
  return data
}

