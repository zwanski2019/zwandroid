import { useEffect, useState } from 'react'
import { useStore } from './lib/store'
import { ModuleGrid } from './components/ModuleGrid'
import { Terminal } from './components/Terminal'
import { StatusBar } from './components/StatusBar'
import { NFCModule } from './modules/nfc/NFCModule'
import { IRModule } from './modules/ir/IRModule'
import { BLEModule } from './modules/bluetooth/BLEModule'
import { BadUSBModule } from './modules/badusb/BadUSBModule'
import { SubGHzModule } from './modules/subghz/SubGHzModule'
import { SignalDB } from './modules/signaldb/SignalDB'
import { Settings } from './components/Settings'

const MODULES: Record<string, React.ComponentType> = {
  nfc: NFCModule,
  ir: IRModule,
  bluetooth: BLEModule,
  badusb: BadUSBModule,
  subghz: SubGHzModule,
  signaldb: SignalDB,
}

export default function App() {
  const { activeModule, setActiveModule, addLog, settingsOpen, setSettingsOpen } = useStore()
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 8))

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toTimeString().slice(0, 8)), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    addLog('ZwanDroid v1.0 initialized', 'success')
    addLog('Powered by Flipper Zero asset database', 'info')
  }, [addLog])

  useEffect(() => {
    const { settings, setSettingsOpen: openSettings, addLog: logMessage } = useStore.getState()
    if (!settings.apiBase) {
      setTimeout(() => {
        logMessage('First run - add your Backend URL in Settings', 'warn')
        openSettings(true)
      }, 1500)
    }
  }, [])

  const ActiveModule = activeModule ? MODULES[activeModule] : null

  return (
    <div className="min-h-screen bg-base font-mono text-text flex flex-col overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #00ff88 0px, #00ff88 1px, transparent 1px, transparent 4px)',
        }}
      />

      <div
        className="fixed inset-0 pointer-events-none z-40"
        style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.8) 100%)' }}
      />

      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface relative z-10">
        <div className="flex items-center gap-3">
          {activeModule && (
            <button
              onClick={() => setActiveModule(null)}
              className="text-dim hover:text-neon text-xs tracking-widest transition-colors mr-2"
            >
              ← BACK
            </button>
          )}
          <h1 className="font-display text-lg tracking-[0.3em]">
            <span className="text-neon">ZWAN</span>
            <span className="text-amber">DROID</span>
          </h1>
          <span className="text-[9px] text-dim tracking-widest hidden sm:block">SOFTWARE FLIPPER ZERO</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-neon tracking-widest animate-blink">● LIVE</span>
          <button
            onClick={() => setSettingsOpen(true)}
            className="text-dim hover:text-neon transition-colors text-base leading-none"
            title="Settings"
          >
            ⚙
          </button>
          <span className="text-[11px] text-dim tracking-widest">{time}</span>
        </div>
      </header>

      <StatusBar />

      <main className="flex-1 overflow-y-auto relative z-10">
        {ActiveModule ? (
          <div className="animate-fadein">
            <ActiveModule />
          </div>
        ) : (
          <div className="animate-fadein">
            <ModuleGrid />
          </div>
        )}
      </main>

      <Terminal />
      {settingsOpen && <Settings />}
    </div>
  )
}
