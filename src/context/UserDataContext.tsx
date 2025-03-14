
// This file now re-exports from the userData folder to maintain backward compatibility
export { 
  UserDataProvider, 
  useUserData 
} from './userData';

export type {
  HeroProfile,
  StatusModule,
  LookModule,
  FinanceModule,
  SportModule,
  Transaction,
  SavingsGoal,
  MonthlyBudget,
  IncomeExpenseItem,
  BudgetTemplate,
  FinanceAchievement,
  FinanceQuest,
  MonthlyData,
  CourseItem,
  LanguageItem,
  SkillItem,
  StatusItem,
  UserData,
  UserDataContextType
} from './userData';
