export interface IRSignal {
  name: string
  type: 'raw' | 'parsed'
  protocol?: string
  address?: string
  command?: string
  frequency?: number
  duty_cycle?: number
  data?: number[]
}

export async function parseFlipperIRFile(text: string): Promise<IRSignal[]> {
  const signals: IRSignal[] = []
  const blocks = text.split('#')
  for (const block of blocks) {
    const lines = block.trim().split('\n')
    const signal: Partial<IRSignal> = {}
    for (const line of lines) {
      const [key, ...rest] = line.split(': ')
      const val = rest.join(': ').trim()
      if (key === 'name') signal.name = val
      if (key === 'type') signal.type = val as 'raw' | 'parsed'
      if (key === 'protocol') signal.protocol = val
      if (key === 'address') signal.address = val
      if (key === 'command') signal.command = val
      if (key === 'frequency') signal.frequency = parseInt(val)
      if (key === 'duty_cycle') signal.duty_cycle = parseFloat(val)
      if (key === 'data') signal.data = val.split(' ').map(Number)
    }
    if (signal.name) signals.push(signal as IRSignal)
  }
  return signals
}

export async function sendIRViaSerial(signal: IRSignal) {
  if (!('serial' in navigator)) {
    throw new Error('Web Serial not supported')
  }
  const port = await (navigator as any).serial.requestPort()
  await port.open({ baudRate: 115200 })
  const writer = port.writable.getWriter()
  const payload = JSON.stringify(signal) + '\n'
  await writer.write(new TextEncoder().encode(payload))
  writer.releaseLock()
  await port.close()
}

