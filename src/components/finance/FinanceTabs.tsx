
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MonthlyData, Transaction } from "@/context/userData";
import FinancialOverview from "./FinancialOverview";
import FinancialInsights from "./FinancialInsights";
import TransactionTracker from "./TransactionTracker";
import SavingsTracker from "./SavingsTracker";
import AnnualBudget from "./AnnualBudget";
import FinanceQuests from "./FinanceQuests";

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
  
  const handleUpdateMonthData = async (data: Partial<MonthlyData>) => {
    await updateCurrentMonthData(data);
  };
  
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
        <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
        <TabsTrigger value="budget">Budget</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
        <TabsTrigger value="savings">Épargne</TabsTrigger>
        <TabsTrigger value="reports">Rapports</TabsTrigger>
        <TabsTrigger value="quests">Quêtes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-8">
              <FinancialOverview 
                income={currentMonthData?.income || 0}
                expenses={currentMonthData?.expenses || 0}
                balance={(currentMonthData?.income || 0) - (currentMonthData?.expenses || 0)}
                savingsGoal={savingsGoal}
                savingsRate={currentMonthData?.savingsRate || 0}
                selectedMonth={selectedMonth}
                unlockAchievement={unlockAchievement}
                completeQuestStep={completeQuestStep}
              />
              
              <FinancialInsights 
                transactions={transactions}
                month={selectedMonth}
                updateMonthData={handleUpdateMonthData}
                deleteTransaction={deleteTransaction}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="budget">
        <AnnualBudget />
      </TabsContent>
      
      <TabsContent value="transactions">
        <TransactionTracker 
          selectedMonth={selectedMonth}
          transactions={transactions}
          updateMonthData={handleUpdateMonthData}
          completeQuestStep={completeQuestStep}
          addTransaction={addTransaction}
        />
      </TabsContent>
      
      <TabsContent value="savings">
        <SavingsTracker />
      </TabsContent>
      
      <TabsContent value="reports">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Rapports financiers</h3>
            <p className="text-muted-foreground">
              Cette section sera disponible prochainement...
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="quests">
        <FinanceQuests completeQuestStep={completeQuestStep} />
      </TabsContent>
    </Tabs>
  );
};

export default FinanceTabs;
