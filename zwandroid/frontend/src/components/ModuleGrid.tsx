import { useStore } from '../lib/store'

export function ModuleGrid() {
  const { setActiveModule, addLog } = useStore()

  const MODULES = [
    {
      id: 'nfc',
      label: 'NFC',
      icon: '◈',
      color: 'text-neon border-neon/20',
      glow: 'shadow-[0_0_20px_rgba(0,255,136,0.15)]',
      desc: 'Read · Write · Clone',
      status: 'READY',
      statusColor: 'text-neon',
      tags: ['NDEF', 'ISO14443', 'Mifare'],
    },
    {
      id: 'ir',
      label: 'IR BLASTER',
      icon: '⊛',
      color: 'text-amber border-amber/20',
      glow: 'shadow-[0_0_20px_rgba(255,107,53,0.15)]',
      desc: 'Universal Remote',
      status: '12K+ CODES',
      statusColor: 'text-amber',
      tags: ['NEC', 'RC5', 'Samsung', 'Sony'],
    },
    {
      id: 'bluetooth',
      label: 'BLUETOOTH',
      icon: '⌬',
      color: 'text-blue border-blue/20',
      glow: 'shadow-[0_0_20px_rgba(77,166,255,0.15)]',
      desc: 'BLE Scanner · GATT',
      status: 'READY',
      statusColor: 'text-blue',
      tags: ['BLE 5.0', 'GATT', 'Scan'],
    },
    {
      id: 'badusb',
      label: 'BAD USB',
      icon: '▣',
      color: 'text-red border-red/20',
      glow: 'shadow-[0_0_20px_rgba(255,51,102,0.15)]',
      desc: 'HID Payload Injector',
      status: 'USB OTG',
      statusColor: 'text-red',
      tags: ['DuckyScript', 'HID', 'WebUSB'],
    },
    {
      id: 'subghz',
      label: 'SUB-GHZ',
      icon: '≋',
      color: 'text-purple border-purple/20',
      glow: 'shadow-[0_0_20px_rgba(192,132,252,0.15)]',
      desc: 'RF · RTL-SDR',
      status: 'DONGLE REQ.',
      statusColor: 'text-purple',
      tags: ['433MHz', 'RTL-SDR', 'OOK'],
    },
    {
      id: 'signaldb',
      label: 'SIGNAL DB',
      icon: '⊞',
      color: 'text-gold border-gold/20',
      glow: 'shadow-[0_0_20px_rgba(255,215,0,0.15)]',
      desc: 'Flipper Asset Library',
      status: 'FLIPPER DB',
      statusColor: 'text-gold',
      tags: ['Import', 'Export', 'Search'],
    },
  ]

  return (
    <div className="p-4">
      <div className="mb-6 px-1">
        <div className="text-[10px] text-dim tracking-[0.4em] mb-1">SELECT MODULE</div>
        <div className="h-px bg-gradient-to-r from-neon/30 to-transparent" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MODULES.map((m, i) => (
          <button
            key={m.id}
            onClick={() => {
              setActiveModule(m.id)
              addLog(`Module loaded: ${m.label}`, 'info')
            }}
            className={`
              relative bg-surface border ${m.color} rounded-sm p-4
              text-left transition-all duration-200 overflow-hidden
              hover:${m.glow} active:scale-95
              group
            `}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div
              className="absolute top-0 right-0 w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity"
              style={{ background: `radial-gradient(circle at top right, currentColor, transparent)` }}
            />

            <div className={`text-3xl mb-3 ${m.color.split(' ')[0]}`}>{m.icon}</div>
            <div className="font-display text-[11px] tracking-[0.2em] text-bright mb-1">{m.label}</div>
            <div className="text-[10px] text-dim tracking-wider mb-3">{m.desc}</div>

            <div className="flex flex-wrap gap-1 mb-2">
              {m.tags.map((t) => (
                <span key={t} className="text-[8px] px-1.5 py-0.5 bg-muted text-dim rounded-sm tracking-wider">
                  {t}
                </span>
              ))}
            </div>

            <div className={`text-[9px] tracking-[0.3em] font-bold ${m.statusColor}`}>{m.status}</div>
          </button>
        ))}
      </div>

      <div className="mt-6 px-1 text-[9px] text-dim tracking-wider text-center">
        POWERED BY FLIPPER ZERO OPEN SOURCE ASSETS
        <br />
        <a
          href="https://github.com/flipperdevices/flipperzero-firmware"
          target="_blank"
          rel="noreferrer"
          className="text-neon/50 hover:text-neon transition-colors"
        >
          github.com/flipperdevices/flipperzero-firmware
        </a>
      </div>
    </div>
  )
}

