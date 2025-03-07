import { useState, useEffect, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useUserData } from "@/context/UserDataContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  PiggyBank, 
  ChartPie, 
  Wallet,
  ArrowUpDown,
  Trophy,
  Medal,
  Star,
  Award,
  Crown,
  Flag,
  Gem,
  CircleCheck,
  BarChart3,
  Bookmark,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnnualBudget from "@/components/finance/AnnualBudget";
import TransactionTracker from "@/components/finance/TransactionTracker";
import SavingsTracker from "@/components/finance/SavingsTracker";
import FinancialOverview from "@/components/finance/FinancialOverview";
import FinancialInsights from "@/components/finance/FinancialInsights";
import CustomBadge from "@/components/ui/CustomBadge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import XPBar from "@/components/dashboard/XPBar";
import { useFinanceXP } from "@/hooks/useFinanceXP";
import { MonthlyData } from "@/context/UserDataContext";

const Finances = () => {
  const { userData, loading, updateFinanceModule } = useUserData();
  const { normalizeMonthName, calculateTotalSavings, cleanupMonthlyData } = useFinanceXP();
  
  const [selectedMonth, setSelectedMonth] = useState(() => {
    try {
      const currentMonth = format(new Date(), 'MMMM', { locale: fr });
      return normalizeMonthName(currentMonth);
    } catch (error) {
      console.error("Erreur format date:", error);
      return "Janvier";
    }
  });
  
  const [currentMonthData, setCurrentMonthData] = useState<MonthlyData>({
    income: 0,
    expenses: 0,
    balance: 0,
    savingsRate: 0,
    transactions: []
  });
  
  const [isChangingMonth, setIsChangingMonth] = useState(false);
  const [initialCleanupDone, setInitialCleanupDone] = useState(false);
  
  // Exécuter le nettoyage initial des données mensuelles
  useEffect(() => {
    if (userData?.financeModule && !initialCleanupDone && !loading) {
      cleanupMonthlyData().then(() => {
        setInitialCleanupDone(true);
      });
    }
  }, [userData?.financeModule, initialCleanupDone, loading, cleanupMonthlyData]);
  
  // Fonction améliorée pour fusionner les données de mois identiques mais avec des orthographes différentes
  const mergeMonthData = useCallback((monthlyData: Record<string, MonthlyData>, normalizedMonth: string) => {
    const result: MonthlyData = {
      income: 0,
      expenses: 0,
      balance: 0,
      savingsRate: 0,
      transactions: []
    };
    
    if (!monthlyData || !normalizedMonth) return result;
    
    // Récupérer toutes les clés des mois qui correspondraient au mois normalisé
    const matchingMonthKeys = Object.keys(monthlyData).filter(key => 
      normalizeMonthName(key) === normalizedMonth
    );
    
    if (matchingMonthKeys.length === 0) {
      // Aucune correspondance trouvée, retourner un résultat vide
      return result;
    }
    
    // Set pour suivre les IDs des transactions déjà vues
    const transactionIds = new Set<string>();
    
    // Fusionner les données de tous les mois correspondants
    matchingMonthKeys.forEach(monthKey => {
      const monthData = monthlyData[monthKey];
      
      if (!monthData) return;
      
      // Ajouter revenus et dépenses
      result.income += parseFloat(String(monthData.income)) || 0;
      result.expenses += parseFloat(String(monthData.expenses)) || 0;
      
      // Ajouter les transactions sans duplication
      if (Array.isArray(monthData.transactions)) {
        monthData.transactions.forEach(transaction => {
          if (!transactionIds.has(transaction.id)) {
            // Cloner la transaction pour éviter les références circulaires
            const clonedTransaction = { ...transaction };
            // S'assurer que le mois est normalisé
            clonedTransaction.month = normalizedMonth;
            
            result.transactions.push(clonedTransaction);
            transactionIds.add(transaction.id);
          }
        });
      }
    });
    
    // Recalculer le solde et le taux d'épargne
    result.balance = result.income - result.expenses;
    result.savingsRate = result.income > 0 
      ? Math.round((result.income - result.expenses) / result.income * 100) 
      : 0;
    
    return result;
  }, [normalizeMonthName]);
  
  // Sauvegarde les données du mois courant
  const saveCurrentMonthData = useCallback(async () => {
    if (!userData?.financeModule || isChangingMonth) return;
    
    try {
      setIsChangingMonth(true);
      
      const normalizedMonth = normalizeMonthName(selectedMonth);
      console.log(`Sauvegarde des données du mois ${normalizedMonth}:`, currentMonthData);
      
      if (!normalizedMonth) {
        console.error("Nom de mois normalisé invalide");
        return;
      }
      
      // Nettoyer les transactions en normalisant le mois et en évitant les références circulaires
      const safeTransactions = currentMonthData.transactions.map(t => ({
        ...t,
        month: normalizedMonth
      }));
      
      const dataToSave = {
        ...currentMonthData,
        transactions: safeTransactions,
        // Assurez-vous que ces champs sont des nombres
        income: parseFloat(String(currentMonthData.income)) || 0,
        expenses: parseFloat(String(currentMonthData.expenses)) || 0,
        balance: parseFloat(String(currentMonthData.balance)) || 0,
        savingsRate: parseFloat(String(currentMonthData.savingsRate)) || 0
      };
      
      // Récupérer les données mensuelles existantes
      const existingMonthlyData = {
        ...(userData.financeModule.monthlyData || {})
      };
      
      // Identifier tous les mois qui doivent être fusionnés avec le mois normalisé
      const keysToDelete = Object.keys(existingMonthlyData).filter(key => 
        key !== normalizedMonth && normalizeMonthName(key) === normalizedMonth
      );
      
      // Supprimer les anciennes entrées pour les remplacer par une seule entrée normalisée
      keysToDelete.forEach(key => {
        delete existingMonthlyData[key];
      });
      
      // Ajouter les nouvelles données
      existingMonthlyData[normalizedMonth] = dataToSave;
      
      await updateFinanceModule({ monthlyData: existingMonthlyData });
      
      toast({
        title: "Données sauvegardées",
        description: `Les données pour ${normalizedMonth} ont été enregistrées.`,
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données mensuelles:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les données du mois.",
        variant: "destructive"
      });
    } finally {
      setIsChangingMonth(false);
    }
  }, [userData?.financeModule, isChangingMonth, selectedMonth, currentMonthData, normalizeMonthName, updateFinanceModule]);
  
  // Charge les données du mois sélectionné
  const loadMonthData = useCallback(() => {
    if (!userData?.financeModule?.monthlyData || loading || !initialCleanupDone) return;
    
    const monthlyData = userData.financeModule.monthlyData || {};
    const normalizedMonth = normalizeMonthName(selectedMonth);
    
    if (!normalizedMonth) {
      console.error("Nom de mois normalisé invalide lors du chargement");
      return;
    }
    
    console.log(`Chargement des données pour le mois: ${normalizedMonth}`, monthlyData);
    
    const mergedData = mergeMonthData(monthlyData, normalizedMonth);
    
    console.log(`Données après fusion pour ${normalizedMonth}:`, mergedData);
    setCurrentMonthData(mergedData);
  }, [userData?.financeModule?.monthlyData, loading, selectedMonth, mergeMonthData, normalizeMonthName, initialCleanupDone]);
  
  // Charger les données lorsque le mois change ou que les données utilisateur sont mises à jour
  useEffect(() => {
    if (initialCleanupDone) {
      loadMonthData();
    }
  }, [selectedMonth, userData?.financeModule?.monthlyData, loading, loadMonthData, initialCleanupDone]);
  
  // Sauvegarder les données avant de quitter la page
  useEffect(() => {
    return () => {
      saveCurrentMonthData();
    };
  }, [saveCurrentMonthData]);
  
  // Gérer le changement de mois
  const handleMonthChange = async (value: string) => {
    if (isChangingMonth) {
      console.log("Changement de mois en cours, ignoré");
      return;
    }
    
    try {
      const newMonth = normalizeMonthName(value);
      
      if (!newMonth) {
        console.error("Nom de mois normalisé invalide lors du changement");
        return;
      }
      
      console.log(`Changement de mois demandé: ${selectedMonth} -> ${newMonth}`);
      
      if (newMonth !== selectedMonth) {
        // Sauvegarder les données du mois actuel avant de changer
        setIsChangingMonth(true);
        await saveCurrentMonthData();
        
        // Mettre à jour le mois sélectionné
        setSelectedMonth(newMonth);
        
        // Notifier l'utilisateur
        toast({
          title: "Mois sélectionné",
          description: `Données financières pour ${newMonth} chargées.`,
        });
      }
    } catch (error) {
      console.error("Erreur lors du changement de mois:", error);
      toast({
        title: "Erreur",
        description: "Impossible de changer de mois. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsChangingMonth(false);
    }
  };
  
  const completeQuestStep = async (questId: string, progress: number) => {
    if (!userData.financeModule) return;
    
    try {
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
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la progression de quête:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la progression.",
        variant: "destructive"
      });
    }
  };
  
  const unlockAchievement = async (achievementId: string) => {
    if (!userData.financeModule) return;
    
    try {
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
    } catch (error) {
      console.error("Erreur lors du déblocage du succès:", error);
      toast({
        title: "Erreur",
        description: "Impossible de débloquer le succès.",
        variant: "destructive"
      });
    }
  };

  // Afficher un indicateur de chargement pendant le chargement des données
  if (loading || !initialCleanupDone) {
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
  } = userData?.financeModule || {};
  
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const financeAchievements = [
    {
      id: "budget_master",
      icon: <BarChart3 size={18} />,
      name: "Maître du Budget",
      description: "Maintenir un équilibre budgétaire pendant 3 mois consécutifs",
      rarity: "legendary" as const,
      unlocked: false
    },
    {
      id: "saving_expert",
      icon: <PiggyBank size={18} />,
      name: "Expert en Épargne",
      description: "Atteindre un taux d'épargne de 30% pendant 2 mois",
      rarity: "epic" as const,
      unlocked: false
    },
    {
      id: "income_diversifier",
      icon: <DollarSign size={18} />,
      name: "Diversificateur de Revenus",
      description: "Ajouter 3 sources de revenus différentes",
      rarity: "rare" as const,
      unlocked: false
    },
    {
      id: "expense_tracker",
      icon: <ArrowUpDown size={18} />,
      name: "Traqueur de Dépenses",
      description: "Suivre toutes les dépenses pendant un mois entier",
      rarity: "uncommon" as const,
      unlocked: false
    },
    {
      id: "goal_achiever",
      icon: <Flag size={18} />,
      name: "Atteigneur d'Objectifs",
      description: "Atteindre votre premier objectif d'épargne",
      rarity: "uncommon" as const,
      unlocked: false
    },
    {
      id: "financial_planner",
      icon: <Crown size={18} />,
      name: "Planificateur Financier",
      description: "Créer un plan financier annuel complet",
      rarity: "rare" as const,
      unlocked: false
    },
    {
      id: "debt_eliminator",
      icon: <CircleCheck size={18} />,
      name: "Éliminateur de Dettes",
      description: "Rembourser entièrement une dette",
      rarity: "epic" as const,
      unlocked: false
    },
    {
      id: "investment_starter",
      icon: <TrendingUp size={18} />,
      name: "Investisseur Débutant",
      description: "Réaliser votre premier investissement",
      rarity: "rare" as const,
      unlocked: false
    },
    {
      id: "emergency_fund",
      icon: <Bookmark size={18} />,
      name: "Fonds d'Urgence",
      description: "Constituer un fonds d'urgence équivalent à 3 mois de dépenses",
      rarity: "epic" as const,
      unlocked: false
    },
    {
      id: "financial_freedom",
      icon: <Gem size={18} />,
      name: "Liberté Financière",
      description: "Atteindre un patrimoine suffisant pour couvrir vos besoins essentiels",
      rarity: "legendary" as const,
      unlocked: false
    }
  ];

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="font-pixel text-3xl mb-2">Finance Quest</h1>
            <p className="text-muted-foreground">Gérez votre argent, progressez, atteignez vos objectifs</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select 
              value={selectedMonth} 
              onValueChange={handleMonthChange}
              disabled={isChangingMonth}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Mois">
                  {isChangingMonth ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Chargement</span>
                    </div>
                  ) : (
                    selectedMonth
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card variant="minimal" className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                {financeLevel}
              </div>
              <div>
                <h3 className="font-pixel text-lg">Niveau Finance</h3>
                <p className="text-sm text-muted-foreground">Novice Financier</p>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <XPBar currentXP={currentXP} maxXP={maxXP} />
              <p className="text-xs text-right text-muted-foreground mt-1">Prochain niveau: Planificateur</p>
            </div>
          </div>
        </Card>

        <Card variant="minimal">
          <CardHeader>
            <CardTitle>Quêtes Actives</CardTitle>
            <CardDescription>Complétez ces missions pour gagner de l'XP</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quests && quests.map(quest => (
                <div key={quest.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{quest.name}</h4>
                    <span className="text-xs text-purple-500">+{quest.xpReward} XP</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{quest.description}</p>
                  <Progress value={quest.progress} className="h-2 mb-1" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {quest.progress}% complété
                    </span>
                    {!quest.completed && quest.progress < 100 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => completeQuestStep(quest.id, Math.min(quest.progress + 20, 100))}
                      >
                        Progresser
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-4 grid grid-cols-4 gap-2">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <ChartPie size={16} />
              <span className="hidden md:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="budget" className="flex items-center gap-2">
              <Wallet size={16} />
              <span className="hidden md:inline">Budget</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <ArrowUpDown size={16} />
              <span className="hidden md:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="savings" className="flex items-center gap-2">
              <PiggyBank size={16} />
              <span className="hidden md:inline">Épargne</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 gap-6">
              <FinancialOverview 
                income={currentMonthData.income}
                expenses={currentMonthData.expenses}
                balance={currentMonthData.balance}
                savingsGoal={userData?.financeModule?.savingsGoal || 0}
                savingsRate={currentMonthData.savingsRate}
                unlockAchievement={unlockAchievement}
                completeQuestStep={completeQuestStep}
                selectedMonth={selectedMonth}
              />
              
              <FinancialInsights 
                transactions={currentMonthData.transactions || []}
                month={selectedMonth}
                updateMonthData={(newData) => {
                  setCurrentMonthData(prev => ({
                    ...prev,
                    ...newData
                  }));
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="budget">
            <AnnualBudget />
          </TabsContent>
          
          <TabsContent value="transactions">
            <TransactionTracker 
              selectedMonth={selectedMonth} 
              completeQuestStep={completeQuestStep}
              transactions={currentMonthData.transactions || []}
              updateMonthData={(newData) => {
                setCurrentMonthData(prev => ({
                  ...prev,
                  ...newData
                }));
              }}
            />
          </TabsContent>
          
          <TabsContent value="savings">
            <SavingsTracker 
              unlockAchievement={unlockAchievement}
              completeQuestStep={completeQuestStep}
            />
          </TabsContent>
        </Tabs>

        <Card variant="minimal">
          <CardHeader>
            <CardTitle>Accomplissements</CardTitle>
            <CardDescription>Débloquez des médailles en progressant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {financeAchievements.map(achievement => (
                <CustomBadge
                  key={achievement.id}
                  icon={achievement.icon}
                  name={achievement.name}
                  description={achievement.description}
                  rarity={achievement.rarity}
                  unlocked={achievement.unlocked}
                  onClick={() => !achievement.unlocked && unlockAchievement(achievement.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Finances;
