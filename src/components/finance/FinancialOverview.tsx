
import React from 'react';
import { Edit, ArrowUp, ArrowDown, DollarSign, PiggyBank, TrendingUp, Trophy, Target, Zap, BadgeDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/context/UserDataContext';
import { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface FinancialOverviewProps {
  income: number;
  expenses: number;
  balance: number;
  savingsGoal: number;
  savingsRate: number;
  unlockAchievement?: (achievementId: string) => Promise<void>;
  completeQuestStep?: (questId: string, progress: number) => Promise<void>;
}

const FinancialOverview = ({ 
  income, 
  expenses, 
  balance, 
  savingsGoal, 
  savingsRate,
  unlockAchievement,
  completeQuestStep
}: FinancialOverviewProps) => {
  const { userData, updateFinanceModule } = useUserData();
  
  // Edit states
  const [isEditingSavingsGoal, setIsEditingSavingsGoal] = useState(false);
  
  // Form values
  const [savingsGoalValue, setSavingsGoalValue] = useState(userData.financeModule?.savingsGoal || 0);

  // Calculate actual totals from transactions
  const [actualIncome, setActualIncome] = useState(0);
  const [actualExpenses, setActualExpenses] = useState(0);

  useEffect(() => {
    // Calculate totals from the transactions
    if (userData.financeModule?.transactions) {
      const incomeTotal = userData.financeModule.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      
      const expensesTotal = userData.financeModule.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      
      setActualIncome(incomeTotal);
      setActualExpenses(expensesTotal);
      
      // Update the finance module with the calculated totals
      if (incomeTotal !== userData.financeModule.monthlyIncome || 
          expensesTotal !== userData.financeModule.monthlyExpenses) {
        updateFinanceModule({
          monthlyIncome: incomeTotal,
          monthlyExpenses: expensesTotal,
          balance: incomeTotal - expensesTotal
        });
      }
    }
  }, [userData.financeModule?.transactions]);

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
    if (completeQuestStep) {
      completeQuestStep("create_savings", 50);
    }
    
    setIsEditingSavingsGoal(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Income Card - Now read-only */}
      <div className="glass-card p-4 flex flex-col gap-2 relative group overflow-hidden">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green-400 to-green-600"></div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
            <DollarSign size={16} />
          </div>
          <span>Revenus mensuels</span>
        </div>
        <div className="text-2xl font-semibold text-primary">{actualIncome} €</div>
        <div className="flex items-center gap-1 text-xs text-green-500">
          <ArrowUp size={12} />
          <span>Total des revenus</span>
        </div>
      </div>
      
      {/* Expenses Card - Now read-only */}
      <div className="glass-card p-4 flex flex-col gap-2 relative group overflow-hidden">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-orange-400 to-orange-600"></div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
            <ArrowDown size={16} />
          </div>
          <span>Dépenses mensuelles</span>
        </div>
        <div className="text-2xl font-semibold text-destructive">{actualExpenses} €</div>
        <div className="flex items-center gap-1 text-xs text-orange-500">
          <ArrowDown size={12} />
          <span>Total des dépenses</span>
        </div>
      </div>
      
      {/* Savings Goal - Still interactive */}
      <Dialog open={isEditingSavingsGoal} onOpenChange={setIsEditingSavingsGoal}>
        <div 
          onClick={handleOpenSavingsGoalDialog}
          className="glass-card p-4 flex flex-col gap-2 hover:shadow-md transition-all cursor-pointer relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit size={16} />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <Target size={16} />
            </div>
            <span>Objectif épargne</span>
          </div>
          <div className="text-2xl font-semibold text-primary">{userData.financeModule?.savingsGoal || 0} €</div>
          <div className="flex items-center gap-1 text-xs text-blue-500">
            <TrendingUp size={12} />
            <span>Cliquez pour définir un objectif</span>
          </div>
          <div className="mt-2 p-1.5 rounded-md bg-purple-50 border border-purple-100 flex items-center justify-between">
            <div className="flex items-center text-xs text-purple-700">
              <Trophy size={12} className="mr-1 text-amber-500" />
              <span>+20 XP</span>
            </div>
            <span className="text-xs text-purple-600">Mission: Fixer un objectif d'épargne</span>
          </div>
        </div>
        
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
                <Progress value={0} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">0% réalisé</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-purple-600">
              <Zap size={16} className="mr-1 text-amber-500" />
              <span>+20 XP</span>
            </div>
            <Button onClick={handleSaveSavingsGoal}>
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialOverview;
