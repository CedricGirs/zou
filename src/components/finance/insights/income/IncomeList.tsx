
import React from 'react';
import { Transaction } from "@/context/userData";
import { Edit2, Trash2, Check as CheckIcon, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface IncomeListProps {
  transactions: Transaction[];
  deleteTransaction: (id: string) => Promise<void>;
  editingTransaction: {
    id: string;
    amount: number;
    type: 'income' | 'expense';
  } | null;
  handleEditAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startEditTransaction: (transaction: Transaction) => void;
  saveEditedTransaction: () => Promise<void>;
  showRecentIncomes: boolean;
  toggleRecentIncomes: () => void;
}

const IncomeList: React.FC<IncomeListProps> = ({
  transactions,
  deleteTransaction,
  editingTransaction,
  handleEditAmountChange,
  startEditTransaction,
  saveEditedTransaction,
  showRecentIncomes,
  toggleRecentIncomes
}) => {
  // Filter only income transactions
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  
  console.log("IncomeList - Received transactions:", transactions);
  console.log("IncomeList - Filtered income transactions:", incomeTransactions);

  if (!incomeTransactions || incomeTransactions.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <span>Vous n'avez pas encore ajouté de revenus ce mois-ci.</span>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Sources de revenus récentes :</p>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleRecentIncomes}
          className="text-xs"
        >
          <List size={14} className="mr-1" />
          {showRecentIncomes ? "Masquer la liste" : "Voir tous"}
        </Button>
      </div>
      
      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {incomeTransactions
          .slice(0, showRecentIncomes ? undefined : 5)
          .map(income => (
            <div key={income.id} className="flex justify-between items-center p-2 border rounded hover:bg-muted/50">
              <div>
                <p className="font-medium text-sm">{income.description}</p>
                <p className="text-xs text-muted-foreground">{income.category}</p>
              </div>
              <div className="flex items-center gap-2">
                {editingTransaction && editingTransaction.id === income.id ? (
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
                    <span className="text-green-600 font-medium">{income.amount} €</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => startEditTransaction(income)}
                    >
                      <Edit2 size={16} className="text-blue-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => deleteTransaction(income.id)}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default IncomeList;
