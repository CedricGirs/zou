
import { useEffect, useCallback, useState } from 'react';
import { useUserData } from '@/context/UserDataContext';
import { toast } from '@/hooks/use-toast';

const XP_PER_EURO_SAVED = 1;
const XP_PER_ACHIEVEMENT = 50;

export const useFinanceXP = () => {
  const { userData, updateFinanceModule } = useUserData();
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Normalisation stricte du nom des mois
  const normalizeMonthName = useCallback((month: string): string => {
    if (!month || typeof month !== 'string') return "";
    
    // Conversion en minuscules pour standardisation
    const monthLower = month.toLowerCase().trim();
    
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
    
    // Traitement spécial pour "Mars" qui est souvent mal écrit comme "mars"
    if (monthLower === "mars") {
      return "Mars";
    }
    
    // Si aucune correspondance, retourner le mois capitalisé
    console.log(`Mois non reconnu: ${month}, utilisation de la capitalisation standard`);
    return monthLower.charAt(0).toUpperCase() + monthLower.slice(1);
  }, []);

  // Calculate total balance across all months with improved deduplication
  const calculateTotalSavings = useCallback(() => {
    if (!userData?.financeModule?.monthlyData) return 0;
    
    try {
      const monthlyData = userData.financeModule.monthlyData;
      console.log("Données mensuelles:", monthlyData);
      
      // Map pour stocker les mois normalisés et leurs données
      const normalizedMonthsMap = new Map();
      
      // Normaliser tous les noms de mois et fusionner les données dupliquées
      Object.entries(monthlyData).forEach(([month, data]) => {
        const normalizedMonth = normalizeMonthName(month);
        
        if (!normalizedMonth) return; // Skip empty month names
        
        if (!normalizedMonthsMap.has(normalizedMonth)) {
          // Nouveau mois normalisé
          normalizedMonthsMap.set(normalizedMonth, {
            income: parseFloat(data.income) || 0,
            expenses: parseFloat(data.expenses) || 0,
            balance: parseFloat(data.balance) || 0,
            transactions: [...(Array.isArray(data.transactions) ? data.transactions : [])]
          });
        } else {
          // Fusionner avec un mois existant
          const existingData = normalizedMonthsMap.get(normalizedMonth);
          
          existingData.income += parseFloat(data.income) || 0;
          existingData.expenses += parseFloat(data.expenses) || 0;
          existingData.balance += parseFloat(data.balance) || 0;
          
          // Fusionner les transactions en évitant les doublons par ID
          if (Array.isArray(data.transactions)) {
            const existingIds = new Set(existingData.transactions.map((t: any) => t.id));
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

  // Fonction pour nettoyer les données mensuelles en supprimant les doublons
  const cleanupMonthlyData = useCallback(async () => {
    if (!userData?.financeModule?.monthlyData || isProcessing) return;

    try {
      setIsProcessing(true);
      const monthlyData = userData.financeModule.monthlyData;
      const cleanedData: Record<string, any> = {};
      const processedMonths = new Set();

      // Traiter chaque entrée de mois
      Object.entries(monthlyData).forEach(([month, data]) => {
        const normalizedMonth = normalizeMonthName(month);
        
        if (!normalizedMonth || processedMonths.has(normalizedMonth)) return;
        
        // Collecter toutes les données pour ce mois normalisé
        const allMonthData = Object.entries(monthlyData)
          .filter(([m]) => normalizeMonthName(m) === normalizedMonth)
          .map(([_, d]) => d);

        // Fusionner les données
        const mergedData = {
          income: 0,
          expenses: 0,
          balance: 0,
          transactions: [] as any[],
          savingsRate: 0
        };

        const transactionIds = new Set();
        
        allMonthData.forEach(monthData => {
          mergedData.income += parseFloat(monthData.income) || 0;
          mergedData.expenses += parseFloat(monthData.expenses) || 0;
          
          if (Array.isArray(monthData.transactions)) {
            monthData.transactions.forEach((transaction: any) => {
              if (!transactionIds.has(transaction.id)) {
                transactionIds.add(transaction.id);
                mergedData.transactions.push({
                  ...transaction,
                  month: normalizedMonth
                });
              }
            });
          }
        });
        
        // Recalculer le solde et le taux d'épargne
        mergedData.balance = mergedData.income - mergedData.expenses;
        mergedData.savingsRate = mergedData.income > 0 
          ? Math.round((mergedData.income - mergedData.expenses) / mergedData.income * 100) 
          : 0;
        
        cleanedData[normalizedMonth] = mergedData;
        processedMonths.add(normalizedMonth);
      });

      // Mettre à jour les données nettoyées
      await updateFinanceModule({ monthlyData: cleanedData });
      console.log("Données mensuelles nettoyées:", cleanedData);
      
    } catch (error) {
      console.error("Erreur lors du nettoyage des données mensuelles:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [userData?.financeModule?.monthlyData, normalizeMonthName, updateFinanceModule, isProcessing]);

  const updateXPAndLevel = useCallback(async () => {
    if (!userData?.financeModule || isProcessing) return;

    try {
      setIsProcessing(true);
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
    } finally {
      setIsProcessing(false);
    }
  }, [userData?.financeModule, calculateXPFromSavings, calculateXPFromAchievements, calculateTotalSavings, updateFinanceModule, calculateLevelThreshold, isProcessing]);

  // Update XP and level when finance module data changes
  useEffect(() => {
    let isMounted = true;
    
    if (userData?.financeModule && isMounted && !isProcessing) {
      // Nettoyer les données mensuelles lors du chargement initial
      cleanupMonthlyData().then(() => {
        if (isMounted) {
          updateXPAndLevel();
        }
      });
    }
    
    return () => {
      isMounted = false;
    };
  }, [updateXPAndLevel, userData?.financeModule, cleanupMonthlyData, isProcessing]);

  return {
    updateXPAndLevel,
    calculateLevelThreshold,
    normalizeMonthName,
    calculateTotalSavings,
    cleanupMonthlyData
  };
};
