export function useHID() {
  return {
    supported: typeof navigator !== 'undefined' && 'usb' in navigator,
  }
}

