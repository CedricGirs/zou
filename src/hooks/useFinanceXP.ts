
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

  // Normaliser le nom du mois de façon stricte et cohérente
  const normalizeMonthName = useCallback((month: string): string => {
    if (!month) return "";
    
    // Conversion en minuscules pour standardisation
    const monthLower = month.toLowerCase();
    
    // Tableau de mois standard avec accents
    const standardMonths = [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];
    
    // Variantes d'orthographe possibles pour chaque mois
    const monthVariants: {[key: string]: string} = {
      "january": "janvier", "jan": "janvier", "janv": "janvier",
      "february": "février", "feb": "février", "fev": "février", "févr": "février", "fév": "février",
      "march": "mars", "mar": "mars",
      "april": "avril", "apr": "avril", "avr": "avril",
      "may": "mai",
      "june": "juin", "jun": "juin",
      "july": "juillet", "jul": "juillet", "juil": "juillet",
      "august": "août", "aug": "août", "aout": "août", "aoû": "août",
      "september": "septembre", "sep": "septembre", "sept": "septembre",
      "october": "octobre", "oct": "octobre",
      "november": "novembre", "nov": "novembre",
      "december": "décembre", "dec": "décembre", "déc": "décembre"
    };
    
    // Vérifier si le mois est déjà dans le format standard
    if (standardMonths.includes(monthLower)) {
      // Première lettre en majuscule, reste en minuscules
      return monthLower.charAt(0).toUpperCase() + monthLower.slice(1);
    }
    
    // Vérifier si c'est une variante connue
    if (monthVariants[monthLower]) {
      const standardMonth = monthVariants[monthLower];
      return standardMonth.charAt(0).toUpperCase() + standardMonth.slice(1);
    }
    
    // Gestion des mois avec juste la première lettre en majuscule
    const capitalizedMonth = monthLower.charAt(0).toUpperCase() + monthLower.slice(1);
    if (monthVariants[capitalizedMonth.toLowerCase()]) {
      const standardMonth = monthVariants[capitalizedMonth.toLowerCase()];
      return standardMonth.charAt(0).toUpperCase() + standardMonth.slice(1);
    }
    
    // Si aucune correspondance, retourner le mois avec première lettre en majuscule
    console.log(`Mois non reconnu: ${month}, utilisation de la capitalisation standard`);
    return monthLower.charAt(0).toUpperCase() + monthLower.slice(1);
  }, []);

  // Calculate total balance across all months with improved deduplication
  const calculateTotalSavings = useCallback(() => {
    if (!userData?.financeModule?.monthlyData) return 0;
    
    try {
      const monthlyData = userData.financeModule.monthlyData;
      console.log("Données mensuelles:", monthlyData);
      
      // Map pour stocker les mois déjà normalisés et leurs données
      const normalizedMonthsMap = new Map();
      
      // Normaliser tous les noms de mois et fusionner les données dupliquées
      Object.entries(monthlyData).forEach(([month, data]) => {
        const normalizedMonth = normalizeMonthName(month);
        
        if (!normalizedMonthsMap.has(normalizedMonth)) {
          // Nouveau mois normalisé
          normalizedMonthsMap.set(normalizedMonth, {
            income: data.income || 0,
            expenses: data.expenses || 0,
            balance: data.balance || 0,
            transactions: [...(data.transactions || [])]
          });
        } else {
          // Fusionner avec un mois existant
          const existingData = normalizedMonthsMap.get(normalizedMonth);
          
          existingData.income += data.income || 0;
          existingData.expenses += data.expenses || 0;
          existingData.balance += data.balance || 0;
          
          // Fusionner les transactions en évitant les doublons par ID
          const existingIds = new Set(existingData.transactions.map((t: any) => t.id));
          if (Array.isArray(data.transactions)) {
            const newTransactions = data.transactions.filter(t => !existingIds.has(t.id));
            existingData.transactions.push(...newTransactions);
          }
        }
      });
      
      // Calculer le total des soldes mensuels
      let totalBalance = 0;
      normalizedMonthsMap.forEach((data) => {
        totalBalance += data.balance;
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
