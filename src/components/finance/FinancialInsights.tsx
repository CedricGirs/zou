
import React, { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Transaction } from "@/context/UserDataContext";
import { AlertCircle, TrendingUp, TrendingDown, ArrowRight, Trophy, Target, BadgeDollarSign, Plus, Trash2, Edit2, Check as CheckIcon } from 'lucide-react';
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

interface FinancialInsightsProps {
  transactions: Transaction[];
  month: string;
  addTransaction?: (transaction: Transaction) => void;
  deleteTransaction?: (transactionId: string) => void;
}

const FinancialInsights = ({ 
  transactions, 
  month, 
  addTransaction,
  deleteTransaction 
}: FinancialInsightsProps) => {
  const { userData } = useUserData();
  
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
  
  // Ajouter revenu
  const handleAddIncome = () => {
    if (!newIncome.description || newIncome.amount <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs correctement.",
        variant: "destructive"
      });
      return;
    }
    
    // Créer une transaction de type revenu
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
    
    // Utiliser la fonction d'ajout passée en props si disponible
    if (addTransaction) {
      addTransaction(transaction);
    }
    
    toast({
      title: "Revenu ajouté",
      description: `${newIncome.description} : ${newIncome.amount}€ a été ajouté avec succès.`
    });
    
    // Réinitialiser le formulaire
    setNewIncome({
      description: '',
      amount: 0,
      category: 'Salaire'
    });
  };
  
  // Ajouter dépense
  const handleAddExpense = () => {
    if (!newExpense.description || newExpense.amount <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs correctement.",
        variant: "destructive"
      });
      return;
    }
    
    // Créer une transaction de type dépense
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
    
    // Utiliser la fonction d'ajout passée en props si disponible
    if (addTransaction) {
      addTransaction(transaction);
    }
    
    toast({
      title: "Dépense ajoutée",
      description: `${newExpense.description} : ${newExpense.amount}€ a été ajoutée avec succès.`
    });
    
    // Réinitialiser le formulaire
    setNewExpense({
      description: '',
      amount: 0,
      category: 'Logement'
    });
  };

  // Fonction pour supprimer une transaction
  const handleDeleteTransaction = (transactionId: string, type: 'income' | 'expense') => {
    // Utiliser la fonction de suppression passée en props si disponible
    if (deleteTransaction) {
      deleteTransaction(transactionId);
      
      toast({
        title: type === 'income' ? "Revenu supprimé" : "Dépense supprimée",
        description: `La transaction a été supprimée avec succès.`
      });
    }
  };

  // Fonction pour commencer à éditer une transaction
  const startEditTransaction = (transaction: Transaction) => {
    setEditingTransaction({
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type
    });
  };

  // Fonction pour sauvegarder une transaction éditée
  const saveEditedTransaction = async () => {
    if (!editingTransaction) return;

    // Cette fonctionnalité n'est pas encore implémentée avec le nouveau système
    // Il faudrait ajouter une fonction updateTransaction dans les props
    
    toast({
      title: "Fonctionnalité indisponible",
      description: `La modification des transactions n'est pas encore disponible.`,
      variant: "destructive"
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

  return (
    <div className="space-y-6">      
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
                  <p className="text-sm font-medium">Sources de revenus récentes :</p>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {transactions
                      ?.filter(t => t.type === 'income')
                      .slice(0, 5)
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
                                  onClick={() => handleDeleteTransaction(income.id, 'income')}
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
                    <Button onClick={handleAddIncome}>Ajouter</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between">
            <span className="text-xs text-muted-foreground">Revenu mensuel total: {
              transactions
                ?.filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0)
            } €</span>
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
                  <p className="text-sm font-medium">Dépenses récentes :</p>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {transactions
                      ?.filter(t => t.type === 'expense')
                      .slice(0, 5)
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
                                  onClick={() => handleDeleteTransaction(expense.id, 'expense')}
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
                    <Button onClick={handleAddExpense}>Ajouter</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between">
            <span className="text-xs text-muted-foreground">Dépense mensuelle totale: {
              transactions
                ?.filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)
            } €</span>
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
