
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Transaction } from "@/context/UserDataContext";
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TransactionSummaryProps {
  filteredTransactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  pieChartData: Array<{ name: string; value: number }>;
  handleDeleteTransaction: (id: string) => void;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  filteredTransactions,
  totalIncome,
  totalExpenses,
  pieChartData,
  handleDeleteTransaction
}) => {
  // Colors for the pie chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card className="p-4 bg-green-50 border-green-100">
            <p className="text-sm text-muted-foreground mb-1">Total revenus</p>
            <p className="text-xl font-semibold text-green-600">{totalIncome} €</p>
          </Card>
          
          <Card className="p-4 bg-red-50 border-red-100">
            <p className="text-sm text-muted-foreground mb-1">Total dépenses</p>
            <p className="text-xl font-semibold text-red-600">{totalExpenses} €</p>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Répartition des dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} €`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground p-4">
                Pas assez de données pour afficher un graphique
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Transactions récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {filteredTransactions.slice(0, 10).map(transaction => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUp size={16} />
                    ) : (
                      <ArrowDown size={16} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date} - {transaction.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount} €
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    <Trash2 size={14} className="text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionSummary;
