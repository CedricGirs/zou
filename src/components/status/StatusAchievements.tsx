
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserData } from "@/context/userData";
import { Trophy, Sparkles, Award, Book, Languages, Brain, GraduationCap, Palette } from "lucide-react";
import CustomBadge from "@/components/ui/CustomBadge";
import { useToast } from "@/hooks/use-toast";

const StatusAchievements = () => {
  const { userData, updateStatusModule } = useUserData();
  const { toast } = useToast();
  
  const achievements = [
    {
      id: "first_course",
      icon: <Book size={18} />,
      name: "Première Formation",
      description: "Ajouter votre première formation",
      rarity: "common" as const,
      xpReward: 25
    },
    {
      id: "first_language",
      icon: <Languages size={18} />,
      name: "Polyglotte",
      description: "Ajouter votre première langue",
      rarity: "common" as const,
      xpReward: 20
    },
    {
      id: "first_skill",
      icon: <Brain size={18} />,
      name: "Compétent",
      description: "Ajouter votre première compétence",
      rarity: "common" as const,
      xpReward: 15
    },
    {
      id: "language_master",
      icon: <Sparkles size={18} />,
      name: "Maître Linguiste",
      description: "Atteindre le niveau C2 dans une langue",
      rarity: "epic" as const,
      xpReward: 50
    },
    {
      id: "course_complete",
      icon: <GraduationCap size={18} />,
      name: "Diplômé",
      description: "Terminer une formation à 100%",
      rarity: "uncommon" as const,
      xpReward: 30
    },
    {
      id: "certificate_collector",
      icon: <Award size={18} />,
      name: "Collectionneur",
      description: "Obtenir 3 certificats",
      rarity: "rare" as const,
      xpReward: 40
    },
    {
      id: "skill_expert",
      icon: <Palette size={18} />,
      name: "Expert",
      description: "Atteindre 100% dans 3 compétences",
      rarity: "rare" as const,
      xpReward: 35
    },
    {
      id: "jack_of_all_trades",
      icon: <Trophy size={18} />,
      name: "Touche-à-tout",
      description: "Avoir au moins une entrée dans chaque catégorie",
      rarity: "legendary" as const,
      xpReward: 45
    }
  ];
  
  const unlockAchievement = async (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return;
    
    // Check if already completed
    if (userData.statusModule.achievements?.some(a => a.id === achievementId && a.completed)) {
      toast({
        title: "Succès déjà débloqué",
        description: "Vous avez déjà débloqué ce succès.",
        variant: "default",
      });
      return;
    }
    
    const newXP = (userData.statusModule.statusXP || 0) + achievement.xpReward;
    let newLevel = userData.statusModule.statusLevel || 1;
    let newMaxXP = userData.statusModule.maxXP || 100;
    
    if (newXP >= newMaxXP) {
      newLevel += 1;
      newMaxXP = Math.floor(newMaxXP * 1.5);
      
      toast({
        title: "Niveau supérieur!",
        description: `Vous avez atteint le niveau ${newLevel} en formation!`,
        variant: "default",
      });
    } else {
      toast({
        title: "Succès débloqué!",
        description: `${achievement.name}: +${achievement.xpReward} XP`,
        variant: "default",
      });
    }
    
    // Update user data with new achievement and XP
    const updatedAchievements = [
      ...(userData.statusModule.achievements || []),
      { ...achievement, completed: true }
    ];
    
    await updateStatusModule({
      statusXP: newXP,
      statusLevel: newLevel,
      maxXP: newMaxXP,
      achievements: updatedAchievements
    });
  };

  // Check for achievements completion conditions
  useEffect(() => {
    const checkAchievements = async () => {
      const statusItems = userData.statusItems || [];
      const achievements = userData.statusModule.achievements || [];
      
      // First course achievement
      const hasCourse = statusItems.some(item => item.type === "course");
      const hasFirstCourseAchievement = achievements.some(a => a.id === "first_course" && a.completed);
      if (hasCourse && !hasFirstCourseAchievement) {
        await unlockAchievement("first_course");
      }
      
      // First language achievement
      const hasLanguage = statusItems.some(item => item.type === "language");
      const hasFirstLanguageAchievement = achievements.some(a => a.id === "first_language" && a.completed);
      if (hasLanguage && !hasFirstLanguageAchievement) {
        await unlockAchievement("first_language");
      }
      
      // First skill achievement
      const hasSkill = statusItems.some(item => item.type === "skill");
      const hasFirstSkillAchievement = achievements.some(a => a.id === "first_skill" && a.completed);
      if (hasSkill && !hasFirstSkillAchievement) {
        await unlockAchievement("first_skill");
      }
      
      // Language Master achievement
      const hasC2Language = statusItems.some(item => item.type === "language" && (item as any).level === "C2");
      const hasLanguageMasterAchievement = achievements.some(a => a.id === "language_master" && a.completed);
      if (hasC2Language && !hasLanguageMasterAchievement) {
        await unlockAchievement("language_master");
      }
      
      // Course complete achievement
      const hasCompletedCourse = statusItems.some(item => item.type === "course" && item.progress === 100);
      const hasCourseCompleteAchievement = achievements.some(a => a.id === "course_complete" && a.completed);
      if (hasCompletedCourse && !hasCourseCompleteAchievement) {
        await unlockAchievement("course_complete");
      }
      
      // Certificate collector achievement
      const certificateCount = statusItems.filter(item => item.certificate).length;
      const hasCertificateCollectorAchievement = achievements.some(a => a.id === "certificate_collector" && a.completed);
      if (certificateCount >= 3 && !hasCertificateCollectorAchievement) {
        await unlockAchievement("certificate_collector");
      }
      
      // Skill expert achievement
      const completedSkills = statusItems.filter(item => item.type === "skill" && item.progress === 100).length;
      const hasSkillExpertAchievement = achievements.some(a => a.id === "skill_expert" && a.completed);
      if (completedSkills >= 3 && !hasSkillExpertAchievement) {
        await unlockAchievement("skill_expert");
      }
      
      // Jack of all trades achievement
      const hasAllTypes = 
        statusItems.some(item => item.type === "course") && 
        statusItems.some(item => item.type === "language") && 
        statusItems.some(item => item.type === "skill");
      const hasJackOfAllTradesAchievement = achievements.some(a => a.id === "jack_of_all_trades" && a.completed);
      if (hasAllTypes && !hasJackOfAllTradesAchievement) {
        await unlockAchievement("jack_of_all_trades");
      }
    };
    
    checkAchievements();
  }, [userData.statusItems]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy size={20} />
          Succès Formation
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
              unlocked={userData.statusModule.achievements?.some(
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

export default StatusAchievements;
