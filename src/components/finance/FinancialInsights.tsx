
import React, { useCallback } from 'react';
import { useUserData } from '@/context/userData';
import { Transaction } from '@/context/userData';
import IncomeCard from './insights/income/IncomeCard';
import ExpenseCard from './insights/expense/ExpenseCard';
import TemplateCreationDialog from './insights/TemplateCreationDialog';
import { useTransactionHandling } from './insights/hooks/useTransactionHandling';
import { useTemplateManagement } from './insights/hooks/useTemplateManagement';
import { useTemplateApplication } from './insights/hooks/useTemplateApplication';

interface FinancialInsightsProps {
  transactions: Transaction[];
  month: string;
  updateMonthData: (data: any) => Promise<any>;
  deleteTransaction: (id: string) => Promise<any>;
}

const FinancialInsights = ({ 
  transactions, 
  month, 
  updateMonthData,
  deleteTransaction 
}: FinancialInsightsProps) => {
  const { userData } = useUserData();
  
  // Category lists
  const incomeCategories = [
    'Salaire', 'Freelance', 'Dividendes', 'Loyers', 'Cadeaux', 'Remboursements', 'Autres'
  ];
  
  const expenseCategories = [
    'Logement', 'Alimentation', 'Transport', 'Loisirs', 'Santé', 'Éducation', 'Vêtements', 'Cadeaux', 'Autre'
  ];
  
  // Custom hooks for managing transactions and templates
  const {
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
    handleDeleteTransaction,
    startEditTransaction,
    handleEditAmountChange,
    saveEditedTransaction,
    toggleRecentIncomes,
    toggleRecentExpenses
  } = useTransactionHandling(transactions, month, updateMonthData);
  
  // Function to recalculate totals
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
  
  const {
    isCreateTemplateOpen,
    setIsCreateTemplateOpen,
    templateName,
    setTemplateName,
    templateDescription,
    setTemplateDescription,
    handleCreateTemplate,
    isApplyIncomeTemplateOpen,
    setIsApplyIncomeTemplateOpen,
    isApplyExpenseTemplateOpen,
    setIsApplyExpenseTemplateOpen,
    selectedTemplateId,
    setSelectedTemplateId
  } = useTemplateManagement(transactions);
  
  // Hook for applying templates
  const {
    applyIncomeTemplate,
    applyExpenseTemplate
  } = useTemplateApplication(
    transactions,
    month,
    selectedTemplateId,
    recalculateTotals,
    updateMonthData
  );

  console.log("FinancialInsights - Current transactions:", transactions);

  return (
    <div className="space-y-6">      
      <div className="flex justify-end mb-4">
        <TemplateCreationDialog
          isCreateTemplateOpen={isCreateTemplateOpen}
          setIsCreateTemplateOpen={setIsCreateTemplateOpen}
          templateName={templateName}
          setTemplateName={setTemplateName}
          templateDescription={templateDescription}
          setTemplateDescription={setTemplateDescription}
          handleCreateTemplate={handleCreateTemplate}
          transactions={transactions}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IncomeCard
          transactions={transactions}
          month={month}
          newIncome={newIncome}
          handleIncomeChange={handleIncomeChange}
          handleIncomeCategoryChange={handleIncomeCategoryChange}
          addIncome={addIncome}
          deleteTransaction={handleDeleteTransaction}
          incomeCategories={incomeCategories}
          editingTransaction={editingTransaction}
          handleEditAmountChange={handleEditAmountChange}
          startEditTransaction={startEditTransaction}
          saveEditedTransaction={saveEditedTransaction}
          isApplyIncomeTemplateOpen={isApplyIncomeTemplateOpen}
          setIsApplyIncomeTemplateOpen={setIsApplyIncomeTemplateOpen}
          selectedTemplateId={selectedTemplateId}
          setSelectedTemplateId={setSelectedTemplateId}
          applyIncomeTemplate={applyIncomeTemplate}
          showRecentIncomes={showRecentIncomes}
          toggleRecentIncomes={toggleRecentIncomes}
          userData={userData}
        />
        
        <ExpenseCard
          transactions={transactions}
          month={month}
          newExpense={newExpense}
          handleExpenseChange={handleExpenseChange}
          handleExpenseCategoryChange={handleExpenseCategoryChange}
          addExpense={addExpense}
          deleteTransaction={handleDeleteTransaction}
          expenseCategories={expenseCategories}
          editingTransaction={editingTransaction}
          handleEditAmountChange={handleEditAmountChange}
          startEditTransaction={startEditTransaction}
          saveEditedTransaction={saveEditedTransaction}
          isApplyExpenseTemplateOpen={isApplyExpenseTemplateOpen}
          setIsApplyExpenseTemplateOpen={setIsApplyExpenseTemplateOpen}
          selectedTemplateId={selectedTemplateId}
          setSelectedTemplateId={setSelectedTemplateId}
          applyExpenseTemplate={applyExpenseTemplate}
          showRecentExpenses={showRecentExpenses}
          toggleRecentExpenses={toggleRecentExpenses}
          userData={userData}
        />
      </div>
    </div>
  );
};

export default FinancialInsights;
