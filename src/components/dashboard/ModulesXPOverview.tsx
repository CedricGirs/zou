
import { useUserData } from "@/context/UserDataContext";
import { Award, Brain, DollarSign, Dumbbell, ShirtIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/context/LanguageContext";
import { playSound } from "@/utils/audioUtils";

interface ModuleProgress {
  name: string;
  level: number;
  currentXP: number;
  maxXP: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  path: string;
  variant: "default" | "success" | "warning" | "danger" | "purple" | "gradient" | "minimal" | "income" | "expense" | "savings" | "emerald" | "blue" | "red" | "green";
}

const ModulesXPOverview = () => {
  const { userData } = useUserData();
  const { t } = useLanguage();
  
  // Extract all module progress data
  const modules: ModuleProgress[] = [
    {
      name: t("statusModule"),
      level: userData.statusModule.statusLevel || 1,
      currentXP: userData.statusModule.statusXP || 0,
      maxXP: userData.statusModule.maxXP || 100,
      icon: <Brain className="h-5 w-5" />,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
      path: "/status",
      variant: "emerald"
    },
    {
      name: t("lookModule"),
      level: userData.lookModule.styleLevel || 1,
      currentXP: userData.lookModule.styleXP || 0,
      maxXP: userData.lookModule.maxXP || 100,
      icon: <ShirtIcon className="h-5 w-5" />,
      color: "bg-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      path: "/look",
      variant: "blue"
    },
    {
      name: t("financeModule"),
      level: userData.financeModule.financeLevel || 1,
      currentXP: userData.financeModule.currentXP || 0,
      maxXP: userData.financeModule.maxXP || 100,
      icon: <DollarSign className="h-5 w-5" />,
      color: "bg-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      path: "/finances",
      variant: "purple"
    },
    {
      name: t("sportModule"),
      level: userData.sportModule.sportLevel || 1,
      currentXP: userData.sportModule.sportXP || 0,
      maxXP: userData.sportModule.maxXP || 100,
      icon: <Dumbbell className="h-5 w-5" />,
      color: "bg-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      path: "/sport",
      variant: "red"
    }
  ];
  
  const handleModuleClick = (path: string, name: string) => {
    playSound('click');
    window.location.href = path;
  };
  
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="text-zou-purple" size={18} />
        <h2 className="font-pixel text-lg">{t("modulesProgress")}</h2>
      </div>
      
      <div className="space-y-4">
        {modules.map((module) => {
          const progressPercentage = Math.min(100, Math.floor((module.currentXP / module.maxXP) * 100));
          
          return (
            <div 
              key={module.name} 
              className="pixel-card hover:translate-x-1 transition-transform cursor-pointer"
              onClick={() => handleModuleClick(module.path, module.name)}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-full ${module.bgColor}`}>
                  {module.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{module.name}</span>
                    <span className="text-xs font-pixel bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                      LV {module.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress 
                      value={progressPercentage} 
                      className="h-2 flex-1" 
                      variant={module.variant}
                    />
                    <span className="text-xs tabular-nums">
                      {module.currentXP}/{module.maxXP}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModulesXPOverview;
