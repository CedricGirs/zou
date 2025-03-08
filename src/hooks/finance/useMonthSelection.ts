
import { useState, useEffect } from 'react';
import { useUserData, MonthlyData } from '@/context/UserDataContext';

export const useMonthSelection = () => {
  const { userData } = useUserData();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('fr-FR', { month: 'long' }));
  const [currentMonthData, setCurrentMonthData] = useState<MonthlyData>({
    income: 0,
    expenses: 0,
    balance: 0,
    savingsRate: 0,
    transactions: []
  });

  // Load data for the selected month
  useEffect(() => {
    if (!userData?.financeModule) return;
    
    const monthData = userData.financeModule.monthlyData?.[selectedMonth] || {
      income: 0,
      expenses: 0,
      balance: 0,
      savingsRate: 0,
      transactions: []
    };
    
    console.log("Données mensuelles:", userData.financeModule.monthlyData);
    setCurrentMonthData(monthData);
  }, [selectedMonth, userData]);

  return {
    selectedMonth,
    setSelectedMonth,
    currentMonthData,
    setCurrentMonthData
  };
};
