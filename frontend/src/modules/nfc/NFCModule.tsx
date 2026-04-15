import { useState } from 'react'
import { useStore } from '../../lib/store'

export function NFCModule() {
  const { addLog, addSignal } = useStore()
  const [scanning, setScanning] = useState(false)
  const [lastTag, setLastTag] = useState<Record<string, unknown> | null>(null)
  const [writeText, setWriteText] = useState('')
  const [mode, setMode] = useState<'scan' | 'write' | 'clone'>('scan')

  const supported = 'NDEFReader' in window

  async function scanTag() {
    if (!supported) {
      addLog('Web NFC not supported — use Chrome on Android', 'error')
      return
    }
    setScanning(true)
    addLog('NFC reader activated — tap a tag...', 'info')
    try {
      const reader = new (window as any).NDEFReader()
      await reader.scan()
      reader.onreading = (event: any) => {
        const records = event.message.records.map((r: any) => ({
          type: r.recordType,
          data: new TextDecoder().decode(r.data),
        }))
        const tag = { serialNumber: event.serialNumber, records }
        setLastTag(tag)
        addLog(`✓ Tag: SN ${event.serialNumber} — ${records.length} record(s)`, 'success')
        addSignal({ type: 'nfc', name: `NFC ${event.serialNumber}`, data: JSON.stringify(records), raw: tag })
        setScanning(false)
      }
      reader.onreadingerror = () => {
        addLog('NFC read error', 'error')
        setScanning(false)
      }
    } catch (err: any) {
      addLog(`NFC error: ${err.message}`, 'error')
      setScanning(false)
    }
  }

  async function writeTag() {
    if (!supported) {
      addLog('Web NFC not supported', 'error')
      return
    }
    if (!writeText.trim()) {
      addLog('Enter text to write', 'warn')
      return
    }
    try {
      const writer = new (window as any).NDEFReader()
      addLog(`Writing "${writeText}" — tap a tag...`, 'info')
      await writer.write({ records: [{ recordType: 'text', data: writeText }] })
      addLog(`✓ Written successfully`, 'success')
    } catch (err: any) {
      addLog(`Write error: ${err.message}`, 'error')
    }
  }

  return (
    <div className="p-4 space-y-4 animate-fadein">
      <div className="flex items-center gap-3 p-4 bg-surface border border-neon/20 rounded-sm">
        <span className="text-4xl text-neon">◈</span>
        <div>
          <div className="font-display text-sm tracking-widest text-bright">NFC MODULE</div>
          <div className="text-[10px] text-dim tracking-wider mt-0.5">NDEF · ISO14443 · Mifare</div>
        </div>
        {!supported && (
          <span className="ml-auto text-[9px] text-red border border-red/30 px-2 py-1 tracking-wider">
            CHROME ANDROID ONLY
          </span>
        )}
      </div>

      <div className="flex gap-1">
        {(['scan', 'write', 'clone'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 text-[10px] tracking-widest py-2 border transition-colors ${
              mode === m ? 'text-neon border-neon/50 bg-neon/5' : 'text-dim border-border hover:border-neon/20'
            }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {mode === 'scan' && (
        <div className="space-y-3">
          <button
            onClick={scanTag}
            disabled={scanning}
            className="w-full py-4 border border-neon/30 text-neon bg-neon/5 hover:bg-neon/10
                       text-xs tracking-[0.3em] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {scanning ? '◈ SCANNING...' : '◈ SCAN TAG'}
          </button>
          {scanning && (
            <div className="h-1 bg-muted rounded overflow-hidden">
              <div className="h-full bg-neon animate-fillbar" />
            </div>
          )}
          {lastTag && (
            <div className="bg-surface border border-border p-3 rounded-sm text-[10px] space-y-1">
              <div className="text-neon tracking-wider">LAST TAG</div>
              <div className="text-dim">
                SN: <span className="text-text">{lastTag.serialNumber as string}</span>
              </div>
              {(lastTag.records as any[]).map((r, i) => (
                <div key={i} className="text-dim">
                  [{r.type}]: <span className="text-text">{r.data}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {mode === 'write' && (
        <div className="space-y-3">
          <input
            type="text"
            value={writeText}
            onChange={(e) => setWriteText(e.target.value)}
            placeholder="Text to write to tag..."
            className="w-full bg-surface border border-border text-text text-xs p-3
                       placeholder-dim focus:border-neon/50 focus:outline-none tracking-wider"
          />
          <button
            onClick={writeTag}
            className="w-full py-3 border border-amber/30 text-amber bg-amber/5 hover:bg-amber/10
                       text-xs tracking-[0.3em] transition-all"
          >
            ▶ WRITE TO TAG
          </button>
        </div>
      )}

      {mode === 'clone' && (
        <div className="space-y-3 text-[11px] text-text">
          <div className="p-3 bg-surface border border-border rounded-sm space-y-2">
            <div className="text-[10px] text-dim tracking-wider">CLONE PROCEDURE</div>
            <div>
              1. Tap <span className="text-neon">SCAN SOURCE</span> and hold source tag
            </div>
            <div>
              2. Tap <span className="text-amber">WRITE CLONE</span> and hold blank tag
            </div>
          </div>
          <button
            onClick={scanTag}
            className="w-full py-3 border border-neon/30 text-neon bg-neon/5 text-xs tracking-widest transition-all"
          >
            1. SCAN SOURCE TAG
          </button>
          <button
            onClick={writeTag}
            disabled={!lastTag}
            className="w-full py-3 border border-amber/30 text-amber bg-amber/5 text-xs tracking-widest
                       transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            2. WRITE CLONE
          </button>
        </div>
      )}
    </div>
  )
}

