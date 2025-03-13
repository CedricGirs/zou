import { Progress } from "@/components/ui/progress";
import { Sword, Shield, Wand } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SkillCategoryStatsProps {
  stats: {
    weapons: { total: number, unlocked: number, maxed: number },
    defense: { total: number, unlocked: number, maxed: number },
    magic: { total: number, unlocked: number, maxed: number }
  }
}

const SkillCategoryStats = ({ stats }: SkillCategoryStatsProps) => {
  const { t } = useLanguage();
  
  const calculateProgress = (branch: 'weapons' | 'defense' | 'magic') => {
    return (stats[branch].unlocked / stats[branch].total) * 100;
  };
  
  const calculateMastery = (branch: 'weapons' | 'defense' | 'magic') => {
    return stats[branch].unlocked === 0 ? 0 : (stats[branch].maxed / stats[branch].unlocked) * 100;
  };
  
  // Map French names to categories as shown in the image
  const categoryMappings = {
    weapons: { name: "Armes", equalsTo: "Productivité" },
    defense: { name: "Défense", equalsTo: "Santé" },
    magic: { name: "Magie", equalsTo: "Connaissance" }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Left side: StatusLevel (keep existing) */}
      <div className="col-span-1">
        <div className="glass-card p-4">
          <h3 className="font-pixel text-lg mb-3">{t("progressTitle")}</h3>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-zou-purple/20 rounded-full flex items-center justify-center">
              <span className="text-zou-purple font-pixel text-lg">1</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1 text-xs font-medium">
                <span className="flex items-center gap-1">
                  <span className="text-zou-purple">NIV</span>
                </span>
                <span>
                  XP<span className="text-muted-foreground">₀</span> / 100
                </span>
              </div>
              <Progress value={0} className="h-2" variant="purple" />
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
      </div>
      
      {/* Right side: Skills Overview (new pixel style) */}
      <div className="col-span-1 md:col-span-2 glass-card p-4">
        <h3 className="font-pixel text-lg mb-3">{t("skillsOverview")}</h3>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1 text-sm">
            <span className="font-pixel text-sm">{t("overallMastery")}</span>
            <span className="font-pixel text-sm">0%</span>
          </div>
          <div className="flex justify-between mb-1 text-xs">
            <span className="text-muted-foreground">XP</span>
            <span className="text-muted-foreground">0 / 100</span>
          </div>
          <Progress value={0} className="h-2" variant="gradient" />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Weapons */}
          <div className="bg-red-100 dark:bg-red-900/20 rounded-lg p-3 flex flex-col items-center">
            <div className="font-pixel text-red-600 dark:text-red-400 mb-1 flex flex-col items-center">
              <span className="text-sm">{categoryMappings.weapons.name} =</span>
              <span className="text-sm">{categoryMappings.weapons.equalsTo}</span>
            </div>
            <span className="text-2xl font-pixel mt-1">
              {stats.weapons.unlocked}/{stats.weapons.total}
            </span>
          </div>
          
          {/* Defense */}
          <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-3 flex flex-col items-center">
            <div className="font-pixel text-blue-600 dark:text-blue-400 mb-1 flex flex-col items-center">
              <span className="text-sm">{categoryMappings.defense.name} =</span>
              <span className="text-sm">{categoryMappings.defense.equalsTo}</span>
            </div>
            <span className="text-2xl font-pixel mt-1">
              {stats.defense.unlocked}/{stats.defense.total}
            </span>
          </div>
          
          {/* Magic */}
          <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-3 flex flex-col items-center">
            <div className="font-pixel text-purple-600 dark:text-purple-400 mb-1 flex flex-col items-center">
              <span className="text-sm">{categoryMappings.magic.name} =</span>
              <span className="text-sm">{categoryMappings.magic.equalsTo}</span>
            </div>
            <span className="text-2xl font-pixel mt-1">
              {stats.magic.unlocked}/{stats.magic.total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillCategoryStats;
