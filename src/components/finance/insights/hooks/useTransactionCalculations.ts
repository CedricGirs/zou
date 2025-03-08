
import { useCallback } from 'react';
import { Transaction } from '@/context/userData';

export const useTransactionCalculations = () => {
  const recalculateTotals = useCallback((updatedTransactions: Transaction[]) => {
    const totalIncome = updatedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = updatedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;
    
    return {
      income: totalIncome,
      expenses: totalExpenses,
      balance,
      savingsRate,
      transactions: updatedTransactions
    };
  }, []);

  return {
    recalculateTotals
  };
};
