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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnnualBudget from "@/components/finance/AnnualBudget";
import TransactionTracker from "@/components/finance/TransactionTracker";
import SavingsTracker from "@/components/finance/SavingsTracker";
import FinancialReports from "@/components/finance/FinancialReports";
import FinancialOverview from "@/components/finance/FinancialOverview";
import FinancialInsights from "@/components/finance/FinancialInsights";
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
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const Finances = () => {
  const { userData, loading, updateFinanceModule } = useUserData();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MMMM', { locale: fr }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  
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
    balance = 0,
    monthlyIncome = 0,
    monthlyExpenses = 0,
    savingsRate = 0
  } = userData?.financeModule || {};
  
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  const years = ['2022', '2023', '2024', '2025'];

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    toast({
      title: "Mois sélectionné",
      description: `Données financières pour ${value} ${selectedYear} chargées.`,
    });
  };
  
  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    toast({
      title: "Année sélectionnée",
      description: `Données financières pour ${selectedMonth} ${value} chargées.`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export des données financières",
      description: "Vos données financières ont été exportées avec succès.",
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
            
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="minimal" className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyIncome} €</div>
            </CardContent>
          </Card>
          
          <Card variant="minimal" className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Dépenses</CardTitle>
              <ArrowUpDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyExpenses} €</div>
            </CardContent>
          </Card>
          
          <Card variant="minimal" className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Épargne</CardTitle>
              <PiggyBank className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{savingsRate}%</div>
            </CardContent>
          </Card>
        </div>

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
                income={monthlyIncome}
                expenses={monthlyExpenses}
                balance={balance}
                savingsGoal={0}
                savingsRate={savingsRate}
                unlockAchievement={unlockAchievement}
                completeQuestStep={completeQuestStep}
              />
              
              <FinancialInsights 
                transactions={userData.financeModule?.transactions || []}
                month={selectedMonth}
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
              {achievements && achievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`p-3 rounded-lg border flex flex-col items-center text-center gap-2 ${
                    achievement.completed 
                      ? 'bg-amber-50 border-amber-200' 
                      : 'bg-gray-50 border-gray-200 opacity-70 cursor-pointer hover:bg-gray-100'
                  }`}
                  onClick={() => !achievement.completed && unlockAchievement(achievement.id)}
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    achievement.completed ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Trophy size={18} />
                  </div>
                  <h4 className="font-medium text-sm">{achievement.name}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    achievement.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {achievement.completed ? 'Complété' : 'À débloquer'} 
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Finances;
