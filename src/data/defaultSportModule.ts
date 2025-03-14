
import { SportModule } from "@/types/SportTypes";

export const defaultSportModule: SportModule = {
  weeklyGymVisits: 0,
  weeklyRunningKm: 0,
  totalGymVisits: 0,
  totalRunningKm: 0,
  sportXP: 0,
  sportLevel: 1,
  maxXP: 100,
  streakDays: 0,
  lastActivityDate: null,
  badges: [
    {
      id: "first_gym_visit",
      name: "Premier Pas",
      description: "Première visite à la salle de musculation",
      completed: false,
      xpReward: 25,
      icon: "dumbbell",
      rarity: "common"
    },
    {
      id: "first_run",
      name: "Coureur Débutant",
      description: "Premier kilomètre parcouru",
      completed: false,
      xpReward: 25,
      icon: "running",
      rarity: "common"
    },
    {
      id: "gym_3_times",
      name: "Persévérance",
      description: "Aller à la salle 3 fois en une semaine",
      completed: false,
      xpReward: 50,
      icon: "trophy",
      rarity: "uncommon"
    },
    {
      id: "run_10km",
      name: "Semi-Marathonien",
      description: "Courir 10km en une semaine",
      completed: false,
      xpReward: 50,
      icon: "medal",
      rarity: "uncommon"
    },
    {
      id: "streak_7_days",
      name: "Discipline de Fer",
      description: "Faire du sport 7 jours d'affilée",
      completed: false,
      xpReward: 100,
      icon: "flame",
      rarity: "rare"
    }
  ]
};
