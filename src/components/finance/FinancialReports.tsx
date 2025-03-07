
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUserData } from "@/context/UserDataContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, FileBarChart2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface FinancialReportsProps {
  selectedMonth?: string;
  selectedYear?: string;
}

const FinancialReports = ({ selectedMonth, selectedYear }: FinancialReportsProps) => {
  const { userData } = useUserData();
  const [monthlyData, setMonthlyData] = useState<{
    income: number;
    expenses: number;
    balance: number;
  }>({
    income: 0,
    expenses: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (!userData?.financeModule || !selectedMonth || !selectedYear) return;
    
    setLoading(true);
    
    try {
      // Vérifier si des données existent pour ce mois
      const monthKey = `${selectedMonth}_${selectedYear}`;
      const monthData = userData.financeModule.monthlyData?.[monthKey];
      
      if (monthData) {
        // Utiliser les données existantes
        setMonthlyData({
          income: monthData.monthlyIncome,
          expenses: monthData.monthlyExpenses,
          balance: monthData.balance
        });
        setHasData(true);
      } else {
        // Réinitialiser à zéro pour un nouveau mois
        setMonthlyData({
          income: 0,
          expenses: 0,
          balance: 0
        });
        setHasData(false);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données du rapport:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, userData?.financeModule]);

  const categoryData = userData?.financeModule?.monthlyData?.[`${selectedMonth}_${selectedYear}`]?.transactions?.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.amount;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const chartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value
  }));

  const handleExportReport = () => {
    toast({
      title: "Rapport exporté",
      description: `Le rapport financier pour ${selectedMonth} ${selectedYear} a été exporté.`
    });
  };

  const comparisonData = [
    { name: 'Revenus', value: monthlyData.income },
    { name: 'Dépenses', value: monthlyData.expenses },
    { name: 'Solde', value: monthlyData.balance }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Rapports Financiers</CardTitle>
            <CardDescription>Analyses pour {selectedMonth} {selectedYear}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download size={16} className="mr-2" />
            Exporter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Chargement des données...</p>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-md">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-medium">
              Aucune donnée disponible pour {selectedMonth} {selectedYear}.
            </p>
            <p className="text-muted-foreground text-sm mt-2 mb-4">
              Ajoutez des transactions ou définissez un budget pour voir les rapports.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Résumé du mois</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} €`} />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      fill={(entry) => {
                        const name = entry.name;
                        if (name === 'Revenus') return '#22c55e';
                        if (name === 'Dépenses') return '#ef4444';
                        return monthlyData.balance >= 0 ? '#3b82f6' : '#f97316';
                      }}
                      name="Montant (€)" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {chartData.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Répartition des dépenses</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value} €`} />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Montant (€)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card className="p-4 bg-green-50 border-green-100">
                <p className="text-sm text-muted-foreground mb-1">Total revenus</p>
                <p className="text-xl font-semibold text-green-600">{monthlyData.income} €</p>
              </Card>
              
              <Card className="p-4 bg-red-50 border-red-100">
                <p className="text-sm text-muted-foreground mb-1">Total dépenses</p>
                <p className="text-xl font-semibold text-red-600">{monthlyData.expenses} €</p>
              </Card>
              
              <Card className={`p-4 ${monthlyData.balance >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
                <p className="text-sm text-muted-foreground mb-1">Solde</p>
                <p className={`text-xl font-semibold ${monthlyData.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {monthlyData.balance} €
                </p>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialReports;
