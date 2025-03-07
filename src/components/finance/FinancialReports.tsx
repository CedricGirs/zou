
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
  const [yearFilter, setYearFilter] = useState('2024');
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [annualData, setAnnualData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [savingsRateData, setSavingsRateData] = useState<any[]>([]);
  
  // Process data from userData when it changes
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
    
    // Generate annual data
    // For now, we'll use static data plus the current year's data aggregated from monthly
    const currentYearTotal = calculateAnnualTotals();
    setAnnualData([
      { year: '2022', income: 55000, expenses: 46000, savings: 9000 },
      { year: '2023', income: 58000, expenses: 48000, savings: 10000 },
      { year: '2024', income: currentYearTotal.income, expenses: currentYearTotal.expenses, savings: currentYearTotal.savings }
    ]);
    
    // Generate category data from user's expense breakdown
    const expensesBreakdown = calculateExpensesBreakdown();
    setCategoryData(expensesBreakdown);
    
    // Generate savings rate data
    // For historical years, use static data
    // For current year, calculate from the actual data
    const currentYearSavingsRate = currentYearTotal.income > 0 
      ? (currentYearTotal.savings / currentYearTotal.income) * 100 
      : 0;
    
    setSavingsRateData([
      { year: '2022', rate: 16.4 },
      { year: '2023', rate: 17.2 },
      { year: '2024', rate: parseFloat(currentYearSavingsRate.toFixed(1)) }
    ]);
  }, [userData]);
  
  // Calculate annual totals from monthly data
  const calculateAnnualTotals = () => {
    if (!userData.financeModule.annualBudget) {
      return { income: 0, expenses: 0, savings: 0 };
    }
    
    let totalIncome = 0;
    let totalExpenses = 0;
    
    Object.values(userData.financeModule.annualBudget).forEach(data => {
      totalIncome += data.income;
      totalExpenses += data.expenses;
    });
    
    return {
      income: totalIncome,
      expenses: totalExpenses,
      savings: totalIncome - totalExpenses
    };
  };
  
  // Calculate expense breakdown by category
  const calculateExpensesBreakdown = () => {
    const housingExpenses = userData.financeModule.housingExpenses || 0;
    const foodExpenses = userData.financeModule.foodExpenses || 0;
    const transportExpenses = userData.financeModule.transportExpenses || 0;
    const leisureExpenses = userData.financeModule.leisureExpenses || 0;
    const fixedExpenses = userData.financeModule.fixedExpenses || 0;
    const debtPayments = userData.financeModule.debtPayments || 0;
    
    const totalExpenses = (
      housingExpenses +
      foodExpenses +
      transportExpenses +
      leisureExpenses +
      fixedExpenses +
      debtPayments
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
        value: Math.round(housingExpenses / totalExpenses * 100) 
      },
      { 
        name: 'Alimentation', 
        value: Math.round(foodExpenses / totalExpenses * 100) 
      },
      { 
        name: 'Transport', 
        value: Math.round(transportExpenses / totalExpenses * 100) 
      },
      { 
        name: 'Loisirs', 
        value: Math.round(leisureExpenses / totalExpenses * 100) 
      },
      { 
        name: 'Charges fixes', 
        value: Math.round(fixedExpenses / totalExpenses * 100) 
      },
      { 
        name: 'Dettes', 
        value: Math.round(debtPayments / totalExpenses * 100) 
      }
    ];
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  return (
    <div className="glass-card p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-pixel text-lg">Rapports Financiers</h2>
        
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="monthly">Mensuel</TabsTrigger>
          <TabsTrigger value="annual">Annuel</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="savings">Épargne</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly" className="space-y-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Aperçu Mensuel - {yearFilter}</h3>
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
        
        <TabsContent value="annual">
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Comparaison Annuelle</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={annualData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
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
                  <th className="border p-2 text-left">Année</th>
                  <th className="border p-2 text-right">Revenus</th>
                  <th className="border p-2 text-right">Dépenses</th>
                  <th className="border p-2 text-right">Épargne</th>
                  <th className="border p-2 text-center">Taux d'épargne</th>
                </tr>
              </thead>
              <tbody>
                {annualData.map((data, index) => {
                  const savingsRate = data.income > 0 
                    ? ((data.savings / data.income) * 100).toFixed(1) 
                    : "0";
                  
                  return (
                    <tr key={index} className="hover:bg-muted/50">
                      <td className="border p-2">{data.year}</td>
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
              <h3 className="text-sm font-semibold mb-2">Répartition des Dépenses</h3>
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
              <h3 className="text-sm font-semibold mb-2">Détails des Catégories</h3>
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
            <h3 className="text-sm font-semibold mb-2">Évolution du Taux d'Épargne</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={savingsRateData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  name="Taux d'épargne" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {savingsRateData.map((data, index) => (
              <div key={index} className="pixel-card p-4">
                <h3 className="text-lg font-semibold text-center mb-2">{data.year}</h3>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-zou-purple mb-2">
                    {data.rate}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Taux d'épargne annuel
                  </div>
                  {index > 0 && (
                    <div className={`mt-2 text-sm ${
                      data.rate > savingsRateData[index - 1].rate 
                        ? 'text-green-500' 
                        : 'text-red-500'
                    }`}>
                      {data.rate > savingsRateData[index - 1].rate 
                        ? `+${(data.rate - savingsRateData[index - 1].rate).toFixed(1)}%` 
                        : `${(data.rate - savingsRateData[index - 1].rate).toFixed(1)}%`} 
                      par rapport à l'année précédente
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialReports;
