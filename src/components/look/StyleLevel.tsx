
import { Card } from "@/components/ui/card";
import XPBar from "@/components/dashboard/XPBar";
import { useUserData } from "@/context/userData";
import { Trophy } from "lucide-react";

const StyleLevel = () => {
  const { userData } = useUserData();
  
  const { 
    styleLevel = 1, 
    styleXP = 0, 
    maxXP = 100 
  } = userData?.lookModule || {};
  
  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
            <Trophy size={24} />
          </div>
          <div>
            <h3 className="font-pixel text-lg">Niveau Style</h3>
            <p className="text-sm text-muted-foreground">Fashionista en devenir</p>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <XPBar currentXP={styleXP} maxXP={maxXP} variant="purple" />
          <p className="text-xs text-right text-muted-foreground mt-1">
            Prochain niveau: {styleLevel + 1}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default StyleLevel;
