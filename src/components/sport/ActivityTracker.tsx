
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Running, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserData } from "@/context/userData";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

const ActivityTracker = () => {
  const { userData, updateSportModule } = useUserData();
  const { toast } = useToast();
  const [runningKm, setRunningKm] = useState(1);
  
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
    
    // Check for badges
    const updatedBadges = [...userData.sportModule.badges];
    
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
    
    await updateSportModule({
      totalRunningKm: newTotalRunning,
      weeklyRunningKm: newWeeklyRunning,
      sportXP: newXP,
      sportLevel: newLevel,
      maxXP: newMaxXP,
      streakDays: newStreakDays,
      lastActivityDate: now.toISOString(),
      badges: updatedBadges
    });
    
    toast({
      title: "Activité enregistrée!",
      description: `+${xpGained} XP pour votre course`,
      variant: "default",
    });
    
    // Reset slider
    setRunningKm(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enregistrer une activité</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gym">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="gym">
              <Dumbbell className="mr-2" size={16} />
              Musculation
            </TabsTrigger>
            <TabsTrigger value="running">
              <Running className="mr-2" size={16} />
              Course
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gym" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="running" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium mb-2 flex items-center">
                <Running className="mr-2 text-blue-500" size={20} />
                Séance de course
              </h3>
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
              <Button onClick={logRunning} className="w-full" variant="default">
                <Plus className="mr-2" size={16} />
                Enregistrer {runningKm} km
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivityTracker;
