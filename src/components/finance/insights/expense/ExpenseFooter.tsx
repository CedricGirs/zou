
import React, { useMemo } from 'react';
import { Transaction } from "@/context/userData";
import { Trophy } from 'lucide-react';
import { CardFooter } from "@/components/ui/card";

interface ExpenseFooterProps {
  transactions: Transaction[];
}

const ExpenseFooter: React.FC<ExpenseFooterProps> = ({ transactions }) => {
  // Calculer les dépenses totales de manière memoïsée
  const totalExpenses = useMemo(() => {
    // Filtrer uniquement les transactions de type dépense
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    // Calculer la somme des dépenses
    const total = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    console.log("Expense transactions count:", expenseTransactions.length);
    console.log("Total expenses calculated:", total);
    
    return total;
  }, [transactions]);

  return (
    <CardFooter className="bg-gray-50 flex justify-between">
      <span className="text-xs text-muted-foreground">
        Dépenses mensuelles totales: {totalExpenses.toFixed(2)} €
      </span>
      <div className="flex items-center text-xs text-purple-600">
        <Trophy size={12} className="mr-1 text-amber-500" />
        <span>+20 XP pour catégorisation complète</span>
      </div>
    </CardFooter>
  );
};

export default ExpenseFooter;
