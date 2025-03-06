
import { ReactNode } from 'react';

export interface Badge {
  id: string;
  icon: ReactNode;
  name: string;
  description: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  unlocked: boolean;
  unlockedDate?: string;
  category: string;
  progress?: number; // Optional progress percentage (0-100)
}
