export interface DuckyCommand {
  type: 'KEY' | 'STRING' | 'DELAY' | 'HOLD' | 'REM'
  value: string
  delay?: number
}

const MODIFIER_KEYS: Record<string, string> = {
  GUI: 'Meta',
  ALT: 'Alt',
  SHIFT: 'Shift',
  CTRL: 'Control',
  ENTER: 'Enter',
  SPACE: ' ',
  TAB: 'Tab',
  ESC: 'Escape',
  DELETE: 'Delete',
  BACKSPACE: 'Backspace',
  HOME: 'Home',
  END: 'End',
  PAGEUP: 'PageUp',
  PAGEDOWN: 'PageDown',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
}

export function parseDuckyScript(script: string): DuckyCommand[] {
  const commands: DuckyCommand[] = []
  const lines = script
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  for (const line of lines) {
    if (line.startsWith('REM')) {
      commands.push({ type: 'REM', value: line.slice(4) })
    } else if (line.startsWith('DELAY')) {
      commands.push({ type: 'DELAY', value: '', delay: parseInt(line.split(' ')[1]) })
    } else if (line.startsWith('STRING')) {
      commands.push({ type: 'STRING', value: line.slice(7) })
    } else {
      const parts = line.split(' ')
      const keys = parts.map((p) => MODIFIER_KEYS[p] || p).join('+')
      commands.push({ type: 'KEY', value: keys })
    }
  }
  return commands
}

export async function executePayload(commands: DuckyCommand[], onLog: (msg: string) => void) {
  for (const cmd of commands) {
    if (cmd.type === 'DELAY') {
      await new Promise((r) => setTimeout(r, cmd.delay || 0))
    } else if (cmd.type === 'REM') {
      onLog(`# ${cmd.value}`)
    } else if (cmd.type === 'STRING') {
      onLog(`TYPE: ${cmd.value}`)
    } else if (cmd.type === 'KEY') {
      onLog(`KEY: ${cmd.value}`)
    }
  }
}

