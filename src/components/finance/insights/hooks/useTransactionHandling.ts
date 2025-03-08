
import { useState, useCallback } from 'react';
import { Transaction } from '@/context/userData';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const useTransactionHandling = (
  transactions: Transaction[],
  month: string,
  updateMonthData: (data: any) => Promise<any>
) => {
  const [newIncome, setNewIncome] = useState({
    description: '',
    amount: 0,
    category: 'Salaire'
  });
  
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: 0,
    category: 'Logement'
  });

  const [editingTransaction, setEditingTransaction] = useState<{
    id: string;
    amount: number;
    type: 'income' | 'expense';
  } | null>(null);
  
  const [showRecentIncomes, setShowRecentIncomes] = useState(false);
  const [showRecentExpenses, setShowRecentExpenses] = useState(false);

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

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewIncome({
      ...newIncome,
      [name]: type === 'number' ? Number(value) : value
    });
  };
  
  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: type === 'number' ? Number(value) : value
    });
  };
  
  const handleIncomeCategoryChange = (value: string) => {
    setNewIncome({
      ...newIncome,
      category: value
    });
  };
  
  const handleExpenseCategoryChange = (value: string) => {
    setNewExpense({
      ...newExpense,
      category: value
    });
  };

  const addIncome = async () => {
    if (!newIncome.description || newIncome.amount <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs correctement.",
        variant: "destructive"
      });
      return;
    }
    
    const transaction: Transaction = {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      description: newIncome.description,
      amount: newIncome.amount,
      category: newIncome.category,
      type: 'income',
      month: month,
      isVerified: false
    };
    
    // S'assurer que transactions est bien un tableau
    const currentTransactions = Array.isArray(transactions) ? [...transactions] : [];
    const updatedTransactions = [...currentTransactions, transaction];
    
    console.log("Ajout d'un revenu:", transaction);
    console.log("Transactions avant mise à jour:", currentTransactions);
    console.log("Transactions après mise à jour:", updatedTransactions);
    
    const updatedData = recalculateTotals(updatedTransactions);
    
    try {
      const result = await updateMonthData(updatedData);
      console.log("Résultat de la mise à jour:", result);
      
      toast({
        title: "Revenu ajouté",
        description: `${newIncome.description} : ${newIncome.amount}€ a été ajouté avec succès.`
      });
      
      setNewIncome({
        description: '',
        amount: 0,
        category: 'Salaire'
      });
      
      return result;
    } catch (error) {
      console.error("Erreur lors de l'ajout du revenu:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du revenu.",
        variant: "destructive"
      });
    }
  };
  
  const addExpense = async () => {
    if (!newExpense.description || newExpense.amount <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs correctement.",
        variant: "destructive"
      });
      return;
    }
    
    const transaction: Transaction = {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      description: newExpense.description,
      amount: newExpense.amount,
      category: newExpense.category,
      type: 'expense',
      month: month,
      isVerified: false
    };
    
    // S'assurer que transactions est bien un tableau
    const currentTransactions = Array.isArray(transactions) ? [...transactions] : [];
    const updatedTransactions = [...currentTransactions, transaction];
    
    console.log("Ajout d'une dépense:", transaction);
    console.log("Transactions avant mise à jour:", currentTransactions);
    console.log("Transactions après mise à jour:", updatedTransactions);
    
    const updatedData = recalculateTotals(updatedTransactions);
    
    try {
      const result = await updateMonthData(updatedData);
      console.log("Résultat de la mise à jour:", result);
      
      toast({
        title: "Dépense ajoutée",
        description: `${newExpense.description} : ${newExpense.amount}€ a été ajoutée avec succès.`
      });
      
      setNewExpense({
        description: '',
        amount: 0,
        category: 'Logement'
      });
      
      return result;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la dépense:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la dépense.",
        variant: "destructive"
      });
    }
  };

  const deleteTransaction = async (transactionId: string) => {
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
    }
  };

  const startEditTransaction = (transaction: Transaction) => {
    setEditingTransaction({
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type
    });
  };

  const handleEditAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingTransaction) return;
    
    setEditingTransaction({
      ...editingTransaction,
      amount: Number(e.target.value)
    });
  };

  const saveEditedTransaction = async () => {
    if (!editingTransaction) return;

    const updatedTransactions = transactions.map(t => {
      if (t.id === editingTransaction.id) {
        return {
          ...t,
          amount: editingTransaction.amount
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
      
      setEditingTransaction(null);
      return result;
    } catch (error) {
      console.error("Erreur lors de la modification de la transaction:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de la transaction.",
        variant: "destructive"
      });
    }
  };

  const toggleRecentIncomes = () => {
    setShowRecentIncomes(!showRecentIncomes);
  };

  const toggleRecentExpenses = () => {
    setShowRecentExpenses(!showRecentExpenses);
  };

  // Ajouter une fonction pour manipuler directement les transactions
  const handleDeleteTransaction = async (id: string) => {
    return await deleteTransaction(id);
  };

  return {
    newIncome,
    newExpense,
    editingTransaction,
    showRecentIncomes,
    showRecentExpenses,
    handleIncomeChange,
    handleExpenseChange,
    handleIncomeCategoryChange,
    handleExpenseCategoryChange,
    addIncome,
    addExpense,
    deleteTransaction,
    handleDeleteTransaction,
    startEditTransaction,
    handleEditAmountChange,
    saveEditedTransaction,
    toggleRecentIncomes,
    toggleRecentExpenses
  };
};
