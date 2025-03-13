
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
import XPBar from "@/components/dashboard/XPBar";

const Skills = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { userData, updateSkills } = useUserData();
  
  // État local pour les badges
  const [skillBadges, setSkillBadges] = useState<Badge[]>([]);
  
  // Calculate overall skill mastery
  const calculateOverallMastery = () => {
    if (!userData.skills || userData.skills.length === 0) return 0;
    
    const unlockedSkills = userData.skills.filter(s => s.unlocked);
    if (unlockedSkills.length === 0) return 0;
    
    const totalLevels = unlockedSkills.reduce((sum, skill) => sum + skill.level, 0);
    const maxPossibleLevels = unlockedSkills.reduce((sum, skill) => sum + skill.maxLevel, 0);
    
    return Math.floor((totalLevels / maxPossibleLevels) * 100);
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-1">
          <StatusLevel />
        </div>
        <div className="col-span-1 md:col-span-2 glass-card p-4">
          <h2 className="font-pixel text-lg mb-2">{t("skillsOverview")}</h2>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{t("overallMastery")}</span>
              <span className="text-sm font-medium">{calculateOverallMastery()}%</span>
            </div>
            <XPBar 
              currentXP={calculateOverallMastery()} 
              maxXP={100} 
              animated={true}
              variant="gradient"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-red-100 dark:bg-red-900/20 rounded-lg p-3 flex flex-col items-center">
              <span className="text-red-600 dark:text-red-400 font-pixel text-sm">{t("weapons")}</span>
              <span className="text-2xl font-bold mt-1">
                {userData.skills?.filter((s: Skill) => s.branch === "weapons" && s.unlocked).length || 0}/
                {userData.skills?.filter((s: Skill) => s.branch === "weapons").length || 10}
              </span>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-3 flex flex-col items-center">
              <span className="text-blue-600 dark:text-blue-400 font-pixel text-sm">{t("defense")}</span>
              <span className="text-2xl font-bold mt-1">
                {userData.skills?.filter((s: Skill) => s.branch === "defense" && s.unlocked).length || 0}/
                {userData.skills?.filter((s: Skill) => s.branch === "defense").length || 10}
              </span>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-3 flex flex-col items-center">
              <span className="text-purple-600 dark:text-purple-400 font-pixel text-sm">{t("magic")}</span>
              <span className="text-2xl font-bold mt-1">
                {userData.skills?.filter((s: Skill) => s.branch === "magic" && s.unlocked).length || 0}/
                {userData.skills?.filter((s: Skill) => s.branch === "magic").length || 10}
              </span>
            </div>
          </div>
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
