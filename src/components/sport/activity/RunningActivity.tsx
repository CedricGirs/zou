
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity, Plus, Calendar } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useUserData } from "@/context/userData";
import { SportBadge } from "@/types/SportTypes";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const RunningActivity = () => {
  const { userData, updateSportModule } = useUserData();
  const { toast } = useToast();
  const [runningKm, setRunningKm] = useState(1);

  // Make sure sportModule exists
  if (!userData.sportModule) {
    return (
      <div className="text-center p-4">
        <p>Module Sport non disponible</p>
      </div>
    );
  }

  const logRunning = async () => {
    const now = new Date();
    const newTotalRunning = userData.sportModule.totalRunningKm + runningKm;
    const newWeeklyRunning = userData.sportModule.weeklyRunningKm + runningKm;
    const xpGained = Math.floor(runningKm * 10); // 10 XP per km
    
    // Check for streak
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
    
    // Record daily activity data
    const currentDate = format(now, 'yyyy-MM-dd');
    const dailyActivities = userData.sportModule.dailyActivities || {};
    const dayEntry = dailyActivities[currentDate] || { gymVisits: 0, runningKm: 0 };
    
    // Update today's entry
    dailyActivities[currentDate] = {
      ...dayEntry, 
      runningKm: dayEntry.runningKm + runningKm,
      date: now.toISOString()
    };
    
    // Check for badges
    const updatedBadges = [...userData.sportModule.badges];
    
    checkAndUnlockBadges(updatedBadges, newTotalRunning, newWeeklyRunning, newStreakDays, now, newXP);
    
    await updateSportModule({
      totalRunningKm: newTotalRunning,
      weeklyRunningKm: newWeeklyRunning,
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
      description: `+${xpGained} XP pour votre course`,
      variant: "default",
    });
    
    // Reset slider
    setRunningKm(1);
  };

  const checkAndUnlockBadges = (
    updatedBadges: SportBadge[], 
    newTotalRunning: number,
    newWeeklyRunning: number, 
    newStreakDays: number,
    now: Date,
    newXP: number
  ) => {
    // First run badge
    if (userData.sportModule.totalRunningKm === 0) {
      const badgeIndex = updatedBadges.findIndex(b => b.id === "first_run");
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
    
    // 10km in a week badge
    if (newWeeklyRunning >= 10) {
      const badgeIndex = updatedBadges.findIndex(b => b.id === "run_10km");
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
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
      <h3 className="font-medium mb-1 flex items-center">
        <Activity className="mr-2 text-blue-500" size={20} />
        Séance de course
      </h3>
      
      <div className="text-xs text-muted-foreground mb-4 flex items-center">
        <Calendar size={12} className="mr-1" />
        <span>Aujourd'hui - {today}</span>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground">Distance (km)</span>
          <span className="font-medium">{runningKm} km</span>
        </div>
        <Slider
          value={[runningKm]}
          min={0.5}
          max={42}
          step={0.5}
          onValueChange={(value) => setRunningKm(value[0])}
          className="mb-4"
        />
      </div>
      <Button onClick={logRunning} className="w-full bg-blue-600 hover:bg-blue-700">
        <Plus className="mr-2" size={16} />
        Enregistrer {runningKm} km
      </Button>
    </div>
  );
};
