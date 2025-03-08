
import { useCallback } from 'react';
import { useUserData, MonthlyData } from '@/context/UserDataContext';

export const useMonthlyData = (selectedMonth: string) => {
  const { userData, updateFinanceModule } = useUserData();
  
  const saveMonthlyData = useCallback(async (monthData: MonthlyData) => {
    if (!userData?.financeModule) return;
    
    const monthlyData = {
      ...(userData.financeModule.monthlyData || {}),
      [selectedMonth]: monthData
    };
    
    await updateFinanceModule({ monthlyData });
    console.log(`Données du mois ${selectedMonth} sauvegardées:`, monthData);
  }, [selectedMonth, userData, updateFinanceModule]);

  const updateCurrentMonthData = useCallback(async (updates: Partial<MonthlyData>, currentData: MonthlyData) => {
    const updatedData = {
      ...currentData,
      ...updates
    };
    
    await saveMonthlyData(updatedData);
    
    return updatedData;
  }, [saveMonthlyData]);

  return {
    saveMonthlyData,
    updateCurrentMonthData,
    savingsGoal: userData?.financeModule?.savingsGoal || 0
  };
};
