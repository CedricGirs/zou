
import React from 'react';
import { Trash2, ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Transaction } from "@/context/UserDataContext";

interface TransactionListProps {
  transactions: Transaction[];
  handleDeleteTransaction: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  handleDeleteTransaction
}) => {
  console.log("TransactionList: Transactions à afficher:", transactions);
  
  // Trier les transactions par date (les plus récentes d'abord)
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  return (
    <div className="overflow-x-auto">
      {!sortedTransactions || sortedTransactions.length === 0 ? (
        <div className="text-center p-4 text-muted-foreground">
          Aucune transaction à afficher pour le moment.
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-left">Catégorie</th>
              <th className="border p-2 text-right">Montant</th>
              <th className="border p-2 text-center">Type</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-muted/50">
                <td className="border p-2">{transaction.date}</td>
                <td className="border p-2">{transaction.description}</td>
                <td className="border p-2">{transaction.category}</td>
                <td className="border p-2 text-right">{transaction.amount.toFixed(2)} €</td>
                <td className="border p-2 text-center">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {transaction.type === 'income' ? 'Revenu' : 'Dépense'}
                  </span>
                </td>
                <td className="border p-2 text-center">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    <Trash2 size={14} className="text-muted-foreground" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionList;
