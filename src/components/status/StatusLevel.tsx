
import { useUserData } from "@/context/userData";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const StatusLevel = () => {
  const { userData } = useUserData();
  const { t } = useLanguage();
  
  const { statusXP = 0, statusLevel = 1, maxXP = 100 } = userData.statusModule;
  const percentProgress = (statusXP / maxXP) * 100;
  
  return (
    <div className="glass-card p-4">
      <h3 className="font-pixel text-lg mb-3">{t("progressTitle")}</h3>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-zou-purple/20 rounded-full flex items-center justify-center">
          <span className="text-zou-purple font-pixel text-lg">{statusLevel}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between mb-1 text-xs font-medium">
            <span className="flex items-center gap-1">
              <span className="text-zou-purple">NIV</span>
            </span>
            <span>
              {statusXP}<span className="text-muted-foreground">ₓₚ</span> / {maxXP}
            </span>
          </div>
          <Progress value={percentProgress} className="h-2" variant="purple" />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-amber-100 dark:bg-amber-900/20 rounded-lg p-2 flex flex-col items-center">
          <span className="text-amber-500 mb-1">🔥</span>
          <span className="text-[10px] text-center">{t("progressMotivation")}</span>
        </div>
        <div className="bg-emerald-100 dark:bg-emerald-900/20 rounded-lg p-2 flex flex-col items-center">
          <span className="text-emerald-500 mb-1">🎯</span>
          <span className="text-[10px] text-center">{t("progressXPTip")}</span>
        </div>
        <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-2 flex flex-col items-center">
          <span className="text-purple-500 mb-1">🏆</span>
          <span className="text-[10px] text-center">{t("progressNextLevel")}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusLevel;
