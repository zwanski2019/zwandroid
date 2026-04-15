import type { PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'

export function ModuleShell(
  props: PropsWithChildren<{ title: string; subtitle?: string; icon?: string; accent?: string }>,
) {
  const navigate = useNavigate()
  const accent = props.accent ?? '#00ff88'

  return (
    <div style={{ padding: 16 }}>
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'transparent',
          border: '1px solid var(--border)',
          color: 'var(--muted)',
          fontSize: 11,
          padding: '6px 12px',
          cursor: 'pointer',
          letterSpacing: 2,
          marginBottom: 16,
        }}
      >
        ← BACK
      </button>

      <div
        style={{
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          marginBottom: 20,
          padding: 16,
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          borderRadius: 4,
          color: accent,
        }}
      >
        <span style={{ fontSize: 36, lineHeight: 1 }}>{props.icon ?? '◈'}</span>
        <div>
          <div className="mono-title" style={{ fontSize: 20, letterSpacing: 3 }}>
            {props.title}
          </div>
          {props.subtitle ? (
            <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1, marginTop: 4 }}>{props.subtitle}</div>
          ) : null}
        </div>
      </div>

      {props.children}
    </div>
  )
}

