
import { Card } from "@/components/ui/card";
import XPBar from "@/components/dashboard/XPBar";
import { useUserData } from "@/context/userData";

const FinanceLevel = () => {
  const { userData } = useUserData();
  
  const { 
    financeLevel = 1, 
    currentXP = 0, 
    maxXP = 100 
  } = userData?.financeModule || {};
  
  return (
    <Card variant="minimal" className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
            {financeLevel}
          </div>
          <div>
            <h3 className="font-pixel text-lg">Niveau Finance</h3>
            <p className="text-sm text-muted-foreground">Novice Financier</p>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <XPBar currentXP={currentXP} maxXP={maxXP} />
          <p className="text-xs text-right text-muted-foreground mt-1">Prochain niveau: Planificateur</p>
        </div>
      </div>
    </Card>
  );
};

export default FinanceLevel;
