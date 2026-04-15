type BluetoothDeviceLike = any

export function useBluetooth() {
  async function scanDevices(): Promise<BluetoothDeviceLike[]> {
    const nav = navigator as Navigator & { bluetooth?: any }
    if (!nav.bluetooth) throw new Error('Web Bluetooth not supported')
    const device = await nav.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service', 'device_information'],
    })
    return [device]
  }

  async function readDeviceInfo(device: BluetoothDeviceLike) {
    const server = await device.gatt?.connect()
    if (!server) return null
    try {
      const service = await server.getPrimaryService('device_information')
      const chars = await service.getCharacteristics()
      const info: Record<string, string> = {}
      for (const char of chars) {
        const val = await char.readValue()
        info[char.uuid] = new TextDecoder().decode(val)
      }
      return info
    } catch {
      return null
    } finally {
      server.disconnect()
    }
  }

  return { scanDevices, readDeviceInfo }
}

