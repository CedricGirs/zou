
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
    if (currentMonthData && currentMonthData.transactions) {
      console.log("Current transactions:", currentMonthData.transactions);
    }
  }, [currentMonthData]);

  // Higher-level update function that maintains state consistency
  const updateCurrentMonthData = async (updates: Partial<MonthlyData>): Promise<MonthlyData> => {
    console.log("Updating current month data with:", updates);
    console.log("Current transactions before update:", currentMonthData.transactions);
    console.log("Transactions in updates:", updates.transactions);
    
    const updatedData = await updateMonthData(updates, currentMonthData);
    console.log("Setting updated data:", updatedData);
    console.log("Updated transactions:", updatedData.transactions);
    
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
