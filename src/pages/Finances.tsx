
import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useUserData } from "@/context/UserDataContext";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { MonthlyData } from "@/context/UserDataContext";

// New component imports
import MonthSelector from "@/components/finance/MonthSelector";
import FinanceLevel from "@/components/finance/FinanceLevel";
import ActiveQuests from "@/components/finance/ActiveQuests";
import FinanceTabs from "@/components/finance/FinanceTabs";
import FinanceAchievements from "@/components/finance/FinanceAchievements";

const Finances = () => {
  const { userData, loading, updateFinanceModule } = useUserData();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MMMM', { locale: fr }));
  const [currentMonthData, setCurrentMonthData] = useState<MonthlyData>({
    income: 0,
    expenses: 0,
    balance: 0,
    savingsRate: 0,
    transactions: []
  });
  
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  const currentMonthIndex = months.indexOf(selectedMonth);
  const previousMonth = currentMonthIndex > 0 ? months[currentMonthIndex - 1] : months[11];
  const nextMonth = currentMonthIndex < 11 ? months[currentMonthIndex + 1] : months[0];
  
  // Charger les données pour le mois sélectionné
  useEffect(() => {
    if (!loading && userData?.financeModule) {
      console.log(`Chargement initial des données pour ${selectedMonth}`);
      
      // Récupérer les données du mois sélectionné ou initialiser à 0 si aucune donnée n'existe
      const monthData = userData.financeModule.monthlyData?.[selectedMonth] || {
        income: 0,
        expenses: 0,
        balance: 0,
        savingsRate: 0,
        transactions: []
      };
      
      console.log(`Données chargées pour ${selectedMonth}:`, monthData);
      setCurrentMonthData(monthData);
    }
  }, [selectedMonth, userData, loading]);
  
  // Sauvegarder les données du mois actuel
  const saveMonthData = async () => {
    if (userData?.financeModule) {
      console.log(`Tentative de sauvegarde des données pour ${selectedMonth}:`, currentMonthData);
      
      const monthlyData = {
        ...(userData.financeModule.monthlyData || {}),
        [selectedMonth]: currentMonthData
      };
      
      console.log(`Structure complète des données mensuelles après mise à jour:`, monthlyData);
      
      try {
        await updateFinanceModule({ monthlyData });
        console.log(`Données sauvegardées avec succès pour ${selectedMonth}`);
        return true;
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des données:", error);
        return false;
      }
    }
    return false;
  };
  
  const handleMonthChange = async (month: string) => {
    if (month === selectedMonth) return; // Éviter de recharger le même mois
    
    console.log(`Changement de mois: de ${selectedMonth} à ${month}`);
    
    // Sauvegarder les données du mois actuel
    const saveResult = await saveMonthData();
    if (!saveResult) {
      console.error(`Échec de la sauvegarde des données pour ${selectedMonth}`);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les données du mois actuel.",
        variant: "destructive"
      });
      return;
    }
    
    // Changer le mois
    setSelectedMonth(month);
    
    // Charger les données du nouveau mois
    if (userData?.financeModule?.monthlyData) {
      const newMonthData = userData.financeModule.monthlyData[month] || {
        income: 0,
        expenses: 0,
        balance: 0,
        savingsRate: 0,
        transactions: []
      };
      
      console.log(`Données chargées pour ${month}:`, newMonthData);
      setCurrentMonthData(newMonthData);
      
      toast({
        title: `${month} sélectionné`,
        description: newMonthData.transactions.length > 0 
          ? `Données financières pour ${month} chargées.`
          : `Aucune donnée existante pour ${month}. Valeurs initialisées à 0.`,
      });
    }
  };
  
  // S'assurer de sauvegarder les données lors de la fermeture de l'application
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log(`Sauvegarde des données avant fermeture pour ${selectedMonth}`);
      
      // Sauvegarde synchrone (pour le beforeunload)
      if (userData?.financeModule) {
        const monthlyData = {
          ...(userData.financeModule.monthlyData || {}),
          [selectedMonth]: currentMonthData
        };
        
        // Nous ne pouvons pas attendre une promesse dans beforeunload, utilisons saveSync
        try {
          localStorage.setItem('pendingFinanceData', JSON.stringify({ 
            monthlyData, 
            lastSavedMonth: selectedMonth 
          }));
        } catch (error) {
          console.error("Erreur lors de la sauvegarde d'urgence:", error);
        }
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Sauvegarder également lors du démontage du composant
      saveMonthData();
    };
  }, [userData, currentMonthData, selectedMonth]);
  
  // Effet pour gérer la sauvegarde périodique
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveMonthData();
    }, 60000); // Sauvegarde automatique toutes les minutes
    
    return () => clearInterval(saveInterval);
  }, [currentMonthData, selectedMonth]);
  
  // Récupérer les données pendantes au démarrage
  useEffect(() => {
    if (!loading && userData?.financeModule) {
      try {
        const pendingData = localStorage.getItem('pendingFinanceData');
        if (pendingData) {
          const { monthlyData, lastSavedMonth } = JSON.parse(pendingData);
          updateFinanceModule({ monthlyData });
          console.log("Données pendantes récupérées et sauvegardées", { monthlyData, lastSavedMonth });
          localStorage.removeItem('pendingFinanceData');
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données pendantes:", error);
      }
    }
  }, [loading]);
  
  const unlockAchievement = async (achievementId: string): Promise<void> => {
    if (!userData.financeModule) return;
    
    const achievements = [...userData.financeModule.achievements];
    const achievementIndex = achievements.findIndex(a => a.id === achievementId);
    
    if (achievementIndex !== -1 && !achievements[achievementIndex].completed) {
      achievements[achievementIndex] = {
        ...achievements[achievementIndex],
        completed: true
      };
      
      await updateFinanceModule({ achievements });
      
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
  };
  
  const completeQuestStep = async (questId: string, progress: number): Promise<void> => {
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
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="text-center">
            <h2 className="text-2xl font-pixel mb-4">Chargement des données financières...</h2>
            <Progress value={80} className="w-64 h-2" />
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const { 
    financeLevel = 1, 
    currentXP = 0, 
    maxXP = 100, 
    achievements = [],
    quests = [],
    savingsGoal = 0
  } = userData?.financeModule || {};

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="font-pixel text-3xl mb-2">Finance Quest</h1>
            <p className="text-muted-foreground">Gérez votre argent, progressez, atteignez vos objectifs</p>
          </div>
          
          <MonthSelector
            selectedMonth={selectedMonth}
            previousMonth={previousMonth}
            nextMonth={nextMonth}
            handleMonthChange={handleMonthChange}
            transactionsCount={currentMonthData.transactions.length}
          />
        </div>

        <FinanceLevel 
          financeLevel={financeLevel}
          currentXP={currentXP}
          maxXP={maxXP}
        />

        <ActiveQuests 
          quests={quests}
          completeQuestStep={completeQuestStep}
        />
        
        <FinanceTabs
          currentMonthData={currentMonthData}
          selectedMonth={selectedMonth}
          savingsGoal={savingsGoal}
          updateMonthData={(newData) => {
            setCurrentMonthData(prev => {
              const updated = {
                ...prev,
                ...newData
              };
              console.log(`Mise à jour des données du mois ${selectedMonth}:`, updated);
              return updated;
            });
          }}
          completeQuestStep={completeQuestStep}
          unlockAchievement={unlockAchievement}
        />

        <FinanceAchievements 
          achievements={achievements}
          unlockAchievement={unlockAchievement}
        />
      </div>
    </MainLayout>
  );
};

export default Finances;
