import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Transaction, BudgetTemplate } from "@/context/UserDataContext";
import { AlertCircle, TrendingUp, TrendingDown, ArrowRight, Trophy, Target, BadgeDollarSign, Plus, Trash2, Edit2, Check as CheckIcon, Save, List, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserData } from "@/context/UserDataContext";
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from "@/components/ui/textarea";

interface FinancialInsightsProps {
  transactions: Transaction[];
  month: string;
  updateMonthData: (data: any) => void;
}

const FinancialInsights = ({ transactions, month, updateMonthData }: FinancialInsightsProps) => {
  const { userData, updateFinanceModule } = useUserData();
  
  // États pour les formulaires d'ajout
  const [newIncome, setNewIncome] = useState({
    description: '',
    amount: 0,
    category: 'Salaire'
  });
  
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: 0,
    category: 'Logement'
  });

  // État pour l'édition d'une transaction
  const [editingTransaction, setEditingTransaction] = useState<{
    id: string;
    amount: number;
    type: 'income' | 'expense';
  } | null>(null);
  
  // État pour le dialogue de création de template
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  
  // Nouveaux états pour les dialogues d'application de templates
  const [isApplyIncomeTemplateOpen, setIsApplyIncomeTemplateOpen] = useState(false);
  const [isApplyExpenseTemplateOpen, setIsApplyExpenseTemplateOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  
  // État pour afficher les revenus et dépenses récents
  const [showRecentIncomes, setShowRecentIncomes] = useState(false);
  const [showRecentExpenses, setShowRecentExpenses] = useState(false);
  
  // Catégories de revenus et dépenses
  const incomeCategories = [
    'Salaire', 'Freelance', 'Dividendes', 'Loyers', 'Cadeaux', 'Remboursements', 'Autres'
  ];
  
  const expenseCategories = [
    'Logement', 'Alimentation', 'Transport', 'Loisirs', 'Santé', 'Éducation', 'Vêtements', 'Cadeaux', 'Autre'
  ];
  
  // Gestion des formulaires
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewIncome({
      ...newIncome,
      [name]: type === 'number' ? Number(value) : value
    });
  };
  
  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: type === 'number' ? Number(value) : value
    });
  };
  
  const handleIncomeCategoryChange = (value: string) => {
    setNewIncome({
      ...newIncome,
      category: value
    });
  };
  
  const handleExpenseCategoryChange = (value: string) => {
    setNewExpense({
      ...newExpense,
      category: value
    });
  };
  
  // Calcul des totaux
  const recalculateTotals = (updatedTransactions: Transaction[]) => {
    const totalIncome = updatedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = updatedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;
    
    return {
      income: totalIncome,
      expenses: totalExpenses,
      balance,
      savingsRate,
      transactions: updatedTransactions
    };
  };
  
  // Ajouter revenu
  const addIncome = async () => {
    if (!newIncome.description || newIncome.amount <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs correctement.",
        variant: "destructive"
      });
      return;
    }
    
    const transaction: Transaction = {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      description: newIncome.description,
      amount: newIncome.amount,
      category: newIncome.category,
      type: 'income',
      month: month,
      isVerified: false
    };
    
    const updatedTransactions = [...transactions, transaction];
    const updatedData = recalculateTotals(updatedTransactions);
    
    updateMonthData(updatedData);
    
    toast({
      title: "Revenu ajouté",
      description: `${newIncome.description} : ${newIncome.amount}€ a été ajouté avec succès.`
    });
    
    setNewIncome({
      description: '',
      amount: 0,
      category: 'Salaire'
    });
  };
  
  // Ajouter dépense
  const addExpense = async () => {
    if (!newExpense.description || newExpense.amount <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs correctement.",
        variant: "destructive"
      });
      return;
    }
    
    const transaction: Transaction = {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      description: newExpense.description,
      amount: newExpense.amount,
      category: newExpense.category,
      type: 'expense',
      month: month,
      isVerified: false
    };
    
    const updatedTransactions = [...transactions, transaction];
    const updatedData = recalculateTotals(updatedTransactions);
    
    updateMonthData(updatedData);
    
    toast({
      title: "Dépense ajoutée",
      description: `${newExpense.description} : ${newExpense.amount}€ a été ajoutée avec succès.`
    });
    
    setNewExpense({
      description: '',
      amount: 0,
      category: 'Logement'
    });
  };

  // Supprimer une transaction
  const deleteTransaction = async (transactionId: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== transactionId);
    const updatedData = recalculateTotals(updatedTransactions);
    
    updateMonthData(updatedData);
    
    toast({
      title: "Transaction supprimée",
      description: "La transaction a été supprimée avec succès."
    });
  };

  // Éditer une transaction
  const startEditTransaction = (transaction: Transaction) => {
    setEditingTransaction({
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type
    });
  };

  // Sauvegarder une transaction éditée
  const saveEditedTransaction = async () => {
    if (!editingTransaction) return;

    const updatedTransactions = transactions.map(t => {
      if (t.id === editingTransaction.id) {
        return {
          ...t,
          amount: editingTransaction.amount
        };
      }
      return t;
    });

    const updatedData = recalculateTotals(updatedTransactions);
    
    updateMonthData(updatedData);
    
    toast({
      title: "Transaction modifiée",
      description: `Le montant a été mis à jour avec succès.`
    });
    
    setEditingTransaction(null);
  };

  // Gérer le changement de montant dans le formulaire d'édition
  const handleEditAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingTransaction) return;
    
    setEditingTransaction({
      ...editingTransaction,
      amount: Number(e.target.value)
    });
  };

  // Créer un template
  const handleCreateTemplate = async () => {
    if (!templateName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez donner un nom à votre template.",
        variant: "destructive"
      });
      return;
    }

    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    const newTemplate: BudgetTemplate = {
      id: uuidv4(),
      name: templateName,
      income: totalIncome,
      expenses: totalExpenses,
      description: templateDescription,
      incomeItems: incomeTransactions.map(t => ({
        id: uuidv4(),
        description: t.description,
        amount: t.amount,
        category: t.category
      })),
      expenseItems: expenseTransactions.map(t => ({
        id: uuidv4(),
        description: t.description,
        amount: t.amount,
        category: t.category
      }))
    };

    const currentTemplates = userData?.financeModule?.budgetTemplates || [];
    await updateFinanceModule({
      budgetTemplates: [...currentTemplates, newTemplate]
    });

    toast({
      title: "Template créé",
      description: `Le template "${templateName}" a été créé avec succès.`,
    });

    setTemplateName('');
    setTemplateDescription('');
    setIsCreateTemplateOpen(false);
  };

  // Nouvelle fonction pour appliquer un template de revenus
  const applyIncomeTemplate = () => {
    if (!selectedTemplateId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un template.",
        variant: "destructive"
      });
      return;
    }

    const template = userData?.financeModule?.budgetTemplates.find(t => t.id === selectedTemplateId);
    
    if (!template || !template.incomeItems || template.incomeItems.length === 0) {
      toast({
        title: "Information",
        description: "Ce template ne contient pas de revenus à ajouter.",
      });
      return;
    }
    
    const newTransactions: Transaction[] = template.incomeItems.map(item => ({
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      description: item.description,
      amount: item.amount,
      category: item.category,
      type: 'income',
      month: month,
      isVerified: false
    }));
    
    const updatedTransactions = [...transactions, ...newTransactions];
    const updatedData = recalculateTotals(updatedTransactions);
    
    updateMonthData(updatedData);
    
    toast({
      title: "Template appliqué",
      description: `${newTransactions.length} revenus ont été ajoutés depuis le template "${template.name}".`,
    });
    
    setSelectedTemplateId('');
    setIsApplyIncomeTemplateOpen(false);
  };
  
  // Nouvelle fonction pour appliquer un template de dépenses
  const applyExpenseTemplate = () => {
    if (!selectedTemplateId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un template.",
        variant: "destructive"
      });
      return;
    }

    const template = userData?.financeModule?.budgetTemplates.find(t => t.id === selectedTemplateId);
    
    if (!template || !template.expenseItems || template.expenseItems.length === 0) {
      toast({
        title: "Information",
        description: "Ce template ne contient pas de dépenses à ajouter.",
      });
      return;
    }
    
    const newTransactions: Transaction[] = template.expenseItems.map(item => ({
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      description: item.description,
      amount: item.amount,
      category: item.category,
      type: 'expense',
      month: month,
      isVerified: false
    }));
    
    const updatedTransactions = [...transactions, ...newTransactions];
    const updatedData = recalculateTotals(updatedTransactions);
    
    updateMonthData(updatedData);
    
    toast({
      title: "Template appliqué",
      description: `${newTransactions.length} dépenses ont été ajoutées depuis le template "${template.name}".`,
    });
    
    setSelectedTemplateId('');
    setIsApplyExpenseTemplateOpen(false);
  };

  // Afficher les revenus récents
  const toggleRecentIncomes = () => {
    setShowRecentIncomes(!showRecentIncomes);
  };

  // Afficher les dépenses récentes
  const toggleRecentExpenses = () => {
    setShowRecentExpenses(!showRecentExpenses);
  };

  // Préparation des données récentes
  const recentIncomes = transactions
    .filter(t => t.type === 'income')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
    
  const recentExpenses = transactions
    .filter(t => t.type === 'expense')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">      
      <div className="flex justify-end mb-4">
        <Dialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Save size={16} />
              <span>Créer template</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un template</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="templateName" className="text-right">Nom</Label>
                <Input
                  id="templateName"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="col-span-3"
                  placeholder="Ex: Budget mensuel standard"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="templateDescription" className="text-right">Description</Label>
                <Textarea
                  id="templateDescription"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="col-span-3"
                  placeholder="Description du template (optionnel)"
                />
              </div>
              <div className="col-span-4 mt-2">
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-md text-sm text-amber-700">
                  <p>Ce template contiendra :</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>{transactions.filter(t => t.type === 'income').length} revenus pour un total de {transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)} €</li>
                    <li>{transactions.filter(t => t.type === 'expense').length} dépenses pour un total de {transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)} €</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCreateTemplate}>Créer template</Button>
            </div>
          </DialogContent>
        </Dialog>
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
              {transactions?.filter(t => t.type === 'income').length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <span>Vous n'avez pas encore ajouté de revenus ce mois-ci.</span>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Sources de revenus récentes :</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={toggleRecentIncomes}
                      className="text-xs"
                    >
                      <List size={14} className="mr-1" />
                      {showRecentIncomes ? "Masquer la liste" : "Voir tous"}
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {transactions
                      ?.filter(t => t.type === 'income')
                      .slice(0, showRecentIncomes ? undefined : 5)
                      .map(income => (
                        <div key={income.id} className="flex justify-between items-center p-2 border rounded hover:bg-muted/50">
                          <div>
                            <p className="font-medium text-sm">{income.description}</p>
                            <p className="text-xs text-muted-foreground">{income.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {editingTransaction && editingTransaction.id === income.id ? (
                              <>
                                <Input
                                  type="number"
                                  value={editingTransaction.amount}
                                  onChange={handleEditAmountChange}
                                  className="w-24 h-8"
                                  min={0}
                                />
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={saveEditedTransaction}
                                >
                                  <CheckIcon size={16} className="text-green-500" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <span className="text-green-600 font-medium">{income.amount} €</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => startEditTransaction(income)}
                                >
                                  <Edit2 size={16} className="text-blue-500" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => deleteTransaction(income.id)}
                                >
                                  <Trash2 size={16} className="text-red-500" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <Plus size={14} className="mr-2" />
                      Ajouter un revenu
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un revenu</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="incomeDescription" className="text-right">Description</Label>
                        <Input
                          id="incomeDescription"
                          name="description"
                          value={newIncome.description}
                          onChange={handleIncomeChange}
                          className="col-span-3"
                          placeholder="Salaire, Freelance, etc."
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="incomeAmount" className="text-right">Montant (€)</Label>
                        <Input
                          id="incomeAmount"
                          name="amount"
                          type="number"
                          value={newIncome.amount}
                          onChange={handleIncomeChange}
                          className="col-span-3"
                          min={0}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="incomeCategory" className="text-right">Catégorie</Label>
                        <div className="col-span-3">
                          <Select 
                            value={newIncome.category} 
                            onValueChange={handleIncomeCategoryChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choisissez une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                              {incomeCategories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={addIncome}>Ajouter</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <Save size={14} className="mr-2" />
                      Créer template revenu
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Créer template de revenus</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="incomeTemplateName" className="text-right">Nom</Label>
                        <Input
                          id="incomeTemplateName"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                          className="col-span-3"
                          placeholder="Ex: Revenus mensuels"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="incomeTemplateDescription" className="text-right">Description</Label>
                        <Textarea
                          id="incomeTemplateDescription"
                          value={templateDescription}
                          onChange={(e) => setTemplateDescription(e.target.value)}
                          className="col-span-3"
                          placeholder="Description du template (optionnel)"
                        />
                      </div>
                      <div className="col-span-4 mt-2">
                        <div className="p-3 bg-green-50 border border-green-100 rounded-md text-sm text-green-700">
                          <p>Ce template contiendra :</p>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>{transactions.filter(t => t.type === 'income').length} revenus pour un total de {transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)} €</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleCreateTemplate}>Créer template</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={isApplyIncomeTemplateOpen} onOpenChange={setIsApplyIncomeTemplateOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <Download size={14} className="mr-2" />
                      Utiliser template
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Appliquer un template de revenus</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="incomeTemplate" className="text-right">Template</Label>
                        <div className="col-span-3">
                          <Select 
                            value={selectedTemplateId} 
                            onValueChange={setSelectedTemplateId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choisissez un template" />
                            </SelectTrigger>
                            <SelectContent>
                              {userData?.financeModule?.budgetTemplates.map(template => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {selectedTemplateId && (
                        <div className="col-span-4 mt-2">
                          <div className="p-3 bg-green-50 border border-green-100 rounded-md text-sm">
                            {(() => {
                              const template = userData?.financeModule?.budgetTemplates.find(
                                t => t.id === selectedTemplateId
                              );
                              
                              if (!template) return <p>Template introuvable</p>;
                              
                              const incomeItems = template.incomeItems || [];
                              
                              return (
                                <>
                                  <p className="font-medium mb-2">Contenu du template :</p>
                                  {incomeItems.length === 0 ? (
                                    <p>Ce template ne contient pas de revenus</p>
                                  ) : (
                                    <div className="space-y-2">
                                      <p>{incomeItems.length} revenus pour un total de {template.income} €</p>
                                      <ul className="list-disc list-inside space-y-1">
                                        {incomeItems.map((item, idx) => (
                                          <li key={idx} className="text-xs">
                                            {item.description}: {item.amount} € ({item.category})
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={applyIncomeTemplate}>Appliquer le template</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between">
            <span className="text-xs text-muted-foreground">
              Revenu mensuel total: {
                transactions
                  ?.filter(t => t.type === 'income')
                  .reduce((sum, t) => sum + t.amount, 0) || 0
              } €
            </span>
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
              {transactions?.filter(t => t.type === 'expense').length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <span>Vous n'avez pas encore ajouté de dépenses ce mois-ci.</span>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Dépenses récentes :</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={toggleRecentExpenses}
                      className="text-xs"
                    >
                      <List size={14} className="mr-1" />
                      {showRecentExpenses ? "Masquer la liste" : "Voir tous"}
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {transactions
                      ?.filter(t => t.type === 'expense')
                      .slice(0, showRecentExpenses ? undefined : 5)
                      .map(expense => (
                        <div key={expense.id} className="flex justify-between items-center p-2 border rounded hover:bg-muted/50">
                          <div>
                            <p className="font-medium text-sm">{expense.description}</p>
                            <p className="text-xs text-muted-foreground">{expense.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {editingTransaction && editingTransaction.id === expense.id ? (
                              <>
                                <Input
                                  type="number"
                                  value={editingTransaction.amount}
                                  onChange={handleEditAmountChange}
                                  className="w-24 h-8"
                                  min={0}
                                />
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={saveEditedTransaction}
                                >
                                  <CheckIcon size={16} className="text-green-500" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <span className="text-red-600 font-medium">{expense.amount} €</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => startEditTransaction(expense)}
                                >
                                  <Edit2 size={16} className="text-blue-500" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => deleteTransaction(expense.id)}
                                >
                                  <Trash2 size={16} className="text-red-500" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <Plus size={14} className="mr-2" />
                      Ajouter une dépense
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter une dépense</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="expenseDescription" className="text-right">Description</Label>
                        <Input
                          id="expenseDescription"
                          name="description"
                          value={newExpense.description}
                          onChange={handleExpenseChange}
                          className="col-span-3"
                          placeholder="Loyer, Courses, etc."
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="expenseAmount" className="text-right">Montant (€)</Label>
                        <Input
                          id="expenseAmount"
                          name="amount"
                          type="number"
                          value={newExpense.amount}
                          onChange={handleExpenseChange}
                          className="col-span-3"
                          min={0}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="expenseCategory" className="text-right">Catégorie</Label>
                        <div className="col-span-3">
                          <Select 
                            value={newExpense.category} 
                            onValueChange={handleExpenseCategoryChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choisissez une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                              {expenseCategories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={addExpense}>Ajouter</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <Save size={14} className="mr-2" />
                      Créer template dépense
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Créer template de dépenses</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="expenseTemplateName" className="text-right">Nom</Label>
                        <Input
                          id="expenseTemplateName"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                          className="col-span-3"
                          placeholder="Ex: Dépenses mensuelles"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="expenseTemplateDescription" className="text-right">Description</Label>
                        <Textarea
                          id="expenseTemplateDescription"
                          value={templateDescription}
                          onChange={(e) => setTemplateDescription(e.target.value)}
                          className="col-span-3"
                          placeholder="Description du template (optionnel)"
                        />
                      </div>
                      <div className="col-span-4 mt-2">
                        <div className="p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-700">
                          <p>Ce template contiendra :</p>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>{transactions.filter(t => t.type === 'expense').length} dépenses pour un total de {transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)} €</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleCreateTemplate}>Créer template</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={isApplyExpenseTemplateOpen} onOpenChange={setIsApplyExpenseTemplateOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <Download size={14} className="mr-2" />
                      Utiliser template
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Appliquer un template de dépenses</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="expenseTemplate" className="text-right">Template</Label>
                        <div className="col-span-3">
                          <Select 
                            value={selectedTemplateId} 
                            onValueChange={setSelectedTemplateId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choisissez un template" />
                            </SelectTrigger>
                            <SelectContent>
                              {userData?.financeModule?.budgetTemplates.map(template => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {selectedTemplateId && (
                        <div className="col-span-4 mt-2">
                          <div className="p-3 bg-red-50 border border-red-100 rounded-md text-sm">
                            {(() => {
                              const template = userData?.financeModule?.budgetTemplates.find(
                                t => t.id === selectedTemplateId
                              );
                              
                              if (!template) return <p>Template introuvable</p>;
                              
                              const expenseItems = template.expenseItems || [];
                              
                              return (
                                <>
                                  <p className="font-medium mb-2">Contenu du template :</p>
                                  {expenseItems.length === 0 ? (
                                    <p>Ce template ne contient pas de dépenses</p>
                                  ) : (
                                    <div className="space-y-2">
                                      <p>{expenseItems.length} dépenses pour un total de {template.expenses} €</p>
                                      <ul className="list-disc list-inside space-y-1">
                                        {expenseItems.map((item, idx) => (
                                          <li key={idx} className="text-xs">
                                            {item.description}: {item.amount} € ({item.category})
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={applyExpenseTemplate}>Appliquer le template</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between">
            <span className="text-xs text-muted-foreground">
              Dépense mensuelle totale: {
                transactions
                  ?.filter(t => t.type === 'expense')
                  .reduce((sum, t) => sum + t.amount, 0) || 0
              } €
            </span>
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
