import React from 'react';
import { Edit, ArrowUp, ArrowDown, DollarSign, PiggyBank, TrendingUp, Trophy, Target, Zap, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/context/UserDataContext';
import { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyData } from '@/types/finance';

interface FinancialOverviewProps {
  income: number;
  expenses: number;
  balance: number;
  savingsGoal: number;
  savingsRate: number;
  selectedMonth: string;
  unlockAchievement?: (achievementId: string) => Promise<void>;
  completeQuestStep?: (questId: string, progress: number) => Promise<void>;
  updateMonthData?: (data: Partial<MonthlyData>) => void;
}

const FinancialOverview = ({ 
  income, 
  expenses, 
  balance, 
  savingsGoal, 
  savingsRate,
  selectedMonth,
  unlockAchievement,
  completeQuestStep,
  updateMonthData
}: FinancialOverviewProps) => {
  const { userData, updateFinanceModule } = useUserData();
  
  // États d'édition
  const [isEditingSavingsGoal, setIsEditingSavingsGoal] = useState(false);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  
  // Valeurs des formulaires
  const [savingsGoalValue, setSavingsGoalValue] = useState(userData.financeModule?.savingsGoal || 0);
  const [incomeValue, setIncomeValue] = useState(income || 0);

  // Calculate actual totals from transactions
  const [actualIncome, setActualIncome] = useState(income || 0);
  const [actualExpenses, setActualExpenses] = useState(expenses || 0);
  const [savingsPercentage, setSavingsPercentage] = useState(0);
  const [totalCumulativeSavings, setTotalCumulativeSavings] = useState(0);

  // Fonction pour calculer le total des économies cumulées
  const calculateTotalSavings = () => {
    if (!userData.financeModule?.monthlyData) return 0;
    
    let totalSavings = 0;
    
    // Parcourir toutes les données mensuelles et additionner les économies positives
    Object.entries(userData.financeModule.monthlyData).forEach(([month, monthData]) => {
      const monthSavings = monthData.income - monthData.expenses;
      if (monthSavings > 0) {
        totalSavings += monthSavings;
      }
    });
    
    console.log("Total des économies cumulées:", totalSavings);
    return totalSavings;
  };

  useEffect(() => {
    // Mettre à jour avec les nouvelles données quand income ou expenses changent
    setActualIncome(income);
    setActualExpenses(expenses);
    setIncomeValue(income);
    
    // Calculer le pourcentage d'économies du mois
    const savingsPercent = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
    setSavingsPercentage(savingsPercent);
    
    console.log(`Données du mois ${selectedMonth}:`, { income, expenses, savingsPercent });
    
    // Calculer et définir le total des économies cumulées
    const calculatedTotalSavings = calculateTotalSavings();
    setTotalCumulativeSavings(calculatedTotalSavings);
    
  }, [income, expenses, selectedMonth, userData.financeModule?.monthlyData]);

  useEffect(() => {
    // Mettre à jour la valeur de l'objectif d'épargne lorsque userData change
    setSavingsGoalValue(userData.financeModule?.savingsGoal || 0);
  }, [userData.financeModule?.savingsGoal]);

  const handleOpenSavingsGoalDialog = () => {
    setSavingsGoalValue(userData.financeModule?.savingsGoal || 0);
    setIsEditingSavingsGoal(true);
  };
  
  const handleSaveSavingsGoal = async () => {
    await updateFinanceModule({ savingsGoal: savingsGoalValue });
    
    toast({
      title: "Objectif d'épargne mis à jour",
      description: "Votre objectif d'épargne a été mis à jour avec succès. +20 XP!",
    });
    
    // Advance the quest if it exists
    if (completeQuestStep && userData.financeModule?.quests) {
      const createSavingsQuest = userData.financeModule.quests.find(q => q.id === "create_savings");
      if (createSavingsQuest) {
        completeQuestStep("create_savings", 50);
      }
    }
    
    setIsEditingSavingsGoal(false);
  };
  
  const handleOpenIncomeDialog = () => {
    setIncomeValue(income);
    setIsEditingIncome(true);
  };
  
  const handleSaveIncome = async () => {
    // Calculer le nouveau solde et le taux d'épargne
    const newBalance = incomeValue - expenses;
    const newSavingsRate = incomeValue > 0 ? Math.round(((incomeValue - expenses) / incomeValue) * 100) : 0;
    
    // Mettre à jour les données du mois via la fonction callback
    if (updateMonthData) {
      updateMonthData({
        income: incomeValue,
        balance: newBalance,
        savingsRate: newSavingsRate
      });
    }
    
    toast({
      title: "Revenus mis à jour",
      description: `Vos revenus pour ${selectedMonth} ont été mis à jour.`,
    });
    
    // Avancer la quête si elle existe
    if (completeQuestStep && userData.financeModule?.quests) {
      const setBudgetQuest = userData.financeModule.quests.find(q => q.id === "set_budget");
      if (setBudgetQuest) {
        completeQuestStep("set_budget", 50);
      }
    }
    
    setIsEditingIncome(false);
  };

  // Calculate progress percentage towards savings goal
  const calculateSavingsProgress = () => {
    if (!userData.financeModule?.savingsGoal || userData.financeModule.savingsGoal <= 0) return 0;
    const progress = (totalCumulativeSavings / userData.financeModule.savingsGoal) * 100;
    return Math.min(progress, 100); // Cap at 100%
  };

  const savingsProgress = calculateSavingsProgress();

  // Get a dynamic color for the progress bar based on progress
  const getProgressVariant = () => {
    if (savingsProgress < 25) return "danger";
    if (savingsProgress < 50) return "warning";
    if (savingsProgress < 75) return "purple";
    return "success";
  };

  // Get a motivational message based on savings progress
  const getMotivationalMessage = () => {
    if (savingsProgress < 10) return "Commencez à épargner dès maintenant!";
    if (savingsProgress < 30) return "Bon début, continuez comme ça!";
    if (savingsProgress < 60) return "Vous êtes sur la bonne voie!";
    if (savingsProgress < 90) return "Presque là, encore un effort!";
    return "Félicitations, objectif atteint! 🎉";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">      
      {/* Carte des revenus - éditable */}
      <Dialog open={isEditingIncome} onOpenChange={setIsEditingIncome}>
        <Card 
          onClick={handleOpenIncomeDialog}
          className="hover:shadow-md transition-all cursor-pointer relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green-400 to-green-600"></div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit size={16} />
          </div>
          
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                <DollarSign size={20} />
              </div>
              <CardTitle>Revenus du mois</CardTitle>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total des revenus pour {selectedMonth}</p>
                <p className="text-2xl font-bold">{income} €</p>
              </div>
              <div className={`flex items-center text-sm ${income > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                <ArrowUp size={16} className="mr-1" />
                <span>Entrées</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les revenus</DialogTitle>
            <DialogDescription>
              Définissez vos revenus pour {selectedMonth}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="income" className="text-right">
                Montant
              </Label>
              <Input
                id="income"
                type="number"
                value={incomeValue}
                onChange={(e) => setIncomeValue(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveIncome}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Carte des dépenses - lecture seule */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-red-400 to-red-600"></div>
        
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
              <ArrowDown size={20} />
            </div>
            <CardTitle>Dépenses du mois</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total des dépenses pour {selectedMonth}</p>
              <p className="text-2xl font-bold">{expenses} €</p>
            </div>
            <div className="flex items-center text-sm text-red-500">
              <ArrowDown size={16} className="mr-1" />
              <span>Sorties</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Savings Goal - Interactive with progress bar */}
      <Dialog open={isEditingSavingsGoal} onOpenChange={setIsEditingSavingsGoal}>
        <Card 
          onClick={handleOpenSavingsGoalDialog}
          className="md:col-span-2 glass-card hover:shadow-md transition-all cursor-pointer relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit size={16} />
          </div>
          
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                <Target size={20} />
              </div>
              <div>
                <CardTitle>Objectif épargne</CardTitle>
                <p className="text-sm text-muted-foreground">Suivi de votre progression</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Économies cumulées</p>
                <p className="text-2xl font-bold">{totalCumulativeSavings} €</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Objectif</p>
                <p className="text-2xl font-bold">{userData.financeModule?.savingsGoal || 0} €</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Progression</span>
                <span className="font-medium">{savingsProgress.toFixed(0)}%</span>
              </div>
              <Progress 
                value={savingsProgress} 
                className="h-3" 
                variant={getProgressVariant()}
              />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-xs">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>{getMotivationalMessage()}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Reste: {Math.max(0, (userData.financeModule?.savingsGoal || 0) - totalCumulativeSavings)} €
                </span>
              </div>
            </div>
            
            <div className="mt-2 p-2 rounded-md bg-purple-50 border border-purple-100 flex items-center justify-between">
              <div className="flex items-center text-xs text-purple-700">
                <Trophy size={12} className="mr-1 text-amber-500" />
                <span>+20 XP pour un objectif atteint</span>
              </div>
              <div className="flex items-center">
                {savingsProgress >= 100 && (
                  <Award size={16} className="ml-2 text-amber-500 animate-pulse" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'objectif d'épargne</DialogTitle>
            <DialogDescription>
              Définissez votre objectif d'épargne à atteindre
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="savingsGoal" className="text-right">
                Objectif
              </Label>
              <Input
                id="savingsGoal"
                type="number"
                value={savingsGoalValue}
                onChange={(e) => setSavingsGoalValue(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right col-span-1">
                Progression
              </Label>
              <div className="col-span-3">
                <Progress 
                  value={savingsProgress} 
                  className="h-2" 
                  variant={getProgressVariant()}
                />
                <p className="text-xs text-muted-foreground mt-1">{savingsProgress.toFixed(0)}% réalisé</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <div className="flex items-center text-sm text-purple-600 mr-auto">
              <Zap size={16} className="mr-1 text-amber-500" />
              <span>+20 XP</span>
            </div>
            <Button variant="outline" onClick={() => setIsEditingSavingsGoal(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveSavingsGoal}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialOverview;
