
import { useCallback } from 'react';
import { Transaction } from '@/context/userData';

export const useTransactionCalculations = () => {
  const recalculateTotals = useCallback((updatedTransactions: Transaction[]) => {
    // Ensure updatedTransactions is an array
    const transactionsToUse = Array.isArray(updatedTransactions) ? updatedTransactions : [];
    
    console.log("Recalculating totals with transactions:", transactionsToUse);
    
    const totalIncome = transactionsToUse
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = transactionsToUse
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;
    
    console.log("Calculated totals:", {
      income: totalIncome,
      expenses: totalExpenses,
      balance,
      savingsRate
    });
    
    return {
      income: totalIncome,
      expenses: totalExpenses,
      balance,
      savingsRate,
      transactions: transactionsToUse
    };
  }, []);

  return {
    recalculateTotals
  };
};

// Export a non-hook version for use in utilities
export const recalculateTotals = (updatedTransactions: Transaction[]) => {
  // Ensure updatedTransactions is an array
  const transactionsToUse = Array.isArray(updatedTransactions) ? updatedTransactions : [];
  
  const totalIncome = transactionsToUse
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactionsToUse
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;
  
  return {
    income: totalIncome,
    expenses: totalExpenses,
    balance,
    savingsRate,
    transactions: transactionsToUse
  };
};
