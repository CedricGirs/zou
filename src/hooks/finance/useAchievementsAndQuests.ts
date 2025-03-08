
import { useCallback } from 'react';
import { useUserData } from '@/context/userData';
import { useFinanceXP } from '@/hooks/useFinanceXP';
import { toast } from '@/hooks/use-toast';
import { playSound } from '@/utils/audioUtils';

export const useAchievementsAndQuests = () => {
  const { userData, updateFinanceModule } = useUserData();
  const { updateXPAndLevel } = useFinanceXP();

  const completeQuestStep = useCallback(async (questId: string, progress: number) => {
    if (!userData.financeModule) return;
    
    const quests = [...userData.financeModule.quests];
    const questIndex = quests.findIndex(q => q.id === questId);
    
    if (questIndex !== -1) {
      quests[questIndex] = {
        ...quests[questIndex],
        progress,
        completed: progress === 100
      };
      
      await updateFinanceModule({ quests });
      
      if (progress === 100) {
        playSound('achievement');
        toast({
          title: "Quête complétée!",
          description: `Vous avez gagné ${quests[questIndex].xpReward} XP!`,
        });
        
        const newXP = userData.financeModule.currentXP + quests[questIndex].xpReward;
        let newLevel = userData.financeModule.financeLevel;
        let newMaxXP = userData.financeModule.maxXP;
        
        if (newXP >= newMaxXP) {
          newLevel += 1;
          newMaxXP = newMaxXP * 1.5;
          playSound('levelUp');
          toast({
            title: "Niveau supérieur!",
            description: `Vous êtes maintenant niveau ${newLevel} en finances!`,
          });
        }
        
        await updateFinanceModule({ 
          currentXP: newXP, 
          financeLevel: newLevel,
          maxXP: newMaxXP
        });
      }
    }
  }, [userData, updateFinanceModule]);

  const unlockAchievement = useCallback(async (achievementId: string) => {
    if (!userData.financeModule) return;
    
    const achievements = [...userData.financeModule.achievements];
    const achievementIndex = achievements.findIndex(a => a.id === achievementId);
    
    if (achievementIndex !== -1 && !achievements[achievementIndex].completed) {
      achievements[achievementIndex] = {
        ...achievements[achievementIndex],
        completed: true
      };
      
      await updateFinanceModule({ achievements });
      
      playSound('achievement');
      toast({
        title: "Succès débloqué!",
        description: `Vous avez débloqué: ${achievements[achievementIndex].name}`,
      });
      
      const newXP = userData.financeModule.currentXP + achievements[achievementIndex].xpReward;
      let newLevel = userData.financeModule.financeLevel;
      let newMaxXP = userData.financeModule.maxXP;
      
      if (newXP >= newMaxXP) {
        newLevel += 1;
        newMaxXP = newMaxXP * 1.5;
        playSound('levelUp');
        toast({
          title: "Niveau supérieur!",
          description: `Vous êtes maintenant niveau ${newLevel} en finances!`,
        });
      }
      
      await updateFinanceModule({ 
        currentXP: newXP, 
        financeLevel: newLevel,
        maxXP: newMaxXP
      });
      
      updateXPAndLevel();
    }
  }, [userData, updateFinanceModule, updateXPAndLevel]);

  return {
    completeQuestStep,
    unlockAchievement
  };
};
