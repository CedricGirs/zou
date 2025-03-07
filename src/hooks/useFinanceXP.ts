
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
    const normalized = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    
    // Correction des mois spécifiques
    const monthCorrections: { [key: string]: string } = {
      "Fevrier": "Février",
      "Fev": "Février",
      "Fév": "Février",
      "Aout": "Août",
      "Decembre": "Décembre",
      "Dec": "Décembre",
      "Déc": "Décembre"
    };
    
    return monthCorrections[normalized] || normalized;
  }, []);

  // Calculate total balance across all months
  const calculateTotalSavings = useCallback(() => {
    if (!userData?.financeModule?.monthlyData) return 0;
    
    try {
      const monthlyData = userData.financeModule.monthlyData;
      let totalBalance = 0;
      const processedMonths = new Set<string>();
      
      // Nettoyer et fusionner les données des mois
      const cleanedMonthlyData: Record<string, any> = {};
      
      Object.entries(monthlyData).forEach(([month, data]) => {
        const normalizedMonth = normalizeMonthName(month);
        
        if (!cleanedMonthlyData[normalizedMonth]) {
          cleanedMonthlyData[normalizedMonth] = data;
        } else {
          // Fusionner les données si le mois existe déjà
          cleanedMonthlyData[normalizedMonth] = {
            income: (cleanedMonthlyData[normalizedMonth].income || 0) + (data.income || 0),
            expenses: (cleanedMonthlyData[normalizedMonth].expenses || 0) + (data.expenses || 0),
            balance: (cleanedMonthlyData[normalizedMonth].balance || 0) + (data.balance || 0),
            transactions: [...(cleanedMonthlyData[normalizedMonth].transactions || []), ...(data.transactions || [])]
          };
        }
      });
      
      // Calculer le total des économies
      Object.values(cleanedMonthlyData).forEach((monthData: any) => {
        if (monthData && typeof monthData.balance === 'number') {
          totalBalance += monthData.balance;
        }
      });
      
      console.log("Total économies après nettoyage:", totalBalance);
      return Math.max(0, totalBalance); // Pas d'économies négatives
    } catch (error) {
      console.error("Erreur lors du calcul des économies totales:", error);
      return 0;
    }
  }, [userData?.financeModule?.monthlyData, normalizeMonthName]);

  const updateXPAndLevel = useCallback(async () => {
    if (!userData?.financeModule) return;

    try {
      const totalSavings = calculateTotalSavings();
      
      // Mettre à jour le solde total si nécessaire
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

      // Calculer le nouveau niveau
      let newLevel = 1;
      let threshold = calculateLevelThreshold(newLevel + 1);

      while (totalXP >= threshold) {
        newLevel++;
        threshold = calculateLevelThreshold(newLevel + 1);
      }

      const currentLevel = userData.financeModule.financeLevel || 1;
      const hasLeveledUp = newLevel > currentLevel;

      if (hasLeveledUp) {
        toast({
          title: "Niveau supérieur !",
          description: `Félicitations ! Vous êtes maintenant niveau ${newLevel} en finance !`,
          variant: "default",
        });
      }

      // Mettre à jour uniquement si les valeurs ont changé
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
    let isMounted = true;
    
    if (userData?.financeModule && isMounted) {
      updateXPAndLevel();
    }
    
    return () => {
      isMounted = false;
    };
  }, [updateXPAndLevel, userData?.financeModule]);

  return {
    updateXPAndLevel,
    calculateLevelThreshold,
    normalizeMonthName,
    calculateTotalSavings
  };
};
