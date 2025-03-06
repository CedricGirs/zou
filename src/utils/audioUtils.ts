
// Cache for loaded audio files
const audioCache: Record<string, HTMLAudioElement> = {};

// Sound effect paths
const soundEffects = {
  click: "/sounds/click.mp3",
  badge: "/sounds/badge.mp3",
  levelUp: "/sounds/level-up.mp3"
};

/**
 * Plays a sound effect
 * @param sound The sound effect to play (click, badge, levelUp)
 */
export const playSound = (sound: keyof typeof soundEffects) => {
  try {
    // Check if audio is already cached
    if (!audioCache[sound]) {
      const audio = new Audio(soundEffects[sound]);
      audioCache[sound] = audio;
    }
    
    // Reset and play
    const audio = audioCache[sound];
    audio.currentTime = 0;
    audio.play().catch(err => {
      console.error("Error playing sound:", err);
    });
  } catch (error) {
    console.error("Failed to play sound:", error);
  }
};

// Preload sounds for better performance
export const preloadSounds = () => {
  Object.keys(soundEffects).forEach(key => {
    const sound = key as keyof typeof soundEffects;
    if (!audioCache[sound]) {
      const audio = new Audio(soundEffects[sound]);
      audio.preload = "auto";
      audioCache[sound] = audio;
    }
  });
};
