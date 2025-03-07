
/**
 * Utility functions for formatting values in the annual budget section
 */

/**
 * Format a number as currency in EUR (€)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};

/**
 * Get months list in French
 */
export const getMonths = (): string[] => [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

/**
 * Calculate total budget values from monthly data
 */
export const calculateTotals = (annualBudget: Record<string, { income: number, expenses: number }> | undefined) => {
  if (!annualBudget) return { totalIncome: 0, totalExpenses: 0, totalSavings: 0 };
  
  let totalIncome = 0;
  let totalExpenses = 0;
  
  Object.values(annualBudget).forEach(month => {
    totalIncome += month.income;
    totalExpenses += month.expenses;
  });
  
  return {
    totalIncome,
    totalExpenses,
    totalSavings: totalIncome - totalExpenses
  };
};
