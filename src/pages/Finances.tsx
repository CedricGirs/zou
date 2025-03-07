
import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useUserData } from "@/context/UserDataContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartPie, Wallet, ArrowUpDown, PiggyBank } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import AnnualBudget from "@/components/finance/AnnualBudget";
import TransactionTracker from "@/components/finance/TransactionTracker";
import SavingsTracker from "@/components/finance/SavingsTracker";
import FinancialOverview from "@/components/finance/FinancialOverview";
import FinancialInsights from "@/components/finance/FinancialInsights";
import { playSound } from "@/utils/audioUtils";
import { toast } from "@/hooks/use-toast";
import { Transaction } from "@/context/UserDataContext";

// Import newly created components
import FinanceHeader from "@/components/finance/FinanceHeader";
import FinanceLevel from "@/components/finance/FinanceLevel";
import FinanceQuests from "@/components/finance/FinanceQuests";
import FinanceAchievements from "@/components/finance/FinanceAchievements";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
    quests = [],
    savingsRate = 0
  } = userData?.financeModule || {};
  
  const { 
    transactions = [], 
    monthlyIncome = 0,
    monthlyExpenses = 0,
    balance = 0
  } = monthlyData || {};

  const currentYear = new Date().getFullYear().toString();

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <FinanceHeader 
          selectedMonth={selectedMonth} 
          onMonthChange={handleMonthChange} 
        />

        <FinanceLevel 
          financeLevel={financeLevel}
          currentXP={currentXP}
          maxXP={maxXP}
        />

        <FinanceQuests 
          quests={quests}
          completeQuestStep={completeQuestStep}
        />
        
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
              selectedYear={currentYear}
            />
          </TabsContent>
          
          <TabsContent value="transactions">
            <TransactionTracker 
              selectedMonth={selectedMonth} 
              selectedYear={currentYear}
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

        <FinanceAchievements 
          unlockAchievement={unlockAchievement}
        />
      </div>
    </MainLayout>
  );
};

export default Finances;
