import { useStore } from '../../lib/store'
import type { NFCTagSignalRaw, NDEFRecordDecoded } from './nfc.types'

export function useNFC() {
  const addLog = useStore((s) => s.addLog)
  const addSignal = useStore((s) => s.addSignal)

  async function scanTag() {
    if (!('NDEFReader' in window)) {
      addLog('Web NFC not supported. Use Chrome on Android.', 'error')
      return null
    }

    try {
      const reader = new (window as any).NDEFReader()
      addLog('NFC reader activated — tap a tag...', 'info')
      await reader.scan()

      return await new Promise<{ raw: NFCTagSignalRaw; data: string }>((resolve) => {
        reader.onreading = (event: any) => {
          const records: NDEFRecordDecoded[] = (event.message?.records ?? []).map((r: any) => ({
            type: r.recordType,
            mediaType: r.mediaType,
            data: new TextDecoder().decode(r.data),
          }))
          const raw: NFCTagSignalRaw = { serialNumber: event.serialNumber, records }
          resolve({ raw, data: JSON.stringify(records, null, 2) })
        }
      })
    } catch (err: any) {
      addLog(`NFC error: ${err?.message ?? String(err)}`, 'error')
      return null
    }
  }

  async function writeTag(text: string) {
    if (!('NDEFReader' in window)) {
      addLog('Web NFC not supported.', 'error')
      return
    }
    try {
      const writer = new (window as any).NDEFReader()
      await writer.write({ records: [{ recordType: 'text', data: text }] })
      addLog(`✓ Written to tag: "${text}"`, 'success')
    } catch (err: any) {
      addLog(`Write error: ${err?.message ?? String(err)}`, 'error')
    }
  }

  async function saveScanToLocal(raw: NFCTagSignalRaw, data: string) {
    const signal = {
      id: crypto.randomUUID(),
      type: 'nfc' as const,
      name: `NFC Tag ${new Date().toLocaleTimeString()}`,
      data,
      raw: raw as unknown as Record<string, unknown>,
      createdAt: new Date().toISOString(),
    }
    addSignal(signal)
    addLog(`✓ Saved locally: ${signal.name}`, 'success')
    return signal
  }

  async function cloneTag(sourceText: string) {
    addLog('Now hold target (blank) tag...', 'warn')
    await writeTag(sourceText)
    addLog('✓ Clone complete', 'success')
  }

  return { scanTag, writeTag, saveScanToLocal, cloneTag }
}

