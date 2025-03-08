
import { useCallback } from 'react';
import { useUserData, MonthlyData } from '@/context/userData';

export const useMonthlyData = (selectedMonth: string) => {
  const { userData, updateFinanceModule } = useUserData();
  
  const saveMonthlyData = useCallback(async (monthData: MonthlyData) => {
    if (!userData?.financeModule) return;
    
    // Initialiser avec les données existantes ou un objet vide
    const currentMonthlyData = userData.financeModule.monthlyData || {};
    
    const monthlyData = {
      ...currentMonthlyData,
      [selectedMonth]: monthData
    };
    
    console.log(`Sauvegarde des données du mois ${selectedMonth}:`, monthData);
    
    await updateFinanceModule({ monthlyData });
    console.log(`Données du mois ${selectedMonth} sauvegardées:`, monthData);
  }, [selectedMonth, userData, updateFinanceModule]);

  const updateCurrentMonthData = useCallback(async (updates: Partial<MonthlyData>, currentData: MonthlyData) => {
    const updatedData = {
      ...currentData,
      ...updates
    };
    
    console.log("Mise à jour des données mensuelles:", updatedData);
    await saveMonthlyData(updatedData);
    
    return updatedData;
  }, [saveMonthlyData]);

  return {
    saveMonthlyData,
    updateCurrentMonthData,
    savingsGoal: userData?.financeModule?.savingsGoal || 0
  };
};
