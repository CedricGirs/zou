
import { useState, useEffect, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useUserData } from "@/context/UserDataContext";
import { useFinanceXP } from "@/hooks/useFinanceXP";
import { DollarSign, TrendingUp, PiggyBank, ChartPie, Wallet, ArrowUpDown, Trophy, Medal, Star, Award, Crown, Flag, Gem, CircleCheck, BarChart3, Bookmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnnualBudget from "@/components/finance/AnnualBudget";
import TransactionTracker from "@/components/finance/TransactionTracker";
import SavingsTracker from "@/components/finance/SavingsTracker";
import FinancialOverview from "@/components/finance/FinancialOverview";
import FinancialInsights from "@/components/finance/FinancialInsights";
import CustomBadge from "@/components/ui/CustomBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import XPBar from "@/components/dashboard/XPBar";
import { MonthlyData, FinanceAchievement } from "@/context/UserDataContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Finances = () => {
  const { userData, loading, updateFinanceModule } = useUserData();
  const { 
    normalizeMonthName, 
    getMonthData, 
    saveMonthData,
    isProcessing 
  } = useFinanceXP();
  
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const currentMonth = format(new Date(), 'MMMM', { locale: fr });
    return normalizeMonthName(currentMonth);
  });
  
  const [currentMonthData, setCurrentMonthData] = useState(() => 
    getMonthData(selectedMonth)
  );

  // Functions for achievements and quests
  const unlockAchievement = useCallback(async (achievementId: string): Promise<void> => {
    if (!userData?.financeModule?.achievements) return;
    
    const achievementExists = userData.financeModule.achievements.some(a => a.id === achievementId);
    
    // Find the achievement in the default list to get its name, description, and xpReward
    const existingAchievement = financeAchievements.find(a => a.id === achievementId);
    if (!existingAchievement) return;
    
    const updatedAchievements = achievementExists 
      ? userData.financeModule.achievements.map(a => 
          a.id === achievementId ? { ...a, completed: true } : a
        )
      : [
          ...userData.financeModule.achievements,
          { 
            id: achievementId, 
            name: existingAchievement.name,
            description: existingAchievement.description,
            completed: true, 
            date: new Date().toISOString(),
            xpReward: 25 // Default XP reward if not specified
          }
        ];
    
    await updateFinanceModule({ achievements: updatedAchievements });
    
    toast({
      title: "Nouvel accomplissement !",
      description: `Vous avez débloqué un nouvel accomplissement financier.`,
    });
  }, [userData?.financeModule?.achievements, updateFinanceModule]);

  const completeQuestStep = useCallback(async (questId: string, progress: number): Promise<void> => {
    if (!userData?.financeModule?.quests) return;
    
    const updatedQuests = userData.financeModule.quests.map(q => {
      if (q.id === questId) {
        const wasCompleted = q.completed;
        const newCompleted = progress >= 100;
        
        // If the quest is newly completed, show a toast
        if (newCompleted && !wasCompleted) {
          toast({
            title: "Quête complétée !",
            description: `Vous avez terminé la quête "${q.name}" !`,
          });
        }
        
        return {
          ...q,
          progress,
          completed: newCompleted
        };
      }
      return q;
    });
    
    await updateFinanceModule({ quests: updatedQuests });
  }, [userData?.financeModule?.quests, updateFinanceModule]);

  useEffect(() => {
    if (!loading) {
      const monthData = getMonthData(selectedMonth);
      setCurrentMonthData(monthData);
    }
  }, [selectedMonth, loading, getMonthData]);

  const handleMonthChange = async (newMonth: string) => {
    if (isProcessing) return;

    try {
      await saveMonthData(selectedMonth, currentMonthData);
      
      const normalizedMonth = normalizeMonthName(newMonth);
      setSelectedMonth(normalizedMonth);
      
      const newMonthData = getMonthData(normalizedMonth);
      setCurrentMonthData(newMonthData);
      
    } catch (error) {
      console.error("Erreur lors du changement de mois:", error);
      toast({
        title: "Erreur",
        description: "Impossible de changer de mois. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    return () => {
      if (currentMonthData) {
        saveMonthData(selectedMonth, currentMonthData);
      }
    };
  }, [selectedMonth, currentMonthData, saveMonthData]);

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
              disabled={isProcessing}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Mois">
                  {isProcessing ? (
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
