
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import AnnualBudget from '../AnnualBudget';

const BudgetTabContent = () => {
  return (
    <TabsContent value="budget">
      <AnnualBudget />
    </TabsContent>
  );
};

export default BudgetTabContent;
