
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import SavingsTracker from '../SavingsTracker';

interface SavingsTabContentProps {
  unlockAchievement?: (achievementId: string) => Promise<void>;
  completeQuestStep?: (questId: string, progress: number) => Promise<void>;
}

const SavingsTabContent = ({ 
  unlockAchievement, 
  completeQuestStep 
}: SavingsTabContentProps) => {
  return (
    <TabsContent value="savings">
      <SavingsTracker 
        unlockAchievement={unlockAchievement}
        completeQuestStep={completeQuestStep}
      />
    </TabsContent>
  );
};

export default SavingsTabContent;
