
import { useEffect, useCallback } from 'react';
import { useUserData } from '@/context/UserDataContext';
import { toast } from '@/hooks/use-toast';

const XP_PER_EURO_SAVED = 1;
const XP_PER_ACHIEVEMENT = 50;

export const useFinanceXP = () => {
  const { userData, updateFinanceModule } = useUserData();

  const calculateLevelThreshold = (level: number) => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  };

  const calculateXPFromSavings = useCallback((totalSavings: number) => {
    return Math.floor(totalSavings * XP_PER_EURO_SAVED);
  }, []);

  const calculateXPFromAchievements = useCallback(() => {
    const completedAchievements = userData.financeModule?.achievements.filter(a => a.completed) || [];
    return completedAchievements.length * XP_PER_ACHIEVEMENT;
  }, [userData.financeModule?.achievements]);

  const updateXPAndLevel = useCallback(async () => {
    if (!userData.financeModule) return;

    const savingsXP = calculateXPFromSavings(userData.financeModule.balance || 0);
    const achievementsXP = calculateXPFromAchievements();
    const totalXP = savingsXP + achievementsXP;

    let newLevel = 1;
    let threshold = calculateLevelThreshold(newLevel + 1);

    while (totalXP >= threshold) {
      newLevel++;
      threshold = calculateLevelThreshold(newLevel + 1);
    }

    const hasLeveledUp = newLevel > userData.financeModule.financeLevel;

    if (hasLeveledUp) {
      toast({
        title: "Niveau supérieur !",
        description: `Félicitations ! Vous êtes maintenant niveau ${newLevel} en finance !`,
        variant: "default",
      });
    }

    await updateFinanceModule({
      currentXP: totalXP,
      financeLevel: newLevel,
      maxXP: calculateLevelThreshold(newLevel + 1)
    });
  }, [userData.financeModule, calculateXPFromSavings, calculateXPFromAchievements, updateFinanceModule]);

  useEffect(() => {
    updateXPAndLevel();
  }, [updateXPAndLevel]);

  return {
    updateXPAndLevel,
    calculateLevelThreshold
  };
};
