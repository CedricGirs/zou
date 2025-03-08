
import { useCallback } from 'react';
import { useUserData, MonthlyData } from '@/context/userData';
import { toast } from '@/hooks/use-toast';
import { playSound } from '@/utils/audioUtils';
import { v4 as uuidv4 } from 'uuid'; // Ajout de l'import uuidv4

export const useTransactions = (
  selectedMonth: string, 
  currentMonthData: MonthlyData, 
  saveMonthlyData: (monthData: MonthlyData) => Promise<void>
) => {
  const { userData, updateFinanceModule } = useUserData();

  const addTransaction = useCallback(async (transaction: any) => {
    // Assurer que la transaction a un ID unique
    const completeTransaction = {
      ...transaction,
      id: transaction.id || uuidv4(),
      month: selectedMonth
    };
    
    // Mettre à jour les transactions pour le mois sélectionné
    const updatedTransactions = [...(currentMonthData.transactions || []), completeTransaction];
    
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
    
    // Sauvegarder les données mises à jour
    await saveMonthlyData(updatedMonthData);
    
    // Mettre à jour le solde global
    const currentBalance = userData.financeModule?.balance || 0;
    const newBalance = transaction.type === 'income' 
      ? currentBalance + transaction.amount 
      : currentBalance - transaction.amount;
    
    await updateFinanceModule({ 
      balance: newBalance,
      transactions: [...(userData.financeModule?.transactions || []), completeTransaction]
    });
    
    playSound('transaction');
    toast({
      title: transaction.type === 'income' ? "Revenu ajouté" : "Dépense ajoutée",
      description: `${transaction.description}: ${transaction.amount.toFixed(2)} €`
    });
    
    console.log("Transaction ajoutée:", completeTransaction);
    console.log("Données du mois mises à jour:", updatedMonthData);
    
    return updatedMonthData;
  }, [currentMonthData, userData, saveMonthlyData, updateFinanceModule, selectedMonth]);

  return {
    addTransaction
  };
};
