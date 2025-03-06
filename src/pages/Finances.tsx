
import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useUserData } from "@/context/UserDataContext";
import { useLanguage } from "@/context/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, PiggyBank, CreditCard, Edit } from "lucide-react";
import AnnualBudget from "@/components/finance/AnnualBudget";
import TransactionTracker from "@/components/finance/TransactionTracker";
import SavingsTracker from "@/components/finance/SavingsTracker";
import FinancialReports from "@/components/finance/FinancialReports";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';

const Finances = () => {
  const { userData, updateFinanceModule } = useUserData();
  const { t } = useLanguage();
  
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
  
  const [savingsGoal, setSavingsGoal] = useState(userData.financeModule.savingsGoal);

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
    setSavingsGoal(userData.financeModule.savingsGoal);
    setIsEditingSavingsGoal(true);
  };

  const handleSaveIncome = async () => {
    await updateFinanceModule({ 
      monthlyIncome, 
      additionalIncome 
    });
    
    toast({
      title: "Revenus mis à jour",
      description: "Vos revenus mensuels ont été mis à jour.",
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
      description: "Vos dépenses mensuelles ont été mises à jour.",
    });
    
    setIsEditingExpenses(false);
  };
  
  const handleSaveSavingsGoal = async () => {
    await updateFinanceModule({ savingsGoal });
    
    toast({
      title: "Objectif d'épargne mis à jour",
      description: "Votre objectif d'épargne a été mis à jour.",
    });
    
    setIsEditingSavingsGoal(false);
  };
  
  // Calculate total expenses
  const totalExpenses = (
    (userData.financeModule.housingExpenses || 0) + 
    (userData.financeModule.foodExpenses || 0) + 
    (userData.financeModule.transportExpenses || 0) + 
    (userData.financeModule.leisureExpenses || 0) + 
    (userData.financeModule.fixedExpenses || 0) +
    (userData.financeModule.debtPayments || 0)
  );
  
  // Calculate total income
  const totalIncome = (userData.financeModule.monthlyIncome || 0) + (userData.financeModule.additionalIncome || 0);
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="font-pixel text-2xl mb-2">Finances</h1>
        <p className="text-muted-foreground">Gérez votre budget, vos dépenses et vos objectifs d'épargne</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Dialog open={isEditingIncome} onOpenChange={setIsEditingIncome}>
          <DialogTrigger asChild>
            <div className="pixel-card flex flex-col items-center cursor-pointer hover:bg-muted/50 relative" onClick={handleOpenIncomeDialog}>
              <Edit size={16} className="absolute top-2 right-2 opacity-50" />
              <h3 className="text-sm font-medium mb-1">Revenus Mensuels</h3>
              <span className="font-pixel text-xl text-zou-purple">
                {totalIncome} €
              </span>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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
              <button 
                className="pixel-button"
                onClick={handleSaveIncome}
              >
                Enregistrer
              </button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditingExpenses} onOpenChange={setIsEditingExpenses}>
          <DialogTrigger asChild>
            <div className="pixel-card flex flex-col items-center cursor-pointer hover:bg-muted/50 relative" onClick={handleOpenExpensesDialog}>
              <Edit size={16} className="absolute top-2 right-2 opacity-50" />
              <h3 className="text-sm font-medium mb-1">Dépenses Mensuelles</h3>
              <span className="font-pixel text-xl text-zou-orange">
                {totalExpenses} €
              </span>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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
              <button 
                className="pixel-button"
                onClick={handleSaveExpenses}
              >
                Enregistrer
              </button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditingSavingsGoal} onOpenChange={setIsEditingSavingsGoal}>
          <DialogTrigger asChild>
            <div className="pixel-card flex flex-col items-center cursor-pointer hover:bg-muted/50 relative" onClick={handleOpenSavingsGoalDialog}>
              <Edit size={16} className="absolute top-2 right-2 opacity-50" />
              <h3 className="text-sm font-medium mb-1">Objectif Épargne</h3>
              <span className="font-pixel text-xl text-zou-green">
                {userData.financeModule.savingsGoal} €
              </span>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                className="pixel-button"
                onClick={handleSaveSavingsGoal}
              >
                Enregistrer
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="budget" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="budget" className="flex items-center">
            <DollarSign className="mr-1" size={16} />
            Budget
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center">
            <CreditCard className="mr-1" size={16} />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="savings" className="flex items-center">
            <PiggyBank className="mr-1" size={16} />
            Épargne
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center">
            <TrendingUp className="mr-1" size={16} />
            Rapports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="budget">
          <AnnualBudget />
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionTracker />
        </TabsContent>
        
        <TabsContent value="savings">
          <SavingsTracker />
        </TabsContent>
        
        <TabsContent value="reports">
          <FinancialReports />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Finances;
