
import React from 'react';
import { Transaction } from "@/context/userData";
import { Trophy } from 'lucide-react';
import { CardFooter } from "@/components/ui/card";

interface IncomeFooterProps {
  transactions: Transaction[];
}

const IncomeFooter: React.FC<IncomeFooterProps> = ({ transactions }) => {
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0) || 0;

  return (
    <CardFooter className="bg-gray-50 flex justify-between">
      <span className="text-xs text-muted-foreground">
        Revenu mensuel total: {totalIncome} €
      </span>
      <div className="flex items-center text-xs text-purple-600">
        <Trophy size={12} className="mr-1 text-amber-500" />
        <span>+30 XP pour 3 sources de revenus</span>
      </div>
    </CardFooter>
  );
};

export default IncomeFooter;
