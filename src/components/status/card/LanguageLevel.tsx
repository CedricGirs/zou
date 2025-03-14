
import { ArrowUp } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { StatusItem } from "@/types/StatusTypes";

// Language level definitions
const languageLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const levelToProgress = {
  "A1": 17,
  "A2": 33,
  "B1": 50,
  "B2": 67,
  "C1": 83,
  "C2": 100
};

interface LanguageLevelProps {
  item: StatusItem;
  onUpdate: (id: string, updates: Partial<StatusItem>) => void;
}

const LanguageLevel = ({ item, onUpdate }: LanguageLevelProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  // Function to increment language level
  const incrementLanguageLevel = () => {
    if (item.type === "language" && item.level) {
      const currentLevelIndex = languageLevels.indexOf(item.level);
      if (currentLevelIndex < languageLevels.length - 1) {
        const newLevel = languageLevels[currentLevelIndex + 1];
        const newProgress = levelToProgress[newLevel as keyof typeof levelToProgress];
        
        onUpdate(item.id, { 
          level: newLevel,
          progress: newProgress,
          completed: newLevel === "C2"
        });
        
        toast({
          title: t("success"),
          description: `${t("levelUpgraded")} ${item.level} → ${newLevel}`,
        });
      }
    }
  };

  if (item.type !== "language" || !item.level) return null;
  
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-xs font-medium mr-2">{t("level")}:</span>
          <div className="bg-zou-purple text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
            {item.level}
          </div>
        </div>
        {item.level !== "C2" && (
          <button 
            onClick={incrementLanguageLevel}
            className="text-zou-purple hover:bg-zou-purple/10 p-1 rounded-full transition-colors"
            title={t('upgradeLevel')}
          >
            <ArrowUp size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default LanguageLevel;
export { languageLevels, levelToProgress };
