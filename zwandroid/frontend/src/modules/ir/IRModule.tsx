import { useEffect, useState } from 'react'
import { useStore } from '../../lib/store'
import { irAPI } from '../../lib/api'

export function IRModule() {
  const { addLog } = useStore()
  const [brands, setBrands] = useState<string[]>([])
  const [selectedBrand, setSelectedBrand] = useState('')
  const [signals, setSignals] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    irAPI.brands().then(setBrands).catch(() => addLog('IR DB not reachable — start backend', 'warn'))
  }, [addLog])

  async function searchIR() {
    setLoading(true)
    try {
      const results = await irAPI.search(search, selectedBrand)
      setSignals(results)
      addLog(`Found ${results.length} IR signals`, 'success')
    } catch {
      addLog('IR search failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function sendIR(signal: any) {
    addLog(`Sending IR: ${signal.name}...`, 'info')
    if (!('serial' in navigator)) {
      addLog('Web Serial not available — connect IR blaster via USB', 'warn')
      return
    }
    try {
      const port = await (navigator as any).serial.requestPort()
      await port.open({ baudRate: 115200 })
      const writer = port.writable.getWriter()
      await writer.write(new TextEncoder().encode(JSON.stringify(signal) + '\n'))
      writer.releaseLock()
      await port.close()
      addLog(`✓ IR signal sent: ${signal.name}`, 'success')
    } catch (err: any) {
      addLog(`IR send error: ${err.message}`, 'error')
    }
  }

  return (
    <div className="p-4 space-y-4 animate-fadein">
      <div className="flex items-center gap-3 p-4 bg-surface border border-amber/20 rounded-sm">
        <span className="text-4xl text-amber">⊛</span>
        <div>
          <div className="font-display text-sm tracking-widest text-bright">IR BLASTER</div>
          <div className="text-[10px] text-dim tracking-wider mt-0.5">FLIPPER ZERO IR DATABASE — 12,000+ CODES</div>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search device / brand..."
          onKeyDown={(e) => e.key === 'Enter' && searchIR()}
          className="flex-1 bg-surface border border-border text-text text-xs p-2.5
                     placeholder-dim focus:border-amber/50 focus:outline-none"
        />
        <button
          onClick={searchIR}
          className="px-4 border border-amber/30 text-amber bg-amber/5 text-xs tracking-wider hover:bg-amber/10 transition-all"
        >
          {loading ? '...' : 'SEARCH'}
        </button>
      </div>

      {brands.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {brands.slice(0, 12).map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b === selectedBrand ? '' : b)}
              className={`text-[9px] px-2 py-1 border whitespace-nowrap tracking-wider transition-colors ${
                selectedBrand === b ? 'text-amber border-amber/50 bg-amber/10' : 'text-dim border-border hover:border-amber/20'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2 max-h-72 overflow-y-auto">
        {signals.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-surface border border-border
                                   hover:border-amber/20 transition-colors"
          >
            <div>
              <div className="text-xs text-bright tracking-wide">{s.name}</div>
              <div className="text-[9px] text-dim mt-0.5">
                {s.protocol} · {s.brand} · {s.device}
              </div>
            </div>
            <button
              onClick={() => sendIR(s)}
              className="text-[9px] px-3 py-1.5 border border-amber/30 text-amber hover:bg-amber/10
                         tracking-widest transition-all ml-3 shrink-0"
            >
              ▶ SEND
            </button>
          </div>
        ))}
        {signals.length === 0 && !loading && (
          <div className="text-[10px] text-dim text-center py-6 tracking-wider">SEARCH THE FLIPPER IR DATABASE ABOVE</div>
        )}
      </div>
    </div>
  )
}

