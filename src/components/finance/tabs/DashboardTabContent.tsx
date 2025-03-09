
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { MonthlyData, Transaction } from '@/context/userData';
import FinancialOverview from '../FinancialOverview';
import FinancialInsights from '../FinancialInsights';

interface DashboardTabContentProps {
  currentMonthData: MonthlyData;
  selectedMonth: string;
  savingsGoal: number;
  updateMonthData: (data: any) => Promise<any>;
  deleteTransaction: (id: string) => Promise<any>;
  unlockAchievement?: (achievementId: string) => Promise<void>;
  completeQuestStep?: (questId: string, progress: number) => Promise<void>;
}

const DashboardTabContent = ({
  currentMonthData,
  selectedMonth,
  savingsGoal,
  updateMonthData,
  deleteTransaction,
  unlockAchievement,
  completeQuestStep
}: DashboardTabContentProps) => {
  const transactions = currentMonthData?.transactions || [];
  
  const handleUpdateMonthData = async (data: Partial<MonthlyData>) => {
    const updatedData = await updateMonthData(data);
    return updatedData;
  };
  
  const handleDeleteTransaction = async (id: string) => {
    const updatedData = await deleteTransaction(id);
    return updatedData;
  };
  
  return (
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
              deleteTransaction={handleDeleteTransaction}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default DashboardTabContent;
