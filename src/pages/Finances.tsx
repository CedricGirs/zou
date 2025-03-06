
import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useUserData } from "@/context/UserDataContext";
import { useLanguage } from "@/context/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  PiggyBank, 
  CreditCard, 
  ChartPie, 
  Wallet,
  Calendar,
  Settings,
  ArrowUpDown
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

const Finances = () => {
  const { userData } = useUserData();
  const { t } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MMMM', { locale: fr }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  
  // Calcul des statistiques financières
  const totalIncome = (userData.financeModule.monthlyIncome || 0) + (userData.financeModule.additionalIncome || 0);
  const totalExpenses = (
    (userData.financeModule.housingExpenses || 0) + 
    (userData.financeModule.foodExpenses || 0) + 
    (userData.financeModule.transportExpenses || 0) + 
    (userData.financeModule.leisureExpenses || 0) + 
    (userData.financeModule.fixedExpenses || 0) +
    (userData.financeModule.debtPayments || 0)
  );
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;
  
  // Mois disponibles pour la sélection
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  // Années disponibles pour la sélection
  const years = ['2022', '2023', '2024', '2025'];

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-pixel text-3xl mb-2">Finance Master</h1>
          <p className="text-muted-foreground">Votre tableau de bord financier personnel</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Mois" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-8">
        <FinancialOverview 
          income={totalIncome}
          expenses={totalExpenses}
          balance={balance}
          savingsGoal={userData.financeModule.savingsGoal}
          savingsRate={savingsRate}
        />
      </div>

      <div className="mb-8">
        <FinancialInsights 
          transactions={userData.financeModule.transactions || []}
          month={selectedMonth}
        />
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-6 gap-2">
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
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar size={16} />
            <span className="hidden md:inline">Calendrier</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="hidden md:inline">Rapports</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AnnualBudget />
            </div>
            <div>
              <SavingsTracker />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="budget">
          <AnnualBudget />
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionTracker selectedMonth={selectedMonth} />
        </TabsContent>
        
        <TabsContent value="savings">
          <SavingsTracker />
        </TabsContent>
        
        <TabsContent value="calendar">
          <div className="glass-card p-6">
            <h2 className="font-pixel text-lg mb-4">Calendrier Financier</h2>
            <p className="text-muted-foreground text-center py-10">
              Cette fonctionnalité sera bientôt disponible.
            </p>
            <div className="flex justify-center">
              <Button variant="outline">
                Être notifié quand cette fonctionnalité sera disponible
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <FinancialReports />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Finances;
