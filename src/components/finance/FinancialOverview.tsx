
import React from 'react';
import { Edit, ArrowUp, ArrowDown, DollarSign, PiggyBank, TrendingUp, Trophy, Target, Zap, BadgeDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/context/UserDataContext';
import { useState } from 'react';
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
}

const FinancialOverview = ({ income, expenses, balance, savingsGoal, savingsRate }: FinancialOverviewProps) => {
  const { userData, updateFinanceModule } = useUserData();
  
  // Edit states
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [isEditingExpenses, setIsEditingExpenses] = useState(false);
  const [isEditingSavingsGoal, setIsEditingSavingsGoal] = useState(false);
  
  // Form values
  const [monthlyIncome, setMonthlyIncome] = useState(userData.financeModule.monthlyIncome);
  const [additionalIncome, setAdditionalIncome] = useState(userData.financeModule.additionalIncome || 0);
  
  const [housingExpenses, setHousingExpenses] = useState(userData.financeModule.housingExpenses || 0);
  const [foodExpenses, setFoodExpenses] = useState(userData.financeModule.foodExpenses || 0);
  const [transportExpenses, setTransportExpenses] = useState(userData.financeModule.transportExpenses || 0);
  const [leisureExpenses, setLeisureExpenses] = useState(userData.financeModule.leisureExpenses || 0);
  const [fixedExpenses, setFixedExpenses] = useState(userData.financeModule.fixedExpenses || 0);
  const [debtPayments, setDebtPayments] = useState(userData.financeModule.debtPayments || 0);
  
  const [savingsGoalValue, setSavingsGoalValue] = useState(userData.financeModule.savingsGoal);

  const handleOpenIncomeDialog = () => {
    setMonthlyIncome(userData.financeModule.monthlyIncome);
    setAdditionalIncome(userData.financeModule.additionalIncome || 0);
    setIsEditingIncome(true);
  };
  
  const handleOpenExpensesDialog = () => {
    setHousingExpenses(userData.financeModule.housingExpenses || 0);
    setFoodExpenses(userData.financeModule.foodExpenses || 0);
    setTransportExpenses(userData.financeModule.transportExpenses || 0);
    setLeisureExpenses(userData.financeModule.leisureExpenses || 0);
    setFixedExpenses(userData.financeModule.fixedExpenses || 0);
    setDebtPayments(userData.financeModule.debtPayments || 0);
    setIsEditingExpenses(true);
  };
  
  const handleOpenSavingsGoalDialog = () => {
    setSavingsGoalValue(userData.financeModule.savingsGoal);
    setIsEditingSavingsGoal(true);
  };

  const handleSaveIncome = async () => {
    await updateFinanceModule({ 
      monthlyIncome, 
      additionalIncome 
    });
    
    toast({
      title: "Revenus mis à jour",
      description: "Vos revenus mensuels ont été mis à jour avec succès. +15 XP!",
    });
    
    setIsEditingIncome(false);
  };
  
  const handleSaveExpenses = async () => {
    await updateFinanceModule({ 
      housingExpenses, 
      foodExpenses, 
      transportExpenses, 
      leisureExpenses, 
      fixedExpenses,
      debtPayments
    });
    
    toast({
      title: "Dépenses mises à jour",
      description: "Vos dépenses mensuelles ont été mises à jour avec succès. +15 XP!",
    });
    
    setIsEditingExpenses(false);
  };
  
  const handleSaveSavingsGoal = async () => {
    await updateFinanceModule({ savingsGoal: savingsGoalValue });
    
    toast({
      title: "Objectif d'épargne mis à jour",
      description: "Votre objectif d'épargne a été mis à jour avec succès. +20 XP!",
    });
    
    setIsEditingSavingsGoal(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Dialog open={isEditingIncome} onOpenChange={setIsEditingIncome}>
        <div 
          onClick={handleOpenIncomeDialog}
          className="glass-card p-4 flex flex-col gap-2 hover:shadow-md transition-all cursor-pointer relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green-400 to-green-600"></div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit size={16} />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
              <DollarSign size={16} />
            </div>
            <span>Revenus mensuels</span>
          </div>
          <div className="text-2xl font-semibold text-primary">0 €</div>
          <div className="flex items-center gap-1 text-xs text-green-500">
            <ArrowUp size={12} />
            <span>Définissez vos revenus</span>
          </div>
          <div className="mt-2 p-1.5 rounded-md bg-purple-50 border border-purple-100 flex items-center justify-between">
            <div className="flex items-center text-xs text-purple-700">
              <Trophy size={12} className="mr-1 text-amber-500" />
              <span>+15 XP</span>
            </div>
            <span className="text-xs text-purple-600">Mission: Définir les revenus</span>
          </div>
        </div>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les revenus mensuels</DialogTitle>
            <DialogDescription>
              Entrez vos différentes sources de revenus mensuels
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="primaryIncome" className="text-right">
                Salaire principal
              </Label>
              <Input
                id="primaryIncome"
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="additionalIncome" className="text-right">
                Revenus additionnels
              </Label>
              <Input
                id="additionalIncome"
                type="number"
                value={additionalIncome}
                onChange={(e) => setAdditionalIncome(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-purple-600">
              <Zap size={16} className="mr-1 text-amber-500" />
              <span>+15 XP</span>
            </div>
            <Button onClick={handleSaveIncome}>
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditingExpenses} onOpenChange={setIsEditingExpenses}>
        <div 
          onClick={handleOpenExpensesDialog}
          className="glass-card p-4 flex flex-col gap-2 hover:shadow-md transition-all cursor-pointer relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-orange-400 to-orange-600"></div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit size={16} />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
              <ArrowDown size={16} />
            </div>
            <span>Dépenses mensuelles</span>
          </div>
          <div className="text-2xl font-semibold text-destructive">0 €</div>
          <div className="flex items-center gap-1 text-xs text-orange-500">
            <ArrowUp size={12} className="rotate-180" />
            <span>Ajoutez vos dépenses</span>
          </div>
          <div className="mt-2 p-1.5 rounded-md bg-purple-50 border border-purple-100 flex items-center justify-between">
            <div className="flex items-center text-xs text-purple-700">
              <Trophy size={12} className="mr-1 text-amber-500" />
              <span>+15 XP</span>
            </div>
            <span className="text-xs text-purple-600">Mission: Définir les dépenses</span>
          </div>
        </div>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les dépenses mensuelles</DialogTitle>
            <DialogDescription>
              Détaillez vos différentes dépenses mensuelles par catégorie
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="housingExpenses" className="text-right">
                Logement
              </Label>
              <Input
                id="housingExpenses"
                type="number"
                value={housingExpenses}
                onChange={(e) => setHousingExpenses(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="foodExpenses" className="text-right">
                Alimentation
              </Label>
              <Input
                id="foodExpenses"
                type="number"
                value={foodExpenses}
                onChange={(e) => setFoodExpenses(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transportExpenses" className="text-right">
                Transport
              </Label>
              <Input
                id="transportExpenses"
                type="number"
                value={transportExpenses}
                onChange={(e) => setTransportExpenses(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="leisureExpenses" className="text-right">
                Loisirs
              </Label>
              <Input
                id="leisureExpenses"
                type="number"
                value={leisureExpenses}
                onChange={(e) => setLeisureExpenses(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fixedExpenses" className="text-right">
                Charges fixes
              </Label>
              <Input
                id="fixedExpenses"
                type="number"
                value={fixedExpenses}
                onChange={(e) => setFixedExpenses(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="debtPayments" className="text-right">
                Dettes
              </Label>
              <Input
                id="debtPayments"
                type="number"
                value={debtPayments}
                onChange={(e) => setDebtPayments(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-purple-600">
              <Zap size={16} className="mr-1 text-amber-500" />
              <span>+15 XP</span>
            </div>
            <Button onClick={handleSaveExpenses}>
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
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
          <div className="text-2xl font-semibold text-primary">0 €</div>
          <div className="flex items-center gap-1 text-xs text-blue-500">
            <TrendingUp size={12} />
            <span>Définir un objectif</span>
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
