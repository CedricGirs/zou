
import React from 'react';
import { ArrowDown } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface ExpensesCardProps {
  expenses: number;
  selectedMonth: string;
}

const ExpensesCard = ({ expenses, selectedMonth }: ExpensesCardProps) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-red-400 to-red-600"></div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
            <ArrowDown size={20} />
          </div>
          <CardTitle>Dépenses du mois</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total des dépenses pour {selectedMonth}</p>
            <p className="text-2xl font-bold">{expenses} €</p>
          </div>
          <div className="flex items-center text-sm text-red-500">
            <ArrowDown size={16} className="mr-1" />
            <span>Sorties</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesCard;
