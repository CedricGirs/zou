
import { Circle } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { Skill } from "@/types/StatusTypes";

interface SkillDetailsProps {
  selectedSkill: Skill | null;
  getTextColor: (branch: string) => string;
  iconMap: Record<string, JSX.Element>;
  canUnlock: (skillId: string) => boolean;
  unlockSkill: (skillId: string) => Promise<void>;
  canLevelUp: (skill: Skill) => boolean;
  levelUpSkill: (skillId: string) => Promise<void>;
}

const SkillDetails = ({ 
  selectedSkill, 
  getTextColor, 
  iconMap, 
  canUnlock, 
  unlockSkill, 
  canLevelUp, 
  levelUpSkill 
}: SkillDetailsProps) => {
  const { t } = useLanguage();
  
  if (!selectedSkill) return null;
  
  return (
    <div 
      className="absolute glass-card p-4 w-72 z-20 animate-fade-in backdrop-blur-lg"
      style={{ 
        left: `${Math.min(80, Math.max(20, selectedSkill.position.x))}%`, 
        top: `${Math.min(80, Math.max(20, selectedSkill.position.y + 10))}%`,
        borderColor: selectedSkill.branch === "weapons" ? "rgba(255,100,100,0.3)" : 
                   selectedSkill.branch === "defense" ? "rgba(100,150,255,0.3)" : 
                   "rgba(200,100,255,0.3)"
      }}
    >
      <div className="flex items-center mb-2">
        <div className={`mr-2 ${getTextColor(selectedSkill.branch)}`}>
          {iconMap[selectedSkill.icon] || <Circle size={16} />}
        </div>
        <h3 className="font-pixel text-sm">{selectedSkill.name}</h3>
        {selectedSkill.unlocked && (
          <div className="ml-auto">
            <div className={`text-xs font-semibold px-2 py-0.5 rounded 
              ${selectedSkill.branch === "weapons" ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" : 
                selectedSkill.branch === "defense" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" : 
                "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"}`
              }
            >
              {t("level")} {selectedSkill.level}/{selectedSkill.maxLevel}
            </div>
          </div>
        )}
      </div>
      <p className="text-xs mb-3">{selectedSkill.description}</p>
      
      <div className="flex justify-between gap-2">
        {!selectedSkill.unlocked && (
          <button 
            className={`w-full pixel-button text-[10px] ${!canUnlock(selectedSkill.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => canUnlock(selectedSkill.id) && unlockSkill(selectedSkill.id)}
            disabled={!canUnlock(selectedSkill.id)}
          >
            {t("unlock")} (+{selectedSkill.xpReward} XP)
          </button>
        )}
        
        {selectedSkill.unlocked && canLevelUp(selectedSkill) && (
          <button 
            className="w-full pixel-button text-[10px]"
            onClick={() => levelUpSkill(selectedSkill.id)}
          >
            {t("levelUp")} (+{Math.floor(selectedSkill.xpReward * 0.5)} XP)
          </button>
        )}
        
        {selectedSkill.unlocked && !canLevelUp(selectedSkill) && (
          <div className="w-full text-center text-xs text-green-500 font-medium py-1">
            {t("maxLevelReached")}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillDetails;
