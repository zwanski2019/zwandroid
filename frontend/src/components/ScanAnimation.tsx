export function ScanAnimation({ accent = '#00ff88' }: { accent?: string }) {
  return (
    <div
      style={{
        marginBottom: 16,
        padding: '12px 16px',
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: 4,
      }}
      aria-label="scan-animation"
    >
      <span
        style={{
          fontSize: 11,
          color: accent,
          letterSpacing: 2,
          display: 'block',
          marginBottom: 8,
          animation: 'blink 0.8s infinite',
        }}
      >
        ◈ SCANNING...
      </span>
      <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: '100%', animation: 'fillBar 1.6s ease-out forwards', background: accent }} />
      </div>
    </div>
  )
}

