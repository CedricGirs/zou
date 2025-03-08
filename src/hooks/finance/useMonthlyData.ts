
import { useCallback } from 'react';
import { useUserData, MonthlyData } from '@/context/userData';
import { toast } from '@/hooks/use-toast';

export const useMonthlyData = (selectedMonth: string) => {
  const { userData, updateFinanceModule } = useUserData();
  
  const saveMonthlyData = useCallback(async (monthData: MonthlyData) => {
    if (!userData?.financeModule) {
      console.error("Finance module not initialized");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Module finance non initialisé"
      });
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
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la sauvegarde des données"
      });
    }
  }, [selectedMonth, userData, updateFinanceModule]);

  const updateCurrentMonthData = useCallback(async (updates: Partial<MonthlyData>, currentData: MonthlyData) => {
    console.log("Updating monthly data with:", updates);
    console.log("Current data:", currentData);
    
    const updatedData = {
      ...currentData,
      ...updates,
      // Assurer que l'array de transactions existe
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
