
export interface SportModule {
  weeklyGymVisits: number;
  weeklyRunningKm: number;
  totalGymVisits: number;
  totalRunningKm: number;
  sportXP: number;
  sportLevel: number;
  maxXP: number;
  streakDays: number;
  lastActivityDate: string | null;
  badges: SportBadge[];
}

export interface SportBadge {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  xpReward: number;
  dateUnlocked?: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface ActivityLog {
  id: string;
  type: 'gym' | 'running';
  date: string;
  value: number; // Either 1 visit for gym or kilometers for running
  xpEarned: number;
}

export interface SportStats {
  weeklyGymTarget: number;
  weeklyRunningTarget: number;
  gymStreak: number;
  runningStreak: number;
  personalBests: {
    longestRun: number;
    mostGymVisitsWeek: number;
  };
}
