
import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import SkillTree from "../components/skills/SkillTree";
import CustomBadge from "../components/ui/CustomBadge";
import { useLanguage } from "../context/LanguageContext";
import { badgeData } from "../data/badgeData";
import { Badge } from "../types/badge";
import { useToast } from "@/hooks/use-toast";
import { playSound } from "@/utils/audioUtils";
import { useSyncUserData } from "../hooks/useSyncUserData";

const Skills = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { statusModule } = useSyncUserData();
  const [relatedBadges, setRelatedBadges] = useState<Badge[]>([]);
  
  // Filter badges related to skills and learning
  const skillBadges = badgeData.filter(badge => 
    badge.category === "status" || badge.category === "technical" || badge.category === "gamification"
  ).slice(0, 8);
  
  // Update related badges when statusModule changes
  useEffect(() => {
    if (statusModule && statusModule.softSkills && statusModule.softSkills.length > 0) {
      // Find badges related to the user's soft skills
      const softSkillRelatedBadges = badgeData.filter(badge =>
        statusModule.softSkills.some(skill => 
          badge.name.toLowerCase().includes(skill.toLowerCase()) ||
          badge.description.toLowerCase().includes(skill.toLowerCase())
        )
      );
      
      setRelatedBadges(softSkillRelatedBadges.slice(0, 4));
    }
  }, [statusModule.softSkills]);
  
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
        {statusModule.softSkills && statusModule.softSkills.length > 0 && (
          <div className="mt-2">
            <p className="text-zou-purple font-pixel mb-1">{t("yourSkills")}:</p>
            <div className="flex flex-wrap gap-2">
              {statusModule.softSkills.map((skill, index) => (
                <span key={index} className="pixel-card p-1 px-2 text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="glass-card p-4 mb-6">
        <h2 className="font-pixel text-lg mb-4">{t("skillTree")}</h2>
        <SkillTree />
      </div>
      
      <div className="glass-card p-4">
        <h2 className="font-pixel text-lg mb-4">{t("badgesAchievements")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Show related badges based on skills if available */}
          {relatedBadges.length > 0 ? (
            <>
              {relatedBadges.map(badge => (
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
              {skillBadges.slice(0, 8 - relatedBadges.length).map(badge => (
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
            </>
          ) : (
            skillBadges.map(badge => (
              <CustomBadge 
                key={badge.id}
                icon={badge.icon}
                name={badge.name}
                description={badge.description}
                rarity={badge.rarity}
                unlocked={badge.unlocked}
                onClick={() => showBadgeDetails(badge)}
              />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Skills;
