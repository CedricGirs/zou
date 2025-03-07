
// Cache pour les fichiers audio chargés
const audioCache: Record<string, HTMLAudioElement> = {};

// Chemins des effets sonores
export const soundEffects = {
  click: "/sounds/click.mp3",
  badge: "/sounds/badge.mp3",
  levelUp: "/sounds/level-up.mp3",
  success: "/sounds/level-up.mp3",
  delete: "/sounds/click.mp3",
  achievement: "/sounds/badge.mp3",
  transaction: "/sounds/click.mp3"
};

// Type des effets sonores disponibles
export type SoundEffectType = keyof typeof soundEffects;

/**
 * Joue un effet sonore
 * @param sound L'effet sonore à jouer (click, badge, levelUp, success, delete, achievement, transaction)
 * @param volume Volume du son (0-1, par défaut 0.7)
 */
export const playSound = (sound: SoundEffectType, volume: number = 0.7) => {
  try {
    // Vérifier si l'audio est déjà en cache
    if (!audioCache[sound]) {
      const audio = new Audio(soundEffects[sound]);
      audioCache[sound] = audio;
    }
    
    // Réinitialiser et jouer
    const audio = audioCache[sound];
    audio.volume = volume;
    audio.currentTime = 0;
    
    audio.play().catch(err => {
      console.error("Erreur lors de la lecture du son:", err);
    });
  } catch (error) {
    console.error("Échec de la lecture du son:", error);
  }
};

/**
 * Précharger les sons pour de meilleures performances
 */
export const preloadSounds = () => {
  Object.keys(soundEffects).forEach(key => {
    const sound = key as SoundEffectType;
    if (!audioCache[sound]) {
      const audio = new Audio(soundEffects[sound]);
      audio.preload = "auto";
      audioCache[sound] = audio;
    }
  });
};

/**
 * Vérifier si le son est activé dans le navigateur
 */
export const isSoundEnabled = (): boolean => {
  return !document.querySelector('html')?.classList.contains('sound-disabled');
};

/**
 * Activer ou désactiver le son
 */
export const toggleSound = (enabled: boolean): void => {
  if (enabled) {
    document.querySelector('html')?.classList.remove('sound-disabled');
  } else {
    document.querySelector('html')?.classList.add('sound-disabled');
  }
};
