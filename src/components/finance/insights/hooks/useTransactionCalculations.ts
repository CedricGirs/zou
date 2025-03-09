
import { useCallback } from 'react';
import { Transaction } from '@/context/userData';

export const useTransactionCalculations = () => {
  const recalculateTotals = useCallback((updatedTransactions: Transaction[]) => {
    // Assurons-nous que updatedTransactions est un tableau
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
