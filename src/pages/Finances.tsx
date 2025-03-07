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
  Plus,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnnualBudget from "@/components/finance/AnnualBudget";
import TransactionTracker from "@/components/finance/TransactionTracker";
import SavingsTracker from "@/components/finance/SavingsTracker";
import FinancialReports from "@/components/finance/FinancialReports";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import XPBar from "@/components/dashboard/XPBar";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { MonthlyData } from "@/context/UserDataContext";

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
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [templateType, setTemplateType] = useState<'income' | 'expense'>('income');
  
  useEffect(() => {
    if (!loading && userData?.financeModule) {
      const monthData = userData.financeModule.monthlyData?.[selectedMonth] || {
        income: 0,
        expenses: 0,
        balance: 0,
        savingsRate: 0,
        transactions: []
      };
      
      setCurrentMonthData(monthData);
    }
  }, [selectedMonth, userData, loading]);
  
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
    budgetTemplates = [],
  } = userData?.financeModule || {};
  
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const handleMonthChange = async (value: string) => {
    if (userData?.financeModule) {
      const monthlyData = {
        ...(userData.financeModule.monthlyData || {}),
        [selectedMonth]: currentMonthData
      };
      
      await updateFinanceModule({ monthlyData });
    }
    
    setSelectedMonth(value);
    
    const newMonthData = userData?.financeModule?.monthlyData?.[value] || {
      income: 0,
      expenses: 0,
      balance: 0,
      savingsRate: 0,
      transactions: []
    };
    
    setCurrentMonthData(newMonthData);
    
    toast({
      title: "Mois sélectionné",
      description: `Données financières pour ${value} chargées.`,
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

  const applyTemplate = (type: 'income' | 'expense', templateId: string) => {
    setTemplateType(type);
    setShowTemplateDialog(true);
  };

  const handleApplyTemplate = async (templateId: string) => {
    const selectedTemplate = budgetTemplates.find(t => t.id === templateId);
    
    if (!selectedTemplate) {
      toast({
        title: "Erreur",
        description: "Template introuvable",
        variant: "destructive"
      });
      return;
    }
    
    const newTransactions = [...(currentMonthData.transactions || [])];
    const date = new Date().toISOString();
    
    const items = templateType === 'income' 
      ? selectedTemplate.incomeItems || []
      : selectedTemplate.expenseItems || [];
    
    items.forEach(item => {
      newTransactions.push({
        id: crypto.randomUUID(),
        type: templateType,
        category: item.category,
        amount: item.amount,
        description: item.description,
        date
      });
    });
    
    const newIncome = templateType === 'income'
      ? currentMonthData.income + items.reduce((sum, item) => sum + item.amount, 0)
      : currentMonthData.income;
      
    const newExpenses = templateType === 'expense'
      ? currentMonthData.expenses + items.reduce((sum, item) => sum + item.amount, 0)
      : currentMonthData.expenses;
      
    const newBalance = newIncome - newExpenses;
    const newSavingsRate = newIncome > 0 ? ((newIncome - newExpenses) / newIncome) * 100 : 0;
    
    const updatedMonthData = {
      ...currentMonthData,
      income: newIncome,
      expenses: newExpenses,
      balance: newBalance,
      savingsRate: newSavingsRate,
      transactions: newTransactions
    };
    
    setCurrentMonthData(updatedMonthData);
    
    if (userData?.financeModule) {
      const monthlyData = {
        ...(userData.financeModule.monthlyData || {}),
        [selectedMonth]: updatedMonthData
      };
      
      await updateFinanceModule({ monthlyData });
      
      toast({
        title: "Template appliqué",
        description: `Les éléments du template ont été ajoutés aux ${templateType === 'income' ? 'revenus' : 'dépenses'}.`,
      });
    }
    
    setShowTemplateDialog(false);
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

  const renderIncomeButtonsFunc = () => (
    <div className="flex mt-3">
      <Button 
        variant="template"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => applyTemplate('income', '')}
      >
        Créer template
      </Button>
    </div>
  );
  
  const renderExpenseButtonsFunc = () => (
    <div className="flex mt-3">
      <Button 
        variant="template"
        size="sm" 
        className="flex items-center gap-1"
        onClick={() => applyTemplate('expense', '')}
      >
        Créer template
      </Button>
    </div>
  );

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
          <TabsList className="mb-4 grid grid-cols-5 gap-2">
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
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <TrendingUp size={16} />
              <span className="hidden md:inline">Rapports</span>
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
                incomeButtonsRenderer={renderIncomeButtonsFunc}
                expenseButtonsRenderer={renderExpenseButtonsFunc}
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
          
          <TabsContent value="reports">
            <FinancialReports />
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

        <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Appliquer un Template {templateType === 'income' ? 'Revenus' : 'Dépenses'}</DialogTitle>
              <DialogDescription>
                Choisissez un template à appliquer aux {templateType === 'income' ? 'revenus' : 'dépenses'} de ce mois.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {budgetTemplates && budgetTemplates.length > 0 ? (
                budgetTemplates.map(template => (
                  <Card key={template.id} className="p-3 cursor-pointer hover:bg-accent" onClick={() => handleApplyTemplate(template.id)}>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {templateType === 'income' ? 'Revenus: ' + template.income + '€' : 'Dépenses: ' + template.expenses + '€'}
                    </p>
                    <ul className="mt-2 text-sm">
                      {templateType === 'income' && template.incomeItems ? 
                        template.incomeItems.map((item, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>{item.description}</span>
                            <span>{item.amount}€</span>
                          </li>
                        )) : 
                        templateType === 'expense' && template.expenseItems ?
                        template.expenseItems.map((item, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>{item.description}</span>
                            <span>{item.amount}€</span>
                          </li>
                        )) : 
                        <li className="text-muted-foreground">Aucun élément disponible</li>
                      }
                    </ul>
                  </Card>
                ))
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">Aucun template disponible</p>
                  <p className="text-sm mt-2">Créez d'abord un template dans la section Budget</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Finances;
