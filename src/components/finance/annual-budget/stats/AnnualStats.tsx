import React from 'react';
import { Progress } from "@/components/ui/progress";

interface AnnualStatsProps {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  formatCurrency: (value: number) => string;
}

const AnnualStats = ({ 
  totalIncome, 
  totalExpenses, 
  totalSavings,
  formatCurrency 
}: AnnualStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="p-4 rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 border border-purple-100 transform transition-all duration-200 hover:scale-105">
        <h3 className="text-sm font-medium text-purple-800 mb-2">Revenus Annuels</h3>
        <span className="font-pixel text-xl text-purple-600">
          {formatCurrency(totalIncome)}
        </span>
        <div className="mt-2">
          <Progress 
            value={(totalIncome / (totalIncome + totalExpenses || 1)) * 100} 
            className="h-2" 
            variant="income"
          />
        </div>
      </div>
      
      <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 transform transition-all duration-200 hover:scale-105">
        <h3 className="text-sm font-medium text-orange-800 mb-2">Dépenses Annuelles</h3>
        <span className="font-pixel text-xl text-orange-600">
          {formatCurrency(totalExpenses)}
        </span>
        <div className="mt-2">
          <Progress 
            value={(totalExpenses / (totalIncome + totalExpenses || 1)) * 100} 
            className="h-2" 
            variant="expense"
          />
        </div>
      </div>
      
      <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 transform transition-all duration-200 hover:scale-105">
        <h3 className="text-sm font-medium text-emerald-800 mb-2">Épargne Annuelle</h3>
        <span className="font-pixel text-xl text-emerald-600">
          {formatCurrency(totalSavings)}
        </span>
        <div className="mt-2">
          <Progress 
            value={totalIncome ? (totalSavings / totalIncome) * 100 : 0} 
            className="h-2" 
            variant="savings"
          />
        </div>
      </div>
    </div>
  );
};

export default AnnualStats;
