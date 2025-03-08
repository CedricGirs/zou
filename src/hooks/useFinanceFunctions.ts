
import { useMonthSelection } from './finance/useMonthSelection';
import { useMonthlyData } from './finance/useMonthlyData';
import { useTransactions } from './finance/useTransactions';
import { useAchievementsAndQuests } from './finance/useAchievementsAndQuests';
import { useEffect } from 'react';

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

  // S'assurer que les données sont cohérentes après chaque modification
  useEffect(() => {
    console.log("Current month data in useFinanceFunctions:", currentMonthData);
  }, [currentMonthData]);

  // Higher-level update function that maintains state consistency
  const updateCurrentMonthData = async (updates: Partial<any>) => {
    console.log("Updating current month data with:", updates);
    const updatedData = await updateMonthData(updates, currentMonthData);
    console.log("Setting updated data:", updatedData);
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
