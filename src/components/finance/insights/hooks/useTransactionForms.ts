
import { useState } from 'react';

export const useTransactionForms = () => {
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

  const resetIncomeForm = () => {
    setNewIncome({
      description: '',
      amount: 0,
      category: 'Salaire'
    });
  };

  const resetExpenseForm = () => {
    setNewExpense({
      description: '',
      amount: 0,
      category: 'Logement'
    });
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
    setEditingTransaction,
    handleIncomeChange,
    handleExpenseChange,
    handleIncomeCategoryChange,
    handleExpenseCategoryChange,
    resetIncomeForm,
    resetExpenseForm,
    toggleRecentIncomes,
    toggleRecentExpenses
  };
};
