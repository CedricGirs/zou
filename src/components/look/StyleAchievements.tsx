
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserData } from "@/context/userData";
import { Crown, Sparkles, Star, Trophy, Heart, Zap, GraduationCap, Palette } from "lucide-react";
import CustomBadge from "@/components/ui/CustomBadge";
import { useToast } from "@/hooks/use-toast";

const StyleAchievements = () => {
  const { userData, updateLookModule } = useUserData();
  const { toast } = useToast();
  
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
    },
    {
      id: "color_harmony",
      icon: <Palette size={18} />,
      name: "Harmonie Chromatique",
      description: "Créer une tenue avec des couleurs parfaitement assorties",
      rarity: "rare" as const,
      xpReward: 75
    },
    {
      id: "style_advisor",
      icon: <GraduationCap size={18} />,
      name: "Conseiller en Style",
      description: "Utiliser le conseiller de style 5 fois",
      rarity: "uncommon" as const,
      xpReward: 60
    },
    {
      id: "quick_change",
      icon: <Zap size={18} />,
      name: "Quick Change",
      description: "Créer 3 tenues différentes en une session",
      rarity: "uncommon" as const,
      xpReward: 80
    },
    {
      id: "fashion_enthusiast",
      icon: <Heart size={18} />,
      name: "Passionné de Mode",
      description: "Explorer toutes les catégories de vêtements",
      rarity: "epic" as const,
      xpReward: 120
    }
  ];
  
  const unlockAchievement = async (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return;
    
    // Check if already completed
    if (userData.lookModule?.achievements?.some(a => a.id === achievementId && a.completed)) {
      toast({
        title: "Succès déjà débloqué",
        description: "Vous avez déjà débloqué ce succès.",
        variant: "default",
      });
      return;
    }
    
    const newXP = (userData.lookModule?.styleXP || 0) + achievement.xpReward;
    let newLevel = userData.lookModule?.styleLevel || 1;
    let newMaxXP = userData.lookModule?.maxXP || 100;
    
    if (newXP >= newMaxXP) {
      newLevel += 1;
      newMaxXP = Math.floor(newMaxXP * 1.5);
      
      toast({
        title: "Niveau supérieur!",
        description: `Vous avez atteint le niveau ${newLevel} en style!`,
        variant: "success",
      });
    } else {
      toast({
        title: "Succès débloqué!",
        description: `${achievement.name}: +${achievement.xpReward} XP`,
        variant: "success",
      });
    }
    
    // Update user data with new achievement and XP
    const updatedAchievements = [
      ...(userData.lookModule?.achievements || []),
      { ...achievement, completed: true }
    ];
    
    await updateLookModule({
      styleXP: newXP,
      styleLevel: newLevel,
      maxXP: newMaxXP,
      achievements: updatedAchievements
    });
  };

  // Auto-unlock the first achievement if the user has created a complete outfit
  useEffect(() => {
    const hasCreatedOutfit = userData.lookModule?.styleXP > 0;
    const hasFirstOutfitAchievement = userData.lookModule?.achievements?.some(
      a => a.id === "first_outfit" && a.completed
    );
    
    if (hasCreatedOutfit && !hasFirstOutfitAchievement) {
      unlockAchievement("first_outfit");
    }
    
    // Auto-unlock the fashion expert achievement if the user reaches level 10
    const hasReachedLevel10 = (userData.lookModule?.styleLevel || 0) >= 10;
    const hasFashionExpertAchievement = userData.lookModule?.achievements?.some(
      a => a.id === "fashion_expert" && a.completed
    );
    
    if (hasReachedLevel10 && !hasFashionExpertAchievement) {
      unlockAchievement("fashion_expert");
    }
  }, [userData.lookModule?.styleXP, userData.lookModule?.styleLevel]);

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
