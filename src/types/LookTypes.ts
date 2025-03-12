
export interface LookModule {
  wardrobe: string[];
  sportsFrequency: string;
  style: 'classic' | 'sporty' | 'streetwear';
  styleXP: number;
  styleLevel: number;
  maxXP: number;
  achievements: StyleAchievement[];
}

export interface StyleAchievement {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  xpReward: number;
}

export interface StyleAdvice {
  outfit: string;
  description: string;
  occasion: string;
  weatherTips: string;
  personalizedTips?: string;
}
