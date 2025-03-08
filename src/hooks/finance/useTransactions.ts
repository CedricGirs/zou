
import { useCallback } from 'react';
import { useUserData, MonthlyData } from '@/context/userData';
import { toast } from '@/hooks/use-toast';
import { playSound } from '@/utils/audioUtils';

export const useTransactions = (
  selectedMonth: string, 
  currentMonthData: MonthlyData, 
  saveMonthlyData: (monthData: MonthlyData) => Promise<void>
) => {
  const { userData, updateFinanceModule } = useUserData();

  const addTransaction = useCallback(async (transaction: any) => {
    const updatedTransactions = [...currentMonthData.transactions, transaction];
    
    // Recalculer les totaux du mois
    let totalIncome = 0;
    let totalExpenses = 0;
    
    updatedTransactions.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      if (t.type === 'expense') totalExpenses += t.amount;
    });
    
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
    
    const updatedMonthData = {
      ...currentMonthData,
      income: totalIncome,
      expenses: totalExpenses,
      balance,
      savingsRate,
      transactions: updatedTransactions
    };
    
    await saveMonthlyData(updatedMonthData);
    
    // Mise à jour du solde global
    const currentBalance = userData.financeModule?.balance || 0;
    const newBalance = transaction.type === 'income' 
      ? currentBalance + transaction.amount 
      : currentBalance - transaction.amount;
    
    await updateFinanceModule({ 
      balance: newBalance,
      transactions: [...(userData.financeModule?.transactions || []), transaction]
    });
    
    playSound('transaction');
    toast({
      title: transaction.type === 'income' ? "Revenu ajouté" : "Dépense ajoutée",
      description: `${transaction.description}: ${transaction.amount.toFixed(2)} €`
    });
    
    return updatedMonthData;
  }, [currentMonthData, userData, saveMonthlyData, updateFinanceModule]);

  return {
    addTransaction
  };
};
