
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, BarChartIcon, AlertTriangle, Info } from 'lucide-react';
import { useUserData } from "@/context/UserDataContext";
import { toast } from '@/hooks/use-toast';

const AnnualBudget = () => {
  const { userData, updateFinanceModule } = useUserData();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // Default to current month
    return new Date().toLocaleString('fr-FR', { month: 'long' });
  });
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  useEffect(() => {
    // Check if the annual budget has been initialized
    if (!userData.financeModule.annualBudget || 
        Object.keys(userData.financeModule.annualBudget).length === 0) {
      initializeAnnualBudget();
    } else {
      updateChartData();
      setIsInitialized(true);
      
      // Set initial income and expense values for the selected month
      if (userData.financeModule.annualBudget[selectedMonth]) {
        const monthData = userData.financeModule.annualBudget[selectedMonth];
        setMonthlyIncome(monthData.income);
        setMonthlyExpenses(monthData.expenses);
      }
    }
  }, [userData.financeModule.annualBudget, selectedMonth]);

  const initializeAnnualBudget = async () => {
    // Create template budget with empty values
    const initialBudget = {} as Record<string, { income: number; expenses: number }>;
    
    months.forEach(month => {
      initialBudget[month] = {
        income: 0,
        expenses: 0
      };
    });
    
    // Update user data with template budget
    await updateFinanceModule({ annualBudget: initialBudget });
    setIsInitialized(true);
  };

  // Update chart data when userData changes
  const updateChartData = () => {
    if (userData.financeModule.annualBudget) {
      const formattedData = Object.entries(userData.financeModule.annualBudget).map(([month, data]) => ({
        month: month.substring(0, 3),
        income: data.income,
        expenses: data.expenses,
        savings: data.income - data.expenses
      }));
      setChartData(formattedData);
    }
  };

  const handleEditMonth = () => {
    const monthData = userData.financeModule.annualBudget?.[selectedMonth];
    if (monthData) {
      setMonthlyIncome(monthData.income);
      setMonthlyExpenses(monthData.expenses);
      setEditDialogOpen(true);
    }
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
      
      setEditDialogOpen(false);
      updateChartData();
    }
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    
    // Update the form values when the month changes
    if (userData.financeModule.annualBudget?.[month]) {
      const monthData = userData.financeModule.annualBudget[month];
      setMonthlyIncome(monthData.income);
      setMonthlyExpenses(monthData.expenses);
    }
  };

  // Get current month's data
  const getCurrentMonthData = () => {
    if (!userData.financeModule.annualBudget || !userData.financeModule.annualBudget[selectedMonth]) {
      return { income: 0, expenses: 0, savings: 0 };
    }
    
    const monthData = userData.financeModule.annualBudget[selectedMonth];
    return {
      income: monthData.income,
      expenses: monthData.expenses,
      savings: monthData.income - monthData.expenses
    };
  };

  const { income, expenses, savings } = getCurrentMonthData();
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BarChartIcon className="mr-2 text-zou-purple" size={20} />
          <h2 className="font-pixel text-lg">Budget Mensuel</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Mois" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <button 
            className="pixel-button flex items-center"
            onClick={handleEditMonth}
          >
            <Edit size={16} className="mr-1" />
            Éditer
          </button>
        </div>
      </div>
      
      {isInitialized ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="pixel-card flex flex-col items-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <h3 className="text-sm font-medium mb-1">Revenus - {selectedMonth}</h3>
              <span className="font-pixel text-xl text-zou-purple">
                {income.toLocaleString()} €
              </span>
            </div>
            
            <div className="pixel-card flex flex-col items-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <h3 className="text-sm font-medium mb-1">Dépenses - {selectedMonth}</h3>
              <span className="font-pixel text-xl text-zou-orange">
                {expenses.toLocaleString()} €
              </span>
            </div>
            
            <div className="pixel-card flex flex-col items-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <h3 className="text-sm font-medium mb-1">Épargne - {selectedMonth}</h3>
              <span className={`font-pixel text-xl ${savings >= 0 ? 'text-zou-green' : 'text-red-500'}`}>
                {savings.toLocaleString()} €
              </span>
              {savings < 0 && (
                <div className="flex items-center text-xs text-red-500 mt-1">
                  <AlertTriangle size={12} className="mr-1" />
                  Déficit budgétaire
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold">Aperçu Budgétaire - {selectedMonth}</h3>
              <div className="text-sm text-muted-foreground">
                Taux d'épargne: <span className={`font-medium ${savingsRate >= 20 ? 'text-green-500' : savingsRate > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                  {savingsRate.toFixed(1)}%
                </span>
              </div>
            </div>
            
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => `${Number(value).toLocaleString()} €`}
                    labelFormatter={(label) => `Mois: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Revenus" fill="#8884d8" />
                  <Bar dataKey="expenses" name="Dépenses" fill="#ff7c43" />
                  <Bar dataKey="savings" name="Épargne" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-300">
                <div className="text-center p-10">
                  <Info size={40} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground">
                    Aucune donnée de budget disponible. Commencez par éditer un mois.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="pixel-card p-4">
              <h3 className="text-sm font-semibold mb-4">Détails du Budget - {selectedMonth}</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Revenus</span>
                    <span className="font-medium">{income.toLocaleString()} €</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-zou-purple h-2 rounded-full" 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Dépenses</span>
                    <span className="font-medium">{expenses.toLocaleString()} €</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        expenses > income ? 'bg-red-500' : 'bg-zou-orange'
                      }`}
                      style={{ width: `${income > 0 ? Math.min((expenses / income) * 100, 100) : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Épargne</span>
                    <span className={`font-medium ${savings >= 0 ? 'text-zou-green' : 'text-red-500'}`}>
                      {savings.toLocaleString()} €
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${savings >= 0 ? 'bg-zou-green' : 'bg-red-500'}`}
                      style={{ width: `${income > 0 ? Math.min(Math.abs(savings / income) * 100, 100) : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pixel-card p-4">
              <h3 className="text-sm font-semibold mb-4">Conseils Budgétaires</h3>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="mr-2 bg-zou-purple text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-sm">
                    <strong>Règle 50/30/20:</strong> Allouez 50% aux besoins, 30% aux désirs et 20% à l'épargne.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 bg-zou-purple text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="text-sm">
                    <strong>Automatisez l'épargne:</strong> Programmez un virement automatique dès réception de votre salaire.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 bg-zou-purple text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="text-sm">
                    <strong>Revoyez régulièrement:</strong> Ajustez votre budget chaque mois en fonction de vos résultats.
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le budget de {selectedMonth}</DialogTitle>
                <DialogDescription>
                  Ajustez les revenus et dépenses pour ce mois
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="income" className="text-right">
                    Revenus
                  </Label>
                  <Input
                    id="income"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expenses" className="text-right">
                    Dépenses
                  </Label>
                  <Input
                    id="expenses"
                    type="number"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  className="pixel-button"
                  onClick={handleSaveMonth}
                >
                  Enregistrer
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="text-center p-10">
          <Info size={40} className="mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground">
            Initialisation du budget mensuel...
          </p>
        </div>
      )}
    </div>
  );
};

export default AnnualBudget;
