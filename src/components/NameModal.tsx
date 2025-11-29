"use client";

import { useState, useEffect, useRef } from "react";

const EMOJIS = ["🧁", "✨", "🎂", "💖", "🌈", "⭐", "🎉", "🍰", "💝", "🎈", "🦄", "🌟"];

type NameModalProps = {
  isOpen: boolean;
  currentName: string | null;
  onClose: () => void;
  onSave: (name: string) => void;
};

export default function NameModal({ isOpen, currentName, onSave, onClose }: NameModalProps) {
  const [name, setName] = useState(currentName || "");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setName(currentName || "");
  }, [currentName]);

  if (!isOpen) return null;

  const handleSave = () => {
    const finalName = selectedEmoji ? `${selectedEmoji} ${name.trim()}` : name.trim();
    if (finalName) {
      onSave(finalName);
      onClose();
      setName("");
      setSelectedEmoji("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-[#ff4f8b] mb-4 text-center">
          Name Your Cupcake! 🧁
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Cupcake Name
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter a fun name..."
            maxLength={30}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#f0e8ff] focus:border-[#ff4f8b] focus:outline-none text-lg"
          />
          <div className="text-xs text-slate-500 mt-1 text-right">
            {name.length}/30
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Add an Emoji (optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setSelectedEmoji(selectedEmoji === emoji ? "" : emoji)}
                className={`text-2xl p-2 rounded-lg transition-all transform hover:scale-110 ${
                  selectedEmoji === emoji
                    ? "bg-[#ff4f8b] scale-110"
                    : "bg-[#f8f3ff] hover:bg-[#f0e8ff]"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#ff7bb0] to-[#ff4f8b] text-white font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
          >
            Save ✨
          </button>
        </div>
      </div>
    </div>
  );
}

