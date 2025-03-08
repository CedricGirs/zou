
import { 
  ChartPie, 
  Wallet, 
  ArrowUpDown, 
  PiggyBank 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnnualBudget from "@/components/finance/AnnualBudget";
import TransactionTracker from "@/components/finance/TransactionTracker";
import SavingsTracker from "@/components/finance/SavingsTracker";
import FinancialOverview from "@/components/finance/FinancialOverview";
import FinancialInsights from "@/components/finance/FinancialInsights";
import { MonthlyData } from "@/context/userData";

interface FinanceTabsProps {
  selectedMonth: string;
  currentMonthData: MonthlyData;
  setCurrentMonthData: React.Dispatch<React.SetStateAction<MonthlyData>>;
  updateCurrentMonthData: (updates: Partial<MonthlyData>) => Promise<MonthlyData>;
  addTransaction: (transaction: any) => Promise<MonthlyData>;
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
  savingsGoal,
  unlockAchievement,
  completeQuestStep
}: FinanceTabsProps) => {
  
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="mb-4 grid grid-cols-4 gap-2">
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <ChartPie size={16} />
          <span className="hidden md:inline">Dashboard</span>
        </TabsTrigger>
        <TabsTrigger value="budget" className="flex items-center gap-2">
          <Wallet size={16} />
          <span className="hidden md:inline">Budget</span>
        </TabsTrigger>
        <TabsTrigger value="transactions" className="flex items-center gap-2">
          <ArrowUpDown size={16} />
          <span className="hidden md:inline">Transactions</span>
        </TabsTrigger>
        <TabsTrigger value="savings" className="flex items-center gap-2">
          <PiggyBank size={16} />
          <span className="hidden md:inline">Épargne</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard">
        <div className="grid grid-cols-1 gap-6">
          <FinancialOverview 
            income={currentMonthData.income}
            expenses={currentMonthData.expenses}
            balance={currentMonthData.balance}
            savingsGoal={savingsGoal}
            savingsRate={currentMonthData.savingsRate}
            unlockAchievement={unlockAchievement}
            completeQuestStep={completeQuestStep}
            selectedMonth={selectedMonth}
          />
          
          <FinancialInsights 
            transactions={currentMonthData.transactions || []}
            month={selectedMonth}
            updateMonthData={(newData) => {
              setCurrentMonthData(prev => ({
                ...prev,
                ...newData
              }));
            }}
          />
        </div>
      </TabsContent>

      <TabsContent value="budget">
        <AnnualBudget />
      </TabsContent>
      
      <TabsContent value="transactions">
        <TransactionTracker 
          selectedMonth={selectedMonth} 
          completeQuestStep={completeQuestStep}
          transactions={currentMonthData.transactions || []}
          updateMonthData={updateCurrentMonthData}
          addTransaction={addTransaction}
        />
      </TabsContent>
      
      <TabsContent value="savings">
        <SavingsTracker 
          unlockAchievement={unlockAchievement}
          completeQuestStep={completeQuestStep}
        />
      </TabsContent>
    </Tabs>
  );
};

export default FinanceTabs;
