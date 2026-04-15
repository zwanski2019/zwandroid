import { useState } from 'react'
import { useStore } from '../../lib/store'

const PRESETS: Record<string, string> = {
  'Hello World':
    'DELAY 1000\nGUI r\nDELAY 500\nSTRING notepad\nENTER\nDELAY 800\nSTRING Hello from ZwanDroid!\nENTER',
  'Open Terminal': 'DELAY 500\nCTRL ALT t',
  'Lock Screen': 'GUI l',
  'WiFi Probe': 'DELAY 500\nGUI r\nDELAY 500\nSTRING cmd\nENTER\nDELAY 800\nSTRING netsh wlan show profiles\nENTER',
}

export function BadUSBModule() {
  const { addLog } = useStore()
  const [script, setScript] = useState(PRESETS['Hello World'])
  const [running, setRunning] = useState(false)

  async function runPayload() {
    setRunning(true)
    addLog('Parsing DuckyScript...', 'info')
    const lines = script
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    for (const line of lines) {
      if (line.startsWith('REM')) {
        addLog(`# ${line.slice(4)}`, 'info')
        continue
      }
      if (line.startsWith('DELAY')) {
        const ms = parseInt(line.split(' ')[1]) || 500
        addLog(`DELAY ${ms}ms`, 'info')
        await new Promise((r) => setTimeout(r, Math.min(ms, 200)))
        continue
      }
      if (line.startsWith('STRING')) {
        addLog(`TYPE: ${line.slice(7)}`, 'info')
        continue
      }
      addLog(`KEY: ${line}`, 'info')
    }
    addLog('✓ Payload preview complete — connect USB OTG to execute for real', 'success')
    setRunning(false)
  }

  return (
    <div className="p-4 space-y-4 animate-fadein">
      <div className="flex items-center gap-3 p-4 bg-surface border border-red/20 rounded-sm">
        <span className="text-4xl text-red">▣</span>
        <div>
          <div className="font-display text-sm tracking-widest text-bright">BAD USB</div>
          <div className="text-[10px] text-dim tracking-wider mt-0.5">DUCKYSCRIPT · HID INJECTION · USB OTG</div>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {Object.keys(PRESETS).map((p) => (
          <button
            key={p}
            onClick={() => setScript(PRESETS[p])}
            className="text-[9px] px-2 py-1 border border-border text-dim hover:border-red/30
                       hover:text-red whitespace-nowrap tracking-wider transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        rows={8}
        className="w-full bg-surface border border-border text-text text-xs p-3
                   focus:border-red/50 focus:outline-none font-mono leading-relaxed resize-none"
        placeholder="DELAY 1000&#10;GUI r&#10;STRING notepad&#10;ENTER"
      />

      <button
        onClick={runPayload}
        disabled={running}
        className="w-full py-3 border border-red/30 text-red bg-red/5 hover:bg-red/10
                   text-xs tracking-[0.3em] transition-all disabled:opacity-50"
      >
        {running ? '▶ RUNNING...' : '▶ PREVIEW & RUN PAYLOAD'}
      </button>

      <div className="text-[9px] text-dim tracking-wider text-center border border-border p-2">
        ⚠ PREVIEW MODE — USB OTG + WebUSB HID required for real injection
      </div>
    </div>
  )
}

