import { useEffect, useState } from 'react'

export function StatusBar() {
  const [nfc, setNfc] = useState(false)
  const [bt, setBt] = useState(false)

  useEffect(() => {
    setNfc('NDEFReader' in window)
    setBt('bluetooth' in navigator)
  }, [])

  const chips = [
    { label: 'NFC', ok: nfc },
    { label: 'BT', ok: bt },
    { label: 'USB', ok: 'usb' in navigator },
    { label: 'SERIAL', ok: 'serial' in navigator },
    { label: 'SDR', ok: false },
  ]

  return (
    <div className="flex gap-2 px-4 py-1.5 border-b border-border bg-base overflow-x-auto">
      {chips.map((c) => (
        <span
          key={c.label}
          className={`text-[9px] tracking-widest px-2 py-0.5 rounded-sm border whitespace-nowrap ${
            c.ok ? 'text-neon border-neon/30 bg-neon/5' : 'text-dim border-border bg-surface'
          }`}
        >
          {c.label}:{c.ok ? 'ON' : '—'}
        </span>
      ))}
      <span className="text-[9px] tracking-widest px-2 py-0.5 rounded-sm border text-gold border-gold/30 bg-gold/5 ml-auto whitespace-nowrap">
        FLIPPER DB: LOADED
      </span>
    </div>
  )
}

