
import React from 'react';
import { Transaction } from "@/context/userData";
import { TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseList from './ExpenseList';
import AddExpenseDialog from './AddExpenseDialog';
import ApplyTemplateDialog from './ApplyTemplateDialog';
import ExpenseFooter from './ExpenseFooter';

interface ExpenseCardProps {
  transactions: Transaction[];
  month: string;
  newExpense: {
    description: string;
    amount: number;
    category: string;
  };
  handleExpenseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExpenseCategoryChange: (value: string) => void;
  addExpense: () => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  expenseCategories: string[];
  editingTransaction: {
    id: string;
    amount: number;
    type: 'income' | 'expense';
  } | null;
  handleEditAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startEditTransaction: (transaction: Transaction) => void;
  saveEditedTransaction: () => Promise<void>;
  isApplyExpenseTemplateOpen: boolean;
  setIsApplyExpenseTemplateOpen: (isOpen: boolean) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  applyExpenseTemplate: () => void;
  showRecentExpenses: boolean;
  toggleRecentExpenses: () => void;
  userData: any;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  transactions,
  month,
  newExpense,
  handleExpenseChange,
  handleExpenseCategoryChange,
  addExpense,
  deleteTransaction,
  expenseCategories,
  editingTransaction,
  handleEditAmountChange,
  startEditTransaction,
  saveEditedTransaction,
  isApplyExpenseTemplateOpen,
  setIsApplyExpenseTemplateOpen,
  selectedTemplateId,
  setSelectedTemplateId,
  applyExpenseTemplate,
  showRecentExpenses,
  toggleRecentExpenses,
  userData
}) => {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown size={18} />
          Dépenses
        </CardTitle>
        <CardDescription>Analyse de vos catégories de dépenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ExpenseList 
            expenseTransactions={expenseTransactions}
            showRecentExpenses={showRecentExpenses}
            toggleRecentExpenses={toggleRecentExpenses}
            editingTransaction={editingTransaction}
            handleEditAmountChange={handleEditAmountChange}
            startEditTransaction={startEditTransaction}
            saveEditedTransaction={saveEditedTransaction}
            deleteTransaction={deleteTransaction}
          />
          
          <div className="flex flex-col gap-2">
            <AddExpenseDialog
              newExpense={newExpense}
              handleExpenseChange={handleExpenseChange}
              handleExpenseCategoryChange={handleExpenseCategoryChange}
              addExpense={addExpense}
              expenseCategories={expenseCategories}
            />
            
            <ApplyTemplateDialog
              isApplyExpenseTemplateOpen={isApplyExpenseTemplateOpen}
              setIsApplyExpenseTemplateOpen={setIsApplyExpenseTemplateOpen}
              selectedTemplateId={selectedTemplateId}
              setSelectedTemplateId={setSelectedTemplateId}
              applyExpenseTemplate={applyExpenseTemplate}
              userData={userData}
            />
          </div>
        </div>
      </CardContent>
      <ExpenseFooter transactions={transactions} />
    </Card>
  );
};

export default ExpenseCard;
