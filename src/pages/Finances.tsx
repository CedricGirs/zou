
import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useUserData } from "@/context/UserDataContext";
import { Progress } from "@/components/ui/progress";
import FinanceHeader from "@/components/finance/FinanceHeader";
import FinanceLevel from "@/components/finance/FinanceLevel";
import FinanceQuests from "@/components/finance/FinanceQuests";
import FinanceTabs from "@/components/finance/FinanceTabs";
import FinanceAchievements from "@/components/finance/FinanceAchievements";
import { useFinanceFunctions } from "@/hooks/useFinanceFunctions";

const Finances = () => {
  const { userData, loading } = useUserData();
  const {
    selectedMonth,
    setSelectedMonth,
    currentMonthData,
    setCurrentMonthData,
    completeQuestStep,
    unlockAchievement,
    savingsGoal
  } = useFinanceFunctions();
  
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
        <FinanceHeader 
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          currentMonthData={currentMonthData}
          setCurrentMonthData={setCurrentMonthData}
        />
        
        <FinanceLevel />
        
        <FinanceQuests completeQuestStep={completeQuestStep} />
        
        <FinanceTabs 
          selectedMonth={selectedMonth}
          currentMonthData={currentMonthData}
          setCurrentMonthData={setCurrentMonthData}
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
