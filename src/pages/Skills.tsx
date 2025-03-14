
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
import StatusLevel from "@/components/status/StatusLevel";
import { Skill } from "@/types/StatusTypes";
import SkillCategoryStats from "@/components/skills/SkillCategoryStats";

const Skills = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { userData, updateSkills } = useUserData();
  
  // État local pour les badges
  const [skillBadges, setSkillBadges] = useState<Badge[]>([]);
  
  // Calculate stats for each skill category
  const getSkillStats = () => {
    const stats = {
      weapons: { total: 0, unlocked: 0, maxed: 0 },
      defense: { total: 0, unlocked: 0, maxed: 0 },
      magic: { total: 0, unlocked: 0, maxed: 0 }
    };
    
    if (userData.skills) {
      userData.skills.forEach(skill => {
        if (skill.branch === 'weapons') {
          stats.weapons.total++;
          if (skill.unlocked) {
            stats.weapons.unlocked++;
            if (skill.level >= skill.maxLevel) {
              stats.weapons.maxed++;
            }
          }
        } else if (skill.branch === 'defense') {
          stats.defense.total++;
          if (skill.unlocked) {
            stats.defense.unlocked++;
            if (skill.level >= skill.maxLevel) {
              stats.defense.maxed++;
            }
          }
        } else if (skill.branch === 'magic') {
          stats.magic.total++;
          if (skill.unlocked) {
            stats.magic.unlocked++;
            if (skill.level >= skill.maxLevel) {
              stats.magic.maxed++;
            }
          }
        }
      });
    }
    
    return stats;
  };
  
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
      
      {/* Stats grid with both level progress and category stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Left side: StatusLevel */}
        <div className="col-span-1">
          <StatusLevel />
        </div>
        
        {/* Right side: Skills Overview */}
        <div className="col-span-1 md:col-span-2">
          <SkillCategoryStats stats={getSkillStats()} />
        </div>
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
