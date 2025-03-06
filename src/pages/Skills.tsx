
import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import SkillTree from "../components/skills/SkillTree";
import CustomBadge from "../components/ui/CustomBadge";
import { useLanguage } from "../context/LanguageContext";
import { badgeData } from "../data/badgeData";
import { Badge } from "../types/badge";
import { useToast } from "@/hooks/use-toast";
import { playSound } from "@/utils/audioUtils";
import { useUserData } from "../context/UserDataContext";

const Skills = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { userData, updateSkills } = useUserData();
  
  // État local pour les badges
  const [skillBadges, setSkillBadges] = useState<Badge[]>([]);
  
  // Charger les badges au démarrage
  useEffect(() => {
    // Filter badges related to skills and learning
    const filteredBadges = badgeData.filter(badge => 
      badge.category === "status" || badge.category === "technical" || badge.category === "gamification"
    ).slice(0, 8);
    
    setSkillBadges(filteredBadges);
  }, []);
  
  const showBadgeDetails = (badge: Badge) => {
    if (badge.unlocked) {
      playSound('badge');
      toast({
        title: badge.name,
        description: `${badge.description}${badge.unlockedDate ? `\n${t("unlockedOn")}: ${new Date(badge.unlockedDate).toLocaleDateString()}` : ''}`,
        duration: 3000,
      });
    } else {
      toast({
        title: t("badgeLocked"),
        description: t("completeRequirements"),
        duration: 3000,
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="font-pixel text-2xl mb-2">{t("skillsTitle")}</h1>
        <p className="text-muted-foreground">{t("skillsSubtitle")}</p>
      </div>
      
      <div className="glass-card p-4 mb-6">
        <h2 className="font-pixel text-lg mb-4">{t("skillTree")}</h2>
        <SkillTree 
          skills={userData.skills} 
          onSkillsUpdate={updateSkills} 
        />
      </div>
      
      <div className="glass-card p-4">
        <h2 className="font-pixel text-lg mb-4">{t("badgesAchievements")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skillBadges.map(badge => (
            <CustomBadge 
              key={badge.id}
              icon={badge.icon}
              name={badge.name}
              description={badge.description}
              rarity={badge.rarity}
              unlocked={badge.unlocked}
              onClick={() => showBadgeDetails(badge)}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Skills;
