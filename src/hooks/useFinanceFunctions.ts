
import { useMonthSelection } from './finance/useMonthSelection';
import { useMonthlyData } from './finance/useMonthlyData';
import { useTransactions } from './finance/useTransactions';
import { useAchievementsAndQuests } from './finance/useAchievementsAndQuests';

export const useFinanceFunctions = () => {
  const { 
    selectedMonth, 
    setSelectedMonth,
    currentMonthData,
    setCurrentMonthData 
  } = useMonthSelection();
  
  const { 
    saveMonthlyData,
    updateCurrentMonthData: updateMonthData,
    savingsGoal 
  } = useMonthlyData(selectedMonth);
  
  const { addTransaction } = useTransactions(
    selectedMonth,
    currentMonthData,
    saveMonthlyData
  );
  
  const { 
    completeQuestStep,
    unlockAchievement 
  } = useAchievementsAndQuests();

  // Higher-level update function that maintains state consistency
  const updateCurrentMonthData = async (updates: Partial<any>) => {
    const updatedData = await updateMonthData(updates, currentMonthData);
    setCurrentMonthData(updatedData);
    return updatedData;
  };
  
  return {
    selectedMonth,
    setSelectedMonth,
    currentMonthData,
    setCurrentMonthData,
    updateCurrentMonthData,
    addTransaction,
    completeQuestStep,
    unlockAchievement,
    savingsGoal
  };
};
