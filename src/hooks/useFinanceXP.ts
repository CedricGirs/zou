
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
    return Math.floor(Math.max(0, totalSavings) * XP_PER_EURO_SAVED);
  }, []);

  const calculateXPFromAchievements = useCallback(() => {
    if (!userData?.financeModule?.achievements) return 0;
    
    const achievements = userData.financeModule.achievements;
    const completedAchievements = achievements.filter(a => a.completed);
    return completedAchievements.length * XP_PER_ACHIEVEMENT;
  }, [userData?.financeModule?.achievements]);

  // Normaliser le nom du mois
  const normalizeMonthName = useCallback((month: string): string => {
    if (!month) return "";
    return month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
  }, []);

  // Calculate total balance across all months
  const calculateTotalSavings = useCallback(() => {
    if (!userData?.financeModule?.monthlyData) return 0;
    
    try {
      const monthlyData = userData.financeModule.monthlyData;
      let totalBalance = 0;
      const processedMonths = new Set<string>();
      
      // Sum up all monthly balances, handle case-insensitive duplicates
      Object.entries(monthlyData).forEach(([month, monthData]) => {
        // Normalize month name
        const normalizedMonth = normalizeMonthName(month);
        
        // Skip if we've already processed this month (case-insensitive)
        if (processedMonths.has(normalizedMonth.toLowerCase())) {
          return;
        }
        
        if (monthData && typeof monthData.balance === 'number') {
          totalBalance += monthData.balance;
          processedMonths.add(normalizedMonth.toLowerCase());
        }
      });
      
      console.log("Total économies cumulées (normalisé):", totalBalance);
      return totalBalance;
    } catch (error) {
      console.error("Erreur lors du calcul des économies totales:", error);
      return 0;
    }
  }, [userData?.financeModule?.monthlyData, normalizeMonthName]);

  const updateXPAndLevel = useCallback(async () => {
    if (!userData?.financeModule) return;

    try {
      // Calculate total savings across all months
      const totalSavings = calculateTotalSavings();
      
      // Update the balance property with total savings
      if (userData.financeModule.balance !== totalSavings) {
        await updateFinanceModule({ balance: totalSavings });
      }
      
      const savingsXP = calculateXPFromSavings(totalSavings);
      const achievementsXP = calculateXPFromAchievements();
      const totalXP = savingsXP + achievementsXP;
      
      console.log("XP calculations:", { 
        savingsXP, 
        achievementsXP, 
        totalXP,
        currentLevel: userData.financeModule.financeLevel,
        currentXP: userData.financeModule.currentXP,
        maxXP: userData.financeModule.maxXP
      });

      // Calculate new level based on XP
      let newLevel = 1;
      let threshold = calculateLevelThreshold(newLevel + 1);

      while (totalXP >= threshold) {
        newLevel++;
        threshold = calculateLevelThreshold(newLevel + 1);
      }

      const currentLevel = userData.financeModule.financeLevel || 1;
      const hasLeveledUp = newLevel > currentLevel;

      // Show toast if user leveled up
      if (hasLeveledUp) {
        toast({
          title: "Niveau supérieur !",
          description: `Félicitations ! Vous êtes maintenant niveau ${newLevel} en finance !`,
          variant: "default",
        });
      }

      // Only update if values have changed to avoid infinite loops
      if (totalXP !== userData.financeModule.currentXP || 
          newLevel !== userData.financeModule.financeLevel) {
        await updateFinanceModule({
          currentXP: totalXP,
          financeLevel: newLevel,
          maxXP: calculateLevelThreshold(newLevel + 1)
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'XP:", error);
    }
  }, [userData?.financeModule, calculateXPFromSavings, calculateXPFromAchievements, calculateTotalSavings, updateFinanceModule, calculateLevelThreshold]);

  // Update XP and level when finance module data changes
  useEffect(() => {
    if (userData?.financeModule) {
      updateXPAndLevel();
    }
  }, [updateXPAndLevel, userData?.financeModule]);

  return {
    updateXPAndLevel,
    calculateLevelThreshold,
    normalizeMonthName
  };
};
