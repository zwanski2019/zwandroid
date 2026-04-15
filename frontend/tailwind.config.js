export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#040a06',
        surface: '#080f0a',
        border: '#0f1f12',
        muted: '#1a3020',
        dim: '#2a5040',
        text: '#8abf94',
        bright: '#c8e8cc',
        neon: '#00ff88',
        amber: '#ff6b35',
        blue: '#4da6ff',
        red: '#ff3366',
        purple: '#c084fc',
        gold: '#ffd700',
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'],
        display: ['"Orbitron"', 'sans-serif'],
      },
      animation: {
        blink: 'blink 1.2s step-end infinite',
        scan: 'scan 3s linear infinite',
        pulse2: 'pulse2 2s ease-in-out infinite',
        fadein: 'fadein 0.3s ease',
        fillbar: 'fillbar 1.8s ease-out forwards',
      },
      keyframes: {
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        scan: { '0%': { backgroundPosition: '0 0' }, '100%': { backgroundPosition: '0 100px' } },
        pulse2: { '0%,100%': { opacity: 0.6 }, '50%': { opacity: 1 } },
        fadein: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'none' } },
        fillbar: { '0%': { width: '0%' }, '80%': { width: '90%' }, '100%': { width: '100%' } },
      },
    },
  },
}

