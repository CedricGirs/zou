
import { useCallback } from 'react';
import { Transaction } from '@/context/userData';
import { useTransactionForms } from './useTransactionForms';
import { useTransactionOperations } from './useTransactionOperations';

export const useTransactionHandling = (
  transactions: Transaction[],
  month: string,
  updateMonthData: (data: any) => Promise<any>
) => {
  const {
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
  } = useTransactionForms();

  const {
    addTransaction,
    deleteTransaction,
    editTransaction
  } = useTransactionOperations(transactions, month, updateMonthData);

  // Higher-level function for adding income
  const addIncome = useCallback(async () => {
    const result = await addTransaction(
      newIncome.description,
      newIncome.amount,
      newIncome.category,
      'income'
    );
    
    if (result) {
      resetIncomeForm();
    }
    
    return result;
  }, [newIncome, addTransaction, resetIncomeForm]);

  // Higher-level function for adding expense
  const addExpense = useCallback(async () => {
    const result = await addTransaction(
      newExpense.description,
      newExpense.amount,
      newExpense.category,
      'expense'
    );
    
    if (result) {
      resetExpenseForm();
    }
    
    return result;
  }, [newExpense, addTransaction, resetExpenseForm]);

  // Higher-level function for starting edit mode
  const startEditTransaction = useCallback((transaction: Transaction) => {
    setEditingTransaction({
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type
    });
  }, [setEditingTransaction]);

  // Higher-level function for handling edit amount changes
  const handleEditAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingTransaction) return;
    
    setEditingTransaction({
      ...editingTransaction,
      amount: Number(e.target.value)
    });
  }, [editingTransaction, setEditingTransaction]);

  // Higher-level function for saving edited transaction
  const saveEditedTransaction = useCallback(async () => {
    if (!editingTransaction) return;

    const result = await editTransaction(
      editingTransaction.id,
      editingTransaction.amount
    );
    
    if (result) {
      setEditingTransaction(null);
    }
    
    return result;
  }, [editingTransaction, editTransaction, setEditingTransaction]);

  // Function to handle delete transaction
  const handleDeleteTransaction = useCallback(async (id: string) => {
    return await deleteTransaction(id);
  }, [deleteTransaction]);

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
    deleteTransaction: handleDeleteTransaction,
    handleDeleteTransaction,
    startEditTransaction,
    handleEditAmountChange,
    saveEditedTransaction,
    toggleRecentIncomes,
    toggleRecentExpenses
  };
};
