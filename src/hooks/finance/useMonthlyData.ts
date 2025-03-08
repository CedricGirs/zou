
import { useCallback } from 'react';
import { useUserData, MonthlyData } from '@/context/userData';

export const useMonthlyData = (selectedMonth: string) => {
  const { userData, updateFinanceModule } = useUserData();
  
  const saveMonthlyData = useCallback(async (monthData: MonthlyData) => {
    if (!userData?.financeModule) {
      console.error("Finance module not initialized");
      return;
    }
    
    console.log(`Saving data for month ${selectedMonth}:`, monthData);
    
    // Initialiser avec les données existantes ou un objet vide
    const currentMonthlyData = userData.financeModule.monthlyData || {};
    
    const monthlyData = {
      ...currentMonthlyData,
      [selectedMonth]: {
        ...monthData,
        transactions: Array.isArray(monthData.transactions) ? monthData.transactions : []
      }
    };
    
    console.log("Full monthly data to save:", monthlyData);
    
    try {
      await updateFinanceModule({ monthlyData });
      console.log(`Data for month ${selectedMonth} saved successfully`);
    } catch (error) {
      console.error("Error saving monthly data:", error);
    }
  }, [selectedMonth, userData, updateFinanceModule]);

  const updateCurrentMonthData = useCallback(async (updates: Partial<MonthlyData>, currentData: MonthlyData) => {
    console.log("Updating monthly data with:", updates);
    console.log("Current data:", currentData);
    
    const updatedData = {
      ...currentData,
      ...updates,
      // Ensure transactions array exists
      transactions: Array.isArray(updates.transactions) 
        ? updates.transactions 
        : Array.isArray(currentData.transactions)
          ? currentData.transactions
          : []
    };
    
    console.log("Final updated data:", updatedData);
    await saveMonthlyData(updatedData);
    
    return updatedData;
  }, [saveMonthlyData]);

  return {
    saveMonthlyData,
    updateCurrentMonthData,
    savingsGoal: userData?.financeModule?.savingsGoal || 0
  };
};
