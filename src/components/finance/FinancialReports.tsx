
import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserData } from "@/context/UserDataContext";

const FinancialReports = () => {
  const { userData } = useUserData();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // Default to current month
    return new Date().toLocaleString('fr-FR', { month: 'long' });
  });
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  // Process data from userData when it changes or month selection changes
  useEffect(() => {
    // Generate monthly data from annual budget
    if (userData.financeModule.annualBudget) {
      const monthData = Object.entries(userData.financeModule.annualBudget).map(([month, data]) => ({
        month: month.substring(0, 3),
        income: data.income,
        expenses: data.expenses,
        savings: data.income - data.expenses
      }));
      setMonthlyData(monthData);
    }
    
    // Generate category data from current month transactions
    const expensesBreakdown = calculateExpensesBreakdown();
    setCategoryData(expensesBreakdown);
  }, [userData, selectedMonth]);
  
  // Calculate expense breakdown by category for selected month
  const calculateExpensesBreakdown = () => {
    // Filter transactions for the selected month
    const monthTransactions = (userData.financeModule.transactions || [])
      .filter(t => t.month === selectedMonth && t.amount < 0);
    
    // Group by category and calculate totals
    const categoryTotals: Record<string, number> = {};
    let totalExpenses = 0;
    
    monthTransactions.forEach(transaction => {
      const category = transaction.category;
      const amount = Math.abs(transaction.amount);
      
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      
      categoryTotals[category] += amount;
      totalExpenses += amount;
    });
    
    // If no transactions, use the expense breakdown from user profile
    if (totalExpenses === 0) {
      const totalExpenses = (
        (userData.financeModule.housingExpenses || 0) +
        (userData.financeModule.foodExpenses || 0) +
        (userData.financeModule.transportExpenses || 0) +
        (userData.financeModule.leisureExpenses || 0) +
        (userData.financeModule.fixedExpenses || 0) +
        (userData.financeModule.debtPayments || 0)
      );
      
      if (totalExpenses === 0) {
        return [
          { name: 'Logement', value: 0 },
          { name: 'Alimentation', value: 0 },
          { name: 'Transport', value: 0 },
          { name: 'Loisirs', value: 0 },
          { name: 'Charges fixes', value: 0 },
          { name: 'Dettes', value: 0 }
        ];
      }
      
      return [
        { 
          name: 'Logement', 
          value: Math.round((userData.financeModule.housingExpenses || 0) / totalExpenses * 100) 
        },
        { 
          name: 'Alimentation', 
          value: Math.round((userData.financeModule.foodExpenses || 0) / totalExpenses * 100) 
        },
        { 
          name: 'Transport', 
          value: Math.round((userData.financeModule.transportExpenses || 0) / totalExpenses * 100) 
        },
        { 
          name: 'Loisirs', 
          value: Math.round((userData.financeModule.leisureExpenses || 0) / totalExpenses * 100) 
        },
        { 
          name: 'Charges fixes', 
          value: Math.round((userData.financeModule.fixedExpenses || 0) / totalExpenses * 100) 
        },
        { 
          name: 'Dettes', 
          value: Math.round((userData.financeModule.debtPayments || 0) / totalExpenses * 100) 
        }
      ];
    }
    
    // Convert to percentage
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Math.round((value / totalExpenses) * 100)
    }));
  };

  // Get month's data 
  const getSelectedMonthData = () => {
    if (!userData.financeModule.annualBudget) return { income: 0, expenses: 0, savings: 0 };
    const monthData = userData.financeModule.annualBudget[selectedMonth];
    if (!monthData) return { income: 0, expenses: 0, savings: 0 };
    
    return {
      income: monthData.income,
      expenses: monthData.expenses,
      savings: monthData.income - monthData.expenses
    };
  };
  
  const monthData = getSelectedMonthData();
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  return (
    <div className="glass-card p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-pixel text-lg">Rapport Financier</h2>
        
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Mois" />
          </SelectTrigger>
          <SelectContent>
            {months.map(month => (
              <SelectItem key={month} value={month}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="pixel-card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <h3 className="text-sm font-medium mb-2">Revenus</h3>
          <div className="font-pixel text-xl text-zou-purple">{monthData.income.toLocaleString()} €</div>
        </div>
        
        <div className="pixel-card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <h3 className="text-sm font-medium mb-2">Dépenses</h3>
          <div className="font-pixel text-xl text-zou-orange">{monthData.expenses.toLocaleString()} €</div>
        </div>
        
        <div className="pixel-card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <h3 className="text-sm font-medium mb-2">Épargne</h3>
          <div className={`font-pixel text-xl ${monthData.savings >= 0 ? 'text-zou-green' : 'text-red-500'}`}>
            {monthData.savings.toLocaleString()} €
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="monthly">Aperçu</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="savings">Épargne</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly" className="space-y-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Aperçu Mensuel - {selectedMonth}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} €`} />
                <Legend />
                <Bar dataKey="income" name="Revenus" fill="#8884d8" />
                <Bar dataKey="expenses" name="Dépenses" fill="#ff7c43" />
                <Bar dataKey="savings" name="Épargne" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Mois</th>
                  <th className="border p-2 text-right">Revenus</th>
                  <th className="border p-2 text-right">Dépenses</th>
                  <th className="border p-2 text-right">Épargne</th>
                  <th className="border p-2 text-center">Taux d'épargne</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data, index) => {
                  const savingsRate = data.income > 0 
                    ? ((data.savings / data.income) * 100).toFixed(1) 
                    : "0";
                  
                  return (
                    <tr key={index} className="hover:bg-muted/50">
                      <td className="border p-2">{data.month}</td>
                      <td className="border p-2 text-right">{data.income} €</td>
                      <td className="border p-2 text-right">{data.expenses} €</td>
                      <td className="border p-2 text-right">{data.savings} €</td>
                      <td className="border p-2 text-center">{savingsRate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-2">Répartition des Dépenses - {selectedMonth}</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-2">Détails des Catégories - {selectedMonth}</h3>
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="pixel-card p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span>{category.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold">{category.value}%</span>
                      </div>
                    </div>
                    <div className="mt-2 progress-bar">
                      <div 
                        className="progress-bar-fill"
                        style={{ 
                          width: `${category.value}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="savings">
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Épargne - {selectedMonth}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="pixel-card p-6">
                <h3 className="text-lg font-semibold text-center mb-4">{selectedMonth}</h3>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-zou-purple mb-2">
                    {monthData.income > 0 
                      ? ((monthData.savings / monthData.income) * 100).toFixed(1) 
                      : "0"}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Taux d'épargne mensuel
                  </div>
                  <div className="mt-4 w-full">
                    <div className="text-sm font-medium mb-1 flex justify-between">
                      <span>Épargne réalisée</span>
                      <span>{monthData.savings.toLocaleString()} €</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-zou-purple h-2.5 rounded-full"
                        style={{ width: `${Math.min(monthData.income > 0 ? (monthData.savings / monthData.income) * 100 : 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pixel-card p-6">
                <h3 className="text-lg font-semibold mb-4">Conseils d'épargne</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="bg-zou-purple text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
                    <span>Visez un taux d'épargne d'au moins 20% de vos revenus</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-zou-purple text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
                    <span>Constituez un fonds d'urgence équivalent à 3-6 mois de dépenses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-zou-purple text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
                    <span>Automatisez vos virements d'épargne en début de mois</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialReports;
