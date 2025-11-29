Ohhh yes, this is perfect “modern stack with kids” territory. 🧁✨
Let’s make a **Next.js + Tailwind** cupcake game that you can:

* run locally
* preview on your phone
* later deploy to Vercel in 1 click

I’ll keep it as **simple as possible** but still clean and modern.

---

## 1️⃣ Create the Next.js App (with Tailwind)

In your terminal:

```bash
npx create-next-app@latest cupcake-designer \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

When it finishes:

```bash
cd cupcake-designer
npm run dev
```

Open `http://localhost:3000` on your laptop.

> 📱 To preview on your phone on the same Wi-Fi:
> Use your laptop’s IP, e.g. `http://192.168.1.23:3000`

---

## 2️⃣ Replace the Home Page With the Cupcake Game

Open:
`src/app/page.tsx`
Delete everything and paste this:

```tsx
"use client";

import { useState } from "react";

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

export default function Home() {
  const [baseIndex, setBaseIndex] = useState(0);
  const [frostingIndex, setFrostingIndex] = useState(0);
  const [toppingIndex, setToppingIndex] = useState(0);
  const [cupcakeName, setCupcakeName] = useState<string | null>(null);

  const base = BASES[baseIndex];
  const frosting = FROSTINGS[frostingIndex];
  const topping = TOPPINGS[toppingIndex];

  function handleRandom() {
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
  }

  function handleNameYourself() {
    const name = window.prompt("What is your cupcake’s name?");
    if (name && name.trim()) {
      setCupcakeName(name.trim());
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffeef7_0,_#ffe1c7_40%,_#f5c3ff_100%)] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white/90 shadow-2xl px-4 py-5 sm:px-5 sm:py-6">
        {/* Header */}
        <header className="text-center mb-4">
          <h1 className="text-2xl font-extrabold tracking-wide text-[#ff4f8b]">
            Cupcake Designer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tap to mix bases, frosting & toppings — then name your creation!
          </p>
        </header>

        {/* Cupcake Preview */}
        <section className="flex items-center justify-center py-4">
          <div className="relative w-44 h-44 flex items-end justify-center">
            {/* Plate */}
            <div className="absolute bottom-0 w-[80%] h-4 sm:h-5 bg-gradient-to-b from-white to-[#ddd8f2] rounded-full shadow-md" />

            {/* Cupcake */}
            <div className="relative w-28 h-36 flex flex-col items-center justify-end translate-y-[-6px]">
              {/* Frosting */}
              <div
                className={`relative w-24 h-20 rounded-[999px_999px_24px_24px] shadow-md flex items-center justify-center ${frosting.className}`}
              >
                {/* swirl blobs using pseudo "layers" */}
                <div className="absolute w-20 h-10 rounded-full bg-white/40 top-[-8px] left-[10px]" />
                <div className="absolute w-9 h-6 rounded-full bg-white/40 top-[-16px] right-[14px]" />

                {/* toppings */}
                <div className="absolute flex gap-1 -translate-y-1">
                  {topping.emojis.map((emoji, idx) => (
                    <span
                      key={idx}
                      className="text-lg drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                    >
                      {emoji}
                    </span>
                  ))}
                </div>

                {/* frosting label */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.18em] text-slate-700 font-bold whitespace-nowrap">
                  {frosting.label}
                </div>
              </div>

              {/* Base */}
              <div
                className={`relative w-full h-[52px] rounded-[10px_10px_18px_18px] overflow-hidden flex items-end justify-center shadow-lg mt-[-10px] ${base.className}`}
              >
                {/* stripes */}
                <div className="absolute inset-0 flex opacity-35">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="flex-1 bg-white/70 mx-[2px]"
                    />
                  ))}
                </div>
                <div className="absolute bottom-1 left-0 right-0 text-center text-[0.6rem] uppercase tracking-[0.18em] font-bold text-black/70">
                  {base.label}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cupcake Name */}
        <section className="mb-3">
          <div className="text-center text-sm font-semibold text-[#4f325e]">
            <span className="inline-block bg-white/90 px-3 py-1 rounded-full shadow-sm">
              {cupcakeName ?? "✨ Tap “Random Cupcake” to get a magic name!"}
            </span>
          </div>
        </section>

        {/* Controls */}
        <section className="flex flex-col gap-2.5 text-xs sm:text-sm">
          {/* Base control */}
          <div className="rounded-2xl bg-[#f8f3ff] px-3 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[0.65rem] uppercase tracking-[0.18em] font-semibold text-[#7c6fa3]">
                Base
              </span>
              <span className="text-xs font-semibold text-[#493a73]">
                {base.label}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                className="inline-flex items-center gap-1 rounded-full bg-white text-[#493a73] font-semibold px-3 py-1.5 shadow-sm active:translate-y-px"
                onClick={() => setBaseIndex((i) => wrapIndex(i - 1, BASES.length))}
              >
                <span>⬅️</span>
                Prev
              </button>
              <button
                className="inline-flex items-center gap-1 rounded-full bg-white text-[#493a73] font-semibold px-3 py-1.5 shadow-sm active:translate-y-px"
                onClick={() => setBaseIndex((i) => wrapIndex(i + 1, BASES.length))}
              >
                Next
                <span>➡️</span>
              </button>
            </div>
          </div>

          {/* Frosting control */}
          <div className="rounded-2xl bg-[#f8f3ff] px-3 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[0.65rem] uppercase tracking-[0.18em] font-semibold text-[#7c6fa3]">
                Frosting
              </span>
              <span className="text-xs font-semibold text-[#493a73]">
                {frosting.label}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                className="inline-flex items-center gap-1 rounded-full bg-white text-[#493a73] font-semibold px-3 py-1.5 shadow-sm active:translate-y-px"
                onClick={() =>
                  setFrostingIndex((i) => wrapIndex(i - 1, FROSTINGS.length))
                }
              >
                <span>⬅️</span>
                Prev
              </button>
              <button
                className="inline-flex items-center gap-1 rounded-full bg-white text-[#493a73] font-semibold px-3 py-1.5 shadow-sm active:translate-y-px"
                onClick={() =>
                  setFrostingIndex((i) => wrapIndex(i + 1, FROSTINGS.length))
                }
              >
                Next
                <span>➡️</span>
              </button>
            </div>
          </div>

          {/* Toppings control */}
          <div className="rounded-2xl bg-[#f8f3ff] px-3 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[0.65rem] uppercase tracking-[0.18em] font-semibold text-[#7c6fa3]">
                Toppings
              </span>
              <span className="text-xs font-semibold text-[#493a73]">
                {topping.label}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                className="inline-flex items-center gap-1 rounded-full bg-white text-[#493a73] font-semibold px-3 py-1.5 shadow-sm active:translate-y-px"
                onClick={() =>
                  setToppingIndex((i) => wrapIndex(i - 1, TOPPINGS.length))
                }
              >
                <span>⬅️</span>
                Prev
              </button>
              <button
                className="inline-flex items-center gap-1 rounded-full bg-white text-[#493a73] font-semibold px-3 py-1.5 shadow-sm active:translate-y-px"
                onClick={() =>
                  setToppingIndex((i) => wrapIndex(i + 1, TOPPINGS.length))
                }
              >
                Next
                <span>➡️</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-2xl bg-[#f8f3ff] px-3 py-2.5">
            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#ff7bb0] to-[#ff4f8b] text-white font-semibold px-3.5 py-1.5 shadow-md active:translate-y-px"
                onClick={handleRandom}
              >
                <span>🎲</span>
                Random Cupcake
              </button>
              <button
                className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#79689e66] bg-transparent text-[#493a73] font-semibold px-3.5 py-1.5 active:translate-y-px"
                onClick={handleNameYourself}
              >
                <span>💬</span>
                Name It Yourself
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-3 text-center text-[0.65rem] text-slate-500">
          Made with love for Uncle Chien & the nieces 🧁
        </footer>
      </div>
    </main>
  );
}
```

That’s it — this gives you a **fully working cupcake designer game** in a modern stack.

* Click **Prev/Next** on each row to change:

  * base
  * frosting
  * toppings
* Click **🎲 Random Cupcake** → random combo + fun name
* Click **💬 Name It Yourself** → kids type their own cupcake name

---

## 3️⃣ (Optional) Tiny Tailwind Clean-Up

Since `create-next-app` already sets up Tailwind, you don’t *have* to touch CSS, but I like to keep the body clean.

In `src/app/globals.css`, you can keep the default, or simplify to:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  height: 100%;
}
```

---

## 4️⃣ Next Steps / Upgrades (For Later)

When the nieces get bored of version 1, we can add:

* ✨ **Save favorites** (store cupcakes in localStorage)
* 🔊 **Sound effects** when randomizing or naming
* 📸 **“Share my cupcake”** – generate a shareable image/card
* 🎯 **Mini game mode** – “Can you build this cupcake?” then show a target they must match

---

If you want, send me a screenshot of it running, and we can do **“version 2”** together with sounds or saving favorites.
