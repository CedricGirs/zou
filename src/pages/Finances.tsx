
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
import { WifiOff } from "lucide-react";
import { useSyncUserData } from "@/hooks/useSyncUserData";

const Finances = () => {
  const { userData, loading } = useUserData();
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
  
  // Vérifier l'état de la connexion
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
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
        {!isOnline && (
          <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <WifiOff size={18} />
            <span>Mode hors ligne: Les modifications seront enregistrées localement et synchronisées à la reconnexion.</span>
          </div>
        )}
        
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
