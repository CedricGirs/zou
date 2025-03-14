
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "../../../context/LanguageContext";
import { StatusItem } from "@/types/StatusTypes";

interface ProgressSectionProps {
  item: StatusItem;
  onUpdate: (id: string, updates: Partial<StatusItem>) => void;
}

const ProgressSection = ({ item, onUpdate }: ProgressSectionProps) => {
  const { t } = useLanguage();
  
  const handleProgressChange = (newProgress: number) => {
    onUpdate(item.id, { progress: newProgress });
    
    // Mark as completed if progress is 100%
    if (newProgress === 100) {
      onUpdate(item.id, { completed: true });
    }
  };
  
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span>{t("progress")}</span>
        <span>{item.progress}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-bar-fill bg-zou-purple"
          style={{ width: `${item.progress}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between space-x-2 mt-2">
        <div className="flex-1">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={item.progress} 
            onChange={(e) => handleProgressChange(Number(e.target.value))}
            className="w-full h-2 accent-zou-purple cursor-pointer"
            disabled={item.type === "language"}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressSection;
