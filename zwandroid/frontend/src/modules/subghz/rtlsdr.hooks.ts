const RTL_SDR_VENDOR_ID = 0x0bda
const RTL_SDR_PRODUCT_ID = 0x2838

export async function connectRTLSDR() {
  if (!('usb' in navigator)) throw new Error('WebUSB not supported')
  const device = await (navigator as any).usb.requestDevice({
    filters: [{ vendorId: RTL_SDR_VENDOR_ID, productId: RTL_SDR_PRODUCT_ID }],
  })
  await device.open()
  await device.selectConfiguration(1)
  await device.claimInterface(0)
  return device
}

export async function tuneFrequency(device: any, freqHz: number) {
  const buf = new Uint8Array(4)
  new DataView(buf.buffer).setUint32(0, freqHz, true)
  await device.controlTransferOut(
    {
      requestType: 'vendor',
      recipient: 'device',
      request: 0x01,
      value: 0,
      index: 0,
    },
    buf,
  )
}

export async function readSamples(device: any, numSamples: number): Promise<Uint8Array> {
  const result = await device.transferIn(1, numSamples * 2)
  return new Uint8Array(result.data.buffer)
}

