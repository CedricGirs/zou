
import { useCallback } from 'react';
import { useUserData, MonthlyData, Transaction } from '@/context/userData';
import { toast } from '@/hooks/use-toast';
import { playSound } from '@/utils/audioUtils';
import { v4 as uuidv4 } from 'uuid';
import { recalculateTotals } from '@/components/finance/insights/hooks/useTransactionCalculations';

export const useTransactions = (
  selectedMonth: string, 
  currentMonthData: MonthlyData, 
  saveMonthlyData: (monthData: MonthlyData) => Promise<MonthlyData>
) => {
  const { userData, updateFinanceModule } = useUserData();

  const addTransaction = useCallback(async (transaction: Partial<Transaction>): Promise<MonthlyData> => {
    console.log("Adding transaction:", transaction);
    console.log("Current month data:", currentMonthData);
    
    // Ensure the transaction has a unique ID
    const completeTransaction = {
      ...transaction,
      id: transaction.id || uuidv4(),
      date: transaction.date || new Date().toISOString().split('T')[0],
      month: selectedMonth
    } as Transaction;
    
    // Update transactions for the selected month
    const currentTransactions = Array.isArray(currentMonthData.transactions) 
      ? [...currentMonthData.transactions] 
      : [];
    
    const updatedTransactions = [...currentTransactions, completeTransaction];
    
    console.log("Current transactions:", currentTransactions);
    console.log("Updated transactions array:", updatedTransactions);
    
    // Use the centralized recalculateTotals function
    const updatedTotals = recalculateTotals(updatedTransactions);
    
    const updatedMonthData = {
      ...currentMonthData,
      ...updatedTotals
    };
    
    console.log("Updated month data to save:", updatedMonthData);
    
    // Save the updated data
    const savedData = await saveMonthlyData(updatedMonthData);
    console.log("Saved month data:", savedData);
    
    // Update global balance and transactions
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
    
    return savedData;
  }, [currentMonthData, userData?.financeModule, saveMonthlyData, updateFinanceModule, selectedMonth]);

  const deleteTransaction = useCallback(async (id: string): Promise<MonthlyData> => {
    console.log("Deleting transaction with ID:", id);
    
    // Find and remove the transaction
    const updatedTransactions = currentMonthData.transactions
      ? currentMonthData.transactions.filter(t => t.id !== id)
      : [];
    
    // Use the centralized recalculateTotals function
    const updatedTotals = recalculateTotals(updatedTransactions);
    
    const updatedMonthData = {
      ...currentMonthData,
      ...updatedTotals
    };
    
    console.log("Updated month data after deletion:", updatedMonthData);
    
    // Save the updated data
    const savedData = await saveMonthlyData(updatedMonthData);
    console.log("Saved month data after deletion:", savedData);
    
    // Update global transactions
    const globalTransactions = userData?.financeModule?.transactions || [];
    const updatedGlobalTransactions = globalTransactions.filter(t => t.id !== id);
    
    await updateFinanceModule({ 
      transactions: updatedGlobalTransactions
    });
    
    console.log("Transaction deleted successfully");
    
    return savedData;
  }, [currentMonthData, userData?.financeModule, saveMonthlyData, updateFinanceModule]);

  return {
    addTransaction,
    deleteTransaction
  };
};
