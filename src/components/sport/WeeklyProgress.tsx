
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Activity } from "lucide-react";  // Changed Running to Activity
import { useUserData } from "@/context/userData";

const WeeklyProgress = () => {
  const { userData } = useUserData();
  const { sportModule } = userData;
  
  // Définition des objectifs hebdomadaires
  const weeklyGymTarget = 4; // 4 visites par semaine
  const weeklyRunningTarget = 15; // 15 km par semaine
  
  // Calcul des pourcentages
  const gymPercentage = Math.min(100, (sportModule.weeklyGymVisits / weeklyGymTarget) * 100);
  const runningPercentage = Math.min(100, (sportModule.weeklyRunningKm / weeklyRunningTarget) * 100);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progression Hebdomadaire</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Dumbbell className="mr-2 text-purple-500" size={18} />
                <span className="font-medium">Musculation</span>
              </div>
              <span className="text-sm font-mono">
                {sportModule.weeklyGymVisits} / {weeklyGymTarget} visites
              </span>
            </div>
            <Progress value={gymPercentage} className="h-3" variant="purple" />
            <p className="text-xs text-muted-foreground mt-1">
              {gymPercentage >= 100 
                ? "Objectif atteint! 🎉" 
                : `Encore ${weeklyGymTarget - sportModule.weeklyGymVisits} visite(s) pour atteindre votre objectif`}
            </p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Activity className="mr-2 text-blue-500" size={18} />  {/* Changed to Activity */}
                <span className="font-medium">Course</span>
              </div>
              <span className="text-sm font-mono">
                {sportModule.weeklyRunningKm} / {weeklyRunningTarget} km
              </span>
            </div>
            <Progress value={runningPercentage} className="h-3" variant="gradient" />
            <p className="text-xs text-muted-foreground mt-1">
              {runningPercentage >= 100 
                ? "Objectif atteint! 🎉" 
                : `Encore ${(weeklyRunningTarget - sportModule.weeklyRunningKm).toFixed(1)} km pour atteindre votre objectif`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgress;
