"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CupcakeData, encodeCupcakeData } from "@/utils/cupcakeUtils";

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

function CupcakeThumbnail({ cupcake }: { cupcake: CupcakeData }) {
  const base = BASES[cupcake.baseIndex] ?? BASES[0];
  const frosting = FROSTINGS[cupcake.frostingIndex] ?? FROSTINGS[0];
  const topping = TOPPINGS[cupcake.toppingIndex] ?? TOPPINGS[0];

  return (
    <Link
      href={`/?cupcake=${encodeCupcakeData(cupcake)}`}
      className="block bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transform transition-all duration-200 hover:scale-105"
    >
      <div className="flex items-center justify-center mb-3">
        <div className="relative w-20 h-20 flex items-end justify-center">
          <div className="absolute bottom-0 w-[70%] h-3 bg-gradient-to-b from-white to-[#ddd8f2] rounded-full" />
          <div className="relative w-16 h-14 flex flex-col items-center justify-end">
            <div className={`relative w-14 h-12 rounded-[999px_999px_20px_20px] ${frosting.className}`}>
              <div className="absolute flex gap-0.5 -translate-y-1 left-1/2 -translate-x-1/2">
                {topping.emojis.slice(0, 2).map((emoji, idx) => (
                  <span key={idx} className="text-sm">{emoji}</span>
                ))}
              </div>
            </div>
            <div className={`relative w-full h-8 rounded-[8px_8px_14px_14px] mt-[-6px] ${base.className}`} />
          </div>
        </div>
      </div>
      <h3 className="text-sm font-bold text-center text-slate-800 truncate">
        {cupcake.name}
      </h3>
      <p className="text-xs text-slate-500 text-center mt-1">
        {new Date(cupcake.createdAt).toLocaleDateString()}
      </p>
    </Link>
  );
}

export default function GalleryPage() {
  const [savedCupcakes, setSavedCupcakes] = useLocalStorage<CupcakeData[]>("saved-cupcakes", []);
  const [deleteMode, setDeleteMode] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (deleteMode) {
      setDeletingId(id);
      setTimeout(() => {
        setSavedCupcakes((prev) => {
          const filtered = prev.filter((c) => c.id !== id);
          if (filtered.length === 0) {
            setDeleteMode(false);
          }
          return filtered;
        });
        setDeletingId(null);
      }, 300);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffeef7_0,_#ffe1c7_40%,_#f5c3ff_100%)] p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <Link
            href="/"
            className="inline-block mb-4 text-2xl transform transition-all hover:scale-110"
          >
            🏠
          </Link>
          <h1 className="text-4xl font-extrabold text-[#ff4f8b] mb-2">
            🧁 My Cupcakes 🧁
          </h1>
          <p className="text-slate-600">
            {savedCupcakes.length === 0
              ? "No saved cupcakes yet. Create and save some cupcakes!"
              : `${savedCupcakes.length} saved cupcake${savedCupcakes.length !== 1 ? "s" : ""}`}
          </p>
        </header>

        {savedCupcakes.length > 0 && (
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setDeleteMode(!deleteMode)}
              className={`px-4 py-2 rounded-full font-bold transition-all ${
                deleteMode
                  ? "bg-red-500 text-white"
                  : "bg-white text-slate-700 border-2 border-slate-300"
              }`}
            >
              {deleteMode ? "✓ Done Deleting" : "🗑️ Delete Mode"}
            </button>
          </div>
        )}

        {savedCupcakes.length === 0 ? (
          <div className="text-center py-12 bg-white/90 rounded-3xl shadow-lg">
            <div className="text-6xl mb-4">🧁</div>
            <p className="text-xl text-slate-600 mb-4">No cupcakes saved yet!</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#ff7bb0] to-[#ff4f8b] text-white font-bold shadow-lg hover:shadow-xl transform transition-all hover:scale-105"
            >
              Create Your First Cupcake ✨
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {savedCupcakes.map((cupcake) => (
              <div
                key={cupcake.id}
                className={`relative ${deletingId === cupcake.id ? "opacity-0 scale-0 transition-all duration-300" : ""}`}
              >
                {deleteMode && (
                  <button
                    onClick={() => handleDelete(cupcake.id)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-lg z-10 shadow-lg hover:bg-red-600 transform transition-all hover:scale-110"
                  >
                    ×
                  </button>
                )}
                <CupcakeThumbnail cupcake={cupcake} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

