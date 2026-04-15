import { useState } from 'react'
import { useStore } from '../../lib/store'

export function SubGHzModule() {
  const { addLog } = useStore()
  const [freq, setFreq] = useState('433920000')
  const [connected, setConnected] = useState(false)

  async function connectSDR() {
    if (!('usb' in navigator)) {
      addLog('WebUSB not supported', 'error')
      return
    }
    try {
      const device = await (navigator as any).usb.requestDevice({
        filters: [{ vendorId: 0x0bda }],
      })
      await device.open()
      setConnected(true)
      addLog(`✓ RTL-SDR connected: ${device.productName}`, 'success')
    } catch (err: any) {
      addLog(`SDR: ${err.message}`, 'error')
    }
  }

  return (
    <div className="p-4 space-y-4 animate-fadein">
      <div className="flex items-center gap-3 p-4 bg-surface border border-purple/20 rounded-sm">
        <span className="text-4xl text-purple">≋</span>
        <div>
          <div className="font-display text-sm tracking-widest text-bright">SUB-GHZ</div>
          <div className="text-[10px] text-dim tracking-wider mt-0.5">RTL-SDR · 433MHz · OOK/ASK</div>
        </div>
      </div>

      <div className="p-3 border border-purple/20 bg-purple/5 text-[10px] text-purple tracking-wider">
        ⚠ RTL-SDR USB dongle required (RTL2832U chip, VID 0x0BDA)
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={freq}
          onChange={(e) => setFreq(e.target.value)}
          className="flex-1 bg-surface border border-border text-text text-xs p-2.5 focus:border-purple/50 focus:outline-none"
          placeholder="Frequency (Hz)"
        />
        <span className="text-[9px] text-dim self-center">Hz</span>
      </div>

      <button
        onClick={connectSDR}
        className={`w-full py-3 border text-xs tracking-[0.3em] transition-all ${
          connected ? 'border-neon/30 text-neon bg-neon/5' : 'border-purple/30 text-purple bg-purple/5 hover:bg-purple/10'
        }`}
      >
        {connected ? '✓ SDR CONNECTED' : '≋ CONNECT RTL-SDR'}
      </button>

      {connected && (
        <div className="grid grid-cols-2 gap-2">
          {['SCAN FREQ', 'RECORD IQ', 'REPLAY', 'BRUTE 433'].map((a) => (
            <button
              key={a}
              onClick={() => addLog(`${a} started at ${freq}Hz`, 'info')}
              className="py-2.5 border border-border text-dim hover:border-purple/30 hover:text-purple
                         text-[9px] tracking-widest transition-colors"
            >
              {a}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

