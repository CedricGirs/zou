
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import FinanceQuests from '../FinanceQuests';

interface QuestsTabContentProps {
  completeQuestStep: (questId: string, progress: number) => Promise<void>;
}

const QuestsTabContent = ({ completeQuestStep }: QuestsTabContentProps) => {
  return (
    <TabsContent value="quests">
      <FinanceQuests completeQuestStep={completeQuestStep} />
    </TabsContent>
  );
};

export default QuestsTabContent;
