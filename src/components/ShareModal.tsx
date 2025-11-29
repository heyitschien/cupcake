"use client";

import { useState } from "react";
import { CupcakeData, encodeCupcakeData } from "@/utils/cupcakeUtils";
import { generateCupcakeImage, downloadImage } from "@/utils/imageGenerator";

type ShareModalProps = {
  isOpen: boolean;
  cupcakeData: CupcakeData;
  onClose: () => void;
};

export default function ShareModal({ isOpen, cupcakeData, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const shareUrl = typeof window !== "undefined" 
    ? `${window.location.origin}?cupcake=${encodeCupcakeData(cupcakeData)}`
    : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const dataUrl = await generateCupcakeImage(cupcakeData);
      downloadImage(dataUrl, `${cupcakeData.name.replace(/[^a-z0-9]/gi, "_")}_cupcake.png`);
    } catch (err) {
      console.error("Failed to generate image:", err);
      alert("Failed to generate image. Please try again.");
    } finally {
      setDownloading(false);
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
          Share Your Cupcake! 🧁
        </h2>

        <div className="space-y-4">
          <button
            onClick={handleCopy}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#ff7bb0] to-[#ff4f8b] text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            {copied ? "✓ Copied!" : "📋 Copy Link"}
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#ff4f8b] text-[#ff4f8b] font-bold hover:bg-[#ff4f8b] hover:text-white transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {downloading ? "⏳ Generating..." : "📸 Download Image"}
          </button>

          <div className="pt-4 border-t">
            <p className="text-xs text-slate-500 text-center mb-2">Share Link:</p>
            <div className="bg-slate-50 p-2 rounded-lg text-xs break-all font-mono">
              {shareUrl}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}

