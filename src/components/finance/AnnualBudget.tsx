
import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, TrendingUp, ArrowUp, ArrowDown, DollarSign, Wallet, PiggyBank } from 'lucide-react';
import { useUserData } from "@/context/UserDataContext";
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { playSound } from "@/utils/audioUtils";

const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const AnnualBudget = () => {
  const { userData, updateFinanceModule } = useUserData();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  // Update chart data when userData changes
  useEffect(() => {
    if (userData.financeModule.annualBudget) {
      // Ensure months are in the correct order
      const formattedData = months.map(month => {
        const data = userData.financeModule.annualBudget[month] || { income: 0, expenses: 0 };
        return {
          month,
          income: data.income,
          expenses: data.expenses,
          savings: data.income - data.expenses
        };
      });
      setChartData(formattedData);
    }
  }, [userData.financeModule.annualBudget]);

  const handleEditMonth = (month: string) => {
    const monthData = userData.financeModule.annualBudget?.[month] || { income: 0, expenses: 0 };
    setMonthlyIncome(monthData.income);
    setMonthlyExpenses(monthData.expenses);
    setSelectedMonth(month);
  };

  const handleSaveMonth = async () => {
    if (selectedMonth && userData.financeModule.annualBudget) {
      const updatedBudget = {
        ...userData.financeModule.annualBudget,
        [selectedMonth]: {
          income: monthlyIncome,
          expenses: monthlyExpenses
        }
      };
      
      await updateFinanceModule({ annualBudget: updatedBudget });
      toast({
        title: "Budget mis à jour",
        description: `Le budget de ${selectedMonth} a été mis à jour.`,
      });
      
      playSound('success');
      setSelectedMonth(null);
    }
  };

  const calculateTotals = () => {
    if (!userData.financeModule.annualBudget) return { totalIncome: 0, totalExpenses: 0, totalSavings: 0 };
    
    let totalIncome = 0;
    let totalExpenses = 0;
    
    Object.values(userData.financeModule.annualBudget).forEach(month => {
      totalIncome += month.income;
      totalExpenses += month.expenses;
    });
    
    return {
      totalIncome,
      totalExpenses,
      totalSavings: totalIncome - totalExpenses
    };
  };

  const { totalIncome, totalExpenses, totalSavings } = calculateTotals();

  const getMonthColor = (month: string) => {
    if (!userData.financeModule.annualBudget?.[month]) return "bg-gray-100 border-gray-200";
    
    const data = userData.financeModule.annualBudget[month];
    const savings = data.income - data.expenses;
    
    if (savings > 0) return "bg-green-50 border-green-200 hover:bg-green-100";
    if (savings < 0) return "bg-red-50 border-red-200 hover:bg-red-100";
    return "bg-gray-50 border-gray-200 hover:bg-gray-100";
  };

  const getMonthIcon = (month: string) => {
    if (!userData.financeModule.annualBudget?.[month]) return <Wallet className="text-gray-400" size={18} />;
    
    const data = userData.financeModule.annualBudget[month];
    const savings = data.income - data.expenses;
    
    if (savings > 0) return <ArrowUp className="text-green-500" size={18} />;
    if (savings < 0) return <ArrowDown className="text-red-500" size={18} />;
    return <Wallet className="text-gray-400" size={18} />;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Budget Annuel</CardTitle>
        <div className="flex items-center space-x-2">
          <DollarSign className="text-muted-foreground" size={18} />
          <TrendingUp className="text-muted-foreground" size={18} />
          <PiggyBank className="text-muted-foreground" size={18} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="pixel-card flex flex-col items-center">
            <h3 className="text-sm font-medium mb-1">Revenus Annuels</h3>
            <span className="font-pixel text-xl text-zou-purple">
              {formatCurrency(totalIncome)}
            </span>
          </div>
          
          <div className="pixel-card flex flex-col items-center">
            <h3 className="text-sm font-medium mb-1">Dépenses Annuelles</h3>
            <span className="font-pixel text-xl text-zou-orange">
              {formatCurrency(totalExpenses)}
            </span>
          </div>
          
          <div className="pixel-card flex flex-col items-center">
            <h3 className="text-sm font-medium mb-1">Épargne Annuelle</h3>
            <span className="font-pixel text-xl text-zou-green">
              {formatCurrency(totalSavings)}
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => formatCurrency(value as number)}
                labelFormatter={(label) => `Mois: ${label}`}
              />
              <Legend />
              <Bar dataKey="income" name="Revenus" fill="#8884d8" />
              <Bar dataKey="expenses" name="Dépenses" fill="#ff7c43" />
              <Bar dataKey="savings" name="Épargne" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          {months.map((month) => {
            const monthData = userData.financeModule.annualBudget?.[month] || { income: 0, expenses: 0 };
            const savings = monthData.income - monthData.expenses;
            const isPositive = savings > 0;
            const isNegative = savings < 0;
            
            return (
              <div 
                key={month}
                className={cn(
                  "border rounded-lg p-3 transition-all duration-200 cursor-pointer relative overflow-hidden",
                  getMonthColor(month),
                  hoveredMonth === month ? "transform scale-105 shadow-md" : ""
                )}
                onClick={() => handleEditMonth(month)}
                onMouseEnter={() => setHoveredMonth(month)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm">{month}</h4>
                  {getMonthIcon(month)}
                </div>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenus:</span>
                    <span>{formatCurrency(monthData.income)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dépenses:</span>
                    <span>{formatCurrency(monthData.expenses)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Épargne:</span>
                    <span className={cn(
                      isPositive ? "text-green-600" : isNegative ? "text-red-600" : ""
                    )}>
                      {formatCurrency(savings)}
                    </span>
                  </div>
                </div>
                
                {/* Show edit button on hover */}
                <div className={cn(
                  "absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 transition-opacity",
                  hoveredMonth === month ? "opacity-100" : "opacity-0"
                )}>
                  <Edit size={16} className="text-gray-700" />
                </div>
              </div>
            );
          })}
        </div>
        
        <Dialog open={!!selectedMonth} onOpenChange={(open) => !open && setSelectedMonth(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier le budget de {selectedMonth}</DialogTitle>
              <DialogDescription>
                Ajustez les revenus et dépenses pour ce mois
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="income" className="flex items-center gap-2">
                    <ArrowUp size={16} className="text-green-500" />
                    Revenus mensuels
                  </Label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="income"
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expenses" className="flex items-center gap-2">
                    <ArrowDown size={16} className="text-red-500" />
                    Dépenses mensuelles
                  </Label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="expenses"
                      type="number"
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {/* Summary calculation */}
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Épargne mensuelle:</span>
                    <span className={cn(
                      "font-pixel text-lg",
                      monthlyIncome - monthlyExpenses > 0 ? "text-green-600" : 
                      monthlyIncome - monthlyExpenses < 0 ? "text-red-600" : ""
                    )}>
                      {formatCurrency(monthlyIncome - monthlyExpenses)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setSelectedMonth(null)}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleSaveMonth}
              >
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AnnualBudget;
