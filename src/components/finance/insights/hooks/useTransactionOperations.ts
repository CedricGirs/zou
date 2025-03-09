
import { useCallback } from 'react';
import { Transaction } from '@/context/userData';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { recalculateTotals } from './useTransactionCalculations';

export const useTransactionOperations = (
  transactions: Transaction[],
  month: string,
  updateMonthData: (data: any) => Promise<any>
) => {
  const createTransaction = useCallback((
    description: string,
    amount: number,
    category: string,
    type: 'income' | 'expense'
  ): Transaction => {
    return {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      description,
      amount,
      category,
      type,
      month,
      isVerified: false
    };
  }, [month]);

  const addTransaction = useCallback(async (
    description: string,
    amount: number,
    category: string,
    type: 'income' | 'expense'
  ) => {
    if (!description || amount <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs correctement.",
        variant: "destructive"
      });
      return null;
    }
    
    const transaction = createTransaction(description, amount, category, type);
    
    // Ensure transactions is an array
    const currentTransactions = Array.isArray(transactions) ? [...transactions] : [];
    const updatedTransactions = [...currentTransactions, transaction];
    
    console.log(`Ajout d'un ${type === 'income' ? 'revenu' : 'dépense'}:`, transaction);
    console.log("Transactions avant mise à jour:", currentTransactions);
    console.log("Transactions après mise à jour:", updatedTransactions);
    
    const updatedData = recalculateTotals(updatedTransactions);
    
    try {
      const result = await updateMonthData(updatedData);
      console.log("Résultat de la mise à jour:", result);
      
      toast({
        title: type === 'income' ? "Revenu ajouté" : "Dépense ajoutée",
        description: `${description} : ${amount}€ a été ajouté${type === 'income' ? '' : 'e'} avec succès.`
      });
      
      return result;
    } catch (error) {
      console.error(`Erreur lors de l'ajout ${type === 'income' ? 'du revenu' : 'de la dépense'}:`, error);
      toast({
        title: "Erreur",
        description: `Une erreur est survenue lors de l'ajout ${type === 'income' ? 'du revenu' : 'de la dépense'}.`,
        variant: "destructive"
      });
      return null;
    }
  }, [transactions, updateMonthData, createTransaction]);

  const deleteTransaction = useCallback(async (transactionId: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== transactionId);
    const updatedData = recalculateTotals(updatedTransactions);
    
    try {
      const result = await updateMonthData(updatedData);
      console.log("Résultat de la suppression:", result);
      
      toast({
        title: "Transaction supprimée",
        description: "La transaction a été supprimée avec succès."
      });
      
      return result;
    } catch (error) {
      console.error("Erreur lors de la suppression de la transaction:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la transaction.",
        variant: "destructive"
      });
      return null;
    }
  }, [transactions, updateMonthData]);

  const editTransaction = useCallback(async (
    transactionId: string,
    amount: number
  ) => {
    const updatedTransactions = transactions.map(t => {
      if (t.id === transactionId) {
        return {
          ...t,
          amount
        };
      }
      return t;
    });

    const updatedData = recalculateTotals(updatedTransactions);
    
    try {
      const result = await updateMonthData(updatedData);
      console.log("Résultat de la modification:", result);
      
      toast({
        title: "Transaction modifiée",
        description: `Le montant a été mis à jour avec succès.`
      });
      
      return result;
    } catch (error) {
      console.error("Erreur lors de la modification de la transaction:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de la transaction.",
        variant: "destructive"
      });
      return null;
    }
  }, [transactions, updateMonthData]);

  return {
    addTransaction,
    deleteTransaction,
    editTransaction
  };
};
