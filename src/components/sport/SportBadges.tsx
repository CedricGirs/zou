
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserData } from "@/context/userData";
import CustomBadge from "@/components/ui/CustomBadge";
import { Trophy, Dumbbell, Activity, Medal, Flame, Timer, Award, Target } from "lucide-react";

const SportBadges = () => {
  const { userData } = useUserData();
  const { sportModule } = userData;
  
  if (!sportModule) {
    return null;
  }
  
  // Mapping des icônes pour les badges
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "dumbbell": return <Dumbbell size={18} />;
      case "running": return <Activity size={18} />;
      case "trophy": return <Trophy size={18} />;
      case "medal": return <Medal size={18} />;
      case "flame": return <Flame size={18} />;
      case "timer": return <Timer size={18} />;
      case "award": return <Award size={18} />;
      case "target": return <Target size={18} />;
      default: return <Trophy size={18} />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="text-amber-500" size={20} />
          Badges Sportifs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sportModule.badges.map(badge => (
            <CustomBadge
              key={badge.id}
              icon={getIconComponent(badge.icon)}
              name={badge.name}
              description={badge.description}
              rarity={badge.rarity}
              unlocked={badge.completed}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SportBadges;
