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

export function playSound(type: "click" | "whoosh" | "pop" | "success" | "sparkle", enabled: boolean = true) {
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

