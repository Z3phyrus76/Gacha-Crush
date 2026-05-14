import { useState, useEffect } from "react";

const MESSAGES = [
  "You make every room brighter just by walking in. 🌟",
  "I think about our conversations more than I should. 💭",
  "You're kind of my favorite person. Don't tell anyone. 🤫",
  "Honestly? You're really cool and I hope you know it. 🎸",
  "I get nervous around you. In the best way. 🦋",
  "You have really good taste. In everything. Including friends. 😌",
  "I saved that thing you said. I still think about it. 💌",
  "You're the rare kind of person who actually listens. 🌸",
  "Every time I see you, I forget what I was going to say. 🫀",
  "RARE DROP: You are genuinely one of a kind. ✨",
];

const CAPSULE_COLORS = [
  { top: "#FF6B9D", bottom: "#C44569" },
  { top: "#A8E6CF", bottom: "#3D9970" },
  { top: "#FFD3A5", bottom: "#FD9644" },
  { top: "#A29BFE", bottom: "#6C5CE7" },
  { top: "#81ECEC", bottom: "#00CEC9" },
  { top: "#FDCB6E", bottom: "#E17055" },
];

const RARE_CHANCE = 0.15;

function CapsuleSVG({ colors, scale = 1, wobble = false }) {
  return (
    <svg
      width={80 * scale}
      height={110 * scale}
      viewBox="0 0 80 110"
      style={{
        filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
        animation: wobble ? "wobble 0.5s ease-in-out" : "none",
      }}
    >
      {/* Top half */}
      <ellipse cx="40" cy="40" rx="38" ry="40" fill={colors.top} />
      <ellipse cx="40" cy="70" rx="38" ry="40" fill={colors.bottom} />
      {/* Seam */}
      <rect x="2" y="38" width="76" height="4" fill="rgba(0,0,0,0.15)" />
      {/* Shine */}
      <ellipse cx="28" cy="22" rx="10" ry="7" fill="rgba(255,255,255,0.35)" transform="rotate(-20,28,22)" />
    </svg>
  );
}

function MachineSVG({ isEjecting, hasCoin }) {
  return (
    <svg width="260" height="320" viewBox="0 0 260 320" style={{ filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.15))" }}>
      {/* Body */}
      <rect x="20" y="80" width="220" height="200" rx="16" fill="#F5F0E8" stroke="#D4C5A9" strokeWidth="2" />
      {/* Top dome */}
      <rect x="30" y="10" width="200" height="90" rx="14" fill="#FAFAFA" stroke="#D4C5A9" strokeWidth="2" />
      {/* Red top stripe */}
      <rect x="20" y="10" width="220" height="18" rx="10" fill="#E74C3C" />
      <rect x="20" y="20" width="220" height="8" fill="#E74C3C" />
      {/* Red bottom stripe */}
      <rect x="20" y="260" width="220" height="20" rx="8" fill="#E74C3C" />
      {/* Capsule display window */}
      <rect x="40" y="25" width="180" height="62" rx="8" fill="#E8F4FD" stroke="#BFD7EA" strokeWidth="1.5" />
      {/* Capsules inside window - decorative */}
      <ellipse cx="75" cy="56" rx="22" ry="26" fill="#FF6B9D" opacity="0.9" />
      <ellipse cx="75" cy="68" rx="22" ry="16" fill="#C44569" opacity="0.9" />
      <ellipse cx="118" cy="52" rx="20" ry="23" fill="#A29BFE" opacity="0.9" />
      <ellipse cx="118" cy="64" rx="20" ry="14" fill="#6C5CE7" opacity="0.9" />
      <ellipse cx="158" cy="56" rx="18" ry="22" fill="#FDCB6E" opacity="0.9" />
      <ellipse cx="158" cy="67" rx="18" ry="13" fill="#E17055" opacity="0.9" />
      {/* Price tag */}
      <rect x="38" y="96" width="68" height="26" rx="6" fill="#FFF" stroke="#D4C5A9" strokeWidth="1" />
      <text x="72" y="108" textAnchor="middle" fontSize="8" fill="#999" fontFamily="serif">各</text>
      <text x="72" y="118" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#E74C3C" fontFamily="sans-serif">¥200</text>
      {/* Coin slot label */}
      <rect x="116" y="96" width="80" height="18" rx="5" fill="#3498DB" />
      <text x="156" y="109" textAnchor="middle" fontSize="8" fill="#FFF" fontFamily="sans-serif">コイン投入口 ▼</text>
      {/* Coin slot */}
      <rect x="148" y="117" width="28" height="6" rx="3" fill="#2C3E50" />
      {/* Coin flash */}
      {hasCoin && (
        <ellipse cx="162" cy="120" rx="10" ry="4" fill="#F1C40F" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.2;0.9" dur="0.3s" repeatCount="3" />
        </ellipse>
      )}
      {/* Turn handle label */}
      <text x="46" y="158" fontSize="7" fill="#666" fontFamily="sans-serif">▶ ハンドルをゆっくり</text>
      <text x="46" y="168" fontSize="7" fill="#666" fontFamily="sans-serif">　1回まわしてください。</text>
      {/* Main dial/handle area */}
      <circle cx="155" cy="175" r="42" fill="#FFF" stroke="#D4C5A9" strokeWidth="2" />
      <circle cx="155" cy="175" r="38" fill="#3498DB" opacity="0.15" />
      <circle cx="155" cy="175" r="34" fill="#FFF" stroke="#BFD7EA" strokeWidth="1.5" />
      {/* Handle knob */}
      <circle cx="155" cy="145" r="10" fill="#E74C3C" stroke="#C0392B" strokeWidth="1.5" />
      <circle cx="155" cy="145" r="5" fill="#C0392B" />
      {/* Capsule exit chute */}
      <rect x="115" y="220" width="80" height="48" rx="8" fill="#DDD" stroke="#C5C5C5" strokeWidth="1.5" />
      <rect x="120" y="230" width="70" height="32" rx="6" fill="#CCC" />
      {/* Ejected capsule animation */}
      {isEjecting && (
        <g>
          <ellipse cx="155" cy="236" rx="16" ry="18" fill="#A8E6CF">
            <animate attributeName="cy" from="200" to="236" dur="0.4s" fill="freeze" />
          </ellipse>
          <ellipse cx="155" cy="248" rx="16" ry="12" fill="#3D9970">
            <animate attributeName="cy" from="212" to="248" dur="0.4s" fill="freeze" />
          </ellipse>
        </g>
      )}
      {/* Feet */}
      <rect x="40" y="278" width="28" height="12" rx="4" fill="#C0392B" />
      <rect x="192" y="278" width="28" height="12" rx="4" fill="#C0392B" />
    </svg>
  );
}

export default function GachaMessage() {
  const [step, setStep] = useState("idle"); // idle | coined | turning | ejecting | opening | revealed
  const [capsuleColor, setCapsuleColor] = useState(CAPSULE_COLORS[0]);
  const [message, setMessage] = useState("");
  const [isRare, setIsRare] = useState(false);
  const [handleRotation, setHandleRotation] = useState(0);
  const [count, setCount] = useState(0);

  const insertCoin = () => {
    if (step !== "idle") return;
    setStep("coined");
  };

  const turnHandle = () => {
    if (step !== "coined") return;
    setStep("turning");
    setHandleRotation(360);

    const rare = Math.random() < RARE_CHANCE;
    const color = CAPSULE_COLORS[Math.floor(Math.random() * CAPSULE_COLORS.length)];
    const msg = rare
      ? MESSAGES[9]
      : MESSAGES[Math.floor(Math.random() * (MESSAGES.length - 1))];

    setCapsuleColor(color);
    setIsRare(rare);
    setMessage(msg);

    setTimeout(() => setStep("ejecting"), 700);
    setTimeout(() => setStep("opening"), 1400);
  };

  const openCapsule = () => {
    if (step !== "opening") return;
    setCount((c) => c + 1);
    setStep("revealed");
  };

  const reset = () => {
    setStep("idle");
    setHandleRotation(0);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #FFF5F7 0%, #F0F4FF 50%, #FFF8F0 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', serif",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative dots */}
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: 8, height: 8,
          borderRadius: "50%",
          background: ["#FFB3C6","#A8D8EA","#FFE0AC","#C3B1E1"][i % 4],
          top: `${10 + (i * 7.5) % 85}%`,
          left: `${5 + (i * 11) % 90}%`,
          opacity: 0.5,
        }} />
      ))}

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#E74C3C", textTransform: "uppercase", marginBottom: 4 }}>
          GACHA MESSAGE
        </div>
        <h1 style={{ fontSize: 28, fontWeight: "bold", color: "#2C2C2C", margin: 0, letterSpacing: -0.5 }}>
          Secret message
        </h1>
        {count > 0 && (
          <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
            {count} capsule{count > 1 ? "s" : ""} collected
          </div>
        )}
      </div>

      {/* Machine */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <div style={{
          transform: step === "turning" ? `rotate(${handleRotation}deg)` : "rotate(0deg)",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "center center",
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: "none",
          zIndex: 0,
        }} />
        <MachineSVG isEjecting={step === "ejecting" || step === "opening"} hasCoin={step === "coined"} />
      </div>

      {/* Action area */}
      {step === "idle" && (
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: 14, marginBottom: 12 }}>
            Insert a coin to receive a secret message 💌
          </p>
          <button onClick={insertCoin} style={btnStyle("#E74C3C")}>
            🪙 Insert ¥200
          </button>
        </div>
      )}

      {step === "coined" && (
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#3498DB", fontSize: 14, marginBottom: 12 }}>
            Now turn the handle slowly! 🎰
          </p>
          <button onClick={turnHandle} style={btnStyle("#3498DB")}>
            🔄 Turn Handle
          </button>
        </div>
      )}

      {step === "turning" && (
        <div style={{ textAlign: "center", color: "#999", fontSize: 14 }}>
          ⚙️ Turning...
        </div>
      )}

      {step === "ejecting" && (
        <div style={{ textAlign: "center", color: "#999", fontSize: 14 }}>
          🎊 A capsule appeared!
        </div>
      )}

      {step === "opening" && (
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#E17055", fontSize: 14, marginBottom: 12 }}>
            You got a capsule! Open it? 🫧
          </p>
          <button onClick={openCapsule} style={btnStyle("#E17055")}>
            ✨ Open Capsule!
          </button>
        </div>
      )}

      {step === "revealed" && (
        <div style={{
          background: "#FFF",
          borderRadius: 20,
          padding: "24px 28px",
          maxWidth: 300,
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          border: `2px solid ${capsuleColor.top}`,
          position: "relative",
          animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
          <div style={{ marginBottom: 12 }}>
            <CapsuleSVG colors={capsuleColor} scale={0.7} wobble />
          </div>
          {isRare && (
            <div style={{
              background: "linear-gradient(135deg, #F6D365, #FDA085)",
              color: "#FFF",
              fontSize: 11,
              fontWeight: "bold",
              letterSpacing: 2,
              padding: "3px 10px",
              borderRadius: 20,
              display: "inline-block",
              marginBottom: 10,
            }}>
              ★ RARE DROP ★
            </div>
          )}
          <p style={{
            fontSize: 16,
            color: "#2C2C2C",
            lineHeight: 1.6,
            fontStyle: "italic",
            margin: "0 0 16px",
          }}>
            "{message}"
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={reset} style={btnStyle(capsuleColor.bottom, true)}>
              🎰 Play again
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.7); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes wobble {
          0%,100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }
        button:hover { opacity: 0.88; transform: translateY(-1px); }
        button:active { transform: translateY(1px); }
      `}</style>
    </div>
  );
}

function btnStyle(color, small = false) {
  return {
    background: color,
    color: "#FFF",
    border: "none",
    borderRadius: 50,
    padding: small ? "10px 20px" : "12px 28px",
    fontSize: small ? 13 : 15,
    fontWeight: "bold",
    cursor: "pointer",
    letterSpacing: 0.5,
    boxShadow: `0 4px 14px ${color}55`,
    transition: "all 0.15s ease",
    fontFamily: "Georgia, serif",
  };
}
