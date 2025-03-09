
import React, { useEffect } from 'react';
import { useUserData } from '@/context/UserDataContext';
import { useFinanceXP } from '@/hooks/useFinanceXP';
import SavingsGoalCard from './overview/SavingsGoalCard';
import { useSavingsCalculations } from './overview/useSavingsCalculations';

interface FinancialOverviewProps {
  income: number;
  expenses: number;
  balance: number;
  savingsGoal: number;
  savingsRate: number;
  selectedMonth: string;
  unlockAchievement?: (achievementId: string) => Promise<void>;
  completeQuestStep?: (questId: string, progress: number) => Promise<void>;
}

const FinancialOverview = ({ 
  income, 
  expenses, 
  balance, 
  savingsGoal, 
  savingsRate,
  selectedMonth,
  unlockAchievement,
  completeQuestStep
}: FinancialOverviewProps) => {
  const { userData } = useUserData();
  const { updateXPAndLevel } = useFinanceXP();
  const { 
    totalCumulativeSavings,
    updateFinancialMetrics
  } = useSavingsCalculations();

  useEffect(() => {
    updateFinancialMetrics(income, expenses);
    updateXPAndLevel();
  }, [income, expenses, selectedMonth, userData.financeModule?.monthlyData, updateXPAndLevel]);

  return (
    <div className="grid grid-cols-1 gap-4">      
      <SavingsGoalCard 
        savingsGoal={savingsGoal}
        totalCumulativeSavings={totalCumulativeSavings}
        completeQuestStep={completeQuestStep}
        updateXPAndLevel={updateXPAndLevel}
      />
    </div>
  );
};

export default FinancialOverview;
