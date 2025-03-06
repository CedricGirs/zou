
import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useUserData } from "@/context/UserDataContext";
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
  ArrowUpDown,
  Download,
  FileText,
  Target,
  BadgeDollarSign
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

const Finances = () => {
  const { userData } = useUserData();
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

  const handleExportData = () => {
    // Cette fonction permettrait d'exporter toutes les données financières
    toast({
      title: "Export des données financières",
      description: "Vos données financières ont été exportées avec succès.",
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        {/* En-tête avec titre et sélecteurs de date */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="font-pixel text-3xl mb-2">Finance Master</h1>
            <p className="text-muted-foreground">Votre tableau de bord financier personnel</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
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
            
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download size={16} className="mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Aperçu financier */}
        <FinancialOverview 
          income={0}
          expenses={0}
          balance={0}
          savingsGoal={0}
          savingsRate={0}
        />

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenu mensuel</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 €</div>
              <p className="text-xs text-muted-foreground">+0% depuis le mois dernier</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Dépenses</CardTitle>
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 €</div>
              <p className="text-xs text-muted-foreground">+0% depuis le mois dernier</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Épargne</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 €</div>
              <p className="text-xs text-muted-foreground">0% de votre revenu</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Budget restant</CardTitle>
              <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 €</div>
              <p className="text-xs text-muted-foreground">Jusqu'à la fin du mois</p>
            </CardContent>
          </Card>
        </div>

        {/* Aperçu des tendances financières */}
        <FinancialInsights 
          transactions={[]}
          month={selectedMonth}
        />
        
        {/* Navigation par onglets pour les différentes sections */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Échéances à venir</CardTitle>
                    <CardDescription>Vos paiements et revenus planifiés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <div className="flex items-center gap-2">
                          <FileText size={14} />
                          <span>Loyer</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-semibold text-red-500">- 0 €</span>
                          <span className="text-xs text-muted-foreground">01/04/2024</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b">
                        <div className="flex items-center gap-2">
                          <DollarSign size={14} />
                          <span>Salaire</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-semibold text-green-500">+ 0 €</span>
                          <span className="text-xs text-muted-foreground">30/04/2024</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b">
                        <div className="flex items-center gap-2">
                          <CreditCard size={14} />
                          <span>Assurance</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-semibold text-red-500">- 0 €</span>
                          <span className="text-xs text-muted-foreground">15/04/2024</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Objectifs à atteindre</CardTitle>
                    <CardDescription>Échéances pour vos projets d'épargne</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span>Fonds d'urgence</span>
                          <span className="text-sm">0/0 €</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <div className="text-xs text-muted-foreground">Échéance: Décembre 2024</div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span>Vacances d'été</span>
                          <span className="text-sm">0/0 €</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <div className="text-xs text-muted-foreground">Échéance: Juin 2024</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reports">
            <FinancialReports />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Finances;
