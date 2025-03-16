
import { Button } from "@/components/ui/button";
import { Dumbbell, Plus, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserData } from "@/context/userData";
import { SportBadge } from "@/types/SportTypes";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const GymActivity = () => {
  const { userData, updateSportModule } = useUserData();
  const { toast } = useToast();

  // Make sure sportModule exists
  if (!userData.sportModule) {
    return (
      <div className="text-center p-4">
        <p>Module Sport non disponible</p>
      </div>
    );
  }

  const logGymVisit = async () => {
    const now = new Date();
    const newTotalVisits = userData.sportModule.totalGymVisits + 1;
    const newWeeklyVisits = userData.sportModule.weeklyGymVisits + 1;
    const xpGained = 20; // XP for a gym visit
    
    // Check for streak (if last activity was yesterday)
    const lastActivity = userData.sportModule.lastActivityDate 
      ? new Date(userData.sportModule.lastActivityDate) 
      : null;
    
    let newStreakDays = userData.sportModule.streakDays;
    if (lastActivity) {
      const diffDays = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreakDays += 1;
      } else if (diffDays > 1) {
        newStreakDays = 1;
      }
    } else {
      newStreakDays = 1;
    }
    
    // Update XP and check for level up
    let newXP = userData.sportModule.sportXP + xpGained;
    let newLevel = userData.sportModule.sportLevel;
    let newMaxXP = userData.sportModule.maxXP;
    
    if (newXP >= newMaxXP) {
      newLevel += 1;
      newXP = newXP - newMaxXP;
      newMaxXP = Math.floor(newMaxXP * 1.5);
      
      toast({
        title: "Niveau supérieur!",
        description: `Vous avez atteint le niveau ${newLevel} en sport!`,
        variant: "default",
      });
    }
    
    // Check for badges
    const updatedBadges = [...userData.sportModule.badges];
    
    // Record daily activity data
    const currentDate = format(now, 'yyyy-MM-dd');
    const dailyActivities = userData.sportModule.dailyActivities || {};
    const dayEntry = dailyActivities[currentDate] || { gymVisits: 0, runningKm: 0 };
    
    // Update today's entry
    dailyActivities[currentDate] = {
      ...dayEntry,
      gymVisits: dayEntry.gymVisits + 1,
      date: now.toISOString()
    };
    
    checkAndUnlockBadges(updatedBadges, newTotalVisits, newWeeklyVisits, newStreakDays, now, newXP);
    
    await updateSportModule({
      totalGymVisits: newTotalVisits,
      weeklyGymVisits: newWeeklyVisits,
      sportXP: newXP,
      sportLevel: newLevel,
      maxXP: newMaxXP,
      streakDays: newStreakDays,
      lastActivityDate: now.toISOString(),
      badges: updatedBadges,
      dailyActivities
    });
    
    toast({
      title: "Activité enregistrée!",
      description: `+${xpGained} XP pour votre séance d'entraînement`,
      variant: "default",
    });
  };

  const checkAndUnlockBadges = (
    updatedBadges: SportBadge[], 
    newTotalVisits: number, 
    newWeeklyVisits: number, 
    newStreakDays: number,
    now: Date,
    newXP: number
  ) => {
    // First gym visit badge
    if (newTotalVisits === 1) {
      const badgeIndex = updatedBadges.findIndex(b => b.id === "first_gym_visit");
      if (badgeIndex !== -1 && !updatedBadges[badgeIndex].completed) {
        updatedBadges[badgeIndex].completed = true;
        updatedBadges[badgeIndex].dateUnlocked = now.toISOString();
        newXP += updatedBadges[badgeIndex].xpReward;
        
        toast({
          title: "Badge débloqué!",
          description: updatedBadges[badgeIndex].name,
          variant: "default",
        });
      }
    }
    
    // 3 gym visits in a week badge
    if (newWeeklyVisits >= 3) {
      const badgeIndex = updatedBadges.findIndex(b => b.id === "gym_3_times");
      if (badgeIndex !== -1 && !updatedBadges[badgeIndex].completed) {
        updatedBadges[badgeIndex].completed = true;
        updatedBadges[badgeIndex].dateUnlocked = now.toISOString();
        newXP += updatedBadges[badgeIndex].xpReward;
        
        toast({
          title: "Badge débloqué!",
          description: updatedBadges[badgeIndex].name,
          variant: "default",
        });
      }
    }
    
    // 7-day streak badge
    if (newStreakDays >= 7) {
      const badgeIndex = updatedBadges.findIndex(b => b.id === "streak_7_days");
      if (badgeIndex !== -1 && !updatedBadges[badgeIndex].completed) {
        updatedBadges[badgeIndex].completed = true;
        updatedBadges[badgeIndex].dateUnlocked = now.toISOString();
        newXP += updatedBadges[badgeIndex].xpReward;
        
        toast({
          title: "Badge débloqué!",
          description: updatedBadges[badgeIndex].name,
          variant: "default",
        });
      }
    }
  };

  // Get today's formatted date
  const today = format(new Date(), 'EEEE d MMMM', { locale: fr });

  return (
    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md">
      <h3 className="font-medium mb-1 flex items-center">
        <Dumbbell className="mr-2 text-purple-500" size={20} />
        Séance de musculation
      </h3>
      
      <div className="text-xs text-muted-foreground mb-4 flex items-center">
        <Calendar size={12} className="mr-1" />
        <span>Aujourd'hui - {today}</span>
      </div>
      
      <Button onClick={logGymVisit} className="w-full bg-purple-600 hover:bg-purple-700">
        <Plus className="mr-2" size={16} />
        Enregistrer une visite
      </Button>
    </div>
  );
};
