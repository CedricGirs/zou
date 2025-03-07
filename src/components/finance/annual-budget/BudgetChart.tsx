
import React from 'react';
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

interface BudgetChartProps {
  chartData: any[];
  formatCurrency: (value: number) => string;
}

const BudgetChart = ({ chartData, formatCurrency }: BudgetChartProps) => {
  const COLORS = {
    income: '#8B5CF6', // Vivid purple
    expenses: '#F97316', // Bright orange
    savings: '#10B981', // Emerald green
    background: '#E5DEFF', // Soft purple
  };

  const customBarChart = {
    background: "linear-gradient(180deg, #E5DEFF 0%, rgba(229, 222, 255, 0.2) 100%)",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid rgba(139, 92, 246, 0.2)",
  };

  return (
    <div className="mb-8" style={customBarChart}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.income} stopOpacity={0.8}/>
              <stop offset="100%" stopColor={COLORS.income} stopOpacity={0.4}/>
            </linearGradient>
            <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.expenses} stopOpacity={0.8}/>
              <stop offset="100%" stopColor={COLORS.expenses} stopOpacity={0.4}/>
            </linearGradient>
            <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.savings} stopOpacity={0.8}/>
              <stop offset="100%" stopColor={COLORS.savings} stopOpacity={0.4}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
          <XAxis 
            dataKey="month" 
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value) => formatCurrency(value as number)}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{
              paddingBottom: '20px',
              fontSize: '14px'
            }}
          />
          <Bar 
            dataKey="income" 
            name="Revenus" 
            fill="url(#incomeGradient)"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="expenses" 
            name="Dépenses" 
            fill="url(#expensesGradient)"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="savings" 
            name="Épargne" 
            fill="url(#savingsGradient)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetChart;
