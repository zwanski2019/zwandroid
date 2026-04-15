import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LogLevel = 'info' | 'success' | 'error' | 'warn'
export type SignalType = 'nfc' | 'ir' | 'rf' | 'ble'

export interface LogEntry {
  id: string
  ts: string
  msg: string
  level: LogLevel
}

export interface Signal {
  id: string
  type: SignalType
  name: string
  data: string
  raw: Record<string, unknown>
  createdAt: string
  tags?: string[]
}

interface Settings {
  apiBase: string
  supabaseUrl: string
  supabaseAnonKey: string
  openrouterKey: string
  flipperDbUrl: string
  rtlsdrRelayUrl: string
}

interface AppStore {
  activeModule: string | null
  setActiveModule: (id: string | null) => void
  log: LogEntry[]
  addLog: (msg: string, level?: LogLevel) => void
  clearLog: () => void
  signals: Signal[]
  addSignal: (s: Omit<Signal, 'id' | 'createdAt'>) => Signal
  deleteSignal: (id: string) => void
  theme: 'green' | 'amber' | 'blue'
  setTheme: (t: 'green' | 'amber' | 'blue') => void
  settings: Settings
  updateSettings: (patch: Partial<Settings>) => void
  settingsOpen: boolean
  setSettingsOpen: (v: boolean) => void
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      activeModule: null,
      setActiveModule: (id) => set({ activeModule: id }),
      log: [],
      addLog: (msg, level = 'info') =>
        set((s) => ({
          log: [
            { id: crypto.randomUUID(), ts: new Date().toTimeString().slice(0, 8), msg, level },
            ...s.log.slice(0, 99),
          ],
        })),
      clearLog: () => set({ log: [] }),
      signals: [],
      addSignal: (data) => {
        const signal: Signal = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
        set((s) => ({ signals: [signal, ...s.signals] }))
        return signal
      },
      deleteSignal: (id) => set((s) => ({ signals: s.signals.filter((x) => x.id !== id) })),
      theme: 'green',
      setTheme: (theme) => set({ theme }),
      settings: {
        apiBase: '',
        supabaseUrl: '',
        supabaseAnonKey: '',
        openrouterKey: '',
        flipperDbUrl: '',
        rtlsdrRelayUrl: '',
      },
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      settingsOpen: false,
      setSettingsOpen: (v) => set({ settingsOpen: v }),
    }),
    { name: 'zwandroid-store', partialize: (s) => ({ signals: s.signals, theme: s.theme, settings: s.settings }) },
  ),
)

