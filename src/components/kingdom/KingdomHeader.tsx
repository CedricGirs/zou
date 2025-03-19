
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Save, Crown } from "lucide-react";
import { XPBar } from "@/components/dashboard/XPBar";

interface KingdomHeaderProps {
  saveKingdom: () => void;
  elementCount: number;
}

const KingdomHeader = ({ saveKingdom, elementCount }: KingdomHeaderProps) => {
  const { t } = useLanguage();
  
  // XP calculation based on element count
  const kingdomXP = elementCount * 10;
  const maxXP = 500;
  
  return (
    <div className="flex flex-col space-y-2 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="h-8 w-8 text-amber-500" />
          <h1 className="text-2xl font-bold">{t("kingdom")}</h1>
        </div>
        
        <Button onClick={saveKingdom} className="gap-2">
          <Save className="h-4 w-4" />
          {t("save")}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{t("kingdom_description")}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-medium">{t("elements")}: {elementCount}</span>
          </div>
        </div>
        
        <div>
          <XPBar currentXP={kingdomXP} maxXP={maxXP} variant="gradient" />
          <p className="text-xs text-right mt-1 text-muted-foreground">
            {t("earn_xp_by_building")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KingdomHeader;
