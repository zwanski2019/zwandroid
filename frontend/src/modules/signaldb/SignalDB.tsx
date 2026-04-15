import { useStore } from '../../lib/store'

const TYPE_COLOR: Record<string, string> = {
  nfc: 'text-neon border-neon/30',
  ir: 'text-amber border-amber/30',
  rf: 'text-purple border-purple/30',
  ble: 'text-blue border-blue/30',
}

export function SignalDB() {
  const { signals, deleteSignal } = useStore()

  function exportFlipperFile(signal: any) {
    let content = ''
    if (signal.type === 'ir') {
      content = `Filetype: IR signals file\nVersion: 1\n#\nname: ${signal.name}\ntype: parsed\n`
    } else if (signal.type === 'nfc') {
      content = `Filetype: Flipper NFC device\nVersion: 4\nDevice type: NTAG215\n`
    }
    const blob = new Blob([content], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${signal.name.replace(/\\s+/g, '_')}.${signal.type === 'rf' ? 'sub' : signal.type}`
    a.click()
  }

  return (
    <div className="p-4 space-y-4 animate-fadein">
      <div className="flex items-center gap-3 p-4 bg-surface border border-gold/20 rounded-sm">
        <span className="text-4xl text-gold">⊞</span>
        <div>
          <div className="font-display text-sm tracking-widest text-bright">SIGNAL DB</div>
          <div className="text-[10px] text-dim tracking-wider mt-0.5">{signals.length} SAVED SIGNALS · FLIPPER COMPATIBLE</div>
        </div>
      </div>

      {signals.length === 0 ? (
        <div className="text-center py-12 text-dim text-[10px] tracking-wider">
          NO SIGNALS SAVED YET
          <br />
          <br />
          USE NFC, IR, BLE OR SUB-GHZ MODULES TO CAPTURE SIGNALS
        </div>
      ) : (
        <div className="space-y-2">
          {signals.map((s) => (
            <div key={s.id} className="p-3 bg-surface border border-border flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[8px] px-1.5 py-0.5 border tracking-wider ${TYPE_COLOR[s.type] || 'text-text border-border'}`}>
                    {s.type.toUpperCase()}
                  </span>
                  <span className="text-xs text-bright truncate">{s.name}</span>
                </div>
                <div className="text-[9px] text-dim font-mono truncate">{s.data.slice(0, 60)}...</div>
                <div className="text-[9px] text-dim mt-1">{new Date(s.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => exportFlipperFile(s)}
                  className="text-[9px] px-2 py-1 border border-gold/30 text-gold hover:bg-gold/10 tracking-wider transition-colors"
                >
                  EXPORT
                </button>
                <button
                  onClick={() => deleteSignal(s.id)}
                  className="text-[9px] px-2 py-1 border border-red/20 text-red/60 hover:text-red hover:border-red/40 tracking-wider transition-colors"
                >
                  DEL
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

