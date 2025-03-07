
import { useState, useEffect } from "react";
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
import { playSound } from "@/utils/audioUtils";
import { Transaction, FinanceModule } from "@/context/UserDataContext";

const Finances = () => {
  const { userData, loading, updateFinanceModule } = useUserData();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MMMM', { locale: fr }));
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState<{
    transactions: Transaction[];
    monthlyIncome: number;
    monthlyExpenses: number;
    balance: number;
  } | null>(null);
  
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  useEffect(() => {
    if (loading || !userData?.financeModule) return;
    
    const loadMonthData = async () => {
      setIsDataLoading(true);
      console.log(`Chargement des données pour ${selectedMonth}`);
      
      try {
        const currentYear = new Date().getFullYear().toString();
        const monthKey = `${selectedMonth}_${currentYear}`;
        const savedMonthData = userData.financeModule.monthlyData?.[monthKey];
        
        if (savedMonthData) {
          console.log("Données du mois trouvées :", savedMonthData);
          setMonthlyData({
            transactions: savedMonthData.transactions || [],
            monthlyIncome: savedMonthData.monthlyIncome || 0,
            monthlyExpenses: savedMonthData.monthlyExpenses || 0,
            balance: savedMonthData.balance || 0
          });
        } else {
          console.log("Aucune donnée trouvée pour ce mois, réinitialisation");
          setMonthlyData({
            transactions: [],
            monthlyIncome: 0,
            monthlyExpenses: 0,
            balance: 0
          });
          
          const currentMonthlyData = userData.financeModule.monthlyData || {};
          currentMonthlyData[monthKey] = {
            transactions: [],
            monthlyIncome: 0,
            monthlyExpenses: 0,
            balance: 0
          };
          
          await updateFinanceModule({
            monthlyData: currentMonthlyData
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données mensuelles:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données pour ce mois.",
          variant: "destructive"
        });
      } finally {
        setIsDataLoading(false);
      }
    };
    
    loadMonthData();
  }, [selectedMonth, userData?.financeModule, loading, updateFinanceModule]);

  const saveCurrentMonthData = async () => {
    if (!userData?.financeModule || !monthlyData) return;
    
    try {
      const currentYear = new Date().getFullYear().toString();
      const monthKey = `${selectedMonth}_${currentYear}`;
      
      const currentMonthlyData = userData.financeModule.monthlyData || {};
      
      currentMonthlyData[monthKey] = {
        transactions: monthlyData.transactions || [],
        monthlyIncome: monthlyData.monthlyIncome || 0,
        monthlyExpenses: monthlyData.monthlyExpenses || 0,
        balance: monthlyData.balance || 0
      };
      
      console.log(`Sauvegarde des données pour ${monthKey}:`, currentMonthlyData[monthKey]);
      
      await updateFinanceModule({
        monthlyData: currentMonthlyData
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données mensuelles:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les données pour ce mois.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleMonthChange = async (value: string) => {
    await saveCurrentMonthData();
    setSelectedMonth(value);
    playSound('click');
    toast({
      title: "Mois sélectionné",
      description: `Données financières pour ${value} chargées.`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export des données financières",
      description: "Vos données financières ont été exportées avec succès.",
    });
  };
  
  const updateMonthlyData = (updates: Partial<{
    transactions: Transaction[];
    monthlyIncome: number;
    monthlyExpenses: number;
    balance: number;
  }>) => {
    if (!monthlyData) return;
    
    setMonthlyData({
      ...monthlyData,
      ...updates
    });
  };
  
  const addTransaction = (transaction: Transaction) => {
    if (!monthlyData) return;
    
    const updatedTransactions = [...monthlyData.transactions, transaction];
    let newMonthlyIncome = monthlyData.monthlyIncome;
    let newMonthlyExpenses = monthlyData.monthlyExpenses;
    
    if (transaction.type === 'income') {
      newMonthlyIncome += transaction.amount;
    } else {
      newMonthlyExpenses += transaction.amount;
    }
    
    const newBalance = newMonthlyIncome - newMonthlyExpenses;
    
    updateMonthlyData({
      transactions: updatedTransactions,
      monthlyIncome: newMonthlyIncome,
      monthlyExpenses: newMonthlyExpenses,
      balance: newBalance
    });
  };
  
  const deleteTransaction = (transactionId: string) => {
    if (!monthlyData) return;
    
    const transactionToDelete = monthlyData.transactions.find(t => t.id === transactionId);
    if (!transactionToDelete) return;
    
    const updatedTransactions = monthlyData.transactions.filter(t => t.id !== transactionId);
    let newMonthlyIncome = monthlyData.monthlyIncome;
    let newMonthlyExpenses = monthlyData.monthlyExpenses;
    
    if (transactionToDelete.type === 'income') {
      newMonthlyIncome -= transactionToDelete.amount;
    } else {
      newMonthlyExpenses -= transactionToDelete.amount;
    }
    
    const newBalance = newMonthlyIncome - newMonthlyExpenses;
    
    updateMonthlyData({
      transactions: updatedTransactions,
      monthlyIncome: newMonthlyIncome,
      monthlyExpenses: newMonthlyExpenses,
      balance: newBalance
    });
  };
  
  const completeQuestStep = async (questId: string, progress: number) => {
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
        playSound('success');
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
  };
  
  const unlockAchievement = async (achievementId: string) => {
    if (!userData.financeModule) return;
    
    const achievements = [...userData.financeModule.achievements];
    const achievementIndex = achievements.findIndex(a => a.id === achievementId);
    
    if (achievementIndex !== -1 && !achievements[achievementIndex].completed) {
      achievements[achievementIndex] = {
        ...achievements[achievementIndex],
        completed: true
      };
      
      await updateFinanceModule({ achievements });
      
      playSound('badge');
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
    }
  };

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

  if (loading || isDataLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="text-center">
            <h2 className="text-2xl font-pixel mb-4">Chargement des données financières...</h2>
            <Progress variant="indeterminate" className="w-64 h-2" />
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
    savingsRate = 0
  } = userData?.financeModule || {};
  
  const { 
    transactions = [], 
    monthlyIncome = 0,
    monthlyExpenses = 0,
    balance = 0
  } = monthlyData || {};

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="font-pixel text-3xl mb-2">Finance Quest</h1>
            <p className="text-muted-foreground">Gérez votre argent, progressez, atteignez vos objectifs</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Mois" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Trophy size={16} className="mr-2 text-amber-500" />
              Récompenses
            </Button>
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
                income={monthlyIncome}
                expenses={monthlyExpenses}
                balance={balance}
                savingsGoal={0}
                savingsRate={savingsRate}
                unlockAchievement={unlockAchievement}
                completeQuestStep={completeQuestStep}
              />
              
              <FinancialInsights 
                transactions={transactions}
                month={selectedMonth}
                addTransaction={addTransaction}
                deleteTransaction={deleteTransaction}
              />
            </div>
          </TabsContent>

          <TabsContent value="budget">
            <AnnualBudget 
              selectedMonth={selectedMonth}
              selectedYear={new Date().getFullYear().toString()}
            />
          </TabsContent>
          
          <TabsContent value="transactions">
            <TransactionTracker 
              selectedMonth={selectedMonth} 
              selectedYear={new Date().getFullYear().toString()}
              transactions={transactions}
              completeQuestStep={completeQuestStep}
              addTransaction={addTransaction}
              deleteTransaction={deleteTransaction}
            />
          </TabsContent>
          
          <TabsContent value="savings">
            <SavingsTracker 
              unlockAchievement={unlockAchievement}
              completeQuestStep={completeQuestStep}
              monthlyIncome={monthlyIncome}
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
