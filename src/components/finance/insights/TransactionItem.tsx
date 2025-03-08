
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/context/userData";
import { Edit2, Trash2, Check as CheckIcon } from 'lucide-react';

interface TransactionItemProps {
  transaction: Transaction;
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

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  editingTransaction,
  handleEditAmountChange,
  startEditTransaction,
  saveEditedTransaction,
  deleteTransaction
}) => {
  const isEditing = editingTransaction && editingTransaction.id === transaction.id;
  const isIncome = transaction.type === 'income';
  
  return (
    <div className="flex justify-between items-center p-2 border rounded hover:bg-muted/50">
      <div>
        <p className="font-medium text-sm">{transaction.description}</p>
        <p className="text-xs text-muted-foreground">{transaction.category}</p>
      </div>
      <div className="flex items-center gap-2">
        {isEditing ? (
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
            <span className={isIncome ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
              {transaction.amount} €
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => startEditTransaction(transaction)}
            >
              <Edit2 size={16} className="text-blue-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => deleteTransaction(transaction.id)}
            >
              <Trash2 size={16} className="text-red-500" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;
