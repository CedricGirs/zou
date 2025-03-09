
import { useUserData } from '@/context/UserDataContext';
import { useState, useEffect } from 'react';

export const useSavingsCalculations = () => {
  const { userData } = useUserData();
  const [totalCumulativeSavings, setTotalCumulativeSavings] = useState(0);
  const [actualIncome, setActualIncome] = useState(0);
  const [actualExpenses, setActualExpenses] = useState(0);
  const [savingsPercentage, setSavingsPercentage] = useState(0);

  const calculateTotalSavings = () => {
    if (!userData.financeModule?.monthlyData) return 0;
    
    let totalSavings = 0;
    
    Object.entries(userData.financeModule.monthlyData).forEach(([month, monthData]) => {
      const monthSavings = monthData.income - monthData.expenses;
      if (monthSavings > 0) {
        totalSavings += monthSavings;
        console.log(`Économies du mois ${month}: ${monthSavings}€`);
      }
    });
    
    return totalSavings;
  };

  const updateFinancialMetrics = (income: number, expenses: number) => {
    setActualIncome(income);
    setActualExpenses(expenses);
    
    const savingsPercent = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
    setSavingsPercentage(savingsPercent);
    
    const calculatedTotalSavings = calculateTotalSavings();
    setTotalCumulativeSavings(calculatedTotalSavings);
    
    console.log('Données mensuelles:', userData.financeModule?.monthlyData);
    console.log('Total économies cumulées:', calculatedTotalSavings);
  };

  return {
    actualIncome,
    actualExpenses,
    savingsPercentage,
    totalCumulativeSavings,
    updateFinancialMetrics
  };
};
