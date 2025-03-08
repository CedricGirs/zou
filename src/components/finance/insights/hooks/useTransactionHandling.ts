
import { useState, useCallback } from 'react';
import { Transaction } from '@/context/userData';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const useTransactionHandling = (
  transactions: Transaction[],
  month: string,
  updateMonthData: (data: any) => void
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
    
    const updatedTransactions = [...transactions, transaction];
    const updatedData = recalculateTotals(updatedTransactions);
    
    // S'assurer que les transactions sont bien préservées
    console.log("Ajout d'un revenu:", transaction);
    console.log("Transactions mises à jour:", updatedTransactions);
    
    updateMonthData(updatedData);
    
    toast({
      title: "Revenu ajouté",
      description: `${newIncome.description} : ${newIncome.amount}€ a été ajouté avec succès.`
    });
    
    setNewIncome({
      description: '',
      amount: 0,
      category: 'Salaire'
    });
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
    
    const updatedTransactions = [...transactions, transaction];
    const updatedData = recalculateTotals(updatedTransactions);
    
    // S'assurer que les transactions sont bien préservées
    console.log("Ajout d'une dépense:", transaction);
    console.log("Transactions mises à jour:", updatedTransactions);
    
    updateMonthData(updatedData);
    
    toast({
      title: "Dépense ajoutée",
      description: `${newExpense.description} : ${newExpense.amount}€ a été ajoutée avec succès.`
    });
    
    setNewExpense({
      description: '',
      amount: 0,
      category: 'Logement'
    });
  };

  const deleteTransaction = async (transactionId: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== transactionId);
    const updatedData = recalculateTotals(updatedTransactions);
    
    updateMonthData(updatedData);
    
    toast({
      title: "Transaction supprimée",
      description: "La transaction a été supprimée avec succès."
    });
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
    
    updateMonthData(updatedData);
    
    toast({
      title: "Transaction modifiée",
      description: `Le montant a été mis à jour avec succès.`
    });
    
    setEditingTransaction(null);
  };

  const toggleRecentIncomes = () => {
    setShowRecentIncomes(!showRecentIncomes);
  };

  const toggleRecentExpenses = () => {
    setShowRecentExpenses(!showRecentExpenses);
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
    startEditTransaction,
    handleEditAmountChange,
    saveEditedTransaction,
    toggleRecentIncomes,
    toggleRecentExpenses
  };
};
