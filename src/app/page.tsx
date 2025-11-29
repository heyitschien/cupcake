"use client";

import { useState, useEffect, useRef } from "react";

type Base = {
  id: string;
  label: string;
  className: string;
};

type Frosting = {
  id: string;
  label: string;
  className: string;
};

type Topping = {
  id: string;
  label: string;
  emojis: string[];
};

const BASES: Base[] = [
  { id: "vanilla", label: "Vanilla Cake", className: "bg-[#ffe5b4] text-black" },
  { id: "chocolate", label: "Chocolate Cake", className: "bg-[#c47a5a] text-white" },
  { id: "strawberry", label: "Strawberry Cake", className: "bg-[#ffc0d9] text-black" },
];

const FROSTINGS: Frosting[] = [
  { id: "vanilla", label: "Vanilla Swirl", className: "bg-[#fff6cf]" },
  { id: "chocolate", label: "Chocolate Drip", className: "bg-[#8b4b2c]" },
  { id: "strawberry", label: "Strawberry Cloud", className: "bg-[#ffb3c7]" },
  { id: "mint", label: "Mint Dream", className: "bg-[#b7f4d6]" },
];

const TOPPINGS: Topping[] = [
  { id: "sprinkles", label: "Rainbow Sprinkles", emojis: ["✨", "🍬", "✨"] },
  { id: "strawberry", label: "Fresh Strawberry", emojis: ["🍓"] },
  { id: "chocochip", label: "Choco Chips", emojis: ["🍫", "🍫"] },
  { id: "hearts", label: "Candy Hearts", emojis: ["💗", "💛", "💜"] },
];

const FUN_ADJECTIVES = [
  "Magic",
  "Rainbow",
  "Super",
  "Dreamy",
  "Unicorn",
  "Galaxy",
  "Crispy",
  "Sugar-Cloud",
  "Sparkle",
  "Cozy",
];

const FUN_NOUNS = [
  "Blast",
  "Volcano",
  "Party",
  "Storm",
  "Swirl",
  "Treat",
  "Surprise",
  "Cloud",
  "Delight",
  "Festival",
];

function wrapIndex(index: number, length: number) {
  return (index + length) % length;
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

// Sound effects using Web Audio API
let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

function playSound(type: "click" | "whoosh" | "pop" | "success" | "sparkle", enabled: boolean = true) {
  if (!enabled) return;
  
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const frequencies: Record<typeof type, number> = {
      click: 800,
      whoosh: 400,
      pop: 600,
      success: 523.25, // C5
      sparkle: 880, // A5
    };

    oscillator.frequency.value = frequencies[type];
    oscillator.type = type === "success" ? "sine" : "square";

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  } catch (error) {
    // Silently fail if audio context is not available
    console.debug("Audio not available:", error);
  }
}

// Confetti component
function Confetti({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => {
        const colors = ["#ff4f8b", "#ff7bb0", "#ffe5b4", "#b7f4d6", "#fff6cf", "#ffb3c7"];
        const color = colors[randomInt(colors.length)];
        const left = `${randomInt(100)}%`;
        const delay = Math.random() * 0.5;
        const duration = 2 + Math.random() * 2;

        return (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: color,
              left,
              top: "-10px",
              animation: `confettiFall ${duration}s ease-out ${delay}s forwards`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function Home() {
  const [baseIndex, setBaseIndex] = useState(0);
  const [frostingIndex, setFrostingIndex] = useState(0);
  const [toppingIndex, setToppingIndex] = useState(0);
  const [cupcakeName, setCupcakeName] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const cupcakeRef = useRef<HTMLDivElement>(null);

  const base = BASES[baseIndex];
  const frosting = FROSTINGS[frostingIndex];
  const topping = TOPPINGS[toppingIndex];

  useEffect(() => {
    // Add bounce animation when cupcake changes
    setBounce(true);
    const timer = setTimeout(() => setBounce(false), 600);
    return () => clearTimeout(timer);
  }, [baseIndex, frostingIndex, toppingIndex]);

  function handleChangeBase(direction: number) {
    playSound("click", soundsEnabled);
    setIsAnimating(true);
    setTimeout(() => {
      setBaseIndex((i) => wrapIndex(i + direction, BASES.length));
      setIsAnimating(false);
    }, 150);
  }

  function handleChangeFrosting(direction: number) {
    playSound("whoosh", soundsEnabled);
    setIsAnimating(true);
    setTimeout(() => {
      setFrostingIndex((i) => wrapIndex(i + direction, FROSTINGS.length));
      setIsAnimating(false);
    }, 150);
  }

  function handleChangeTopping(direction: number) {
    playSound("sparkle", soundsEnabled);
    setIsAnimating(true);
    setTimeout(() => {
      setToppingIndex((i) => wrapIndex(i + direction, TOPPINGS.length));
      setIsAnimating(false);
    }, 150);
  }

  function handleRandom() {
    playSound("success", soundsEnabled);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    setIsAnimating(true);
    setTimeout(() => {
      const newBase = randomInt(BASES.length);
      const newFrosting = randomInt(FROSTINGS.length);
      const newTopping = randomInt(TOPPINGS.length);

      setBaseIndex(newBase);
      setFrostingIndex(newFrosting);
      setToppingIndex(newTopping);

      const adj = FUN_ADJECTIVES[randomInt(FUN_ADJECTIVES.length)];
      const noun = FUN_NOUNS[randomInt(FUN_NOUNS.length)];
      const toppingWord = TOPPINGS[newTopping].label.split(" ")[0];

      setCupcakeName(`${adj} ${toppingWord} ${noun}`);
      setIsAnimating(false);
    }, 300);
  }

  function handleNameYourself() {
    playSound("pop", soundsEnabled);
    const name = window.prompt("What is your cupcake's name?");
    if (name && name.trim()) {
      setCupcakeName(name.trim());
      playSound("success", soundsEnabled);
    }
  }

  return (
    <>
      <style jsx>{`
        @keyframes confettiFall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-bounce-custom {
          animation: bounce 0.6s ease-in-out;
        }
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }
        .animate-pulse-custom {
          animation: pulse 1s ease-in-out infinite;
        }
        .shimmer {
          background: linear-gradient(
            90deg,
            #ff4f8b 0%,
            #ff7bb0 25%,
            #ffe5b4 50%,
            #ff7bb0 75%,
            #ff4f8b 100%
          );
          background-size: 2000px 100%;
          animation: shimmer 3s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffeef7_0,_#ffe1c7_40%,_#f5c3ff_100%)] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-20 h-20 rounded-full opacity-20 blur-xl"
              style={{
                backgroundColor: ["#ff4f8b", "#ffe5b4", "#b7f4d6", "#fff6cf", "#ffb3c7"][i],
                left: `${20 + i * 20}%`,
                top: `${10 + i * 15}%`,
                animation: `pulse ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-sm shadow-2xl px-4 py-5 sm:px-5 sm:py-6 relative z-10 transform transition-all duration-300 hover:scale-[1.01]">
          {/* Header */}
          <header className="text-center mb-4 relative">
            <button
              onClick={() => {
                setSoundsEnabled(!soundsEnabled);
                playSound("click", true);
              }}
              className="absolute top-0 right-0 text-2xl transform transition-all duration-200 hover:scale-110 active:scale-95"
              title={soundsEnabled ? "Disable sounds" : "Enable sounds"}
            >
              {soundsEnabled ? "🔊" : "🔇"}
            </button>
            <h1 className="text-3xl font-extrabold tracking-wide shimmer">
              🧁 Solene & Ellie's Cupcake Game 🧁
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              Tap to mix bases, frosting & toppings — then name your creation! ✨
            </p>
          </header>

          {/* Cupcake Preview */}
          <section className="flex items-center justify-center py-6">
            <div className="relative w-44 h-44 flex items-end justify-center">
              {/* Plate */}
              <div className="absolute bottom-0 w-[80%] h-4 sm:h-5 bg-gradient-to-b from-white via-[#f0e8ff] to-[#ddd8f2] rounded-full shadow-lg transform transition-all duration-300 hover:scale-105" />

              {/* Cupcake */}
              <div
                ref={cupcakeRef}
                className={`relative w-28 h-36 flex flex-col items-center justify-end translate-y-[-6px] transition-all duration-500 ${
                  bounce ? "animate-bounce-custom" : ""
                } ${isAnimating ? "animate-wiggle" : ""}`}
              >
                {/* Frosting */}
                <div
                  className={`relative w-24 h-20 rounded-[999px_999px_24px_24px] shadow-lg flex items-center justify-center transition-all duration-500 transform hover:scale-105 ${frosting.className}`}
                >
                  {/* Animated swirl blobs */}
                  <div className="absolute w-20 h-10 rounded-full bg-white/50 top-[-8px] left-[10px] animate-pulse-custom" />
                  <div className="absolute w-9 h-6 rounded-full bg-white/50 top-[-16px] right-[14px] animate-pulse-custom" style={{ animationDelay: "0.3s" }} />

                  {/* Animated toppings */}
                  <div className="absolute flex gap-1 -translate-y-1">
                    {topping.emojis.map((emoji, idx) => (
                      <span
                        key={idx}
                        className="text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] transform transition-all duration-300 hover:scale-125 hover:rotate-12"
                        style={{
                          animation: `pulse ${1 + idx * 0.2}s ease-in-out infinite`,
                          animationDelay: `${idx * 0.1}s`,
                        }}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>

                  {/* Frosting label */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.18em] text-slate-700 font-bold whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full shadow-sm">
                    {frosting.label}
                  </div>
                </div>

                {/* Base */}
                <div
                  className={`relative w-full h-[52px] rounded-[10px_10px_18px_18px] overflow-hidden flex items-end justify-center shadow-xl mt-[-10px] transition-all duration-500 transform hover:scale-105 ${base.className}`}
                >
                  {/* Animated stripes */}
                  <div className="absolute inset-0 flex opacity-40">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="flex-1 bg-white/80 mx-[2px] transform transition-all duration-300"
                        style={{
                          animation: `pulse ${1.5 + i * 0.1}s ease-in-out infinite`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute bottom-1 left-0 right-0 text-center text-[0.6rem] uppercase tracking-[0.18em] font-bold text-black/80 bg-white/60 px-2 py-0.5 rounded-full mx-auto w-fit">
                    {base.label}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cupcake Name */}
          <section className="mb-4">
            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-[#ff4f8b] via-[#ff7bb0] to-[#ffe5b4] px-4 py-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105">
                <span className="text-sm font-bold text-white drop-shadow-md">
                  {cupcakeName ?? "✨ Tap \"Random Cupcake\" to get a magic name! ✨"}
                </span>
              </div>
            </div>
          </section>

          {/* Controls */}
          <section className="flex flex-col gap-3 text-xs sm:text-sm">
            {/* Base control */}
            <div className="rounded-2xl bg-gradient-to-br from-[#f8f3ff] to-[#f0e8ff] px-4 py-3 shadow-md transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.7rem] uppercase tracking-[0.18em] font-bold text-[#7c6fa3] flex items-center gap-1">
                  🎂 Base
                </span>
                <span className="text-xs font-bold text-[#493a73] bg-white/80 px-2 py-1 rounded-full">
                  {base.label}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#493a73] font-bold px-4 py-2 shadow-md transform transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 active:translate-y-px"
                  onClick={() => handleChangeBase(-1)}
                >
                  <span className="text-lg">⬅️</span>
                  <span>Prev</span>
                </button>
                <button
                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#493a73] font-bold px-4 py-2 shadow-md transform transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 active:translate-y-px"
                  onClick={() => handleChangeBase(1)}
                >
                  <span>Next</span>
                  <span className="text-lg">➡️</span>
                </button>
              </div>
            </div>

            {/* Frosting control */}
            <div className="rounded-2xl bg-gradient-to-br from-[#f8f3ff] to-[#f0e8ff] px-4 py-3 shadow-md transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.7rem] uppercase tracking-[0.18em] font-bold text-[#7c6fa3] flex items-center gap-1">
                  🧁 Frosting
                </span>
                <span className="text-xs font-bold text-[#493a73] bg-white/80 px-2 py-1 rounded-full">
                  {frosting.label}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#493a73] font-bold px-4 py-2 shadow-md transform transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 active:translate-y-px"
                  onClick={() => handleChangeFrosting(-1)}
                >
                  <span className="text-lg">⬅️</span>
                  <span>Prev</span>
                </button>
                <button
                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#493a73] font-bold px-4 py-2 shadow-md transform transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 active:translate-y-px"
                  onClick={() => handleChangeFrosting(1)}
                >
                  <span>Next</span>
                  <span className="text-lg">➡️</span>
                </button>
              </div>
            </div>

            {/* Toppings control */}
            <div className="rounded-2xl bg-gradient-to-br from-[#f8f3ff] to-[#f0e8ff] px-4 py-3 shadow-md transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.7rem] uppercase tracking-[0.18em] font-bold text-[#7c6fa3] flex items-center gap-1">
                  ✨ Toppings
                </span>
                <span className="text-xs font-bold text-[#493a73] bg-white/80 px-2 py-1 rounded-full">
                  {topping.label}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#493a73] font-bold px-4 py-2 shadow-md transform transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 active:translate-y-px"
                  onClick={() => handleChangeTopping(-1)}
                >
                  <span className="text-lg">⬅️</span>
                  <span>Prev</span>
                </button>
                <button
                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#493a73] font-bold px-4 py-2 shadow-md transform transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 active:translate-y-px"
                  onClick={() => handleChangeTopping(1)}
                >
                  <span>Next</span>
                  <span className="text-lg">➡️</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-2xl bg-gradient-to-br from-[#f8f3ff] to-[#f0e8ff] px-4 py-3 shadow-md transform transition-all duration-300 hover:shadow-lg">
              <div className="flex flex-wrap gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff7bb0] via-[#ff4f8b] to-[#ff7bb0] text-white font-bold px-5 py-2.5 shadow-lg transform transition-all duration-200 hover:scale-110 hover:shadow-xl active:scale-95 animate-pulse-custom"
                  onClick={handleRandom}
                >
                  <span className="text-xl">🎲</span>
                  <span>Random Cupcake</span>
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-[#79689e] bg-white/80 text-[#493a73] font-bold px-5 py-2.5 shadow-md transform transition-all duration-200 hover:scale-110 hover:shadow-lg hover:bg-white active:scale-95"
                  onClick={handleNameYourself}
                >
                  <span className="text-xl">💬</span>
                  <span>Name It Yourself</span>
                </button>
              </div>
            </div>
          </section>

          <footer className="mt-4 text-center text-[0.7rem] text-slate-600 font-medium">
            Made with 💖 for Uncle Chien & the nieces 🧁✨
          </footer>
        </div>

        <Confetti show={showConfetti} />
      </main>
    </>
  );
}
