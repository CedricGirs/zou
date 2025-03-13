
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
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Weapons Skills */}
      <div className="glass-card p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 rounded-full bg-red-500/10 flex items-center justify-center">
          <Sword className="text-red-500 opacity-30" size={24} />
        </div>
        <h3 className="font-pixel text-lg flex items-center gap-2 mb-2">
          <Sword className="text-red-500" size={18} />
          <span>{t("weapons")}</span>
        </h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium">{t("unlocked")}</span>
              <span className="text-xs font-medium">{stats.weapons.unlocked}/{stats.weapons.total}</span>
            </div>
            <Progress value={calculateProgress('weapons')} className="h-2" variant="danger" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium">{t("mastery")}</span>
              <span className="text-xs font-medium">{stats.weapons.maxed}/{stats.weapons.unlocked || 1}</span>
            </div>
            <Progress value={calculateMastery('weapons')} className="h-2" variant="gradient" />
          </div>
        </div>
      </div>
      
      {/* Defense Skills */}
      <div className="glass-card p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 rounded-full bg-blue-500/10 flex items-center justify-center">
          <Shield className="text-blue-500 opacity-30" size={24} />
        </div>
        <h3 className="font-pixel text-lg flex items-center gap-2 mb-2">
          <Shield className="text-blue-500" size={18} />
          <span>{t("defense")}</span>
        </h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium">{t("unlocked")}</span>
              <span className="text-xs font-medium">{stats.defense.unlocked}/{stats.defense.total}</span>
            </div>
            <Progress value={calculateProgress('defense')} className="h-2" variant="default" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium">{t("mastery")}</span>
              <span className="text-xs font-medium">{stats.defense.maxed}/{stats.defense.unlocked || 1}</span>
            </div>
            <Progress value={calculateMastery('defense')} className="h-2" variant="gradient" />
          </div>
        </div>
      </div>
      
      {/* Magic Skills */}
      <div className="glass-card p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 rounded-full bg-purple-500/10 flex items-center justify-center">
          <Wand className="text-purple-500 opacity-30" size={24} />
        </div>
        <h3 className="font-pixel text-lg flex items-center gap-2 mb-2">
          <Wand className="text-purple-500" size={18} />
          <span>{t("magic")}</span>
        </h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium">{t("unlocked")}</span>
              <span className="text-xs font-medium">{stats.magic.unlocked}/{stats.magic.total}</span>
            </div>
            <Progress value={calculateProgress('magic')} className="h-2" variant="purple" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium">{t("mastery")}</span>
              <span className="text-xs font-medium">{stats.magic.maxed}/{stats.magic.unlocked || 1}</span>
            </div>
            <Progress value={calculateMastery('magic')} className="h-2" variant="gradient" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillCategoryStats;
