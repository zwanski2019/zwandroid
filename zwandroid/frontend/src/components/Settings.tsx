import { useState } from 'react'
import { useStore } from '../lib/store'

interface Field {
  key: keyof ReturnType<typeof useStore.getState>['settings']
  label: string
  placeholder: string
  hint: string
  hintUrl: string
  secret: boolean
  required: boolean
  color: string
}

const FIELDS: Field[] = [
  {
    key: 'apiBase',
    label: 'BACKEND URL',
    placeholder: 'https://zwandroid.up.railway.app',
    hint: 'Your Railway backend deployment URL',
    hintUrl: 'https://railway.app',
    secret: false,
    required: true,
    color: 'neon',
  },
  {
    key: 'supabaseUrl',
    label: 'SUPABASE URL',
    placeholder: 'https://xxxx.supabase.co',
    hint: 'Project URL from Supabase dashboard -> Settings -> API',
    hintUrl: 'https://supabase.com/dashboard',
    secret: false,
    required: false,
    color: 'neon',
  },
  {
    key: 'supabaseAnonKey',
    label: 'SUPABASE ANON KEY',
    placeholder: 'eyJhbGciOiJIUzI1NiIs...',
    hint: 'anon/public key from Supabase -> Settings -> API',
    hintUrl: 'https://supabase.com/dashboard',
    secret: true,
    required: false,
    color: 'neon',
  },
  {
    key: 'rtlsdrRelayUrl',
    label: 'RTL-SDR RELAY (WebSocket)',
    placeholder: 'wss://zwandroid.up.railway.app/subghz/ws/scan',
    hint: 'WebSocket URL for Sub-GHz scanning via backend relay',
    hintUrl: '',
    secret: false,
    required: false,
    color: 'purple',
  },
  {
    key: 'flipperDbUrl',
    label: 'CUSTOM FLIPPER DB URL',
    placeholder: 'https://your-custom-db.com/api',
    hint: 'Optional - override default Flipper community signal DB',
    hintUrl: 'https://github.com/UberGuidoZ/Flipper-IRDB',
    secret: false,
    required: false,
    color: 'gold',
  },
  {
    key: 'openrouterKey',
    label: 'OPENROUTER API KEY',
    placeholder: 'sk-or-v1-...',
    hint: 'Optional - enables AI payload suggestions (OpenRouter)',
    hintUrl: 'https://openrouter.ai/keys',
    secret: true,
    required: false,
    color: 'blue',
  },
]

const COLOR_MAP: Record<string, string> = {
  neon: 'border-neon/40 focus:border-neon/70 text-neon',
  amber: 'border-amber/40 focus:border-amber/70 text-amber',
  purple: 'border-purple/40 focus:border-purple/70 text-purple',
  gold: 'border-gold/40 focus:border-gold/70 text-gold',
  blue: 'border-blue/40 focus:border-blue/70 text-blue',
}

const EMPTY_SETTINGS = {
  apiBase: '',
  supabaseUrl: '',
  supabaseAnonKey: '',
  openrouterKey: '',
  flipperDbUrl: '',
  rtlsdrRelayUrl: '',
}

export function Settings() {
  const { settings, updateSettings, setSettingsOpen, addLog } = useStore()
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    addLog('Settings saved to local storage', 'success')
    setTimeout(() => {
      setSaved(false)
      setSettingsOpen(false)
    }, 1200)
  }

  function clearAll() {
    updateSettings(EMPTY_SETTINGS)
    addLog('All settings cleared', 'warn')
  }

  const configured = Object.values(settings).filter(Boolean).length
  const total = Object.keys(settings).length

  return (
    <div className="fixed inset-0 z-50 bg-base/95 backdrop-blur-sm overflow-y-auto">
      <div className="sticky top-0 bg-base border-b border-border px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="text-neon text-lg">⚙</span>
          <div>
            <div className="font-display text-sm tracking-widest text-bright">SETTINGS</div>
            <div className="text-[9px] text-dim tracking-wider">
              {configured}/{total} configured
            </div>
          </div>
        </div>
        <button
          onClick={() => setSettingsOpen(false)}
          className="text-dim hover:text-red text-xs tracking-widest transition-colors"
        >
          ✕ CLOSE
        </button>
      </div>

      <div className="px-4 py-6 space-y-6 max-w-lg mx-auto">
        <div className="p-3 border border-neon/20 bg-neon/5 text-[10px] text-neon/80 tracking-wider leading-relaxed">
          ⚡ Keys are stored only in your browser's localStorage. They are never sent to any third party. Each
          service is optional unless marked REQUIRED.
        </div>

        {FIELDS.map((field) => {
          const isRevealed = revealed[field.key]
          const val = settings[field.key] || ''
          const hasValue = Boolean(val)
          const colorClass = COLOR_MAP[field.color] || COLOR_MAP.neon

          return (
            <div key={field.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] tracking-[0.25em] font-bold ${
                      field.color === 'neon'
                        ? 'text-neon'
                        : field.color === 'purple'
                          ? 'text-purple'
                          : field.color === 'gold'
                            ? 'text-gold'
                            : field.color === 'blue'
                              ? 'text-blue'
                              : 'text-text'
                    }`}
                  >
                    {field.label}
                  </span>
                  {field.required ? (
                    <span className="text-[8px] text-red border border-red/30 px-1.5 py-0.5 tracking-wider">
                      REQUIRED
                    </span>
                  ) : (
                    <span className="text-[8px] text-dim border border-border px-1.5 py-0.5 tracking-wider">
                      OPTIONAL
                    </span>
                  )}
                  {hasValue && <span className="text-[8px] text-neon">✓</span>}
                </div>
                {field.hintUrl && (
                  <a
                    href={field.hintUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[8px] text-dim hover:text-neon tracking-wider transition-colors"
                  >
                    GET KEY ↗
                  </a>
                )}
              </div>

              <div className="relative">
                <input
                  type={field.secret && !isRevealed ? 'password' : 'text'}
                  value={val}
                  onChange={(e) => updateSettings({ [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className={`
                    w-full bg-surface border text-text text-xs p-3 pr-16
                    placeholder-dim focus:outline-none font-mono tracking-wide
                    transition-colors
                    ${colorClass}
                  `}
                />
                {field.secret && (
                  <button
                    onClick={() => setRevealed((r) => ({ ...r, [field.key]: !r[field.key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-dim
                               hover:text-text tracking-wider transition-colors"
                  >
                    {isRevealed ? 'HIDE' : 'SHOW'}
                  </button>
                )}
              </div>

              <div className="text-[9px] text-dim tracking-wide">{field.hint}</div>
            </div>
          )
        })}

        <div className="border border-border p-4 space-y-3">
          <div className="text-[10px] text-bright tracking-widest font-display">HOW TO GET YOUR KEYS</div>
          <div className="space-y-2 text-[10px] text-dim leading-relaxed">
            <div>
              <span className="text-neon">1. BACKEND URL</span>
              <br />
              -&gt; Deploy backend to Railway (see README)
              <br />
              -&gt; Copy the generated URL e.g.{' '}
              <span className="text-text font-mono">https://zwandroid-prod.up.railway.app</span>
            </div>
            <div className="h-px bg-border" />
            <div>
              <span className="text-neon">2. SUPABASE</span>
              <br />
              -&gt; Go to <span className="text-text">supabase.com</span> -&gt; Create project
              <br />
              -&gt; Settings -&gt; API -&gt; copy Project URL + anon key
            </div>
            <div className="h-px bg-border" />
            <div>
              <span className="text-purple">3. RTL-SDR RELAY</span>
              <br />
              -&gt; Same as Backend URL but with <span className="text-text font-mono">/subghz/ws/scan</span>
              <br />
              -&gt; Uses <span className="text-text">wss://</span> not <span className="text-text">https://</span>
            </div>
            <div className="h-px bg-border" />
            <div>
              <span className="text-blue">4. OPENROUTER</span>
              <br />
              -&gt; Go to <span className="text-text">openrouter.ai</span> -&gt; Sign up -&gt; Keys -&gt; Create key
              <br />
              -&gt; Used for AI payload generation (optional)
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            className={`flex-1 py-3 border text-xs tracking-[0.3em] transition-all ${
              saved ? 'border-neon text-neon bg-neon/10' : 'border-neon/30 text-neon bg-neon/5 hover:bg-neon/10'
            }`}
          >
            {saved ? '✓ SAVED' : 'SAVE SETTINGS'}
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-3 border border-red/20 text-red/50 hover:text-red
                       hover:border-red/40 text-xs tracking-wider transition-all"
          >
            CLEAR ALL
          </button>
        </div>

        <div className="text-[9px] text-dim text-center tracking-wider pb-4">
          SETTINGS STORED IN BROWSER LOCALSTORAGE · NEVER TRANSMITTED
        </div>
      </div>
    </div>
  )
}
