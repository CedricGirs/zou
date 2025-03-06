
import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useUserData } from "@/context/UserDataContext";
import { useLanguage } from "@/context/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, PiggyBank, CreditCard, Edit, LayoutDashboard } from "lucide-react";
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
  
  // Calculate available amount
  const availableAmount = totalIncome - totalExpenses;

  // Calculate percentage of income spent
  const spentPercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  
  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-pixel text-2xl mb-2">Finances</h1>
            <p className="text-muted-foreground">Gérez votre budget, vos dépenses et vos objectifs d'épargne</p>
          </div>
          <div className="hidden md:block">
            <span className="text-sm text-muted-foreground mr-2">
              {new Date().toLocaleDateString('fr-FR', { 
                year: 'numeric',
                month: 'long'
              })}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Dialog open={isEditingIncome} onOpenChange={setIsEditingIncome}>
          <DialogTrigger asChild>
            <div className="pixel-card flex flex-col items-center cursor-pointer hover:bg-muted/50 relative bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20" onClick={handleOpenIncomeDialog}>
              <Edit size={16} className="absolute top-2 right-2 opacity-50" />
              <h3 className="text-sm font-medium mb-1">Revenus Mensuels</h3>
              <span className="font-pixel text-xl text-zou-purple">
                {totalIncome.toLocaleString()} €
              </span>
              <div className="mt-2 w-full bg-black/5 h-1 rounded-full">
                <div className="bg-zou-purple h-1 rounded-full" style={{ width: '100%' }}></div>
              </div>
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
            <div className="pixel-card flex flex-col items-center cursor-pointer hover:bg-muted/50 relative bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20" onClick={handleOpenExpensesDialog}>
              <Edit size={16} className="absolute top-2 right-2 opacity-50" />
              <h3 className="text-sm font-medium mb-1">Dépenses Mensuelles</h3>
              <span className="font-pixel text-xl text-zou-orange">
                {totalExpenses.toLocaleString()} €
              </span>
              <div className="mt-2 w-full bg-black/5 h-1 rounded-full">
                <div 
                  className={`h-1 rounded-full ${
                    spentPercentage > 90 ? 'bg-red-500' : 
                    spentPercentage > 75 ? 'bg-zou-orange' : 'bg-zou-purple'
                  }`} 
                  style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs mt-1 text-muted-foreground">
                {spentPercentage.toFixed(0)}% de vos revenus
              </div>
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
            <div className="pixel-card flex flex-col items-center cursor-pointer hover:bg-muted/50 relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20" onClick={handleOpenSavingsGoalDialog}>
              <Edit size={16} className="absolute top-2 right-2 opacity-50" />
              <h3 className="text-sm font-medium mb-1">Disponible Mensuel</h3>
              <span className={`font-pixel text-xl ${availableAmount >= 0 ? 'text-zou-green' : 'text-red-500'}`}>
                {availableAmount.toLocaleString()} €
              </span>
              <div className="text-xs mt-2 text-muted-foreground">
                Objectif d'épargne: {userData.financeModule.savingsGoal.toLocaleString()} €
              </div>
              <div className="mt-1 w-full bg-black/5 h-1 rounded-full">
                <div 
                  className={`h-1 rounded-full ${availableAmount >= userData.financeModule.savingsGoal ? 'bg-zou-green' : 'bg-gray-400'}`} 
                  style={{ width: `${Math.min((availableAmount / userData.financeModule.savingsGoal) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier l'objectif d'épargne</DialogTitle>
              <DialogDescription>
                Définissez votre objectif d'épargne mensuel à atteindre
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
              <div className="col-span-4 text-sm text-muted-foreground">
                <p>Le montant que vous souhaitez économiser chaque mois.</p>
                <p className="mt-2">Actuellement, il vous reste {availableAmount.toLocaleString()} € après dépenses.</p>
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
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard" className="flex items-center">
            <LayoutDashboard className="mr-1" size={16} />
            Dashboard
          </TabsTrigger>
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
        
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Résumé des dépenses par catégorie */}
            <div className="glass-card p-4">
              <h3 className="font-pixel text-md mb-3">Répartition des Dépenses</h3>
              <div className="space-y-3">
                {totalExpenses > 0 ? (
                  <>
                    <ExpenseItem 
                      label="Logement" 
                      amount={userData.financeModule.housingExpenses || 0} 
                      percentage={(userData.financeModule.housingExpenses || 0) / totalExpenses * 100} 
                      color="bg-purple-500" 
                    />
                    <ExpenseItem 
                      label="Alimentation" 
                      amount={userData.financeModule.foodExpenses || 0} 
                      percentage={(userData.financeModule.foodExpenses || 0) / totalExpenses * 100} 
                      color="bg-blue-500" 
                    />
                    <ExpenseItem 
                      label="Transport" 
                      amount={userData.financeModule.transportExpenses || 0} 
                      percentage={(userData.financeModule.transportExpenses || 0) / totalExpenses * 100} 
                      color="bg-green-500" 
                    />
                    <ExpenseItem 
                      label="Loisirs" 
                      amount={userData.financeModule.leisureExpenses || 0} 
                      percentage={(userData.financeModule.leisureExpenses || 0) / totalExpenses * 100} 
                      color="bg-yellow-500" 
                    />
                    <ExpenseItem 
                      label="Charges fixes" 
                      amount={userData.financeModule.fixedExpenses || 0} 
                      percentage={(userData.financeModule.fixedExpenses || 0) / totalExpenses * 100} 
                      color="bg-orange-500" 
                    />
                    <ExpenseItem 
                      label="Dettes" 
                      amount={userData.financeModule.debtPayments || 0} 
                      percentage={(userData.financeModule.debtPayments || 0) / totalExpenses * 100} 
                      color="bg-red-500" 
                    />
                  </>
                ) : (
                  <div className="text-center p-4 text-muted-foreground">
                    Aucune dépense enregistrée
                  </div>
                )}
              </div>
            </div>
            
            {/* Widget d'économies réalisées */}
            <div className="glass-card p-4">
              <h3 className="font-pixel text-md mb-3">Progression Financière</h3>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Taux d'épargne mensuel</h4>
                <div className="pixel-card p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Actuel</span>
                    <span className="text-sm font-medium">
                      {totalIncome > 0 ? ((availableAmount / totalIncome) * 100).toFixed(1) : "0"}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-zou-purple h-2.5 rounded-full" 
                      style={{ 
                        width: `${totalIncome > 0 ? Math.max(Math.min((availableAmount / totalIncome) * 100, 100), 0) : 0}%` 
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Recommandé: 20% de vos revenus
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Objectif d'épargne mensuel</h4>
                <div className="pixel-card p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Progression</span>
                    <span className="text-sm font-medium">
                      {userData.financeModule.savingsGoal > 0 
                        ? Math.min(Math.max(Math.round((availableAmount / userData.financeModule.savingsGoal) * 100), 0), 100)
                        : 0
                      }%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-zou-green h-2.5 rounded-full" 
                      style={{ 
                        width: `${userData.financeModule.savingsGoal > 0 
                          ? Math.min(Math.max((availableAmount / userData.financeModule.savingsGoal) * 100, 0), 100)
                          : 0
                        }%` 
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Objectif: {userData.financeModule.savingsGoal.toLocaleString()} €
                    </span>
                    <span className={`text-xs ${availableAmount >= userData.financeModule.savingsGoal ? 'text-green-500' : 'text-muted-foreground'}`}>
                      Actuel: {availableAmount.toLocaleString()} €
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
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

// Composant utilitaire pour afficher une ligne de dépense
const ExpenseItem = ({ label, amount, percentage, color }: { label: string; amount: number; percentage: number; color: string }) => {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-medium">{amount.toLocaleString()} €</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`${color} h-2.5 rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-end mt-1">
        <span className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
};

export default Finances;
