
import { Button } from "@/components/ui/button";
import { Dumbbell, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserData } from "@/context/userData";
import { SportBadge } from "@/types/SportTypes";

export const GymActivity = () => {
  const { userData, updateSportModule } = useUserData();
  const { toast } = useToast();

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
    
    checkAndUnlockBadges(updatedBadges, newTotalVisits, newWeeklyVisits, newStreakDays, now, newXP);
    
    await updateSportModule({
      totalGymVisits: newTotalVisits,
      weeklyGymVisits: newWeeklyVisits,
      sportXP: newXP,
      sportLevel: newLevel,
      maxXP: newMaxXP,
      streakDays: newStreakDays,
      lastActivityDate: now.toISOString(),
      badges: updatedBadges
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

  return (
    <div className="bg-purple-50 p-4 rounded-md">
      <h3 className="font-medium mb-2 flex items-center">
        <Dumbbell className="mr-2 text-purple-500" size={20} />
        Séance de musculation
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Enregistrez votre visite à la salle de musculation pour aujourd'hui
      </p>
      <Button onClick={logGymVisit} className="w-full">
        <Plus className="mr-2" size={16} />
        Enregistrer une visite
      </Button>
    </div>
  );
};
