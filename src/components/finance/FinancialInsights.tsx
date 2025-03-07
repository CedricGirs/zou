
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Transaction } from "@/context/UserDataContext";
import { AlertCircle, TrendingUp, TrendingDown, Info, ArrowRight, Trophy, Target, BadgeDollarSign, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FinancialInsightsProps {
  transactions: Transaction[];
  month: string;
}

const FinancialInsights = ({ transactions, month }: FinancialInsightsProps) => {
  // Filter transactions by month - empty to reset
  const filteredTransactions: Transaction[] = [];
  
  // Data for expense categories chart - reset
  const expensePieData = [
    { name: 'Logement', value: 0 },
    { name: 'Alimentation', value: 0 },
    { name: 'Transport', value: 0 },
    { name: 'Loisirs', value: 0 },
    { name: 'Santé', value: 0 },
    { name: 'Divers', value: 0 }
  ];
  
  // Data for daily income vs expenses chart - reset
  const dailyChartData = Array.from({ length: 30 }, (_, i) => ({
    date: `${i + 1}/04`,
    income: 0,
    expenses: 0
  }));
  
  // Financial tips and challenges
  const financialTips = [
    { 
      id: 1, 
      title: "Règle 50/30/20", 
      description: "Allouez 50% de vos revenus aux besoins, 30% aux désirs et 20% à l'épargne.",
      xpReward: 15
    },
    { 
      id: 2, 
      title: "Fonds d'urgence", 
      description: "Visez à avoir 3-6 mois de dépenses en épargne d'urgence.",
      xpReward: 20
    },
    { 
      id: 3, 
      title: "Suivi quotidien", 
      description: "Prenez l'habitude de suivre vos dépenses quotidiennement pour plus de précision.",
      xpReward: 10
    }
  ];
  
  // Financial challenges
  const financialChallenges = [
    { 
      id: 1, 
      title: "No-Spend Week", 
      description: "Ne dépensez rien pendant 7 jours sur les loisirs et achats non-essentiels.",
      difficulty: "Facile",
      xpReward: 50,
      progress: 0
    },
    { 
      id: 2, 
      title: "Réduction -10%", 
      description: "Réduisez vos dépenses de 10% ce mois-ci par rapport au mois précédent.",
      difficulty: "Moyen",
      xpReward: 75,
      progress: 0
    },
    { 
      id: 3, 
      title: "Épargne Automatique", 
      description: "Mettez en place un virement automatique mensuel vers votre épargne.",
      difficulty: "Facile",
      xpReward: 40,
      progress: 0
    }
  ];
  
  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-purple-500" />
          Aperçu du mois
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2 overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50">
              <CardTitle className="text-sm font-medium">Tendances financières</CardTitle>
              <CardDescription>Revenus et dépenses journaliers</CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyChartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString('fr-FR')} €`} />
                    <Legend />
                    <Bar dataKey="income" name="Revenus" fill="#82ca9d" />
                    <Bar dataKey="expenses" name="Dépenses" fill="#ff7c43" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-violet-50 to-purple-50">
              <p className="text-sm text-muted-foreground">
                Ajoutez des transactions pour voir apparaître des données dans ce graphique.
              </p>
              <div className="ml-auto flex items-center bg-white px-2 py-1 rounded-full text-xs text-purple-600">
                <Trophy size={12} className="mr-1 text-amber-500" />
                <span>+25 XP pour 10 transactions</span>
              </div>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50">
              <CardTitle className="text-sm font-medium">Répartition des dépenses</CardTitle>
              <CardDescription>Par catégorie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensePieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => value > 0 ? `${name}` : ''}
                    >
                      {expensePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toLocaleString('fr-FR')} €`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-violet-50 to-purple-50">
              <div className="w-full flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Complétez le graphique</span>
                <div className="flex items-center bg-white px-2 py-1 rounded-full text-xs text-purple-600">
                  <Target size={12} className="mr-1 text-purple-500" />
                  <span>Équilibrez vos dépenses</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={18} className="text-green-500" />
              Conseils Financiers
            </CardTitle>
            <CardDescription>Astuces pour améliorer votre santé financière</CardDescription>
          </CardHeader>
          <CardContent className="px-4 py-3">
            <div className="space-y-4">
              {financialTips.map((tip) => (
                <div key={tip.id} className="rounded-lg border border-green-100 p-3 hover:bg-green-50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm flex items-center gap-1">
                      <Zap size={14} className="text-green-500" />
                      {tip.title}
                    </h4>
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                      +{tip.xpReward} XP
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{tip.description}</p>
                </div>
              ))}
              
              <div className="text-center py-2">
                <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                  Plus de conseils <ArrowRight size={14} className="ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              Défis Financiers
            </CardTitle>
            <CardDescription>Relevez des défis pour gagner des récompenses</CardDescription>
          </CardHeader>
          <CardContent className="px-4 py-3">
            <div className="space-y-4">
              {financialChallenges.map((challenge) => (
                <div key={challenge.id} className="rounded-lg border border-blue-100 p-3 hover:bg-blue-50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm">{challenge.title}</h4>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        challenge.difficulty === "Facile" 
                          ? "bg-green-100 text-green-700"
                          : challenge.difficulty === "Moyen"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                        +{challenge.xpReward} XP
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{challenge.description}</p>
                  <Progress value={challenge.progress} className="h-1.5" />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">{challenge.progress}% complété</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      Commencer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={18} />
              Revenus
            </CardTitle>
            <CardDescription>Analyse de vos sources de revenus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <span>Vous n'avez pas encore ajouté de revenus ce mois-ci.</span>
                </AlertDescription>
              </Alert>
              
              <div className="text-center py-4">
                <div className="inline-block rounded-full bg-purple-100 p-3 mb-3">
                  <BadgeDollarSign className="h-6 w-6 text-purple-500" />
                </div>
                <p className="text-muted-foreground mb-4">
                  Commencez à ajouter vos sources de revenus pour obtenir des analyses détaillées.
                </p>
                <Button variant="outline" size="sm">
                  Ajouter un revenu <ArrowRight size={14} className="ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between">
            <span className="text-xs text-muted-foreground">Revenu mensuel moyen: 0 €</span>
            <div className="flex items-center text-xs text-purple-600">
              <Trophy size={12} className="mr-1 text-amber-500" />
              <span>+30 XP pour 3 sources de revenus</span>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown size={18} />
              Dépenses
            </CardTitle>
            <CardDescription>Analyse de vos catégories de dépenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <span>Vous n'avez pas encore ajouté de dépenses ce mois-ci.</span>
                </AlertDescription>
              </Alert>
              
              <div className="text-center py-4">
                <div className="inline-block rounded-full bg-orange-100 p-3 mb-3">
                  <BadgeDollarSign className="h-6 w-6 text-orange-500" />
                </div>
                <p className="text-muted-foreground mb-4">
                  Commencez à ajouter vos dépenses pour obtenir des analyses détaillées par catégorie.
                </p>
                <Button variant="outline" size="sm">
                  Ajouter une dépense <ArrowRight size={14} className="ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between">
            <span className="text-xs text-muted-foreground">Dépense mensuelle moyenne: 0 €</span>
            <div className="flex items-center text-xs text-purple-600">
              <Target size={12} className="mr-1 text-purple-500" />
              <span>Réduisez vos dépenses de 5%</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default FinancialInsights;
