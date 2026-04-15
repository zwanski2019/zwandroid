export interface BLEScanResult {
  id: string
  name?: string
  device: any
  connected?: boolean
  info?: Record<string, string> | null
}

