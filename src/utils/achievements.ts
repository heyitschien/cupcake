export type Achievement = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: number;
};

export type AchievementStats = {
  totalCupcakesCreated: number;
  basesTried: number[];
  frostingsTried: number[];
  toppingsTried: number[];
  challengesCompleted: number;
  perfectMatches: number;
};

const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, "unlocked" | "unlockedAt">[] = [
  { id: "first-cupcake", name: "First Creation", description: "Create your first cupcake", emoji: "🎉" },
  { id: "ten-cupcakes", name: "Cupcake Master", description: "Create 10 cupcakes", emoji: "🏆" },
  { id: "fifty-cupcakes", name: "Cupcake Legend", description: "Create 50 cupcakes", emoji: "👑" },
  { id: "all-bases", name: "Base Explorer", description: "Try all cake bases", emoji: "🎂" },
  { id: "all-frostings", name: "Frosting Artist", description: "Try all frosting styles", emoji: "🧁" },
  { id: "all-toppings", name: "Topping Collector", description: "Try all toppings", emoji: "✨" },
  { id: "perfect-match", name: "Perfect Match", description: "Complete a challenge perfectly", emoji: "⭐" },
  { id: "five-challenges", name: "Challenge Champion", description: "Complete 5 challenges", emoji: "🎯" },
];

export function checkAchievements(
  stats: AchievementStats,
  currentAchievements: Achievement[]
): Achievement[] {
  const newAchievements: Achievement[] = [];

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    const existing = currentAchievements.find((a) => a.id === def.id);
    if (existing?.unlocked) continue;

    let unlocked = false;

    switch (def.id) {
      case "first-cupcake":
        unlocked = stats.totalCupcakesCreated >= 1;
        break;
      case "ten-cupcakes":
        unlocked = stats.totalCupcakesCreated >= 10;
        break;
      case "fifty-cupcakes":
        unlocked = stats.totalCupcakesCreated >= 50;
        break;
      case "all-bases":
        unlocked = new Set(stats.basesTried).size >= 5; // Assuming 5+ bases
        break;
      case "all-frostings":
        unlocked = new Set(stats.frostingsTried).size >= 7; // Assuming 7+ frostings
        break;
      case "all-toppings":
        unlocked = new Set(stats.toppingsTried).size >= 8; // Assuming 8+ toppings
        break;
      case "perfect-match":
        unlocked = stats.perfectMatches >= 1;
        break;
      case "five-challenges":
        unlocked = stats.challengesCompleted >= 5;
        break;
    }

    if (unlocked) {
      newAchievements.push({
        ...def,
        unlocked: true,
        unlockedAt: Date.now(),
      });
    }
  }

  return newAchievements;
}

export function getAchievementDefinitions() {
  return ACHIEVEMENT_DEFINITIONS;
}

