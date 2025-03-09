
import { useEffect, useCallback } from 'react';
import { useUserData } from '@/context/userData';
import { toast } from '@/hooks/use-toast';
import { playSound } from '@/utils/audioUtils';

// Constantes pour le calcul d'XP
const XP_PER_EURO_SAVED = 1;
const XP_PER_ACHIEVEMENT = 50;
const LEVEL_MULTIPLIER = 1.5;

export const useFinanceXP = () => {
  const { userData, updateFinanceModule } = useUserData();

  /**
   * Calcule le seuil d'XP requis pour atteindre un niveau donné
   */
  const calculateLevelThreshold = useCallback((level: number) => {
    return Math.floor(100 * Math.pow(LEVEL_MULTIPLIER, level - 1));
  }, []);

  /**
   * Calcule l'XP basé sur les économies totales
   */
  const calculateXPFromSavings = useCallback((totalSavings: number) => {
    return Math.floor(totalSavings * XP_PER_EURO_SAVED);
  }, []);

  /**
   * Calcule l'XP basé sur les accomplissements débloqués
   */
  const calculateXPFromAchievements = useCallback(() => {
    const completedAchievements = userData?.financeModule?.achievements?.filter(a => a.completed) || [];
    return completedAchievements.length * XP_PER_ACHIEVEMENT;
  }, [userData?.financeModule?.achievements]);

  /**
   * Met à jour l'XP et le niveau financier de l'utilisateur
   */
  const updateXPAndLevel = useCallback(async () => {
    if (!userData?.financeModule) return;

    console.log("Updating XP and level");
    
    const savingsXP = calculateXPFromSavings(userData.financeModule.balance || 0);
    const achievementsXP = calculateXPFromAchievements();
    const totalXP = savingsXP + achievementsXP;

    console.log("XP calculation:", { savingsXP, achievementsXP, totalXP });
    
    let newLevel = 1;
    let threshold = calculateLevelThreshold(newLevel + 1);

    while (totalXP >= threshold) {
      newLevel++;
      threshold = calculateLevelThreshold(newLevel + 1);
    }

    const hasLeveledUp = newLevel > (userData.financeModule.financeLevel || 1);
    console.log("Level calculation:", { newLevel, currentLevel: userData.financeModule.financeLevel, hasLeveledUp });

    if (hasLeveledUp) {
      toast({
        title: "Niveau supérieur !",
        description: `Félicitations ! Vous êtes maintenant niveau ${newLevel} en finance !`,
        variant: "default",
      });
      
      playSound('levelUp', 0.8);
    }

    await updateFinanceModule({
      currentXP: totalXP,
      financeLevel: newLevel,
      maxXP: calculateLevelThreshold(newLevel + 1)
    });
    
    return {
      totalXP,
      newLevel,
      hasLeveledUp
    };
  }, [
    userData?.financeModule, 
    calculateXPFromSavings, 
    calculateXPFromAchievements, 
    calculateLevelThreshold, 
    updateFinanceModule
  ]);

  // Met à jour l'XP et le niveau au chargement du composant
  useEffect(() => {
    updateXPAndLevel();
  }, [updateXPAndLevel]);

  return {
    updateXPAndLevel,
    calculateLevelThreshold,
    calculateXPFromSavings,
    calculateXPFromAchievements
  };
};
