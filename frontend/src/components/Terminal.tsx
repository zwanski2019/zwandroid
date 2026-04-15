import { useStore } from '../lib/store'

const LEVEL_COLOR: Record<string, string> = {
  info: 'text-text',
  success: 'text-neon',
  error: 'text-red',
  warn: 'text-amber',
}

export function Terminal() {
  const { log, clearLog } = useStore()

  return (
    <div className="border-t border-border bg-base px-4 py-2 h-28 overflow-hidden relative z-10">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] text-dim tracking-[0.4em]">TERMINAL</span>
        <button onClick={clearLog} className="text-[9px] text-dim hover:text-amber transition-colors tracking-widest">
          CLEAR
        </button>
      </div>
      <div className="overflow-y-auto h-16 space-y-0.5">
        {log.length === 0 ? (
          <div className="text-[11px] text-dim animate-blink">_ ready</div>
        ) : (
          log.map((entry, i) => (
            <div
              key={entry.id}
              className={`text-[10px] leading-relaxed tracking-wide ${LEVEL_COLOR[entry.level]}`}
              style={{ opacity: Math.max(0.3, 1 - i * 0.08) }}
            >
              <span className="text-dim mr-2">[{entry.ts}]</span>
              {entry.msg}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

