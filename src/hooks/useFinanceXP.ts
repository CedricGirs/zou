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

  const normalizeMonthName = useCallback((month: string): string => {
    if (!month || typeof month !== 'string') return "";
    
    const monthLower = month.toLowerCase().trim();
    
    const standardMonths = [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];
    
    if (standardMonths.includes(monthLower)) {
      return monthLower.charAt(0).toUpperCase() + monthLower.slice(1);
    }
    
    const monthVariants: {[key: string]: string} = {
      "january": "Janvier", "jan": "Janvier", "janv": "Janvier",
      "february": "Février", "feb": "Février", "fev": "Février", "févr": "Février",
      "march": "Mars", "mar": "Mars",
      "april": "Avril", "apr": "Avril", "avr": "Avril",
      "may": "Mai",
      "june": "Juin", "jun": "Juin",
      "july": "Juillet", "jul": "Juillet", "juil": "Juillet",
      "august": "Août", "aug": "Août", "aout": "Août",
      "september": "Septembre", "sep": "Septembre", "sept": "Septembre",
      "october": "Octobre", "oct": "Octobre",
      "november": "Novembre", "nov": "Novembre",
      "december": "Décembre", "dec": "Décembre", "déc": "Décembre"
    };
    
    return monthVariants[monthLower] || (monthLower.charAt(0).toUpperCase() + monthLower.slice(1));
  }, []);

  const getInitialMonthData = () => ({
    income: 0,
    expenses: 0,
    balance: 0,
    savingsRate: 0,
    transactions: []
  });

  const getMonthData = useCallback((monthName: string) => {
    if (!userData?.financeModule?.monthlyData) return getInitialMonthData();
    
    const normalizedMonth = normalizeMonthName(monthName);
    return userData.financeModule.monthlyData[normalizedMonth] || getInitialMonthData();
  }, [userData?.financeModule?.monthlyData, normalizeMonthName]);

  const saveMonthData = useCallback(async (monthName: string, data: any) => {
    if (!userData?.financeModule || isProcessing) return;
    
    try {
      setIsProcessing(true);
      const normalizedMonth = normalizeMonthName(monthName);
      
      const existingMonthlyData = {
        ...(userData.financeModule.monthlyData || {})
      };

      existingMonthlyData[normalizedMonth] = {
        income: parseFloat(data.income.toString()),
        expenses: parseFloat(data.expenses.toString()),
        balance: parseFloat(data.balance.toString()),
        savingsRate: parseFloat(data.savingsRate.toString()),
        transactions: data.transactions || []
      };

      await updateFinanceModule({ monthlyData: existingMonthlyData });
      
      toast({
        title: "Données sauvegardées",
        description: `Les données pour ${normalizedMonth} ont été enregistrées.`,
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les données.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [userData?.financeModule, updateFinanceModule, normalizeMonthName, isProcessing]);

  const calculateTotalSavings = useCallback(() => {
    if (!userData?.financeModule?.monthlyData) return 0;
    
    try {
      const monthlyData = userData.financeModule.monthlyData;
      console.log("Données mensuelles:", monthlyData);
      
      const normalizedMonthsMap = new Map();
      
      Object.entries(monthlyData).forEach(([month, data]) => {
        const normalizedMonth = normalizeMonthName(month);
        
        if (!normalizedMonth) return;
        
        if (!normalizedMonthsMap.has(normalizedMonth)) {
          normalizedMonthsMap.set(normalizedMonth, {
            income: parseFloat(String(data.income)) || 0,
            expenses: parseFloat(String(data.expenses)) || 0,
            balance: parseFloat(String(data.balance)) || 0,
            transactions: [...(Array.isArray(data.transactions) ? data.transactions : [])]
          });
        } else {
          const existingData = normalizedMonthsMap.get(normalizedMonth);
          
          existingData.income += parseFloat(String(data.income)) || 0;
          existingData.expenses += parseFloat(String(data.expenses)) || 0;
          existingData.balance += parseFloat(String(data.balance)) || 0;
          
          if (Array.isArray(data.transactions)) {
            const existingIds = new Set(existingData.transactions.map((t: any) => t.id));
            const newTransactions = data.transactions.filter(t => !existingIds.has(t.id));
            existingData.transactions.push(...newTransactions);
          }
        }
      });
      
      let totalBalance = 0;
      normalizedMonthsMap.forEach((data) => {
        totalBalance += data.balance;
      });
      
      console.log("Total économies après nettoyage:", totalBalance);
      return Math.max(0, totalBalance);
    } catch (error) {
      console.error("Erreur lors du calcul des économies totales:", error);
      return 0;
    }
  }, [userData?.financeModule?.monthlyData, normalizeMonthName]);

  const cleanupMonthlyData = useCallback(async () => {
    if (!userData?.financeModule?.monthlyData || isProcessing) return;

    try {
      setIsProcessing(true);
      const monthlyData = userData.financeModule.monthlyData;
      const cleanedData: Record<string, any> = {};
      const processedMonths = new Set();

      Object.entries(monthlyData).forEach(([month, data]) => {
        const normalizedMonth = normalizeMonthName(month);
        
        if (!normalizedMonth || processedMonths.has(normalizedMonth)) return;
        
        const allMonthData = Object.entries(monthlyData)
          .filter(([m]) => normalizeMonthName(m) === normalizedMonth)
          .map(([_, d]) => d);

        const mergedData = {
          income: 0,
          expenses: 0,
          balance: 0,
          transactions: [] as any[],
          savingsRate: 0
        };

        const transactionIds = new Set();
        
        allMonthData.forEach(monthData => {
          mergedData.income += parseFloat(String(monthData.income)) || 0;
          mergedData.expenses += parseFloat(String(monthData.expenses)) || 0;
          
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
        
        mergedData.balance = mergedData.income - mergedData.expenses;
        mergedData.savingsRate = mergedData.income > 0 
          ? Math.round((mergedData.income - mergedData.expenses) / mergedData.income * 100) 
          : 0;
        
        cleanedData[normalizedMonth] = mergedData;
        processedMonths.add(normalizedMonth);
      });

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

  useEffect(() => {
    let isMounted = true;
    
    if (userData?.financeModule && isMounted && !isProcessing) {
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
    cleanupMonthlyData,
    getMonthData,
    saveMonthData,
    isProcessing
  };
};
