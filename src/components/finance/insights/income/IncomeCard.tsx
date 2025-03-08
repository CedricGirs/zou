
import React from 'react';
import { Transaction } from "@/context/userData";
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IncomeList from './IncomeList';
import AddIncomeDialog from './AddIncomeDialog';
import ApplyTemplateDialog from './ApplyTemplateDialog';
import IncomeFooter from './IncomeFooter';

interface IncomeCardProps {
  transactions: Transaction[];
  month: string;
  newIncome: {
    description: string;
    amount: number;
    category: string;
  };
  handleIncomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIncomeCategoryChange: (value: string) => void;
  addIncome: () => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  incomeCategories: string[];
  editingTransaction: {
    id: string;
    amount: number;
    type: 'income' | 'expense';
  } | null;
  handleEditAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startEditTransaction: (transaction: Transaction) => void;
  saveEditedTransaction: () => Promise<void>;
  isApplyIncomeTemplateOpen: boolean;
  setIsApplyIncomeTemplateOpen: (isOpen: boolean) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  applyIncomeTemplate: () => void;
  showRecentIncomes: boolean;
  toggleRecentIncomes: () => void;
  userData: any;
}

const IncomeCard: React.FC<IncomeCardProps> = ({
  transactions,
  month,
  newIncome,
  handleIncomeChange,
  handleIncomeCategoryChange,
  addIncome,
  deleteTransaction,
  incomeCategories,
  editingTransaction,
  handleEditAmountChange,
  startEditTransaction,
  saveEditedTransaction,
  isApplyIncomeTemplateOpen,
  setIsApplyIncomeTemplateOpen,
  selectedTemplateId,
  setSelectedTemplateId,
  applyIncomeTemplate,
  showRecentIncomes,
  toggleRecentIncomes,
  userData
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp size={18} />
          Revenus
        </CardTitle>
        <CardDescription>Analyse de vos sources de revenus</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <IncomeList 
            transactions={transactions}
            deleteTransaction={deleteTransaction}
            editingTransaction={editingTransaction}
            handleEditAmountChange={handleEditAmountChange}
            startEditTransaction={startEditTransaction}
            saveEditedTransaction={saveEditedTransaction}
            showRecentIncomes={showRecentIncomes}
            toggleRecentIncomes={toggleRecentIncomes}
          />
          
          <div className="flex flex-col gap-2">
            <AddIncomeDialog 
              newIncome={newIncome}
              handleIncomeChange={handleIncomeChange}
              handleIncomeCategoryChange={handleIncomeCategoryChange}
              addIncome={addIncome}
              incomeCategories={incomeCategories}
            />
            
            <ApplyTemplateDialog 
              isApplyIncomeTemplateOpen={isApplyIncomeTemplateOpen}
              setIsApplyIncomeTemplateOpen={setIsApplyIncomeTemplateOpen}
              selectedTemplateId={selectedTemplateId}
              setSelectedTemplateId={setSelectedTemplateId}
              applyIncomeTemplate={applyIncomeTemplate}
              userData={userData}
            />
          </div>
        </div>
      </CardContent>
      <IncomeFooter transactions={transactions} />
    </Card>
  );
};

export default IncomeCard;
