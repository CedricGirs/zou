
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
import { AlertCircle, TrendingUp, TrendingDown, Info, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FinancialInsightsProps {
  transactions: Transaction[];
  month: string;
}

const FinancialInsights = ({ transactions, month }: FinancialInsightsProps) => {
  // Filtrer les transactions par mois - vide pour réinitialiser
  const filteredTransactions: Transaction[] = [];
  
  // Données pour le graphique des catégories de dépenses - réinitialisées
  const expensePieData = [
    { name: 'Logement', value: 0 },
    { name: 'Alimentation', value: 0 },
    { name: 'Transport', value: 0 },
    { name: 'Loisirs', value: 0 },
    { name: 'Santé', value: 0 },
    { name: 'Divers', value: 0 }
  ];
  
  // Données pour le graphique des revenus vs dépenses par jour - réinitialisées
  const dailyChartData = Array.from({ length: 30 }, (_, i) => ({
    date: `${i + 1}/04`,
    income: 0,
    expenses: 0
  }));
  
  // Couleurs pour les graphiques
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Aperçu du mois</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Tendances financières</CardTitle>
              <CardDescription>Revenus et dépenses journaliers</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
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
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Ajoutez des transactions pour voir apparaître des données dans ce graphique.
              </p>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
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
          </Card>
        </div>
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
              
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  Commencez à ajouter vos sources de revenus pour obtenir des analyses détaillées.
                </p>
                <Button variant="outline" size="sm">
                  Ajouter un revenu <ArrowRight size={14} className="ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
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
              
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  Commencez à ajouter vos dépenses pour obtenir des analyses détaillées par catégorie.
                </p>
                <Button variant="outline" size="sm">
                  Ajouter une dépense <ArrowRight size={14} className="ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialInsights;
