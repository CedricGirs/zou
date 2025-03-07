
import React from 'react';
import { ArrowUp, ArrowDown, Wallet, Edit, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MonthCardProps {
  month: string;
  income: number;
  expenses: number;
  userData: any;
  hoveredMonth: string | null;
  setHoveredMonth: (month: string | null) => void;
  handleEditMonth: (month: string) => void;
  openApplyTemplateDialog: (month: string) => void;
  formatCurrency: (value: number) => string;
}

const MonthCard = ({
  month,
  income,
  expenses,
  userData,
  hoveredMonth,
  setHoveredMonth,
  handleEditMonth,
  openApplyTemplateDialog,
  formatCurrency
}: MonthCardProps) => {
  const savings = income - expenses;

  const getMonthColor = () => {
    if (!userData?.financeModule?.annualBudget?.[month]) return "bg-gray-50";
    
    if (savings > 0) return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200";
    if (savings < 0) return "bg-gradient-to-br from-red-50 to-orange-50 border-red-200";
    return "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200";
  };

  const getMonthIcon = () => {
    if (!userData?.financeModule?.annualBudget?.[month]) return <Wallet className="text-gray-400" size={18} />;
    
    if (savings > 0) return <ArrowUp className="text-green-500" size={18} />;
    if (savings < 0) return <ArrowDown className="text-red-500" size={18} />;
    return <Wallet className="text-gray-400" size={18} />;
  };

  return (
    <div 
      className={`relative border rounded-lg p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer overflow-hidden ${getMonthColor()}`}
      onMouseEnter={() => setHoveredMonth(month)}
      onMouseLeave={() => setHoveredMonth(null)}
    >
      <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-transparent via-purple-300 to-transparent pointer-events-none" />
      
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-pixel text-sm">{month}</h4>
        {getMonthIcon()}
      </div>
      
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-purple-600">Revenus:</span>
          <span className="font-medium">{formatCurrency(income)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-orange-600">Dépenses:</span>
          <span className="font-medium">{formatCurrency(expenses)}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span className="text-emerald-600">Épargne:</span>
          <span className={cn(
            savings > 0 ? "text-emerald-600" : 
            savings < 0 ? "text-red-600" : "text-gray-600"
          )}>
            {formatCurrency(savings)}
          </span>
        </div>
      </div>
      
      {/* Show action buttons on hover */}
      <div className={cn(
        "absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 transition-opacity",
        hoveredMonth === month ? "opacity-100" : "opacity-0"
      )}>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
            onClick={() => handleEditMonth(month)}
          >
            <Edit size={14} className="text-purple-700" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
            onClick={() => openApplyTemplateDialog(month)}
          >
            <Copy size={14} className="text-purple-700" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MonthCard;
