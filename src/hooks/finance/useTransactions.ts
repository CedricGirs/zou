
import { useCallback } from 'react';
import { useUserData, MonthlyData, Transaction } from '@/context/userData';
import { toast } from '@/hooks/use-toast';
import { playSound } from '@/utils/audioUtils';
import { v4 as uuidv4 } from 'uuid';

export const useTransactions = (
  selectedMonth: string, 
  currentMonthData: MonthlyData, 
  saveMonthlyData: (monthData: MonthlyData) => Promise<void>
) => {
  const { userData, updateFinanceModule } = useUserData();

  const addTransaction = useCallback(async (transaction: Partial<Transaction>) => {
    console.log("Adding transaction:", transaction);
    console.log("Current month data:", currentMonthData);
    
    // Assurer que la transaction a un ID unique
    const completeTransaction = {
      ...transaction,
      id: transaction.id || uuidv4(),
      month: selectedMonth
    } as Transaction;
    
    // Mettre à jour les transactions pour le mois sélectionné
    const currentTransactions = Array.isArray(currentMonthData.transactions) 
      ? [...currentMonthData.transactions] 
      : [];
    
    const updatedTransactions = [...currentTransactions, completeTransaction];
    
    console.log("Updated transactions array:", updatedTransactions);
    
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
    
    console.log("Updated month data to save:", updatedMonthData);
    
    // Sauvegarder les données mises à jour
    await saveMonthlyData(updatedMonthData);
    
    // Mettre à jour le solde global et les transactions globales
    const currentBalance = userData?.financeModule?.balance || 0;
    const newBalance = transaction.type === 'income' 
      ? currentBalance + (transaction.amount || 0)
      : currentBalance - (transaction.amount || 0);
    
    const globalTransactions = Array.isArray(userData?.financeModule?.transactions) 
      ? [...userData.financeModule.transactions] 
      : [];
    
    await updateFinanceModule({ 
      balance: newBalance,
      transactions: [...globalTransactions, completeTransaction]
    });
    
    playSound('transaction');
    toast({
      title: transaction.type === 'income' ? "Revenu ajouté" : "Dépense ajoutée",
      description: `${transaction.description}: ${transaction.amount?.toFixed(2)} €`
    });
    
    console.log("Transaction added successfully");
    
    return updatedMonthData;
  }, [currentMonthData, userData?.financeModule, saveMonthlyData, updateFinanceModule, selectedMonth]);

  return {
    addTransaction
  };
};
