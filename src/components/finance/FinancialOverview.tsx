
import React from 'react';
import { useUserData } from '@/context/UserDataContext';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { MonthlyData } from '@/types/finance';
import IncomeCard from './overview/IncomeCard';
import ExpensesCard from './overview/ExpensesCard';
import SavingsGoalCard from './overview/SavingsGoalCard';

interface FinancialOverviewProps {
  income: number;
  expenses: number;
  balance: number;
  savingsGoal: number;
  savingsRate: number;
  selectedMonth: string;
  unlockAchievement?: (achievementId: string) => Promise<void>;
  completeQuestStep?: (questId: string, progress: number) => Promise<void>;
  updateMonthData?: (data: Partial<MonthlyData>) => void;
}

const FinancialOverview = ({ 
  income, 
  expenses, 
  balance,
  savingsGoal,
  savingsRate,
  selectedMonth,
  unlockAchievement,
  completeQuestStep,
  updateMonthData
}: FinancialOverviewProps) => {
  const { userData, updateFinanceModule } = useUserData();
  const [totalCumulativeSavings, setTotalCumulativeSavings] = useState(0);

  const calculateTotalSavings = () => {
    if (!userData.financeModule?.monthlyData) return 0;
    let totalSavings = 0;
    Object.entries(userData.financeModule.monthlyData).forEach(([month, monthData]) => {
      const monthSavings = monthData.income - monthData.expenses;
      if (monthSavings > 0) {
        totalSavings += monthSavings;
      }
    });
    return totalSavings;
  };

  useEffect(() => {
    const calculatedTotalSavings = calculateTotalSavings();
    setTotalCumulativeSavings(calculatedTotalSavings);
  }, [userData.financeModule?.monthlyData]);

  const handleSaveIncome = async (newIncome: number) => {
    const newBalance = newIncome - expenses;
    const newSavingsRate = newIncome > 0 ? Math.round(((newIncome - expenses) / newIncome) * 100) : 0;
    
    if (updateMonthData) {
      updateMonthData({
        income: newIncome,
        balance: newBalance,
        savingsRate: newSavingsRate
      });
    }
    
    toast({
      title: "Revenus mis à jour",
      description: `Vos revenus pour ${selectedMonth} ont été mis à jour.`,
    });
    
    if (completeQuestStep && userData.financeModule?.quests) {
      const setBudgetQuest = userData.financeModule.quests.find(q => q.id === "set_budget");
      if (setBudgetQuest) {
        completeQuestStep("set_budget", 50);
      }
    }
  };

  const handleSaveSavingsGoal = async (newGoal: number) => {
    await updateFinanceModule({ savingsGoal: newGoal });
    
    toast({
      title: "Objectif d'épargne mis à jour",
      description: "Votre objectif d'épargne a été mis à jour avec succès. +20 XP!",
    });
    
    if (completeQuestStep && userData.financeModule?.quests) {
      const createSavingsQuest = userData.financeModule.quests.find(q => q.id === "create_savings");
      if (createSavingsQuest) {
        completeQuestStep("create_savings", 50);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <IncomeCard
        income={income}
        selectedMonth={selectedMonth}
        onSaveIncome={handleSaveIncome}
      />
      
      <ExpensesCard
        expenses={expenses}
        selectedMonth={selectedMonth}
      />

      <SavingsGoalCard
        savingsGoal={userData.financeModule?.savingsGoal || 0}
        totalCumulativeSavings={totalCumulativeSavings}
        onSaveSavingsGoal={handleSaveSavingsGoal}
      />
    </div>
  );
};

export default FinancialOverview;
