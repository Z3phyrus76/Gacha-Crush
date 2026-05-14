import { useState } from "react";

// Fixed colors assigned to each window position — these never change
const WINDOW_COLORS = [
  { top: "#E8B4B8", bottom: "#C0717A" }, // pink
  { top: "#6BAED6", bottom: "#2E6FA3" }, // blue
  { top: "#74C69D", bottom: "#2D9B5A" }, // green
  { top: "#FFA552", bottom: "#E07020" }, // orange
  { top: "#B5A0D8", bottom: "#7B5EA7" }, // purple
  { top: "#F7C59F", bottom: "#E09050" }, // peach
  { top: "#E8B4B8", bottom: "#C0717A" }, // pink
  { top: "#6BAED6", bottom: "#2E6FA3" }, // blue
  { top: "#74C69D", bottom: "#2D9B5A" }, // green
  { top: "#F6D365", bottom: "#FDA085" }, // gold (rare)
];

const MESSAGES = [
  "Okay fine. I like you. Like, a lot. 😶",
  "I replay our conversations more than I'd ever admit. 🌙",
  "You're really hard not to fall for, just so you know. 🍂",
  "I find reasons to think about you constantly. It's a problem. 💛",
  "I smile before I even finish reading your messages. 🌸",
  "Somehow you became my favorite person without even trying. 🫶",
  "I wish I was brave enough to just tell you this in person. 💌",
  "Every time I see you I forget everything I planned to say. 🫀",
  "You make my heart do something really inconvenient. 🦋",
  "RARE DROP: I think I'm falling for you. 💗",
];

// Capsule positions in the window
const CAPSULE_POS = [
  { cx: 48,  cy: 58, rxT: 20, ryT: 24, rxB: 20, ryB: 15 },
  { cx: 96,  cy: 55, rxT: 21, ryT: 25, rxB: 21, ryB: 16 },
  { cx: 146, cy: 57, rxT: 20, ryT: 24, rxB: 20, ryB: 15 },
  { cx: 194, cy: 55, rxT: 19, ryT: 23, rxB: 19, ryB: 14 },
  { cx: 240, cy: 58, rxT: 18, ryT: 22, rxB: 18, ryB: 14 },
  { cx: 56,  cy: 86, rxT: 22, ryT: 17, rxB: 22, ryB: 12 },
  { cx: 106, cy: 84, rxT: 21, ryT: 16, rxB: 21, ryB: 11 },
  { cx: 154, cy: 86, rxT: 20, ryT: 15, rxB: 20, ryB: 10 },
  { cx: 200, cy: 84, rxT: 19, ryT: 15, rxB: 19, ryB: 10 },
  { cx: 244, cy: 86, rxT: 18, ryT: 14, rxB: 18, ryB: 9  },
];

const TOTAL = MESSAGES.length;

// Shuffle just the order of pulls (indices 0-9), not the colors
function shuffleIndices() {
  const a = [...Array(TOTAL).keys()];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GachaMessage() {
  // pullOrder[0] = which window position gets pulled first, etc.
  const [pullOrder] = useState(() => shuffleIndices());
  const [pulled,  setPulled]  = useState(0); // how many pulled so far
  const [step,    setStep]    = useState("ready");
  const [angle,   setAngle]   = useState(0);
  const [current, setCurrent] = useState(null); // { color, msg, rare }
  const [inTray,  setInTray]  = useState(false);
  const [opened,  setOpened]  = useState(false);

  const remaining = TOTAL - pulled;

  const onTurn = () => {
    if (step !== "ready" || remaining === 0) return;
    // The next capsule to pull is pullOrder[pulled]
    const winIdx = pullOrder[pulled];
    const color = WINDOW_COLORS[winIdx];
    const msg   = MESSAGES[winIdx];
    const rare  = winIdx === 9;
    setCurrent({ color, msg, rare, winIdx });
    setStep("turning");
    setAngle(a => a + 360);
    setTimeout(() => { setInTray(true); setStep("dropped"); }, 820);
  };

  const onCapsule = () => {
    if (step !== "dropped") return;
    setOpened(true);
    setTimeout(() => { setPulled(p => p + 1); setStep("revealed"); }, 380);
  };

  const onNext = () => {
    setInTray(false); setOpened(false); setCurrent(null);
    setStep(remaining - 1 === 0 ? "empty" : "ready");
  };

  const col = current?.color || WINDOW_COLORS[0];

  // Which window positions are still visible (haven't been pulled yet)
  const pulledIndices = new Set(pullOrder.slice(0, pulled));

  return (
    <div style={{
      minHeight: "100vh",
      background: "#D8D4CF",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Georgia', serif",
      padding: "12px",
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 9, letterSpacing: 5, color: "#B03020", textTransform: "uppercase", marginBottom: 2 }}>
          GACHA MESSAGE
        </div>
        <h1 style={{ fontSize: 27, fontWeight: "900", color: "#111", margin: "0 0 2px" }}>
          Secret message
        </h1>
        <div style={{ fontSize: 11, color: "#888" }}>
          {remaining > 0 ? `${remaining} remaining` : "All collected!"}
        </div>
      </div>

      {/* Hint */}
      <div style={{ fontSize: 11, color: "#777", marginBottom: 4, minHeight: 17, fontStyle: "italic" }}>
        {step === "ready"   && remaining > 0 && "Click the handle to turn!"}
        {step === "turning" && "Turning…"}
        {step === "dropped" && "Click the capsule to open!"}
      </div>

      {/* ══════════ MACHINE ══════════ */}
      <svg width="300" height="380" viewBox="0 0 300 380"
        style={{ filter: "drop-shadow(0 10px 28px rgba(0,0,0,0.22))", overflow: "visible" }}>

        {/* Red top cap */}
        <rect x="10" y="4"  width="280" height="26" rx="13" fill="#CC3322"/>
        <rect x="10" y="16" width="280" height="14"          fill="#CC3322"/>

        {/* White dome */}
        <rect x="10" y="12" width="280" height="130" rx="12" fill="#F8F6F2" stroke="#E0D8CC" strokeWidth="2"/>
        {/* Glass window */}
        <rect x="20" y="20" width="260" height="115" rx="8" fill="#EDE8E0" stroke="#D0C8BC" strokeWidth="1.5"/>



        {/* ── CAPSULES — each has a fixed color matching WINDOW_COLORS[i] ── */}
        {CAPSULE_POS.map((p, i) => {
          const c = WINDOW_COLORS[i];
          const visible = !pulledIndices.has(i);
          // also hide the one currently being pulled (current.winIdx) once tray shows
          const hideCurrent = inTray && current && current.winIdx === i;
          return (
            <g key={i} style={{
              opacity: visible && !hideCurrent ? 1 : 0,
              transition: "opacity 0.45s ease",
              pointerEvents: "none",
            }}>
              <ellipse cx={p.cx} cy={p.cy}                  rx={p.rxT} ry={p.ryT} fill={c.top}/>
              <ellipse cx={p.cx} cy={p.cy + p.ryT * 0.55}  rx={p.rxB} ry={p.ryB} fill={c.bottom}/>
              <rect    x={p.cx - p.rxT} y={p.cy - 2}        width={p.rxT * 2} height={3} fill="rgba(0,0,0,0.09)"/>
              <ellipse cx={p.cx - p.rxT * 0.28} cy={p.cy - p.ryT * 0.4}
                rx={p.rxT * 0.28} ry={p.ryT * 0.18}
                fill="rgba(255,255,255,0.44)"
                transform={`rotate(-18,${p.cx - p.rxT * 0.28},${p.cy - p.ryT * 0.4})`}/>
            </g>
          );
        })}

        {/* window top glare */}
        <rect x="20" y="20" width="260" height="14" rx="8" fill="rgba(255,255,255,0.48)"/>

        {/* ── LOWER BODY ── */}
        <rect x="10" y="134" width="280" height="210" rx="12" fill="#F8F6F2" stroke="#E0D8CC" strokeWidth="2"/>
        <rect x="10" y="318" width="280" height="24" rx="10" fill="#CC3322"/>

        {/* Labels */}
        <rect x="18" y="143" width="66" height="28" rx="6" fill="#FFF" stroke="#DDD" strokeWidth="1.5"/>
        <text x="51" y="154" textAnchor="middle" fontSize="6.5" fill="#bbb" fontFamily="sans-serif">各</text>
        <text x="51" y="166" textAnchor="middle" fontSize="13" fontWeight="900" fill="#CC3322" fontFamily="sans-serif">200円</text>

        <rect x="90" y="143" width="52" height="28" rx="6" fill="#D63384"/>
        <text x="116" y="154" textAnchor="middle" fontSize="7" fill="#FFF" fontFamily="sans-serif">100円玉</text>
        <text x="116" y="165" textAnchor="middle" fontSize="7" fill="#FFF" fontFamily="sans-serif">専用</text>

        <rect x="148" y="143" width="78" height="20" rx="5" fill="#FFF" stroke="#DDD" strokeWidth="1"/>
        <text x="187" y="157" textAnchor="middle" fontSize="8" fill="#444" fontFamily="sans-serif">コイン投入口▼</text>

        <rect x="234" y="143" width="52" height="36" rx="7" fill="#3498DB"/>
        <text x="260" y="156" textAnchor="middle" fontSize="6.5" fill="#FFF" fontFamily="sans-serif">コイン返却</text>
        <text x="260" y="167" textAnchor="middle" fontSize="6.5" fill="#FFF" fontFamily="sans-serif">ボタン</text>
        <circle cx="260" cy="175" r="5" fill="#2471A3"/>

        <rect x="18" y="178" width="112" height="32" rx="6" fill="#FFF" stroke="#EEE" strokeWidth="1"/>
        <text x="26" y="191" fontSize="7.5" fill="#555" fontFamily="sans-serif">▶ ハンドルをゆっくり</text>
        <text x="26" y="204" fontSize="7.5" fill="#555" fontFamily="sans-serif">　1回まわしてください。</text>

        {/* ── HANDLE DIAL ── */}
        <g onClick={onTurn} style={{ cursor: step === "ready" && remaining > 0 ? "pointer" : "default" }}>
          {step === "ready" && remaining > 0 && (
            <circle cx="144" cy="248" r="56" fill="none" stroke="#3498DB" strokeWidth="2" opacity="0.3">
              <animate attributeName="r" values="50;62;50" dur="1.3s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.35;0;0.35" dur="1.3s" repeatCount="indefinite"/>
            </circle>
          )}
          <circle cx="144" cy="248" r="50" fill="#FFF"
            stroke={step === "ready" && remaining > 0 ? "#2980B9" : "#CCC"} strokeWidth="4"/>
          <circle cx="144" cy="248" r="45"
            fill={step === "ready" && remaining > 0 ? "#D6EAF8" : "#F0F0F0"}
            stroke={step === "ready" && remaining > 0 ? "#AED6F1" : "#DDD"} strokeWidth="1.5"/>
          {[...Array(10)].map((_, i) => {
            const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
            return <circle key={i}
              cx={144 + Math.cos(a) * 39} cy={248 + Math.sin(a) * 39}
              r="2.5" fill={step === "ready" && remaining > 0 ? "#E6AC00" : "#CCC"}/>;
          })}
          <circle cx="144" cy="248" r="32" fill="#FFF" stroke="#E8E0D8" strokeWidth="1.5"/>
          <line x1="112" y1="248" x2="176" y2="248" stroke="#EDE8E0" strokeWidth="2.5"/>
          <line x1="144" y1="216" x2="144" y2="280" stroke="#EDE8E0" strokeWidth="2.5"/>
          <line x1="121" y1="225" x2="167" y2="271" stroke="#EDE8E0" strokeWidth="1.5"/>
          <line x1="167" y1="225" x2="121" y2="271" stroke="#EDE8E0" strokeWidth="1.5"/>
          <g style={{
            transformOrigin: "144px 248px",
            transform: `rotate(${angle}deg)`,
            transition: "transform 0.78s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <line x1="144" y1="248" x2="144" y2="210"
              stroke={step === "ready" && remaining > 0 ? "#2471A3" : "#BBB"}
              strokeWidth="4.5" strokeLinecap="round"/>
            <circle cx="144" cy="207" r="12"
              fill={step === "ready" && remaining > 0 ? "#E74C3C" : "#BBB"}
              stroke={step === "ready" && remaining > 0 ? "#C0392B" : "#999"} strokeWidth="2"/>
            <circle cx="144" cy="207" r="6.5"
              fill={step === "ready" && remaining > 0 ? "#C0392B" : "#999"}/>
          </g>
        </g>

        <circle cx="236" cy="248" r="14" fill="#FFF" stroke="#D8D0C4" strokeWidth="1.5"/>
        <circle cx="236" cy="248" r="8"  fill="#EDE8E0" stroke="#CCC" strokeWidth="1"/>

        {/* ── TRAY ── */}
        <rect x="192" y="200" width="96" height="112" rx="9" fill="#D0C8BC" stroke="#B8B0A4" strokeWidth="2"/>
        <rect x="200" y="234" width="80" height="72"  rx="6" fill="#C0B8AC"/>
        <rect x="210" y="200" width="60" height="16" rx="5" fill="#B0A89C"/>
        <rect x="216" y="206" width="48" height="8"  rx="3" fill="#A09890"/>

        {/* ── CAPSULE IN TRAY — same color as the one removed from window ── */}
        {inTray && (
          <g onClick={onCapsule} style={{ cursor: step === "dropped" ? "pointer" : "default" }}>
            <ellipse cx="240" cy="256" rx="28" ry="32"
              fill={opened ? "rgba(200,198,195,0.4)" : col.top}
              style={{ transition: "fill 0.35s" }}/>
            <ellipse cx="240" cy="278" rx="28" ry="20"
              fill={opened ? "rgba(200,198,195,0.4)" : col.bottom}
              style={{ transition: "fill 0.35s" }}/>
            <rect x="212" y="254" width="56" height="4" fill="rgba(0,0,0,0.09)"/>
            <ellipse cx="228" cy="243" rx="9" ry="6" fill="rgba(255,255,255,0.52)"
              transform="rotate(-20,228,243)"/>
            {step === "dropped" && !opened && (
              <ellipse cx="240" cy="265" rx="30" ry="34" fill="none" stroke="#FFF" strokeWidth="2.5" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.1;0.8" dur="0.9s" repeatCount="indefinite"/>
              </ellipse>
            )}
          </g>
        )}

        {/* 対象年齢 */}
        <rect x="18" y="270" width="54" height="30" rx="6" fill="#2980B9"/>
        <text x="45" y="283" textAnchor="middle" fontSize="7.5" fill="#FFF" fontFamily="sans-serif">対象年齢</text>
        <text x="45" y="294" textAnchor="middle" fontSize="7.5" fill="#FFF" fontFamily="sans-serif">6才以上</text>

        {/* Feet */}
        <rect x="28" y="340" width="38" height="16" rx="7" fill="#A02820"/>
        <rect x="234" y="340" width="38" height="16" rx="7" fill="#A02820"/>
      </svg>

      {/* MESSAGE CARD */}
      {step === "revealed" && current && (
        <div style={{
          marginTop: 10, background: "#FFF", borderRadius: 18,
          padding: "18px 24px", maxWidth: 290, width: "90%",
          textAlign: "center",
          boxShadow: "0 8px 30px rgba(0,0,0,0.14)",
          border: `2.5px solid ${col.top}`,
          animation: "popIn 0.42s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          {current.rare && (
            <div style={{
              background: "linear-gradient(135deg,#F6D365,#FDA085)",
              color: "#FFF", fontSize: 10, fontWeight: "bold",
              letterSpacing: 2, padding: "3px 12px", borderRadius: 20,
              display: "inline-block", marginBottom: 8,
            }}>★ RARE DROP ★</div>
          )}
          <p style={{ fontSize: 16, color: "#111", lineHeight: 1.72, fontStyle: "italic", margin: "0 0 14px" }}>
            "{current.msg}"
          </p>
          {remaining - 1 > 0
            ? <button onClick={onNext} style={btn(col.bottom)}>🎰 Pull again ({remaining - 1} left)</button>
            : <button onClick={onNext} style={btn("#888")}>Last one! 🎉</button>
          }
        </div>
      )}

      {step === "empty" && (
        <div style={{
          marginTop: 10, background: "#FFF", borderRadius: 18,
          padding: "18px 24px", maxWidth: 290, width: "90%",
          textAlign: "center", boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          border: "2px solid #FDCB6E",
          animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          <div style={{ fontSize: 30, marginBottom: 6 }}>🎊</div>
          <p style={{ fontSize: 15, color: "#333", margin: "0 0 4px" }}>All {TOTAL} messages collected!</p>
          <p style={{ fontSize: 12, color: "#aaa", fontStyle: "italic" }}>Hope at least one made you smile 🌸</p>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.65) translateY(6px); opacity: 0; }
          to   { transform: scale(1)    translateY(0);   opacity: 1; }
        }
        button:hover  { opacity: 0.84; transform: translateY(-2px); }
        button:active { transform: translateY(1px); }
      `}</style>
    </div>
  );
}

function btn(color) {
  return {
    background: color, color: "#FFF", border: "none",
    borderRadius: 50, padding: "10px 24px", fontSize: 13,
    fontWeight: "bold", cursor: "pointer", letterSpacing: 0.4,
    boxShadow: `0 4px 14px ${color}55`,
    transition: "all 0.15s ease", fontFamily: "Georgia, serif",
  };
}
