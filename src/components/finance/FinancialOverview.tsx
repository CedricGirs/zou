
import React from 'react';
import { Edit, ArrowUp, ArrowDown, DollarSign, PiggyBank, TrendingUp } from 'lucide-react';
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
      description: "Vos revenus mensuels ont été mis à jour avec succès.",
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
      description: "Vos dépenses mensuelles ont été mises à jour avec succès.",
    });
    
    setIsEditingExpenses(false);
  };
  
  const handleSaveSavingsGoal = async () => {
    await updateFinanceModule({ savingsGoal: savingsGoalValue });
    
    toast({
      title: "Objectif d'épargne mis à jour",
      description: "Votre objectif d'épargne a été mis à jour avec succès.",
    });
    
    setIsEditingSavingsGoal(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Dialog open={isEditingIncome} onOpenChange={setIsEditingIncome}>
        <div 
          onClick={handleOpenIncomeDialog}
          className="glass-card p-4 flex flex-col gap-2 hover:bg-muted/30 transition-colors cursor-pointer relative group"
        >
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit size={16} />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <DollarSign size={16} />
            <span>Revenus mensuels</span>
          </div>
          <div className="text-2xl font-semibold text-primary">{income.toLocaleString('fr-FR')} €</div>
          <div className="flex items-center gap-1 text-xs text-green-500">
            <ArrowUp size={12} />
            <span>+{(income * 0.03).toFixed(0)}€ vs mois dernier</span>
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
          <div className="flex justify-end">
            <Button onClick={handleSaveIncome}>
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditingExpenses} onOpenChange={setIsEditingExpenses}>
        <div 
          onClick={handleOpenExpensesDialog}
          className="glass-card p-4 flex flex-col gap-2 hover:bg-muted/30 transition-colors cursor-pointer relative group"
        >
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit size={16} />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <ArrowUp size={16} className="rotate-180" />
            <span>Dépenses mensuelles</span>
          </div>
          <div className="text-2xl font-semibold text-destructive">{expenses.toLocaleString('fr-FR')} €</div>
          <div className="flex items-center gap-1 text-xs text-red-500">
            <ArrowUp size={12} />
            <span>+{(expenses * 0.02).toFixed(0)}€ vs mois dernier</span>
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
          <div className="flex justify-end">
            <Button onClick={handleSaveExpenses}>
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditingSavingsGoal} onOpenChange={setIsEditingSavingsGoal}>
        <div 
          onClick={handleOpenSavingsGoalDialog}
          className="glass-card p-4 flex flex-col gap-2 hover:bg-muted/30 transition-colors cursor-pointer relative group"
        >
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit size={16} />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <PiggyBank size={16} />
            <span>Objectif épargne</span>
          </div>
          <div className="text-2xl font-semibold text-primary">{savingsGoal.toLocaleString('fr-FR')} €</div>
          <div className="flex items-center gap-1 text-xs text-green-500">
            <TrendingUp size={12} />
            <span>Objectif annuel</span>
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
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveSavingsGoal}>
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="glass-card p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <ArrowDown size={16} className="text-green-500" />
          <span>Balance mensuelle</span>
        </div>
        <div className={`text-2xl font-semibold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {balance.toLocaleString('fr-FR')} €
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Taux d'épargne: {savingsRate}%</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;
