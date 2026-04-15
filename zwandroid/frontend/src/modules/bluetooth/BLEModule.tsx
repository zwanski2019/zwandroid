import { useState } from 'react'
import { useStore } from '../../lib/store'

export function BLEModule() {
  const { addLog, addSignal } = useStore()
  const [devices, setDevices] = useState<any[]>([])
  const [scanning, setScanning] = useState(false)

  async function scan() {
    const nav = navigator as any
    if (!nav.bluetooth) {
      addLog('Web Bluetooth not supported', 'error')
      return
    }
    setScanning(true)
    addLog('BLE scan — select device from browser picker...', 'info')
    try {
      const device = await nav.bluetooth.requestDevice({ acceptAllDevices: true })
      const entry = { id: device.id, name: device.name || 'Unknown', gatt: device.gatt }
      setDevices((d) => [entry, ...d])
      addLog(`✓ Found: ${device.name || device.id}`, 'success')
      addSignal({ type: 'ble', name: device.name || device.id, data: device.id, raw: { id: device.id, name: device.name } })
    } catch (err: any) {
      addLog(`BLE: ${err.message}`, err.message.includes('cancelled') ? 'warn' : 'error')
    } finally {
      setScanning(false)
    }
  }

  return (
    <div className="p-4 space-y-4 animate-fadein">
      <div className="flex items-center gap-3 p-4 bg-surface border border-blue/20 rounded-sm">
        <span className="text-4xl text-blue">⌬</span>
        <div>
          <div className="font-display text-sm tracking-widest text-bright">BLUETOOTH</div>
          <div className="text-[10px] text-dim tracking-wider mt-0.5">BLE SCANNER · GATT EXPLORER</div>
        </div>
      </div>

      <button
        onClick={scan}
        disabled={scanning}
        className="w-full py-4 border border-blue/30 text-blue bg-blue/5 hover:bg-blue/10
                   text-xs tracking-[0.3em] transition-all disabled:opacity-50"
      >
        {scanning ? '⌬ SCANNING...' : '⌬ SCAN BLE DEVICES'}
      </button>

      <div className="space-y-2">
        {devices.map((d, i) => (
          <div key={i} className="p-3 bg-surface border border-border flex items-center justify-between">
            <div>
              <div className="text-xs text-bright">{d.name}</div>
              <div className="text-[9px] text-dim mt-0.5 font-mono">{d.id}</div>
            </div>
            <span className="text-[9px] text-blue border border-blue/30 px-2 py-1">SAVED</span>
          </div>
        ))}
        {devices.length === 0 && <div className="text-[10px] text-dim text-center py-6">NO DEVICES FOUND YET</div>}
      </div>
    </div>
  )
}

