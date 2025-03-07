
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/types/finance";
import { Trash2, Edit2, CheckIcon } from 'lucide-react';

interface TransactionsListProps {
  transactions: Transaction[];
  type: 'income' | 'expense';
  showAll: boolean;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction, amount: number) => void;
}

const TransactionsList = ({
  transactions,
  type,
  showAll,
  onDeleteTransaction,
  onEditTransaction,
}: TransactionsListProps) => {
  const [editingTransaction, setEditingTransaction] = useState<{
    id: string;
    amount: number;
  } | null>(null);

  const startEditTransaction = (transaction: Transaction) => {
    setEditingTransaction({
      id: transaction.id,
      amount: transaction.amount,
    });
  };

  const handleEditAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingTransaction) return;
    
    setEditingTransaction({
      ...editingTransaction,
      amount: Number(e.target.value),
    });
  };

  const saveEditedTransaction = (transaction: Transaction) => {
    if (!editingTransaction) return;
    onEditTransaction(transaction, editingTransaction.amount);
    setEditingTransaction(null);
  };

  const filteredTransactions = transactions
    .filter(t => t.type === type)
    .slice(0, showAll ? undefined : 5);

  return (
    <div className="space-y-2 max-h-[200px] overflow-y-auto">
      {filteredTransactions.map(transaction => (
        <div key={transaction.id} className="flex justify-between items-center p-2 border rounded hover:bg-muted/50">
          <div>
            <p className="font-medium text-sm">{transaction.description}</p>
            <p className="text-xs text-muted-foreground">{transaction.category}</p>
          </div>
          <div className="flex items-center gap-2">
            {editingTransaction && editingTransaction.id === transaction.id ? (
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
                  onClick={() => saveEditedTransaction(transaction)}
                >
                  <CheckIcon size={16} className="text-green-500" />
                </Button>
              </>
            ) : (
              <>
                <span className={type === 'income' ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
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
                  onClick={() => onDeleteTransaction(transaction.id)}
                >
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionsList;
