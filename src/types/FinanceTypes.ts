
export interface Transaction {
  id: string;
  date: string; 
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  month?: string;
  isVerified?: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
}

export interface MonthlyBudget {
  income: number;
  expenses: number;
}

export interface IncomeExpenseItem {
  id: string;
  description: string;
  amount: number;
  category: string;
}

export interface BudgetTemplate {
  id: string;
  name: string;
  income: number;
  expenses: number;
  description?: string;
  incomeItems?: IncomeExpenseItem[];
  expenseItems?: IncomeExpenseItem[];
}

export interface FinanceAchievement {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  xpReward: number;
}

export interface FinanceQuest {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  progress: number;
  xpReward: number;
}

export interface MonthlyData {
  income: number;
  expenses: number;
  balance: number;
  savingsRate: number;
  transactions: Transaction[];
}

export interface FinanceModule {
  // Core financial data
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  savingsGoal?: number;
  
  // Monthly data storage
  monthlyData?: {
    [month: string]: MonthlyData;
  };
  
  // Expense categories
  housingExpenses?: number;
  foodExpenses?: number;
  transportExpenses?: number;
  leisureExpenses?: number;
  fixedExpenses?: number;
  debtPayments?: number;
  additionalIncome?: number;
  
  // Budgeting
  annualBudget: {
    [month: string]: MonthlyBudget;
  };
  
  // New property for budget templates
  budgetTemplates: BudgetTemplate[];
  
  // Gamification elements
  financeLevel: number;
  currentXP: number;
  maxXP: number;
  achievements: FinanceAchievement[];
  quests: FinanceQuest[];
}
