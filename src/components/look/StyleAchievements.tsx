
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserData } from "@/context/userData";
import { Crown, Sparkles, Star, Trophy, Heart } from "lucide-react";
import CustomBadge from "@/components/ui/CustomBadge";

const StyleAchievements = () => {
  const { userData, updateLookModule } = useUserData();
  
  const achievements = [
    {
      id: "first_outfit",
      icon: <Star size={18} />,
      name: "Premier Ensemble",
      description: "Créer votre première tenue complète",
      rarity: "common" as const,
      xpReward: 50
    },
    {
      id: "style_master",
      icon: <Crown size={18} />,
      name: "Maître du Style",
      description: "Créer 10 tenues différentes",
      rarity: "rare" as const,
      xpReward: 100
    },
    {
      id: "seasonal_planner",
      icon: <Sparkles size={18} />,
      name: "Planificateur Saisonnier",
      description: "Planifier une semaine complète de tenues",
      rarity: "epic" as const,
      xpReward: 150
    },
    {
      id: "fashion_expert",
      icon: <Trophy size={18} />,
      name: "Expert Mode",
      description: "Atteindre le niveau 10 en style",
      rarity: "legendary" as const,
      xpReward: 200
    }
  ];
  
  const unlockAchievement = async (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return;
    
    const newXP = (userData.lookModule?.styleXP || 0) + achievement.xpReward;
    let newLevel = userData.lookModule?.styleLevel || 1;
    let newMaxXP = userData.lookModule?.maxXP || 100;
    
    if (newXP >= newMaxXP) {
      newLevel += 1;
      newMaxXP = Math.floor(newMaxXP * 1.5);
    }
    
    await updateLookModule({
      styleXP: newXP,
      styleLevel: newLevel,
      maxXP: newMaxXP,
      achievements: [
        ...(userData.lookModule?.achievements || []),
        { ...achievement, completed: true }
      ]
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy size={20} />
          Succès Style
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map(achievement => (
            <CustomBadge
              key={achievement.id}
              icon={achievement.icon}
              name={achievement.name}
              description={achievement.description}
              rarity={achievement.rarity}
              unlocked={userData.lookModule?.achievements?.some(
                a => a.id === achievement.id && a.completed
              )}
              onClick={() => unlockAchievement(achievement.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StyleAchievements;
