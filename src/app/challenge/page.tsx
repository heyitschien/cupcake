"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AchievementStats } from "@/utils/achievements";
import { playSound } from "./soundUtils";

const BASES = [
  { id: "vanilla", label: "Vanilla Cake", className: "bg-[#ffe5b4] text-black" },
  { id: "chocolate", label: "Chocolate Cake", className: "bg-[#c47a5a] text-white" },
  { id: "strawberry", label: "Strawberry Cake", className: "bg-[#ffc0d9] text-black" },
  { id: "redvelvet", label: "Red Velvet", className: "bg-[#c41e3a] text-white" },
  { id: "lemon", label: "Lemon Cake", className: "bg-[#fffacd] text-black" },
  { id: "carrot", label: "Carrot Cake", className: "bg-[#ffa500] text-black" },
];

const FROSTINGS = [
  { id: "vanilla", label: "Vanilla Swirl", className: "bg-[#fff6cf]" },
  { id: "chocolate", label: "Chocolate Drip", className: "bg-[#8b4b2c]" },
  { id: "strawberry", label: "Strawberry Cloud", className: "bg-[#ffb3c7]" },
  { id: "mint", label: "Mint Dream", className: "bg-[#b7f4d6]" },
  { id: "creamcheese", label: "Cream Cheese", className: "bg-[#fff8dc]" },
  { id: "caramel", label: "Caramel Drizzle", className: "bg-[#d2691e]" },
  { id: "blueberry", label: "Blueberry Swirl", className: "bg-[#e6e6fa]" },
];

const TOPPINGS = [
  { id: "sprinkles", label: "Rainbow Sprinkles", emojis: ["✨", "🍬", "✨"] },
  { id: "strawberry", label: "Fresh Strawberry", emojis: ["🍓"] },
  { id: "chocochip", label: "Choco Chips", emojis: ["🍫", "🍫"] },
  { id: "hearts", label: "Candy Hearts", emojis: ["💗", "💛", "💜"] },
  { id: "cherries", label: "Cherries", emojis: ["🍒", "🍒"] },
  { id: "nuts", label: "Nuts", emojis: ["🥜", "🥜"] },
  { id: "marshmallows", label: "Marshmallows", emojis: ["🍡", "🍡"] },
  { id: "stars", label: "Star Candies", emojis: ["⭐", "⭐", "⭐"] },
];

type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY_TIMES: Record<Difficulty, number> = {
  easy: 120,
  medium: 90,
  hard: 60,
};

function wrapIndex(index: number, length: number) {
  return (index + length) % length;
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function CupcakeDisplay({
  baseIndex,
  frostingIndex,
  toppingIndex,
  size = "normal",
}: {
  baseIndex: number;
  frostingIndex: number;
  toppingIndex: number;
  size?: "normal" | "small";
}) {
  const base = BASES[baseIndex] || BASES[0];
  const frosting = FROSTINGS[frostingIndex] || FROSTINGS[0];
  const topping = TOPPINGS[toppingIndex] || TOPPINGS[0];

  const scale = size === "small" ? 0.7 : 1;

  return (
    <div
      className="relative flex items-end justify-center"
      style={{ width: `${44 * scale}px`, height: `${44 * scale}px` }}
    >
      <div
        className="absolute bottom-0 bg-gradient-to-b from-white to-[#ddd8f2] rounded-full shadow-md"
        style={{ width: `${80 * scale}%`, height: `${16 * scale}px` }}
      />
      <div
        className="relative flex flex-col items-center justify-end"
        style={{
          width: `${28 * scale}px`,
          height: `${36 * scale}px`,
          transform: `translateY(-${6 * scale}px)`,
        }}
      >
        <div
          className={`relative rounded-[999px_999px_24px_24px] shadow-lg flex items-center justify-center ${frosting.className}`}
          style={{ width: `${24 * scale}px`, height: `${20 * scale}px` }}
        >
          <div
            className="absolute flex gap-1"
            style={{ transform: `translateY(-${4 * scale}px)` }}
          >
            {topping.emojis.map((emoji, idx) => (
              <span key={idx} style={{ fontSize: `${20 * scale}px` }}>
                {emoji}
              </span>
            ))}
          </div>
        </div>
        <div
          className={`relative rounded-[10px_10px_18px_18px] overflow-hidden shadow-xl mt-[-${10 * scale}px] ${base.className}`}
          style={{ width: "100%", height: `${52 * scale}px` }}
        />
      </div>
    </div>
  );
}

export default function ChallengePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [targetBase, setTargetBase] = useState(0);
  const [targetFrosting, setTargetFrosting] = useState(0);
  const [targetTopping, setTargetTopping] = useState(0);
  const [playerBase, setPlayerBase] = useState(0);
  const [playerFrosting, setPlayerFrosting] = useState(0);
  const [playerTopping, setPlayerTopping] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameState, setGameState] = useState<"menu" | "playing" | "won" | "lost">("menu");
  const [score, setScore] = useState(0);
  const [stats, setStats] = useLocalStorage<AchievementStats>("stats", {
    totalCupcakesCreated: 0,
    basesTried: [],
    frostingsTried: [],
    toppingsTried: [],
    challengesCompleted: 0,
    perfectMatches: 0,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === "playing" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("lost");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  function startGame() {
    const newTargetBase = randomInt(BASES.length);
    const newTargetFrosting = randomInt(FROSTINGS.length);
    const newTargetTopping = randomInt(TOPPINGS.length);

    setTargetBase(newTargetBase);
    setTargetFrosting(newTargetFrosting);
    setTargetTopping(newTargetTopping);
    setPlayerBase(0);
    setPlayerFrosting(0);
    setPlayerTopping(0);
    setTimeLeft(DIFFICULTY_TIMES[difficulty]);
    setGameState("playing");
    playSound("success", true);
  }

  function checkMatch() {
    const isMatch =
      playerBase === targetBase &&
      playerFrosting === targetFrosting &&
      playerTopping === targetTopping;

    if (isMatch) {
      const timeBonus = Math.floor(timeLeft * 10);
      const difficultyBonus = difficulty === "easy" ? 100 : difficulty === "medium" ? 200 : 300;
      const newScore = timeBonus + difficultyBonus;
      setScore(newScore);
      setGameState("won");
      playSound("success", true);

      const isPerfect = timeLeft >= DIFFICULTY_TIMES[difficulty] * 0.8;
      setStats({
        ...stats,
        challengesCompleted: stats.challengesCompleted + 1,
        perfectMatches: isPerfect ? stats.perfectMatches + 1 : stats.perfectMatches,
      });
    }
  }

  useEffect(() => {
    if (gameState === "playing") {
      checkMatch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerBase, playerFrosting, playerTopping, gameState]);

  if (gameState === "menu") {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffeef7_0,_#ffe1c7_40%,_#f5c3ff_100%)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/95 rounded-3xl shadow-2xl p-6">
          <Link href="/" className="inline-block mb-4 text-2xl">
            🏠
          </Link>
          <h1 className="text-4xl font-extrabold text-[#ff4f8b] text-center mb-6">
            🎯 Challenge Mode 🎯
          </h1>
          <p className="text-center text-slate-600 mb-6">
            Match the target cupcake before time runs out!
          </p>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Choose Difficulty:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    difficulty === diff
                      ? "bg-gradient-to-r from-[#ff7bb0] to-[#ff4f8b] text-white shadow-lg scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  <br />
                  <span className="text-xs">
                    {DIFFICULTY_TIMES[diff]}s
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-[#ff7bb0] to-[#ff4f8b] text-white font-bold text-xl shadow-lg hover:shadow-xl transform transition-all hover:scale-105 active:scale-95"
          >
            Start Challenge! 🚀
          </button>

          {stats.challengesCompleted > 0 && (
            <p className="text-center text-slate-500 mt-4 text-sm">
              Completed: {stats.challengesCompleted} challenge{stats.challengesCompleted !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </main>
    );
  }

  if (gameState === "won") {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffeef7_0,_#ffe1c7_40%,_#f5c3ff_100%)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/95 rounded-3xl shadow-2xl p-6 text-center">
          <div className="text-6xl mb-4 animate-pulse">🎉</div>
          <h2 className="text-3xl font-extrabold text-[#ff4f8b] mb-4">
            Perfect Match!
          </h2>
          <p className="text-2xl font-bold text-slate-700 mb-2">
            Score: {score}
          </p>
          <p className="text-slate-600 mb-6">
            Time remaining: {timeLeft}s
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setGameState("menu")}
              className="px-6 py-3 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-all"
            >
              Menu
            </button>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff7bb0] to-[#ff4f8b] text-white font-bold shadow-lg hover:shadow-xl transform transition-all hover:scale-105"
            >
              Play Again!
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (gameState === "lost") {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffeef7_0,_#ffe1c7_40%,_#f5c3ff_100%)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/95 rounded-3xl shadow-2xl p-6 text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-3xl font-extrabold text-red-500 mb-4">
            Time&apos;s Up!
          </h2>
          <p className="text-slate-600 mb-6">
            Don&apos;t worry, try again!
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setGameState("menu")}
              className="px-6 py-3 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-all"
            >
              Menu
            </button>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff7bb0] to-[#ff4f8b] text-white font-bold shadow-lg hover:shadow-xl transform transition-all hover:scale-105"
            >
              Try Again!
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffeef7_0,_#ffe1c7_40%,_#f5c3ff_100%)] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/95 rounded-3xl shadow-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="text-2xl">
              🏠
            </Link>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#ff4f8b]">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </div>
              <div className="text-sm text-slate-600">Time Left</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-700 mb-3">
                Target Cupcake 🎯
              </h3>
              <div className="flex justify-center">
                <CupcakeDisplay
                  baseIndex={targetBase}
                  frostingIndex={targetFrosting}
                  toppingIndex={targetTopping}
                />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-700 mb-3">
                Your Cupcake ✨
              </h3>
              <div className="flex justify-center">
                <CupcakeDisplay
                  baseIndex={playerBase}
                  frostingIndex={playerFrosting}
                  toppingIndex={playerTopping}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#f8f3ff] to-[#f0e8ff] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#7c6fa3]">🎂 Base</span>
                <span className="text-sm text-slate-600">
                  {BASES[playerBase]?.label}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPlayerBase((i) => wrapIndex(i - 1, BASES.length));
                    playSound("click", true);
                  }}
                  className="flex-1 px-4 py-2 rounded-full bg-white font-bold hover:scale-105 transition-all"
                >
                  ⬅️ Prev
                </button>
                <button
                  onClick={() => {
                    setPlayerBase((i) => wrapIndex(i + 1, BASES.length));
                    playSound("click", true);
                  }}
                  className="flex-1 px-4 py-2 rounded-full bg-white font-bold hover:scale-105 transition-all"
                >
                  Next ➡️
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#f8f3ff] to-[#f0e8ff] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#7c6fa3]">🧁 Frosting</span>
                <span className="text-sm text-slate-600">
                  {FROSTINGS[playerFrosting]?.label}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPlayerFrosting((i) => wrapIndex(i - 1, FROSTINGS.length));
                    playSound("whoosh", true);
                  }}
                  className="flex-1 px-4 py-2 rounded-full bg-white font-bold hover:scale-105 transition-all"
                >
                  ⬅️ Prev
                </button>
                <button
                  onClick={() => {
                    setPlayerFrosting((i) => wrapIndex(i + 1, FROSTINGS.length));
                    playSound("whoosh", true);
                  }}
                  className="flex-1 px-4 py-2 rounded-full bg-white font-bold hover:scale-105 transition-all"
                >
                  Next ➡️
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#f8f3ff] to-[#f0e8ff] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#7c6fa3]">✨ Toppings</span>
                <span className="text-sm text-slate-600">
                  {TOPPINGS[playerTopping]?.label}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPlayerTopping((i) => wrapIndex(i - 1, TOPPINGS.length));
                    playSound("sparkle", true);
                  }}
                  className="flex-1 px-4 py-2 rounded-full bg-white font-bold hover:scale-105 transition-all"
                >
                  ⬅️ Prev
                </button>
                <button
                  onClick={() => {
                    setPlayerTopping((i) => wrapIndex(i + 1, TOPPINGS.length));
                    playSound("sparkle", true);
                  }}
                  className="flex-1 px-4 py-2 rounded-full bg-white font-bold hover:scale-105 transition-all"
                >
                  Next ➡️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

