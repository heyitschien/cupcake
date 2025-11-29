"use client";

import { Achievement } from "@/utils/achievements";

type AchievementBadgeProps = {
  achievement: Achievement;
  onClose: () => void;
};

export default function AchievementBadge({ achievement, onClose }: AchievementBadgeProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pointer-events-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 transform transition-all animate-bounce-custom">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse-custom">{achievement.emoji}</div>
          <h3 className="text-2xl font-bold text-[#ff4f8b] mb-2">
            Achievement Unlocked!
          </h3>
          <h4 className="text-xl font-semibold text-slate-800 mb-2">
            {achievement.name}
          </h4>
          <p className="text-slate-600 mb-6">{achievement.description}</p>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff7bb0] to-[#ff4f8b] text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
          >
            Awesome! 🎉
          </button>
        </div>
      </div>
    </div>
  );
}

