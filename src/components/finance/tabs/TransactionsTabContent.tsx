
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Transaction, MonthlyData } from "@/context/userData";
import TransactionTracker from '../TransactionTracker';

interface TransactionsTabContentProps {
  selectedMonth: string;
  transactions: Transaction[];
  updateMonthData: (data: any) => Promise<any>;
  completeQuestStep?: (questId: string, progress: number) => Promise<void>;
  addTransaction: (transaction: any) => Promise<MonthlyData>;
  deleteTransaction: (id: string) => Promise<any>;
}

const TransactionsTabContent = ({
  selectedMonth,
  transactions,
  updateMonthData,
  completeQuestStep,
  addTransaction,
  deleteTransaction
}: TransactionsTabContentProps) => {
  return (
    <TabsContent value="transactions">
      <TransactionTracker 
        selectedMonth={selectedMonth}
        transactions={transactions}
        updateMonthData={updateMonthData}
        completeQuestStep={completeQuestStep}
        addTransaction={addTransaction}
        deleteTransaction={deleteTransaction}
      />
    </TabsContent>
  );
};

export default TransactionsTabContent;
