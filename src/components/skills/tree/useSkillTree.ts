
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { playSound } from "@/utils/audioUtils";
import { Skill } from "@/types/StatusTypes";
import { useUserData } from "@/context/userData";
import { useLanguage } from "@/context/LanguageContext";

export const useSkillTree = (skills: Skill[], onSkillsUpdate: (skills: Skill[]) => Promise<void>) => {
  const { t } = useLanguage();
  const { userData, updateStatusModule } = useUserData();
  const [localSkills, setLocalSkills] = useState<Skill[]>(skills);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeBranch, setActiveBranch] = useState<"all" | "weapons" | "defense" | "magic">("all");
  
  useEffect(() => {
    if (skills.length > 0) {
      setLocalSkills(skills);
    }
  }, [skills]);
  
  const getBranchColor = (branch: string, unlocked: boolean, level: number) => {
    if (!unlocked) return "bg-gray-400 dark:bg-gray-600 opacity-60";
    
    const intensity = Math.min(100, 50 + level * 15);
    
    switch (branch) {
      case "weapons":
        return `bg-red-${intensity} shadow-lg shadow-red-${intensity}/50`;
      case "defense":
        return `bg-blue-${intensity} shadow-lg shadow-blue-${intensity}/50`;
      case "magic":
        return `bg-purple-${intensity} shadow-lg shadow-purple-${intensity}/50`;
      default:
        return "bg-gray-400";
    }
  };
  
  const getTextColor = (branch: string) => {
    switch (branch) {
      case "weapons": return "text-red-500";
      case "defense": return "text-blue-500";
      case "magic": return "text-purple-500";
      default: return "text-gray-500";
    }
  };
  
  const getConnectionColor = (branch: string, sourceUnlocked: boolean, targetUnlocked: boolean) => {
    if (!sourceUnlocked) return "#444444";
    
    switch (branch) {
      case "weapons":
        return targetUnlocked ? "#ff6b6b" : "#ff6b6b80";
      case "defense":
        return targetUnlocked ? "#4dabf7" : "#4dabf780";
      case "magic":
        return targetUnlocked ? "#cc5de8" : "#cc5de880";
      default:
        return "#9b87f5";
    }
  };
  
  const toggleSkill = (skill: Skill) => {
    if (selectedSkill && selectedSkill.id === skill.id) {
      setSelectedSkill(null);
    } else {
      setSelectedSkill(skill);
    }
  };
  
  const canLevelUp = (skill: Skill) => {
    if (!skill.unlocked) return false;
    return skill.level < skill.maxLevel;
  };
  
  const canUnlock = (skillId: string) => {
    const skillToUnlock = localSkills.find(s => s.id === skillId);
    if (!skillToUnlock || skillToUnlock.unlocked) return false;
    
    if (skillToUnlock.requirements) {
      return skillToUnlock.requirements.every(req => {
        const prereqSkill = localSkills.find(s => s.id === req.skillId);
        return prereqSkill && prereqSkill.unlocked && 
               (!req.level || prereqSkill.level >= req.level);
      });
    }
    
    const connectedSkills = localSkills.filter(s => 
      s.connections.includes(skillId)
    );
    
    return connectedSkills.some(s => s.unlocked);
  };
  
  const unlockSkill = async (skillId: string) => {
    const skillToUnlock = localSkills.find(s => s.id === skillId);
    if (!skillToUnlock) return;
    
    if (!canUnlock(skillId)) {
      toast({
        title: t("cannotUnlock"),
        description: t("unlockPrerequisites"),
        variant: "destructive",
      });
      return;
    }
    
    const updatedSkills = localSkills.map(skill => 
      skill.id === skillId ? { ...skill, unlocked: true, level: 1 } : skill
    );
    
    setLocalSkills(updatedSkills);
    setSelectedSkill(updatedSkills.find(s => s.id === skillId) || null);
    
    try {
      await onSkillsUpdate(updatedSkills);
      
      const xpReward = skillToUnlock.xpReward;
      const newXP = userData.statusModule.statusXP + xpReward;
      let newLevel = userData.statusModule.statusLevel;
      let newMaxXP = userData.statusModule.maxXP;
      
      if (newXP >= newMaxXP) {
        newLevel += 1;
        newMaxXP = Math.floor(newMaxXP * 1.5);
      }
      
      await updateStatusModule({
        statusXP: newXP,
        statusLevel: newLevel,
        maxXP: newMaxXP
      });
      
      playSound('badge');
      toast({
        title: t("skillUnlocked"),
        description: `${skillToUnlock.name} (+${xpReward} XP)`,
      });
    } catch (error) {
      console.error("Error unlocking skill:", error);
      toast({
        title: t("error"),
        description: t("errorUnlockingSkill"),
        variant: "destructive",
      });
    }
  };
  
  const levelUpSkill = async (skillId: string) => {
    const skillToLevel = localSkills.find(s => s.id === skillId);
    if (!skillToLevel || !canLevelUp(skillToLevel)) return;
    
    const newLevel = skillToLevel.level + 1;
    const updatedSkills = localSkills.map(skill => 
      skill.id === skillId ? { ...skill, level: newLevel } : skill
    );
    
    setLocalSkills(updatedSkills);
    setSelectedSkill(updatedSkills.find(s => s.id === skillId) || null);
    
    try {
      await onSkillsUpdate(updatedSkills);
      
      const xpReward = Math.floor(skillToLevel.xpReward * 0.5);
      const newXP = userData.statusModule.statusXP + xpReward;
      let newLevel = userData.statusModule.statusLevel;
      let newMaxXP = userData.statusModule.maxXP;
      
      if (newXP >= newMaxXP) {
        newLevel += 1;
        newMaxXP = Math.floor(newMaxXP * 1.5);
      }
      
      await updateStatusModule({
        statusXP: newXP,
        statusLevel: newLevel,
        maxXP: newMaxXP
      });
      
      playSound('levelUp');
      toast({
        title: t("skillLevelUp"),
        description: `${skillToLevel.name} (${t("level")} ${newLevel}) (+${xpReward} XP)`,
      });
    } catch (error) {
      console.error("Error leveling up skill:", error);
      toast({
        title: t("error"),
        description: t("errorLevelingSkill"),
        variant: "destructive",
      });
    }
  };
  
  const filteredSkills = activeBranch === "all" 
    ? localSkills 
    : localSkills.filter(skill => skill.branch === activeBranch);
    
  return {
    localSkills,
    filteredSkills,
    selectedSkill,
    activeBranch,
    setActiveBranch,
    getBranchColor,
    getTextColor,
    getConnectionColor,
    toggleSkill,
    canLevelUp,
    canUnlock,
    unlockSkill,
    levelUpSkill
  };
};
