
import { Trophy, Dumbbell, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import XPBar from "@/components/dashboard/XPBar";
import { useUserData } from "@/context/userData";

const SportHeader = () => {
  const { userData } = useUserData();
  const { sportModule } = userData;

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <Trophy className="text-zou-purple" size={32} />
        Sport & Fitness
      </h1>
      <p className="text-muted-foreground mb-4">
        Suivez vos activités, gagnez des badges et progressez
      </p>
      
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-100">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
              {sportModule.sportLevel}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Niveau {sportModule.sportLevel} - Sportif</h3>
              <XPBar 
                currentXP={sportModule.sportXP} 
                maxXP={sportModule.maxXP} 
                variant="gradient" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div className="p-2 bg-white rounded-md shadow-sm">
              <Dumbbell className="mx-auto mb-1 text-purple-500" size={24} />
              <div className="text-2xl font-bold">{sportModule.weeklyGymVisits}</div>
              <div className="text-xs text-muted-foreground">Visites salle cette semaine</div>
            </div>
            
            <div className="p-2 bg-white rounded-md shadow-sm">
              <Timer className="mx-auto mb-1 text-blue-500" size={24} />
              <div className="text-2xl font-bold">{sportModule.weeklyRunningKm} km</div>
              <div className="text-xs text-muted-foreground">Course cette semaine</div>
            </div>
            
            <div className="p-2 bg-white rounded-md shadow-sm">
              <Trophy className="mx-auto mb-1 text-amber-500" size={24} />
              <div className="text-2xl font-bold">{sportModule.badges.filter(b => b.completed).length}</div>
              <div className="text-xs text-muted-foreground">Badges débloqués</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SportHeader;
