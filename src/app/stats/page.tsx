"use client";

import Link from "next/link";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AchievementStats, Achievement, getAchievementDefinitions } from "@/utils/achievements";
import { CupcakeData } from "@/utils/cupcakeUtils";

export default function StatsPage() {
  const [stats] = useLocalStorage<AchievementStats>("stats", {
    totalCupcakesCreated: 0,
    basesTried: [],
    frostingsTried: [],
    toppingsTried: [],
    challengesCompleted: 0,
    perfectMatches: 0,
  });
  const [achievements] = useLocalStorage<Achievement[]>("achievements", []);
  const [savedCupcakes] = useLocalStorage<CupcakeData[]>("saved-cupcakes", []);

  const achievementDefs = getAchievementDefinitions();
  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievementDefs.filter(
    (def) => !achievements.find((a) => a.id === def.id && a.unlocked)
  );

  const uniqueBases = new Set(stats.basesTried).size;
  const uniqueFrostings = new Set(stats.frostingsTried).size;
  const uniqueToppings = new Set(stats.toppingsTried).size;

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
            📊 Your Stats 📊
          </h1>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/95 rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-[#ff4f8b] mb-4 text-center">
              🧁 Cupcake Stats
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-semibold">Total Created:</span>
                <span className="text-2xl font-bold text-[#ff4f8b]">
                  {stats.totalCupcakesCreated}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-semibold">Saved Cupcakes:</span>
                <span className="text-2xl font-bold text-[#ff4f8b]">
                  {savedCupcakes.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-semibold">Bases Tried:</span>
                <span className="text-xl font-bold text-slate-600">
                  {uniqueBases} / 6
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-semibold">Frostings Tried:</span>
                <span className="text-xl font-bold text-slate-600">
                  {uniqueFrostings} / 7
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-semibold">Toppings Tried:</span>
                <span className="text-xl font-bold text-slate-600">
                  {uniqueToppings} / 8
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/95 rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-[#ff4f8b] mb-4 text-center">
              🎯 Challenge Stats
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-semibold">Challenges Completed:</span>
                <span className="text-2xl font-bold text-[#ff4f8b]">
                  {stats.challengesCompleted}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-semibold">Perfect Matches:</span>
                <span className="text-2xl font-bold text-[#ff4f8b]">
                  {stats.perfectMatches}
                </span>
              </div>
              {stats.challengesCompleted > 0 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-[#ffe5b4] to-[#fff6cf] rounded-xl">
                  <div className="text-center">
                    <div className="text-sm text-slate-600">Success Rate</div>
                    <div className="text-2xl font-bold text-slate-800">
                      {Math.round((stats.perfectMatches / stats.challengesCompleted) * 100)}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/95 rounded-3xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-[#ff4f8b] mb-4 text-center">
            🏆 Achievements ({unlockedAchievements.length} / {achievementDefs.length})
          </h2>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Unlocked:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {unlockedAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className="bg-gradient-to-br from-[#ffe5b4] to-[#fff6cf] rounded-xl p-3 text-center transform transition-all hover:scale-105"
                >
                  <div className="text-3xl mb-1">{ach.emoji}</div>
                  <div className="text-xs font-bold text-slate-800">{ach.name}</div>
                </div>
              ))}
            </div>
          </div>

          {lockedAchievements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Locked:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {lockedAchievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="bg-slate-100 rounded-xl p-3 text-center opacity-60"
                  >
                    <div className="text-3xl mb-1">🔒</div>
                    <div className="text-xs font-bold text-slate-600">{ach.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{ach.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

