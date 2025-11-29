"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import NameModal from "@/components/NameModal";
import ShareModal from "@/components/ShareModal";
import AchievementBadge from "@/components/AchievementBadge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CupcakeData, generateCupcakeId } from "@/utils/cupcakeUtils";
import { Achievement, AchievementStats, checkAchievements } from "@/utils/achievements";

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

type SpecialEffect = {
  id: string;
  label: string;
  emoji: string;
  className: string;
};

// Expanded content
const BASES: Base[] = [
  { id: "vanilla", label: "Vanilla Cake", className: "bg-[#ffe5b4] text-black" },
  { id: "chocolate", label: "Chocolate Cake", className: "bg-[#c47a5a] text-white" },
  { id: "strawberry", label: "Strawberry Cake", className: "bg-[#ffc0d9] text-black" },
  { id: "redvelvet", label: "Red Velvet", className: "bg-[#c41e3a] text-white" },
  { id: "lemon", label: "Lemon Cake", className: "bg-[#fffacd] text-black" },
  { id: "carrot", label: "Carrot Cake", className: "bg-[#ffa500] text-black" },
];

const FROSTINGS: Frosting[] = [
  { id: "vanilla", label: "Vanilla Swirl", className: "bg-[#fff6cf]" },
  { id: "chocolate", label: "Chocolate Drip", className: "bg-[#8b4b2c]" },
  { id: "strawberry", label: "Strawberry Cloud", className: "bg-[#ffb3c7]" },
  { id: "mint", label: "Mint Dream", className: "bg-[#b7f4d6]" },
  { id: "creamcheese", label: "Cream Cheese", className: "bg-[#fff8dc]" },
  { id: "caramel", label: "Caramel Drizzle", className: "bg-[#d2691e]" },
  { id: "blueberry", label: "Blueberry Swirl", className: "bg-[#e6e6fa]" },
];

const TOPPINGS: Topping[] = [
  { id: "sprinkles", label: "Rainbow Sprinkles", emojis: ["✨", "🍬", "✨"] },
  { id: "strawberry", label: "Fresh Strawberry", emojis: ["🍓"] },
  { id: "chocochip", label: "Choco Chips", emojis: ["🍫", "🍫"] },
  { id: "hearts", label: "Candy Hearts", emojis: ["💗", "💛", "💜"] },
  { id: "cherries", label: "Cherries", emojis: ["🍒", "🍒"] },
  { id: "nuts", label: "Nuts", emojis: ["🥜", "🥜"] },
  { id: "marshmallows", label: "Marshmallows", emojis: ["🍡", "🍡"] },
  { id: "stars", label: "Star Candies", emojis: ["⭐", "⭐", "⭐"] },
];

const SPECIAL_EFFECTS: SpecialEffect[] = [
  { id: "none", label: "None", emoji: "", className: "" },
  { id: "sparkles", label: "Sparkles", emoji: "✨", className: "animate-pulse" },
  { id: "glitter", label: "Glitter", emoji: "💫", className: "animate-pulse" },
  { id: "rainbow", label: "Rainbow Aura", emoji: "🌈", className: "animate-pulse" },
];

const FUN_ADJECTIVES = [
  "Magic", "Rainbow", "Super", "Dreamy", "Unicorn", "Galaxy", "Crispy",
  "Sugar-Cloud", "Sparkle", "Cozy", "Epic", "Fantastic", "Wonderful",
];

const FUN_NOUNS = [
  "Blast", "Volcano", "Party", "Storm", "Swirl", "Treat", "Surprise",
  "Cloud", "Delight", "Festival", "Adventure", "Journey", "Miracle",
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
      success: 523.25,
      sparkle: 880,
    };

    oscillator.frequency.value = frequencies[type];
    oscillator.type = type === "success" ? "sine" : "square";

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  } catch (error) {
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
  const [effectIndex, setEffectIndex] = useState(0);
  const [cupcakeName, setCupcakeName] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [savedCupcakes, setSavedCupcakes] = useLocalStorage<CupcakeData[]>("saved-cupcakes", []);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>("achievements", []);
  const [stats, setStats] = useLocalStorage<AchievementStats>("stats", {
    totalCupcakesCreated: 0,
    basesTried: [],
    frostingsTried: [],
    toppingsTried: [],
    challengesCompleted: 0,
    perfectMatches: 0,
  });

  // Ensure stats arrays are always arrays (migration from old Set format)
  useEffect(() => {
    if (stats && (!Array.isArray(stats.basesTried) || !Array.isArray(stats.frostingsTried) || !Array.isArray(stats.toppingsTried))) {
      setStats({
        ...stats,
        basesTried: Array.isArray(stats.basesTried) ? stats.basesTried : [],
        frostingsTried: Array.isArray(stats.frostingsTried) ? stats.frostingsTried : [],
        toppingsTried: Array.isArray(stats.toppingsTried) ? stats.toppingsTried : [],
      });
    }
  }, []);
  const cupcakeRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const base = BASES[baseIndex];
  const frosting = FROSTINGS[frostingIndex];
  const topping = TOPPINGS[toppingIndex];
  const effect = SPECIAL_EFFECTS[effectIndex];

  // Load cupcake from URL if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cupcakeData = params.get("cupcake");
      if (cupcakeData) {
        try {
          const decoded = JSON.parse(atob(cupcakeData));
          setBaseIndex(decoded.baseIndex || 0);
          setFrostingIndex(decoded.frostingIndex || 0);
          setToppingIndex(decoded.toppingIndex || 0);
          if (decoded.name) setCupcakeName(decoded.name);
        } catch (e) {
          console.error("Failed to decode cupcake data");
        }
      }
    }
  }, []);

  // Update stats when cupcake changes
  useEffect(() => {
    // Ensure arrays exist and handle migration from old Set format
    const basesArray = Array.isArray(stats.basesTried) ? stats.basesTried : [];
    const frostingsArray = Array.isArray(stats.frostingsTried) ? stats.frostingsTried : [];
    const toppingsArray = Array.isArray(stats.toppingsTried) ? stats.toppingsTried : [];
    
    const basesSet = new Set([...basesArray, baseIndex]);
    const frostingsSet = new Set([...frostingsArray, frostingIndex]);
    const toppingsSet = new Set([...toppingsArray, toppingIndex]);
    
    const newStats = {
      ...stats,
      basesTried: Array.from(basesSet),
      frostingsTried: Array.from(frostingsSet),
      toppingsTried: Array.from(toppingsSet),
    };
    setStats(newStats);

    // Check for new achievements
    const newAchievements = checkAchievements(newStats, achievements);
    if (newAchievements.length > 0) {
      const newAchievementList = [...achievements];
      newAchievements.forEach((ach) => {
        if (!newAchievementList.find((a) => a.id === ach.id)) {
          newAchievementList.push(ach);
          setNewAchievement(ach);
          playSound("success", soundsEnabled);
        }
      });
      setAchievements(newAchievementList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseIndex, frostingIndex, toppingIndex]);

  useEffect(() => {
    setBounce(true);
    const timer = setTimeout(() => setBounce(false), 600);
    return () => clearTimeout(timer);
  }, [baseIndex, frostingIndex, toppingIndex, effectIndex]);

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

  function handleChangeEffect(direction: number) {
    playSound("sparkle", soundsEnabled);
    setIsAnimating(true);
    setTimeout(() => {
      setEffectIndex((i) => wrapIndex(i + direction, SPECIAL_EFFECTS.length));
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
      const newEffect = randomInt(SPECIAL_EFFECTS.length);

      setBaseIndex(newBase);
      setFrostingIndex(newFrosting);
      setToppingIndex(newTopping);
      setEffectIndex(newEffect);

      const adj = FUN_ADJECTIVES[randomInt(FUN_ADJECTIVES.length)];
      const noun = FUN_NOUNS[randomInt(FUN_NOUNS.length)];
      const toppingWord = TOPPINGS[newTopping].label.split(" ")[0];

      setCupcakeName(`${adj} ${toppingWord} ${noun}`);
      setIsAnimating(false);

      // Update stats
      setStats({
        ...stats,
        totalCupcakesCreated: stats.totalCupcakesCreated + 1,
      });
    }, 300);
  }

  function handleSaveName(name: string) {
    setCupcakeName(name);
    playSound("success", soundsEnabled);
  }

  function handleSaveCupcake() {
    if (!cupcakeName) {
      setShowNameModal(true);
      return;
    }

    const cupcakeData: CupcakeData = {
      id: generateCupcakeId(),
      baseIndex,
      frostingIndex,
      toppingIndex,
      name: cupcakeName,
      createdAt: Date.now(),
    };

    setSavedCupcakes([...savedCupcakes, cupcakeData]);
    playSound("success", soundsEnabled);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  }

  function handleShare() {
    if (!cupcakeName) {
      setShowNameModal(true);
      return;
    }
    setShowShareModal(true);
  }

  const currentCupcakeData: CupcakeData = {
    id: generateCupcakeId(),
    baseIndex,
    frostingIndex,
    toppingIndex,
    name: cupcakeName || "Unnamed Cupcake",
    createdAt: Date.now(),
  };

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
          <header className="text-center mb-4 relative">
            <div className="absolute top-0 right-0 flex gap-2">
              <Link
                href="/gallery"
                className="text-xl transform transition-all duration-200 hover:scale-110 active:scale-95"
                title="My Cupcakes"
              >
                📚
              </Link>
              <Link
                href="/challenge"
                className="text-xl transform transition-all duration-200 hover:scale-110 active:scale-95"
                title="Challenge Mode"
              >
                🎯
              </Link>
              <Link
                href="/stats"
                className="text-xl transform transition-all duration-200 hover:scale-110 active:scale-95"
                title="Statistics"
              >
                📊
              </Link>
              <button
                onClick={() => {
                  setSoundsEnabled(!soundsEnabled);
                  playSound("click", true);
                }}
                className="text-xl transform transition-all duration-200 hover:scale-110 active:scale-95"
                title={soundsEnabled ? "Disable sounds" : "Enable sounds"}
              >
                {soundsEnabled ? "🔊" : "🔇"}
              </button>
            </div>
            <h1 className="text-3xl font-extrabold tracking-wide shimmer">
              🧁 Solene & Ellie&apos;s Cupcake Game 🧁
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              Tap to mix bases, frosting & toppings — then name your creation! ✨
            </p>
            {savedCupcakes.length > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                {savedCupcakes.length} saved cupcake{savedCupcakes.length !== 1 ? "s" : ""}
              </p>
            )}
          </header>

          <section className="flex items-center justify-center py-6">
            <div className="relative w-44 h-44 flex items-end justify-center">
              <div className="absolute bottom-0 w-[80%] h-4 sm:h-5 bg-gradient-to-b from-white via-[#f0e8ff] to-[#ddd8f2] rounded-full shadow-lg transform transition-all duration-300 hover:scale-105" />

              <div
                ref={cupcakeRef}
                className={`relative w-28 h-36 flex flex-col items-center justify-end translate-y-[-6px] transition-all duration-500 ${
                  bounce ? "animate-bounce-custom" : ""
                } ${isAnimating ? "animate-wiggle" : ""}`}
                onTouchStart={(e) => {
                  touchStartX.current = e.touches[0].clientX;
                  touchStartY.current = e.touches[0].clientY;
                  longPressTimer.current = setTimeout(() => {
                    handleRandom();
                    playSound("pop", soundsEnabled);
                  }, 500);
                }}
                onTouchMove={(e) => {
                  if (longPressTimer.current) {
                    clearTimeout(longPressTimer.current);
                    longPressTimer.current = null;
                  }
                }}
                onTouchEnd={(e) => {
                  if (longPressTimer.current) {
                    clearTimeout(longPressTimer.current);
                    longPressTimer.current = null;
                  }
                  
                  const touchEndX = e.changedTouches[0].clientX;
                  const touchEndY = e.changedTouches[0].clientY;
                  const deltaX = touchEndX - touchStartX.current;
                  const deltaY = touchEndY - touchStartY.current;
                  
                  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                    if (deltaX > 0) {
                      // Swipe right - cycle through options
                      const section = Math.floor(Math.abs(deltaY) / 50);
                      if (section === 0) handleChangeBase(1);
                      else if (section === 1) handleChangeFrosting(1);
                      else if (section === 2) handleChangeTopping(1);
                    } else {
                      // Swipe left - cycle backwards
                      const section = Math.floor(Math.abs(deltaY) / 50);
                      if (section === 0) handleChangeBase(-1);
                      else if (section === 1) handleChangeFrosting(-1);
                      else if (section === 2) handleChangeTopping(-1);
                    }
                  }
                }}
              >
                <div
                  className={`relative w-24 h-20 rounded-[999px_999px_24px_24px] shadow-lg flex items-center justify-center transition-all duration-500 transform hover:scale-105 ${frosting.className}`}
                >
                  <div className="absolute w-20 h-10 rounded-full bg-white/50 top-[-8px] left-[10px] animate-pulse-custom" />
                  <div className="absolute w-9 h-6 rounded-full bg-white/50 top-[-16px] right-[14px] animate-pulse-custom" style={{ animationDelay: "0.3s" }} />

                  {effect.emoji && (
                    <div className={`absolute top-[-20px] text-2xl ${effect.className}`}>
                      {effect.emoji}
                    </div>
                  )}

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

                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.18em] text-slate-700 font-bold whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full shadow-sm">
                    {frosting.label}
                  </div>
                </div>

                <div
                  className={`relative w-full h-[52px] rounded-[10px_10px_18px_18px] overflow-hidden flex items-end justify-center shadow-xl mt-[-10px] transition-all duration-500 transform hover:scale-105 ${base.className}`}
                >
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

          <section className="mb-4">
            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-[#ff4f8b] via-[#ff7bb0] to-[#ffe5b4] px-4 py-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105">
                <span className="text-sm font-bold text-white drop-shadow-md">
                  {cupcakeName ?? "✨ Tap &quot;Random Cupcake&quot; to get a magic name! ✨"}
                </span>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3 text-xs sm:text-sm">
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

            <div className="rounded-2xl bg-gradient-to-br from-[#f8f3ff] to-[#f0e8ff] px-4 py-3 shadow-md transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.7rem] uppercase tracking-[0.18em] font-bold text-[#7c6fa3] flex items-center gap-1">
                  🌟 Special Effects
                </span>
                <span className="text-xs font-bold text-[#493a73] bg-white/80 px-2 py-1 rounded-full">
                  {effect.label}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#493a73] font-bold px-4 py-2 shadow-md transform transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 active:translate-y-px"
                  onClick={() => handleChangeEffect(-1)}
                >
                  <span className="text-lg">⬅️</span>
                  <span>Prev</span>
                </button>
                <button
                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#493a73] font-bold px-4 py-2 shadow-md transform transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 active:translate-y-px"
                  onClick={() => handleChangeEffect(1)}
                >
                  <span>Next</span>
                  <span className="text-lg">➡️</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-[#f8f3ff] to-[#f0e8ff] px-4 py-3 shadow-md transform transition-all duration-300 hover:shadow-lg">
              <div className="flex flex-wrap gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff7bb0] via-[#ff4f8b] to-[#ff7bb0] text-white font-bold px-5 py-2.5 shadow-lg transform transition-all duration-200 hover:scale-110 hover:shadow-xl active:scale-95 animate-pulse-custom"
                  onClick={handleRandom}
                >
                  <span className="text-xl">🎲</span>
                  <span>Random</span>
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-[#79689e] bg-white/80 text-[#493a73] font-bold px-5 py-2.5 shadow-md transform transition-all duration-200 hover:scale-110 hover:shadow-lg hover:bg-white active:scale-95"
                  onClick={() => setShowNameModal(true)}
                >
                  <span className="text-xl">💬</span>
                  <span>Name</span>
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b7f4d6] to-[#90ee90] text-[#2d5016] font-bold px-5 py-2.5 shadow-lg transform transition-all duration-200 hover:scale-110 hover:shadow-xl active:scale-95"
                  onClick={handleSaveCupcake}
                >
                  <span className="text-xl">💾</span>
                  <span>Save</span>
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ffe5b4] to-[#ffd700] text-[#8b6914] font-bold px-5 py-2.5 shadow-lg transform transition-all duration-200 hover:scale-110 hover:shadow-xl active:scale-95"
                  onClick={handleShare}
                >
                  <span className="text-xl">🔗</span>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </section>

          <footer className="mt-4 text-center text-[0.7rem] text-slate-600 font-medium">
            Made with 💖 for Uncle Chien & the nieces 🧁✨
          </footer>
        </div>

        <Confetti show={showConfetti} />
        <NameModal
          isOpen={showNameModal}
          currentName={cupcakeName}
          onClose={() => setShowNameModal(false)}
          onSave={handleSaveName}
        />
        <ShareModal
          isOpen={showShareModal}
          cupcakeData={currentCupcakeData}
          onClose={() => setShowShareModal(false)}
        />
        {newAchievement && (
          <AchievementBadge
            achievement={newAchievement}
            onClose={() => setNewAchievement(null)}
          />
        )}
      </main>
    </>
  );
}
