
import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useUserData } from "@/context/UserDataContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  PiggyBank, 
  ChartPie, 
  Wallet,
  Calendar,
  ArrowUpDown,
  Trophy,
  Target,
  Sparkles,
  Star,
  BadgeDollarSign,
  Medal
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

const Finances = () => {
  const { userData } = useUserData();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MMMM', { locale: fr }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  
  // User's finance level and experience
  const financeLevel = 3;
  const currentXP = 320;
  const maxXP = 500;
  
  // Financial achievements
  const achievements = [
    { id: 1, name: "Budget Master", icon: <Wallet size={20} />, completed: true, xp: 50 },
    { id: 2, name: "Savings Hero", icon: <PiggyBank size={20} />, completed: true, xp: 100 },
    { id: 3, name: "Transaction Tracker", icon: <ArrowUpDown size={20} />, completed: false, xp: 75 },
    { id: 4, name: "Investment Guru", icon: <TrendingUp size={20} />, completed: false, xp: 150 },
  ];
  
  // Finance quests
  const quests = [
    { id: 1, name: "Set monthly budget", description: "Define your income and expenses", reward: "25 XP", progress: 100 },
    { id: 2, name: "Track 10 transactions", description: "Add real transactions to your tracker", reward: "50 XP", progress: 30 },
    { id: 3, name: "Create a savings goal", description: "Set up a savings target with deadline", reward: "30 XP", progress: 0 },
  ];
  
  // Months available for selection
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  // Years available for selection
  const years = ['2022', '2023', '2024', '2025'];

  const handleExportData = () => {
    toast({
      title: "Export des données financières",
      description: "Vos données financières ont été exportées avec succès.",
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        {/* Header with title and date selectors */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="font-pixel text-3xl mb-2">Finance Quest</h1>
            <p className="text-muted-foreground">Votre aventure financière commence ici</p>
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
              <Trophy size={16} className="mr-2 text-amber-500" />
              Récompenses
            </Button>
          </div>
        </div>

        {/* Gamified progression section */}
        <div className="glass-card p-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                {financeLevel}
              </div>
              <div>
                <h3 className="font-pixel text-lg">Niveau Finance</h3>
                <p className="text-sm text-muted-foreground">Maître du Budget</p>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <XPBar currentXP={currentXP} maxXP={maxXP} />
              <p className="text-xs text-right text-muted-foreground mt-1">Prochain niveau: Planificateur Financier</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
            {quests.map(quest => (
              <Card key={quest.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex justify-between">
                    <span>{quest.name}</span>
                    <Sparkles size={16} className="text-amber-500" />
                  </CardTitle>
                  <CardDescription className="text-xs">{quest.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={quest.progress} className="h-2 mb-1" />
                  <div className="flex justify-between text-xs">
                    <span>{quest.progress}% complété</span>
                    <span className="text-purple-500">{quest.reward}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Financial Overview */}
        <FinancialOverview 
          income={0}
          expenses={0}
          balance={0}
          savingsGoal={0}
          savingsRate={0}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow border-t-4 border-t-violet-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenu mensuel</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 €</div>
              <p className="text-xs text-muted-foreground">+0% depuis le mois dernier</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow border-t-4 border-t-orange-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Dépenses</CardTitle>
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 €</div>
              <p className="text-xs text-muted-foreground">+0% depuis le mois dernier</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow border-t-4 border-t-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Épargne</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 €</div>
              <p className="text-xs text-muted-foreground">0% de votre revenu</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow border-t-4 border-t-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Score Financier</CardTitle>
              <Star className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42/100</div>
              <p className="text-xs text-muted-foreground">En progression</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements section */}
        <div className="glass-card p-4">
          <h3 className="font-pixel text-lg mb-4">Réalisations Financières</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`p-4 rounded-lg border flex flex-col items-center text-center gap-2 ${
                  achievement.completed 
                    ? 'bg-gradient-to-br from-violet-50 to-purple-50 border-purple-200' 
                    : 'bg-gray-50 border-gray-200 opacity-70'
                }`}
              >
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  achievement.completed ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {achievement.icon}
                </div>
                <h4 className="font-semibold">{achievement.name}</h4>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  achievement.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {achievement.completed ? 'Complété' : 'À débloquer'} 
                </div>
                <p className="text-xs text-purple-500">+{achievement.xp} XP</p>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Insights */}
        <FinancialInsights 
          transactions={[]}
          month={selectedMonth}
        />
        
        {/* Tab navigation for different sections */}
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
                    <CardTitle className="flex items-center gap-2">
                      <Calendar size={16} />
                      Échéances à venir
                    </CardTitle>
                    <CardDescription>Vos paiements et revenus planifiés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                            <BadgeDollarSign size={16} />
                          </div>
                          <span>Loyer</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-semibold text-red-500">- 0 €</span>
                          <span className="text-xs text-muted-foreground">01/04/2024</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                            <DollarSign size={16} />
                          </div>
                          <span>Salaire</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-semibold text-green-500">+ 0 €</span>
                          <span className="text-xs text-muted-foreground">30/04/2024</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                            <BadgeDollarSign size={16} />
                          </div>
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
                    <CardTitle className="flex items-center gap-2">
                      <Target size={16} />
                      Objectifs à atteindre
                    </CardTitle>
                    <CardDescription>Échéances pour vos projets d'épargne</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Medal size={16} className="text-amber-500" />
                            <span>Fonds d'urgence</span>
                          </div>
                          <span className="text-sm">0/0 €</span>
                        </div>
                        <Progress value={0} className="h-2" />
                        <div className="text-xs text-muted-foreground">Échéance: Décembre 2024</div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Medal size={16} className="text-blue-500" />
                            <span>Vacances d'été</span>
                          </div>
                          <span className="text-sm">0/0 €</span>
                        </div>
                        <Progress value={0} className="h-2" />
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
