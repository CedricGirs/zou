
import { useCallback } from 'react';
import { useUserData, MonthlyData } from '@/context/userData';
import { toast } from '@/hooks/use-toast';

export const useMonthlyData = (selectedMonth: string) => {
  const { userData, updateFinanceModule } = useUserData();
  
  const saveMonthlyData = useCallback(async (monthData: MonthlyData): Promise<MonthlyData> => {
    if (!userData?.financeModule) {
      console.error("Finance module not initialized");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Module finance non initialisé"
      });
      return monthData; // Return original data if module not initialized
    }
    
    console.log(`Saving data for month ${selectedMonth}:`, monthData);
    console.log("Transactions to save:", monthData.transactions);
    
    // Ensure monthlyData object exists
    const currentMonthlyData = userData.financeModule.monthlyData || {};
    
    // Create a new object with updated data for this month
    const monthlyData = {
      ...currentMonthlyData,
      [selectedMonth]: {
        ...monthData,
        income: typeof monthData.income === 'number' ? monthData.income : 0,
        expenses: typeof monthData.expenses === 'number' ? monthData.expenses : 0,
        balance: typeof monthData.balance === 'number' ? monthData.balance : 0,
        savingsRate: typeof monthData.savingsRate === 'number' ? monthData.savingsRate : 0,
        transactions: Array.isArray(monthData.transactions) ? [...monthData.transactions] : []
      }
    };
    
    console.log("Full monthly data to save:", monthlyData);
    console.log("Transactions for current month:", monthlyData[selectedMonth].transactions);
    
    try {
      // Update finance module with new monthly data
      await updateFinanceModule({ 
        monthlyData,
        // Also update global totals
        balance: userData.financeModule.balance,
        monthlyIncome: monthData.income,
        monthlyExpenses: monthData.expenses,
        savingsRate: monthData.savingsRate
      });
      
      console.log(`Data for month ${selectedMonth} saved successfully`);
      return monthlyData[selectedMonth];
    } catch (error) {
      console.error("Error saving monthly data:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la sauvegarde des données"
      });
      return monthData; // Return original data on error
    }
  }, [selectedMonth, userData, updateFinanceModule]);

  const updateCurrentMonthData = useCallback(async (updates: Partial<MonthlyData>, currentData: MonthlyData): Promise<MonthlyData> => {
    console.log("Updating monthly data with:", updates);
    console.log("Current data:", currentData);
    console.log("Transactions in updates:", updates.transactions);
    console.log("Transactions in current data:", currentData.transactions);
    
    // Fusionner correctement les transactions
    let mergedTransactions = [];
    if (Array.isArray(updates.transactions)) {
      mergedTransactions = [...updates.transactions];
    } else if (Array.isArray(currentData.transactions)) {
      mergedTransactions = [...currentData.transactions];
    }
    
    const updatedData = {
      ...currentData,
      ...updates,
      // Ensure transactions array exists and is properly copied
      transactions: mergedTransactions
    };
    
    console.log("Final updated data:", updatedData);
    console.log("Final transactions:", updatedData.transactions);
    
    const savedData = await saveMonthlyData(updatedData);
    
    return savedData;
  }, [saveMonthlyData]);

  return {
    saveMonthlyData,
    updateCurrentMonthData,
    savingsGoal: userData?.financeModule?.savingsGoal || 0
  };
};
