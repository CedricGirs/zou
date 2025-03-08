
import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useUserData } from "@/context/UserDataContext";
import { Progress } from "@/components/ui/progress";
import FinanceHeader from "@/components/finance/FinanceHeader";
import FinanceLevel from "@/components/finance/FinanceLevel";
import FinanceTabs from "@/components/finance/FinanceTabs";
import FinanceAchievements from "@/components/finance/FinanceAchievements";
import { useFinanceFunctions } from "@/hooks/useFinanceFunctions";
import { toast } from "@/hooks/use-toast";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Finances = () => {
  const { userData, loading, forceRefreshData } = useUserData();
  const {
    selectedMonth,
    setSelectedMonth,
    currentMonthData,
    setCurrentMonthData,
    updateCurrentMonthData,
    addTransaction,
    completeQuestStep,
    unlockAchievement,
    savingsGoal
  } = useFinanceFunctions();
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connexion rétablie",
        description: "Les données seront désormais synchronisées automatiquement."
      });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Mode hors ligne",
        description: "Les modifications seront enregistrées localement.",
        variant: "destructive",
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await forceRefreshData();
    setIsRefreshing(false);
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="text-center">
            <h2 className="text-2xl font-pixel mb-4">Chargement des données financières...</h2>
            <Progress value={80} className="w-64 h-2" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            {!isOnline && (
              <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-3 rounded-lg flex items-center gap-2">
                <WifiOff size={18} />
                <span>Mode hors ligne: Les modifications seront enregistrées localement et synchronisées à la reconnexion.</span>
              </div>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2" 
            onClick={handleRefresh}
            disabled={isRefreshing || !isOnline}
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            Rafraîchir les données
          </Button>
        </div>
        
        <FinanceHeader 
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          currentMonthData={currentMonthData}
          setCurrentMonthData={setCurrentMonthData}
        />
        
        <FinanceLevel />
        
        <FinanceTabs 
          selectedMonth={selectedMonth}
          currentMonthData={currentMonthData}
          setCurrentMonthData={setCurrentMonthData}
          updateCurrentMonthData={updateCurrentMonthData}
          addTransaction={addTransaction}
          savingsGoal={savingsGoal}
          unlockAchievement={unlockAchievement}
          completeQuestStep={completeQuestStep}
        />
        
        <FinanceAchievements unlockAchievement={unlockAchievement} />
      </div>
    </MainLayout>
  );
};

export default Finances;
