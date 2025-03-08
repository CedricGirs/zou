
import React from 'react';
import { AlertCircle, Edit2, Trash2, CheckIcon, List } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/context/userData";

interface ExpenseListProps {
  expenseTransactions: Transaction[];
  showRecentExpenses: boolean;
  toggleRecentExpenses: () => void;
  editingTransaction: {
    id: string;
    amount: number;
    type: 'income' | 'expense';
  } | null;
  handleEditAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startEditTransaction: (transaction: Transaction) => void;
  saveEditedTransaction: () => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenseTransactions,
  showRecentExpenses,
  toggleRecentExpenses,
  editingTransaction,
  handleEditAmountChange,
  startEditTransaction,
  saveEditedTransaction,
  deleteTransaction
}) => {
  return (
    <div className="space-y-3">
      {expenseTransactions.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <span>Vous n'avez pas encore ajouté de dépenses ce mois-ci.</span>
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Dépenses récentes :</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleRecentExpenses}
              className="text-xs"
            >
              <List size={14} className="mr-1" />
              {showRecentExpenses ? "Masquer la liste" : "Voir tous"}
            </Button>
          </div>
          
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {expenseTransactions
              .slice(0, showRecentExpenses ? undefined : 5)
              .map(expense => (
                <div key={expense.id} className="flex justify-between items-center p-2 border rounded hover:bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{expense.description}</p>
                    <p className="text-xs text-muted-foreground">{expense.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingTransaction && editingTransaction.id === expense.id ? (
                      <>
                        <Input
                          type="number"
                          value={editingTransaction.amount}
                          onChange={handleEditAmountChange}
                          className="w-24 h-8"
                          min={0}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={saveEditedTransaction}
                        >
                          <CheckIcon size={16} className="text-green-500" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="text-red-600 font-medium">{expense.amount} €</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => startEditTransaction(expense)}
                        >
                          <Edit2 size={16} className="text-blue-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => deleteTransaction(expense.id)}
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseList;
