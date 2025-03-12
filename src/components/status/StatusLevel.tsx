
import { useUserData } from "@/context/userData";
import { Progress } from "@/components/ui/progress";
import { Award, Trophy, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import XPBar from "../dashboard/XPBar";

const StatusLevel = () => {
  const { userData } = useUserData();
  const { t } = useLanguage();
  
  const { statusXP = 0, statusLevel = 1, maxXP = 100 } = userData.statusModule;
  
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-pixel">
          <Award className="text-zou-purple" size={20} />
          {t("progressTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
            <Trophy size={18} className="text-zou-purple" />
            <span className="font-pixel text-sm mr-1">{t("level")}</span>
            <span className="bg-zou-purple text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              {statusLevel}
            </span>
          </div>
          
          <div className="flex-1">
            <XPBar 
              currentXP={statusXP} 
              maxXP={maxXP} 
              animated={true}
              variant="purple"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
          <div className="flex flex-col items-center bg-amber-100 dark:bg-amber-950/40 rounded-lg p-3">
            <Flame size={16} className="text-amber-500 mb-1" />
            <span className="text-xs font-medium text-center">{t("progressMotivation")}</span>
          </div>
          <div className="flex flex-col items-center bg-emerald-100 dark:bg-emerald-950/40 rounded-lg p-3">
            <Award size={16} className="text-emerald-500 mb-1" />
            <span className="text-xs font-medium text-center">{t("progressXPTip")}</span>
          </div>
          <div className="flex flex-col items-center bg-violet-100 dark:bg-violet-950/40 rounded-lg p-3">
            <Trophy size={16} className="text-violet-500 mb-1" />
            <span className="text-xs font-medium text-center">{t("progressNextLevel")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusLevel;
