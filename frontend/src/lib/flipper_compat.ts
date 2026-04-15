import type { IRSignal } from '../modules/ir/ir.hooks'

export function parseFlipperNFC(text: string) {
  const data: Record<string, string> = {}
  for (const line of text.split('\n')) {
    const idx = line.indexOf(': ')
    if (idx > 0) {
      const k = line.slice(0, idx).trim()
      const v = line.slice(idx + 2).trim()
      data[k] = v
    }
  }
  return data
}

export function parseFlipperIR(text: string) {
  const signals: Record<string, string>[] = []
  let current: Record<string, string> = {}
  for (const line0 of text.split('\n')) {
    const line = line0.trim()
    if (!line || line.startsWith('#')) {
      if (Object.keys(current).length) {
        signals.push(current)
        current = {}
      }
      continue
    }
    const idx = line.indexOf(': ')
    if (idx > 0) current[line.slice(0, idx).trim()] = line.slice(idx + 2).trim()
  }
  if (Object.keys(current).length) signals.push(current)
  return signals
}

export function parseFlipperSub(text: string) {
  const data: Record<string, string | number[]> = {}
  const raw_data: number[] = []
  for (const line of text.split('\n')) {
    if (line.startsWith('RAW_Data:')) {
      raw_data.push(...line.split(': ', 2)[1].split(' ').map((x) => parseInt(x)).filter((n) => Number.isFinite(n)))
      continue
    }
    const idx = line.indexOf(': ')
    if (idx > 0) data[line.slice(0, idx).trim()] = line.slice(idx + 2).trim()
  }
  data.raw_data = raw_data
  return data
}

export function exportFlipperIR(signal: IRSignal): string {
  const lines = ['Filetype: IR signals file', 'Version: 1', '#', `name: ${signal.name}`, `type: ${signal.type}`]
  if (signal.type === 'parsed') {
    if (signal.protocol) lines.push(`protocol: ${signal.protocol}`)
    if (signal.address) lines.push(`address: ${signal.address}`)
    if (signal.command) lines.push(`command: ${signal.command}`)
  } else {
    if (signal.frequency != null) lines.push(`frequency: ${signal.frequency}`)
    if (signal.duty_cycle != null) lines.push(`duty_cycle: ${signal.duty_cycle}`)
    if (signal.data) lines.push(`data: ${signal.data.join(' ')}`)
  }
  return lines.join('\n')
}

export async function importFlipperFile(file: File) {
  const text = await file.text()
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext === 'nfc') return { type: 'nfc' as const, data: parseFlipperNFC(text) }
  if (ext === 'ir') return { type: 'ir' as const, data: parseFlipperIR(text) }
  if (ext === 'sub') return { type: 'rf' as const, data: parseFlipperSub(text) }
  throw new Error('Unknown file type')
}

