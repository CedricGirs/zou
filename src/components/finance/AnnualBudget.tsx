
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserData } from "@/context/UserDataContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { PiggyBank, ArrowUp, ArrowDown, Save } from "lucide-react";

interface AnnualBudgetProps {
  selectedMonth?: string;
  selectedYear?: string;
}

const AnnualBudget = ({ selectedMonth, selectedYear }: AnnualBudgetProps) => {
  const { userData, updateFinanceModule } = useUserData();
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  // Charger les données du mois sélectionné
  useEffect(() => {
    if (!userData?.financeModule || !selectedMonth || !selectedYear) return;
    
    setLoading(true);
    
    try {
      // Vérifier si des données existent pour ce mois
      const monthKey = `${selectedMonth}_${selectedYear}`;
      const monthData = userData.financeModule.monthlyData?.[monthKey];
      
      if (monthData) {
        // Utiliser les données existantes
        setIncome(monthData.monthlyIncome);
        setExpenses(monthData.monthlyExpenses);
      } else {
        // Réinitialiser à zéro pour un nouveau mois
        setIncome(0);
        setExpenses(0);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données budgétaires:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, userData?.financeModule]);

  const handleSaveBudget = async () => {
    if (!userData?.financeModule || !selectedMonth || !selectedYear) return;
    
    try {
      const monthKey = `${selectedMonth}_${selectedYear}`;
      
      // Obtenir les données mensuelles actuelles ou créer un nouvel objet
      const currentMonthlyData = userData.financeModule.monthlyData || {};
      const currentMonthData = currentMonthlyData[monthKey] || {
        transactions: [],
        monthlyIncome: 0,
        monthlyExpenses: 0,
        balance: 0
      };
      
      // Mettre à jour les données avec les nouveaux montants
      const updatedMonthData = {
        ...currentMonthData,
        monthlyIncome: income,
        monthlyExpenses: expenses,
        balance: income - expenses
      };
      
      // Mettre à jour les données mensuelles
      currentMonthlyData[monthKey] = updatedMonthData;
      
      // Sauvegarder dans le module finance
      await updateFinanceModule({
        monthlyData: currentMonthlyData
      });
      
      toast({
        title: "Budget mis à jour",
        description: `Budget pour ${selectedMonth} ${selectedYear} sauvegardé avec succès.`
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du budget:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le budget.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget {selectedMonth} {selectedYear}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Chargement des données budgétaires...</p>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="monthly-income">Revenus mensuels</Label>
                <div className="flex items-center space-x-2">
                  <ArrowUp className="h-5 w-5 text-green-500" />
                  <Input
                    id="monthly-income"
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    placeholder="Entrez vos revenus mensuels"
                  />
                  <span>€</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="monthly-expenses">Dépenses mensuelles</Label>
                <div className="flex items-center space-x-2">
                  <ArrowDown className="h-5 w-5 text-red-500" />
                  <Input
                    id="monthly-expenses"
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(Number(e.target.value))}
                    placeholder="Entrez vos dépenses mensuelles"
                  />
                  <span>€</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Solde prévu</h3>
                    <p className={`text-xl font-bold ${income - expenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {income - expenses} €
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <PiggyBank className={`h-5 w-5 ${income - expenses >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                    <span className="text-sm text-muted-foreground">
                      {income - expenses >= 0 
                        ? "Budget équilibré" 
                        : "Budget déficitaire"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleSaveBudget} 
              className="w-full"
            >
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder le budget
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnualBudget;
