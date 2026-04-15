import { useState, useEffect } from "react";

const modules = [
  {
    id: "nfc",
    label: "NFC",
    icon: "◈",
    color: "#00ff88",
    desc: "Read / Write / Clone",
    status: "READY",
    actions: ["Scan Tag", "Write Tag", "Clone Tag", "Save to DB"],
  },
  {
    id: "ir",
    label: "IR BLASTER",
    icon: "⊛",
    color: "#ff6b35",
    desc: "Universal Remote",
    status: "READY",
    actions: ["Send Code", "Learn Code", "Browse Library", "Brute Force"],
  },
  {
    id: "bluetooth",
    label: "BLUETOOTH",
    icon: "⌬",
    color: "#4da6ff",
    desc: "BLE Scanner / Spoof",
    status: "READY",
    actions: ["Scan Devices", "Spoof Device", "BLE Spam", "Sniff Packets"],
  },
  {
    id: "badusb",
    label: "BAD USB",
    icon: "▣",
    color: "#ff3366",
    desc: "HID Payload Injector",
    status: "USB OTG",
    actions: ["Run Payload", "Edit Script", "Import DuckyScript", "Keystroke Inject"],
  },
  {
    id: "subghz",
    label: "SUB-GHZ",
    icon: "≋",
    color: "#c084fc",
    desc: "RTL-SDR Required",
    status: "DONGLE",
    actions: ["Scan Frequencies", "Replay Signal", "Brute 433MHz", "Save Signal"],
  },
  {
    id: "signaldb",
    label: "SIGNAL DB",
    icon: "⊞",
    color: "#ffd700",
    desc: "IR / RF / NFC Library",
    status: "12.4K",
    actions: ["Browse IR Codes", "Browse RF Signals", "Import Flipper File", "Community DB"],
  },
];

const glitch = (text) => (
  <span className="glitch" data-text={text}>
    {text}
  </span>
);

export default function ZwanDroid() {
  const [active, setActive] = useState(null);
  const [log, setLog] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const now = new Date();
  const timeStr = now.toTimeString().slice(0, 8);

  function addLog(msg) {
    setLog((l) => [`[${timeStr}] ${msg}`, ...l.slice(0, 8)]);
  }

  function runAction(action) {
    setScanning(true);
    addLog(`> ${action}...`);
    setTimeout(() => {
      setScanning(false);
      addLog(`✓ ${action} complete`);
    }, 1800);
  }

  const mod = modules.find((m) => m.id === active);

  return (
    <div style={styles.root}>
      {/* Scanline overlay */}
      <div style={styles.scanlines} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={{ color: "#00ff88", fontFamily: "monospace", fontSize: 22, letterSpacing: 4 }}>
            ZWAN
          </span>
          <span style={{ color: "#ff6b35", fontFamily: "monospace", fontSize: 22, letterSpacing: 4 }}>
            DROID
          </span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.pill}>● LIVE</span>
          <span style={styles.clock}>{timeStr}</span>
        </div>
      </div>

      {/* Status bar */}
      <div style={styles.statusBar}>
        {["NFC:ON", "BT:ON", "USB:OTG", "SDR:—", "SIG:12.4K"].map((s) => (
          <span key={s} style={styles.statusChip}>
            {s}
          </span>
        ))}
      </div>

      {/* Main grid */}
      {!active ? (
        <div style={styles.grid}>
          {modules.map((m) => (
            <button
              key={m.id}
              style={{ ...styles.card, "--accent": m.color }}
              onClick={() => { setActive(m.id); addLog(`Module loaded: ${m.label}`); }}
            >
              <span style={{ ...styles.cardIcon, color: m.color }}>{m.icon}</span>
              <span style={styles.cardLabel}>{m.label}</span>
              <span style={styles.cardDesc}>{m.desc}</span>
              <span style={{ ...styles.cardStatus, color: m.color }}>{m.status}</span>
              <div style={{ ...styles.cardGlow, background: m.color }} />
            </button>
          ))}
        </div>
      ) : (
        /* Module view */
        <div style={styles.moduleView}>
          <button style={styles.backBtn} onClick={() => setActive(null)}>
            ← BACK
          </button>
          <div style={{ ...styles.moduleHeader, color: mod.color }}>
            <span style={{ fontSize: 36 }}>{mod.icon}</span>
            <div>
              <div style={styles.moduleName}>{mod.label}</div>
              <div style={styles.moduleDesc}>{mod.desc}</div>
            </div>
          </div>

          {scanning && (
            <div style={styles.scanningBar}>
              <span style={styles.scanningText}>◈ SCANNING...</span>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressFill, background: mod.color }} />
              </div>
            </div>
          )}

          <div style={styles.actions}>
            {mod.actions.map((a) => (
              <button
                key={a}
                style={{ ...styles.actionBtn, "--accent": mod.color }}
                onClick={() => runAction(a)}
                disabled={scanning}
              >
                <span style={{ color: mod.color, marginRight: 8 }}>▶</span>
                {a}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Terminal log */}
      <div style={styles.terminal}>
        <div style={styles.terminalHeader}>TERMINAL</div>
        {log.length === 0 ? (
          <div style={styles.termLine}>_ select a module to begin</div>
        ) : (
          log.map((l, i) => (
            <div key={i} style={{ ...styles.termLine, opacity: 1 - i * 0.1 }}>
              {l}
            </div>
          ))
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .glitch { position: relative; }
        button:hover [style*="cardGlow"] { opacity: 0.15 !important; }
        @keyframes scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fillBar {
          0% { width: 0% }
          80% { width: 95% }
          100% { width: 100% }
        }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#080c10",
    color: "#c8d8c8",
    fontFamily: "'Share Tech Mono', monospace",
    position: "relative",
    overflow: "hidden",
    padding: "0 0 20px",
  },
  scanlines: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.015) 2px, rgba(0,255,136,0.015) 4px)",
    pointerEvents: "none",
    zIndex: 9999,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px 10px",
    borderBottom: "1px solid #1a2a1a",
  },
  logo: {
    fontFamily: "'Orbitron', sans-serif",
    letterSpacing: 6,
  },
  headerRight: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  pill: {
    background: "#0a1a0a",
    border: "1px solid #00ff88",
    color: "#00ff88",
    fontSize: 10,
    padding: "2px 8px",
    borderRadius: 2,
    animation: "blink 2s infinite",
  },
  clock: {
    color: "#4a7a4a",
    fontSize: 12,
    letterSpacing: 2,
  },
  statusBar: {
    display: "flex",
    gap: 8,
    padding: "8px 20px",
    borderBottom: "1px solid #0d1a0d",
    flexWrap: "wrap",
  },
  statusChip: {
    fontSize: 10,
    color: "#4a7a4a",
    background: "#0a140a",
    padding: "2px 6px",
    border: "1px solid #1a2a1a",
    letterSpacing: 1,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
    padding: "16px 16px 0",
  },
  card: {
    background: "#0a0f0a",
    border: "1px solid #1a2a1a",
    borderRadius: 4,
    padding: "16px 14px",
    cursor: "pointer",
    textAlign: "left",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    transition: "border-color 0.2s",
  },
  cardIcon: {
    fontSize: 28,
    lineHeight: 1,
  },
  cardLabel: {
    fontSize: 13,
    fontFamily: "'Orbitron', sans-serif",
    letterSpacing: 1,
    color: "#e0e8e0",
    marginTop: 4,
  },
  cardDesc: {
    fontSize: 10,
    color: "#4a6a4a",
    letterSpacing: 1,
  },
  cardStatus: {
    fontSize: 9,
    marginTop: 6,
    letterSpacing: 2,
    fontWeight: "bold",
  },
  cardGlow: {
    position: "absolute",
    top: 0, right: 0,
    width: 60, height: 60,
    borderRadius: "50%",
    opacity: 0.05,
    filter: "blur(20px)",
    transition: "opacity 0.2s",
  },
  moduleView: {
    padding: "16px",
  },
  backBtn: {
    background: "transparent",
    border: "1px solid #1a2a1a",
    color: "#4a7a4a",
    fontSize: 11,
    padding: "6px 12px",
    cursor: "pointer",
    letterSpacing: 2,
    marginBottom: 16,
  },
  moduleHeader: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    marginBottom: 20,
    padding: "16px",
    background: "#0a0f0a",
    border: "1px solid #1a2a1a",
    borderRadius: 4,
  },
  moduleName: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 20,
    letterSpacing: 3,
  },
  moduleDesc: {
    fontSize: 11,
    color: "#4a6a4a",
    letterSpacing: 1,
    marginTop: 4,
  },
  scanningBar: {
    marginBottom: 16,
    padding: "12px 16px",
    background: "#0a0f0a",
    border: "1px solid #1a2a1a",
    borderRadius: 4,
  },
  scanningText: {
    fontSize: 11,
    color: "#00ff88",
    letterSpacing: 2,
    display: "block",
    marginBottom: 8,
    animation: "blink 0.8s infinite",
  },
  progressTrack: {
    height: 3,
    background: "#1a2a1a",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "100%",
    animation: "fillBar 1.8s ease-out forwards",
    borderRadius: 2,
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  actionBtn: {
    background: "#0a0f0a",
    border: "1px solid #1a2a1a",
    color: "#c8d8c8",
    fontSize: 12,
    padding: "12px 16px",
    cursor: "pointer",
    textAlign: "left",
    letterSpacing: 1,
    borderRadius: 2,
    transition: "background 0.15s, border-color 0.15s",
  },
  terminal: {
    margin: "16px 16px 0",
    background: "#060c06",
    border: "1px solid #0d1a0d",
    borderRadius: 4,
    padding: "10px 12px",
    maxHeight: 140,
    overflow: "hidden",
  },
  terminalHeader: {
    fontSize: 9,
    color: "#2a4a2a",
    letterSpacing: 3,
    marginBottom: 8,
    borderBottom: "1px solid #0d1a0d",
    paddingBottom: 6,
  },
  termLine: {
    fontSize: 11,
    color: "#4a8a4a",
    lineHeight: 1.8,
    letterSpacing: 0.5,
  },
};
