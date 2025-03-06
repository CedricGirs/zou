
import React, { useState } from 'react';
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from 'lucide-react';
import { useUserData } from "@/context/UserDataContext";
import { toast } from '@/hooks/use-toast';

const AnnualBudget = () => {
  const { userData, updateFinanceModule } = useUserData();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  // Format data for the bar chart
  const chartData = Object.entries(userData.financeModule.annualBudget || {}).map(([month, data]) => ({
    month,
    income: data.income,
    expenses: data.expenses,
    savings: data.income - data.expenses
  }));

  const handleEditMonth = (month: string) => {
    const monthData = userData.financeModule.annualBudget?.[month];
    if (monthData) {
      setMonthlyIncome(monthData.income);
      setMonthlyExpenses(monthData.expenses);
      setSelectedMonth(month);
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
      
      setSelectedMonth(null);
    }
  };

  return (
    <div className="glass-card p-4">
      <h2 className="font-pixel text-lg mb-4">Budget Annuel</h2>
      
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
              formatter={(value) => `${value} €`}
              labelFormatter={(label) => `Mois: ${label}`}
            />
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
              <th className="border p-2 text-center">% Dépenses</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(userData.financeModule.annualBudget || {}).map(([month, data]) => {
              const percentExpenses = ((data.expenses / data.income) * 100).toFixed(1);
              const savings = data.income - data.expenses;
              
              return (
                <tr key={month} className="hover:bg-muted/50">
                  <td className="border p-2">{month}</td>
                  <td className="border p-2 text-right">{data.income} €</td>
                  <td className="border p-2 text-right">{data.expenses} €</td>
                  <td className="border p-2 text-right">{savings} €</td>
                  <td className="border p-2 text-center">{percentExpenses}%</td>
                  <td className="border p-2 text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button 
                          className="p-1 rounded hover:bg-muted"
                          onClick={() => handleEditMonth(month)}
                        >
                          <Edit size={16} />
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier le budget de {selectedMonth}</DialogTitle>
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnnualBudget;
