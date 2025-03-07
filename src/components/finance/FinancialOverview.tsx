
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Wallet, 
  PiggyBank, 
  Plus,
  Copy
} from 'lucide-react';
import { useUserData } from "@/context/UserDataContext";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from 'uuid';
import { playSound } from "@/utils/audioUtils";

interface FinancialOverviewProps {
  income: number;
  expenses: number;
  balance: number;
  savingsGoal: number;
  savingsRate: number;
  selectedMonth: string;
  unlockAchievement: (achievementId: string) => Promise<void>;
  completeQuestStep: (questId: string, progress: number) => Promise<void>;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  income,
  expenses,
  balance,
  savingsGoal,
  savingsRate,
  selectedMonth,
  unlockAchievement,
  completeQuestStep
}) => {
  const { userData, updateFinanceModule } = useUserData();
  const [newTemplateDialogOpen, setNewTemplateDialogOpen] = useState(false);
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    income: income || 0,
    expenses: expenses || 0
  });

  const data = [
    { name: 'Revenus', value: income },
    { name: 'Dépenses', value: expenses },
    { name: 'Économies', value: balance > 0 ? balance : 0 }
  ];
  
  const COLORS = ['#22c55e', '#ef4444', '#3b82f6'];
  
  const handleBudgetProgress = async () => {
    if (userData.financeModule) {
      if (!userData.financeModule.achievements.find(a => a.id === "first_budget")?.completed) {
        await unlockAchievement("first_budget");
      }
      
      await completeQuestStep("set_budget", 100);
    }
  };

  const handleSaveAsTemplate = () => {
    setTemplateData({
      name: '',
      description: `Données du mois de ${selectedMonth}`,
      income,
      expenses
    });
    setNewTemplateDialogOpen(true);
  };

  const handleCreateTemplate = async () => {
    if (!templateData.name) {
      toast({
        title: "Erreur",
        description: "Veuillez donner un nom à votre modèle",
        variant: "destructive"
      });
      return;
    }

    const newTemplate = {
      id: uuidv4(),
      name: templateData.name,
      description: templateData.description,
      income: templateData.income,
      expenses: templateData.expenses
    };

    const templates = [
      ...(userData.financeModule?.budgetTemplates || []),
      newTemplate
    ];

    await updateFinanceModule({ budgetTemplates: templates });
    
    setNewTemplateDialogOpen(false);
    
    toast({
      title: "Modèle créé",
      description: `Le modèle "${templateData.name}" a été créé avec succès.`
    });
    
    playSound('success');
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Vue d'ensemble financière</CardTitle>
              <CardDescription>
                Situation financière pour {selectedMonth}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={handleSaveAsTemplate}
            >
              <Copy size={16} />
              <span className="hidden sm:inline">Créer template</span>
              <span className="sm:hidden">Template</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Revenus</p>
                      <h4 className="text-2xl font-bold mt-1">{income} €</h4>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                      <Wallet size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Dépenses</p>
                      <h4 className="text-2xl font-bold mt-1">{expenses} €</h4>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-700">
                      <CreditCard size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Balance</p>
                      <h4 className="text-2xl font-bold mt-1">{balance} €</h4>
                    </div>
                    <div className={`h-12 w-12 rounded-full ${balance >= 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                      <div className="h-full w-full flex items-center justify-center">
                        {balance >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-semibold mb-3">Répartition budget</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={data.filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} €`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Taux d'épargne</h3>
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                    <PiggyBank size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{savingsRate}%</p>
                    <p className="text-xs text-muted-foreground">de vos revenus</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  Objectif d'épargne: {savingsGoal}%
                </p>
                
                <Progress value={savingsRate} className="h-2" />
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Budget équilibré?</h3>
                  <div className={`p-4 rounded-md ${balance >= 0 ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${balance >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {balance >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      </div>
                      <div>
                        <p className={`font-medium ${balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                          {balance >= 0 ? 'Budget équilibré' : 'Budget déficitaire'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {balance >= 0 
                            ? 'Félicitations, continuez ainsi!' 
                            : 'Essayez de réduire vos dépenses ou d\'augmenter vos revenus.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={handleBudgetProgress}
                  >
                    Valider mon budget
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={newTemplateDialogOpen} onOpenChange={setNewTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau modèle</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template-name" className="text-right">
                Nom
              </Label>
              <Input
                id="template-name"
                value={templateData.name}
                onChange={(e) => setTemplateData({ ...templateData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template-desc" className="text-right">
                Description
              </Label>
              <Textarea
                id="template-desc"
                value={templateData.description}
                onChange={(e) => setTemplateData({ ...templateData, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template-income" className="text-right">
                Revenus
              </Label>
              <Input
                id="template-income"
                type="number"
                value={templateData.income}
                onChange={(e) => setTemplateData({ ...templateData, income: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template-expenses" className="text-right">
                Dépenses
              </Label>
              <Input
                id="template-expenses"
                type="number"
                value={templateData.expenses}
                onChange={(e) => setTemplateData({ ...templateData, expenses: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTemplateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateTemplate}>
              Créer le modèle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FinancialOverview;
