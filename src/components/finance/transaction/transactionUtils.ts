
import { Transaction } from "@/context/UserDataContext";

export const recalculateTotals = (transactions: Transaction[]) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;
  
  return {
    income: totalIncome,
    expenses: totalExpenses,
    balance,
    savingsRate,
    transactions
  };
};

export const filterTransactions = (
  transactions: Transaction[],
  categoryFilter: string,
  searchTerm: string
) => {
  return transactions.filter(transaction => {
    // Category filter
    if (categoryFilter !== 'Tous' && transaction.category !== categoryFilter) {
      return false;
    }
    
    // Search term
    if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
};

export const preparePieChartData = (filteredTransactions: Transaction[], categories: string[]) => {
  return categories
    .map(category => {
      const value = filteredTransactions
        .filter(t => t.category === category && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return { name: category, value };
    })
    .filter(item => item.value > 0);
};
