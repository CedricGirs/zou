
import React, { useState, useEffect } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Filter, Search, CreditCard, ArrowUpDown, Download, CalendarDays } from 'lucide-react';
import { useUserData, Transaction } from "@/context/UserDataContext";
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TransactionTrackerProps {
  selectedMonth?: string;
  completeQuestStep?: (questId: string, progress: number) => Promise<void>;
}

const TransactionTracker = ({ selectedMonth, completeQuestStep }: TransactionTrackerProps) => {
  const { userData, updateFinanceModule } = useUserData();
  const transactions = userData?.financeModule?.transactions || [];
  
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    category: 'Autre',
    type: 'expense',
    month: selectedMonth || new Date().toLocaleString('fr-FR', { month: 'long' }),
    isVerified: false
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tous');

  const categories = [
    'Logement', 'Alimentation', 'Transport', 'Loisirs', 
    'Santé', 'Éducation', 'Vêtements', 'Cadeaux', 'Autre'
  ];
  
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const [filterMonth, setFilterMonth] = useState(selectedMonth || new Date().toLocaleString('fr-FR', { month: 'long' }));
  
  // Update new transaction when selected month changes
  useEffect(() => {
    if (selectedMonth) {
      setFilterMonth(selectedMonth);
      setNewTransaction(prev => ({
        ...prev,
        month: selectedMonth
      }));
    }
  }, [selectedMonth]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setNewTransaction({
      ...newTransaction,
      isVerified: checked
    });
  };

  const handleCategoryChange = (value: string) => {
    setNewTransaction({
      ...newTransaction,
      category: value
    });
  };

  const handleMonthChange = (value: string) => {
    setNewTransaction({
      ...newTransaction,
      month: value
    });
  };

  const handleTypeChange = (value: 'income' | 'expense') => {
    setNewTransaction({
      ...newTransaction,
      type: value
    });
  };

  const handleAddTransaction = async () => {
    // Validation
    if (!newTransaction.description || !newTransaction.date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    const transaction: Transaction = {
      id: uuidv4(),
      date: newTransaction.date || format(new Date(), 'yyyy-MM-dd'),
      description: newTransaction.description || '',
      amount: newTransaction.amount || 0,
      category: newTransaction.category || 'Autre',
      type: newTransaction.type || 'expense',
      month: newTransaction.month,
      isVerified: newTransaction.isVerified
    };

    const updatedTransactions = [...transactions, transaction];
    
    await updateFinanceModule({ transactions: updatedTransactions });
    
    // Aussi mettre à jour les dépenses/revenus mensuels
    if (transaction.type === 'expense') {
      const newMonthlyExpenses = (userData?.financeModule?.monthlyExpenses || 0) + transaction.amount;
      await updateFinanceModule({ 
        monthlyExpenses: newMonthlyExpenses,
        balance: (userData?.financeModule?.monthlyIncome || 0) - newMonthlyExpenses
      });
    } else {
      const newMonthlyIncome = (userData?.financeModule?.monthlyIncome || 0) + transaction.amount;
      await updateFinanceModule({ 
        monthlyIncome: newMonthlyIncome,
        balance: newMonthlyIncome - (userData?.financeModule?.monthlyExpenses || 0)
      });
    }
    
    toast({
      title: "Transaction ajoutée",
      description: "La transaction a été ajoutée avec succès."
    });
    
    // Advance quest if applicable
    if (completeQuestStep) {
      const transactionCount = updatedTransactions.length;
      const progress = Math.min((transactionCount / 5) * 100, 100);
      completeQuestStep("track_transactions", progress);
      
      // If this is the first transaction, unlock achievement
      if (transactionCount === 1 && userData?.financeModule?.achievements) {
        const firstTransactionAchievement = userData.financeModule.achievements.find(a => a.id === "first_transaction");
        if (firstTransactionAchievement && !firstTransactionAchievement.completed) {
          const achievements = [...userData.financeModule.achievements];
          const index = achievements.findIndex(a => a.id === "first_transaction");
          if (index !== -1) {
            achievements[index] = { ...achievements[index], completed: true };
            await updateFinanceModule({ achievements });
            
            toast({
              title: "Succès débloqué!",
              description: `Vous avez débloqué: ${achievements[index].name}`,
            });
          }
        }
      }
    }
    
    // Reset form
    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: 0,
      category: 'Autre',
      type: 'expense',
      month: selectedMonth || new Date().toLocaleString('fr-FR', { month: 'long' }),
      isVerified: false
    });
  };

  const handleDeleteTransaction = async (id: string) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    if (!transactionToDelete) return;
    
    const updatedTransactions = transactions.filter(t => t.id !== id);
    await updateFinanceModule({ transactions: updatedTransactions });
    
    // Update monthly income/expenses
    if (transactionToDelete.type === 'expense') {
      const newMonthlyExpenses = (userData?.financeModule?.monthlyExpenses || 0) - transactionToDelete.amount;
      await updateFinanceModule({ 
        monthlyExpenses: newMonthlyExpenses,
        balance: (userData?.financeModule?.monthlyIncome || 0) - newMonthlyExpenses
      });
    } else {
      const newMonthlyIncome = (userData?.financeModule?.monthlyIncome || 0) - transactionToDelete.amount;
      await updateFinanceModule({ 
        monthlyIncome: newMonthlyIncome,
        balance: newMonthlyIncome - (userData?.financeModule?.monthlyExpenses || 0)
      });
    }
    
    toast({
      title: "Transaction supprimée",
      description: "La transaction a été supprimée avec succès."
    });
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Month filter
    if (filterMonth !== 'Tous' && transaction.month !== filterMonth) {
      return false;
    }
    
    // Category filter
    if (categoryFilter !== 'Tous' && transaction.category !== categoryFilter) {
      return false;
    }
    
    // Search term
    if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Prepare data for pie chart
  const pieChartData = categories.map(category => {
    const value = filteredTransactions
      .filter(t => t.category === category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { name: category, value };
  }).filter(item => item.value > 0);

  // Colors for the pie chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Gestion des transactions</CardTitle>
              <CardDescription>Suivez vos revenus et dépenses</CardDescription>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full md:w-40"
                />
              </div>
              
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Mois" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tous">Tous les mois</SelectItem>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tous">Toutes</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center gap-2">
                    <Plus size={16} />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter une transaction</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button" 
                        variant={newTransaction.type === 'expense' ? "destructive" : "outline"}
                        onClick={() => handleTypeChange('expense')}
                        className="w-full"
                      >
                        Dépense
                      </Button>
                      <Button 
                        type="button"
                        variant={newTransaction.type === 'income' ? "default" : "outline"}
                        onClick={() => handleTypeChange('income')}
                        className="w-full"
                      >
                        Revenu
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={newTransaction.date}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="month" className="text-right">Mois</Label>
                      <div className="col-span-3">
                        <Select 
                          value={newTransaction.month} 
                          onValueChange={handleMonthChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner un mois" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map(month => (
                              <SelectItem key={month} value={month}>{month}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">Description</Label>
                      <Input
                        id="description"
                        name="description"
                        value={newTransaction.description}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount" className="text-right">Montant</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={newTransaction.amount}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">Catégorie</Label>
                      <div className="col-span-3">
                        <Select 
                          value={newTransaction.category} 
                          onValueChange={handleCategoryChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <div className="col-span-4 flex items-center space-x-2">
                        <Checkbox 
                          id="isVerified" 
                          checked={newTransaction.isVerified}
                          onCheckedChange={handleCheckboxChange}
                        />
                        <Label htmlFor="isVerified">Vérifié avec la banque</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleAddTransaction}>
                      Ajouter la transaction
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center p-6 border border-dashed rounded-md">
              <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-medium">
                Aucune transaction pour {filterMonth === 'Tous' ? 'cette période' : filterMonth}.
              </p>
              <p className="text-muted-foreground text-sm mt-1 mb-4">
                Ajoutez votre première transaction en cliquant sur le bouton "Ajouter".
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus size={16} className="mr-2" />
                    Ajouter une transaction
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  {/* Contenu de la fenêtre modale - identique à celui ci-dessus */}
                  <DialogHeader>
                    <DialogTitle>Ajouter une transaction</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button" 
                        variant={newTransaction.type === 'expense' ? "destructive" : "outline"}
                        onClick={() => handleTypeChange('expense')}
                        className="w-full"
                      >
                        Dépense
                      </Button>
                      <Button 
                        type="button"
                        variant={newTransaction.type === 'income' ? "default" : "outline"}
                        onClick={() => handleTypeChange('income')}
                        className="w-full"
                      >
                        Revenu
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date2" className="text-right">Date</Label>
                      <Input
                        id="date2"
                        name="date"
                        type="date"
                        value={newTransaction.date}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="month2" className="text-right">Mois</Label>
                      <div className="col-span-3">
                        <Select 
                          value={newTransaction.month} 
                          onValueChange={handleMonthChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner un mois" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map(month => (
                              <SelectItem key={month} value={month}>{month}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description2" className="text-right">Description</Label>
                      <Input
                        id="description2"
                        name="description"
                        value={newTransaction.description}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount2" className="text-right">Montant</Label>
                      <Input
                        id="amount2"
                        name="amount"
                        type="number"
                        value={newTransaction.amount}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category2" className="text-right">Catégorie</Label>
                      <div className="col-span-3">
                        <Select 
                          value={newTransaction.category} 
                          onValueChange={handleCategoryChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <div className="col-span-4 flex items-center space-x-2">
                        <Checkbox 
                          id="isVerified2" 
                          checked={newTransaction.isVerified}
                          onCheckedChange={handleCheckboxChange}
                        />
                        <Label htmlFor="isVerified2">Vérifié avec la banque</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleAddTransaction}>
                      Ajouter la transaction
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Card className="p-4 bg-green-50 border-green-100">
                      <p className="text-sm text-muted-foreground mb-1">Total revenus</p>
                      <p className="text-xl font-semibold text-green-600">{totalIncome} €</p>
                    </Card>
                    
                    <Card className="p-4 bg-red-50 border-red-100">
                      <p className="text-sm text-muted-foreground mb-1">Total dépenses</p>
                      <p className="text-xl font-semibold text-red-600">{totalExpenses} €</p>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Répartition des dépenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {pieChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value} €`} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-center text-muted-foreground p-4">
                          Pas assez de données pour afficher un graphique
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Transactions récentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {filteredTransactions.slice(0, 10).map(transaction => (
                        <div 
                          key={transaction.id} 
                          className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {transaction.type === 'income' ? (
                                <ArrowUp size={16} />
                              ) : (
                                <ArrowDown size={16} />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{transaction.description}</p>
                              <p className="text-xs text-muted-foreground">{transaction.date} - {transaction.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}{transaction.amount} €
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteTransaction(transaction.id)}
                            >
                              <Trash2 size={14} className="text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2 text-left">Date</th>
                      <th className="border p-2 text-left">Description</th>
                      <th className="border p-2 text-left">Catégorie</th>
                      <th className="border p-2 text-right">Montant</th>
                      <th className="border p-2 text-center">Type</th>
                      <th className="border p-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-muted/50">
                        <td className="border p-2">{transaction.date}</td>
                        <td className="border p-2">{transaction.description}</td>
                        <td className="border p-2">{transaction.category}</td>
                        <td className="border p-2 text-right">{transaction.amount} €</td>
                        <td className="border p-2 text-center">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            transaction.type === 'income' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {transaction.type === 'income' ? 'Revenu' : 'Dépense'}
                          </span>
                        </td>
                        <td className="border p-2 text-center">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteTransaction(transaction.id)}
                          >
                            <Trash2 size={14} className="text-muted-foreground" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionTracker;
