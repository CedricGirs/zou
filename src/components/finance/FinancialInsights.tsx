
import React from 'react';
import { 
  BarChart, 
  Bar, 
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Transaction } from "@/context/UserDataContext";
import { AlertCircle, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface FinancialInsightsProps {
  transactions: Transaction[];
  month: string;
}

const FinancialInsights = ({ transactions, month }: FinancialInsightsProps) => {
  // Filtre les transactions pour le mois sélectionné
  const filteredTransactions = transactions.filter(t => t.month === month);
  
  // Données pour le graphique des catégories de dépenses
  const expensesByCategory = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Math.abs(transaction.amount);
      return acc;
    }, {} as Record<string, number>);
  
  const expensePieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value
  }));
  
  // Données pour le graphique des revenus vs dépenses par jour
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  
  const dailyData: Record<string, { income: number, expenses: number, date: string }> = {};
  
  // Initialisation des données pour chaque jour du mois
  for (let day = 1; day <= endOfMonth.getDate(); day++) {
    const dateStr = `${day.toString().padStart(2, '0')}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;
    dailyData[dateStr] = { income: 0, expenses: 0, date: dateStr };
  }
  
  // Remplissage avec les transactions
  filteredTransactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const dateStr = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`;
    
    if (dailyData[dateStr]) {
      if (transaction.amount > 0) {
        dailyData[dateStr].income += transaction.amount;
      } else {
        dailyData[dateStr].expenses += Math.abs(transaction.amount);
      }
    }
  });
  
  const dailyChartData = Object.values(dailyData);
  
  // Calculs financiers
  const totalIncome = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const largestExpense = filteredTransactions
    .filter(t => t.amount < 0)
    .sort((a, b) => a.amount - b.amount)[0];
    
  const largestIncome = filteredTransactions
    .filter(t => t.amount > 0)
    .sort((a, b) => b.amount - a.amount)[0];
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={18} />
          Aperçu des dépenses et revenus
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString('fr-FR')} €`} />
              <Legend />
              <Bar dataKey="income" name="Revenus" fill="#82ca9d" />
              <Bar dataKey="expenses" name="Dépenses" fill="#ff7c43" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingDown size={18} />
          Répartition des dépenses
        </h3>
        
        {expensePieData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expensePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString('fr-FR')} €`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground text-center">
              Pas de données pour ce mois
            </p>
          </div>
        )}
      </div>
      
      <div className="glass-card p-4 lg:col-span-2">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Info size={18} />
          Insights financiers
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {totalIncome > 0 ? (
                <span>Vous avez gagné <strong>{totalIncome.toLocaleString('fr-FR')} €</strong> ce mois-ci.</span>
              ) : (
                <span>Aucun revenu enregistré pour ce mois.</span>
              )}
            </AlertDescription>
          </Alert>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {totalExpenses > 0 ? (
                <span>Vous avez dépensé <strong>{totalExpenses.toLocaleString('fr-FR')} €</strong> ce mois-ci.</span>
              ) : (
                <span>Aucune dépense enregistrée pour ce mois.</span>
              )}
            </AlertDescription>
          </Alert>
          
          {largestExpense && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Votre plus grosse dépense: <strong>{Math.abs(largestExpense.amount).toLocaleString('fr-FR')} €</strong> pour {largestExpense.description}.
              </AlertDescription>
            </Alert>
          )}
          
          {largestIncome && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Votre plus gros revenu: <strong>{largestIncome.amount.toLocaleString('fr-FR')} €</strong> pour {largestIncome.description}.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialInsights;
