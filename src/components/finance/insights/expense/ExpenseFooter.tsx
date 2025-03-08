
import React from 'react';
import { Transaction } from "@/context/userData";
import { Trophy } from 'lucide-react';
import { CardFooter } from "@/components/ui/card";

interface ExpenseFooterProps {
  transactions: Transaction[];
}

const ExpenseFooter: React.FC<ExpenseFooterProps> = ({ transactions }) => {
  // Only filter expense transactions
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  // Calculate total expenses
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0) || 0;

  console.log("Expense transactions:", expenseTransactions);
  console.log("Total expenses:", totalExpenses);

  return (
    <CardFooter className="bg-gray-50 flex justify-between">
      <span className="text-xs text-muted-foreground">
        Dépenses mensuelles totales: {totalExpenses} €
      </span>
      <div className="flex items-center text-xs text-purple-600">
        <Trophy size={12} className="mr-1 text-amber-500" />
        <span>+20 XP pour catégorisation complète</span>
      </div>
    </CardFooter>
  );
};

export default ExpenseFooter;
