
import { Tabs } from "@/components/ui/tabs";
import { MonthlyData, Transaction } from '@/context/userData';
import TabsList from './tabs/TabsList';
import DashboardTabContent from './tabs/DashboardTabContent';
import BudgetTabContent from './tabs/BudgetTabContent';
import TransactionsTabContent from './tabs/TransactionsTabContent';
import SavingsTabContent from './tabs/SavingsTabContent';
import ReportsTabContent from './tabs/ReportsTabContent';
import QuestsTabContent from './tabs/QuestsTabContent';

interface FinanceTabsProps {
  selectedMonth: string;
  currentMonthData: MonthlyData;
  setCurrentMonthData: React.Dispatch<React.SetStateAction<MonthlyData>>;
  updateCurrentMonthData: (updates: Partial<MonthlyData>) => Promise<MonthlyData>;
  addTransaction: (transaction: Partial<Transaction>) => Promise<MonthlyData>;
  deleteTransaction: (id: string) => Promise<MonthlyData>;
  savingsGoal: number;
  unlockAchievement: (achievementId: string) => Promise<void>;
  completeQuestStep: (questId: string, progress: number) => Promise<void>;
}

const FinanceTabs = ({ 
  selectedMonth,
  currentMonthData,
  setCurrentMonthData,
  updateCurrentMonthData,
  addTransaction,
  deleteTransaction,
  savingsGoal,
  unlockAchievement,
  completeQuestStep
}: FinanceTabsProps) => {
  console.log("FinanceTabs - Current month data:", currentMonthData);
  const transactions = currentMonthData?.transactions || [];
  
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList />
      
      <DashboardTabContent 
        currentMonthData={currentMonthData}
        selectedMonth={selectedMonth}
        savingsGoal={savingsGoal}
        updateMonthData={updateCurrentMonthData}
        deleteTransaction={deleteTransaction}
        unlockAchievement={unlockAchievement}
        completeQuestStep={completeQuestStep}
      />
      
      <BudgetTabContent />
      
      <TransactionsTabContent 
        selectedMonth={selectedMonth}
        transactions={transactions}
        updateMonthData={updateCurrentMonthData}
        completeQuestStep={completeQuestStep}
        addTransaction={addTransaction}
        deleteTransaction={deleteTransaction}
      />
      
      <SavingsTabContent 
        unlockAchievement={unlockAchievement}
        completeQuestStep={completeQuestStep}
      />
      
      <ReportsTabContent />
      
      <QuestsTabContent 
        completeQuestStep={completeQuestStep}
      />
    </Tabs>
  );
};

export default FinanceTabs;
