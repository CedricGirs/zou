
import { useState, useEffect, useCallback } from 'react';
import { useUserData, MonthlyData } from '@/context/UserDataContext';
import { toast } from '@/hooks/use-toast';
import { useFinanceXP } from '@/hooks/useFinanceXP';
import { playSound } from '@/utils/audioUtils';

export const useFinanceFunctions = () => {
  const { userData, updateFinanceModule } = useUserData();
  const { updateXPAndLevel } = useFinanceXP();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('fr-FR', { month: 'long' }));
  const [currentMonthData, setCurrentMonthData] = useState<MonthlyData>({
    income: 0,
    expenses: 0,
    balance: 0,
    savingsRate: 0,
    transactions: []
  });

  // Charger les données du mois sélectionné
  useEffect(() => {
    if (!userData?.financeModule) return;
    
    const monthData = userData.financeModule.monthlyData?.[selectedMonth] || {
      income: 0,
      expenses: 0,
      balance: 0,
      savingsRate: 0,
      transactions: []
    };
    
    console.log("Données mensuelles:", userData.financeModule.monthlyData);
    setCurrentMonthData(monthData);
  }, [selectedMonth, userData]);

  // Sauvegarder les données du mois lors du changement
  const saveMonthlyData = useCallback(async (monthData: MonthlyData) => {
    if (!userData?.financeModule) return;
    
    const monthlyData = {
      ...(userData.financeModule.monthlyData || {}),
      [selectedMonth]: monthData
    };
    
    await updateFinanceModule({ monthlyData });
    console.log(`Données du mois ${selectedMonth} sauvegardées:`, monthData);
  }, [selectedMonth, userData, updateFinanceModule]);

  // Compléter une étape de quête avec sauvegarde automatique
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

  // Débloquer un succès avec sauvegarde automatique
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

  // Mettre à jour les données du mois actuel
  const updateCurrentMonthData = useCallback(async (updates: Partial<MonthlyData>) => {
    const updatedData = {
      ...currentMonthData,
      ...updates
    };
    
    setCurrentMonthData(updatedData);
    await saveMonthlyData(updatedData);
    
    return updatedData;
  }, [currentMonthData, saveMonthlyData]);

  // Ajouter une transaction avec mise à jour automatique du mois
  const addTransaction = useCallback(async (transaction: any) => {
    const updatedTransactions = [...currentMonthData.transactions, transaction];
    
    // Recalculer les totaux du mois
    let totalIncome = 0;
    let totalExpenses = 0;
    
    updatedTransactions.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      if (t.type === 'expense') totalExpenses += t.amount;
    });
    
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
    
    const updatedMonthData = {
      ...currentMonthData,
      income: totalIncome,
      expenses: totalExpenses,
      balance,
      savingsRate,
      transactions: updatedTransactions
    };
    
    setCurrentMonthData(updatedMonthData);
    await saveMonthlyData(updatedMonthData);
    
    // Mise à jour du solde global
    const currentBalance = userData.financeModule?.balance || 0;
    const newBalance = transaction.type === 'income' 
      ? currentBalance + transaction.amount 
      : currentBalance - transaction.amount;
    
    await updateFinanceModule({ 
      balance: newBalance,
      transactions: [...(userData.financeModule?.transactions || []), transaction]
    });
    
    playSound('transaction');
    toast({
      title: transaction.type === 'income' ? "Revenu ajouté" : "Dépense ajoutée",
      description: `${transaction.description}: ${transaction.amount.toFixed(2)} €`
    });
    
    return updatedMonthData;
  }, [currentMonthData, userData, saveMonthlyData, updateFinanceModule]);

  return {
    selectedMonth,
    setSelectedMonth,
    currentMonthData,
    setCurrentMonthData,
    updateCurrentMonthData,
    addTransaction,
    completeQuestStep,
    unlockAchievement,
    savingsGoal: userData?.financeModule?.savingsGoal || 0
  };
};
