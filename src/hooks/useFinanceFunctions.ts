
import { useMonthSelection } from './finance/useMonthSelection';
import { useMonthlyData } from './finance/useMonthlyData';
import { useTransactions } from './finance/useTransactions';
import { useAchievementsAndQuests } from './finance/useAchievementsAndQuests';
import { useEffect } from 'react';
import { MonthlyData, Transaction } from '@/context/userData';

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
  
  const { addTransaction, deleteTransaction } = useTransactions(
    selectedMonth,
    currentMonthData,
    saveMonthlyData
  );
  
  const { 
    completeQuestStep,
    unlockAchievement 
  } = useAchievementsAndQuests();

  // Ensure data consistency after each modification
  useEffect(() => {
    console.log("Current month data in useFinanceFunctions:", currentMonthData);
  }, [currentMonthData]);

  // Higher-level update function that maintains state consistency
  const updateCurrentMonthData = async (updates: Partial<MonthlyData>): Promise<MonthlyData> => {
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
    deleteTransaction,
    completeQuestStep,
    unlockAchievement,
    savingsGoal
  };
};
