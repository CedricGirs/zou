
import React, { useState } from 'react';
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, CreditCard, Filter, Calendar, Info, DollarSign } from 'lucide-react';
import { useUserData, Transaction } from "@/context/UserDataContext";
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const TransactionTracker = () => {
  const { userData, updateFinanceModule } = useUserData();
  const transactions = userData.financeModule.transactions || [];
  
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
    month: new Date().toLocaleString('fr-FR', { month: 'long' }),
    description: '',
    amount: 0,
    category: 'Autre',
    isVerified: false
  });

  const categories = [
    'Logement', 'Alimentation', 'Transport', 'Loisirs', 
    'Santé', 'Éducation', 'Vêtements', 'Cadeaux', 'Autre'
  ];
  
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString('fr-FR', { month: 'long' })
  );

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

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

  const handleAddTransaction = async () => {
    // Validate
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
      date: newTransaction.date || '',
      month: newTransaction.month || '',
      description: newTransaction.description || '',
      amount: newTransaction.amount || 0,
      category: newTransaction.category || 'Autre',
      isVerified: newTransaction.isVerified || false
    };

    const updatedTransactions = [...transactions, transaction];
    
    await updateFinanceModule({ transactions: updatedTransactions });
    
    toast({
      title: "Transaction ajoutée",
      description: "La transaction a été ajoutée avec succès."
    });
    
    // Reset form
    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      month: new Date().toLocaleString('fr-FR', { month: 'long' }),
      description: '',
      amount: 0,
      category: 'Autre',
      isVerified: false
    });
    
    setShowDialog(false);
  };

  const handleDeleteTransaction = async (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    await updateFinanceModule({ transactions: updatedTransactions });
    
    toast({
      title: "Transaction supprimée",
      description: "La transaction a été supprimée avec succès."
    });
  };

  // Filter transactions by month, category and type
  const filteredTransactions = transactions.filter(t => {
    let passesFilter = true;
    
    // Month filter
    if (selectedMonth !== 'Tous') {
      passesFilter = passesFilter && t.month === selectedMonth;
    }
    
    // Category filter
    if (categoryFilter) {
      passesFilter = passesFilter && t.category === categoryFilter;
    }
    
    // Transaction type filter
    if (transactionType === 'revenus') {
      passesFilter = passesFilter && t.amount > 0;
    } else if (transactionType === 'depenses') {
      passesFilter = passesFilter && t.amount < 0;
    }
    
    return passesFilter;
  });

  // Group transactions by category for the pie chart
  const categoryData = filteredTransactions.reduce((acc, transaction) => {
    if (transaction.amount < 0) { // Only include expenses
      const category = transaction.category;
      const amount = Math.abs(transaction.amount);
      
      if (!acc[category]) {
        acc[category] = 0;
      }
      
      acc[category] += amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value
  }));

  // Colors for the pie chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  // Calculate totals for the selected period
  const calculateTotals = () => {
    const expenses = filteredTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    const income = filteredTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      expenses,
      income,
      balance: income - expenses
    };
  };
  
  const { expenses, income, balance } = calculateTotals();

  return (
    <div className="glass-card p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <CreditCard className="mr-2 text-zou-purple" size={20} />
          <h2 className="font-pixel text-lg">Transactions</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <button className="pixel-button flex items-center">
                <Plus size={16} className="mr-1" />
                Ajouter
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une transaction</DialogTitle>
                <DialogDescription>
                  Enregistrez une nouvelle transaction pour suivre vos finances
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
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
                  <div className="col-span-3 relative">
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      value={newTransaction.amount}
                      onChange={handleInputChange}
                      className="pl-8"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">€</span>
                    <div className="text-xs text-muted-foreground mt-1">
                      Utilisez des valeurs positives pour les revenus, négatives pour les dépenses.
                    </div>
                  </div>
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
                    <Label htmlFor="isVerified">Transaction vérifiée avec relevé bancaire</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  className="pixel-button"
                  onClick={handleAddTransaction}
                >
                  Ajouter la transaction
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex items-center">
          <Calendar size={16} className="mr-2 text-muted-foreground" />
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Mois" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Tous les mois</SelectItem>
              {months.map(month => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center">
          <Filter size={16} className="mr-2 text-muted-foreground" />
          <Select 
            value={categoryFilter || ''} 
            onValueChange={(val) => setCategoryFilter(val || null)}
          >
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center">
          <DollarSign size={16} className="mr-2 text-muted-foreground" />
          <Select 
            value={transactionType || ''} 
            onValueChange={(val) => setTransactionType(val || null)}
          >
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous</SelectItem>
              <SelectItem value="revenus">Revenus</SelectItem>
              <SelectItem value="depenses">Dépenses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="pixel-card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <h3 className="text-sm font-medium mb-2">Revenus</h3>
          <div className="font-pixel text-xl text-zou-purple">{income.toLocaleString()} €</div>
        </div>
        
        <div className="pixel-card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <h3 className="text-sm font-medium mb-2">Dépenses</h3>
          <div className="font-pixel text-xl text-zou-orange">{expenses.toLocaleString()} €</div>
        </div>
        
        <div className="pixel-card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <h3 className="text-sm font-medium mb-2">Solde</h3>
          <div className={`font-pixel text-xl ${balance >= 0 ? 'text-zou-green' : 'text-red-500'}`}>
            {balance.toLocaleString()} €
          </div>
        </div>
      </div>
      
      {filteredTransactions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <h3 className="text-sm font-semibold mb-3 px-1">Répartition des dépenses</h3>
              {pieChartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${Number(value).toLocaleString()} €`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Info size={40} className="mx-auto mb-2 opacity-20" />
                    <p>Aucune dépense à afficher pour cette période</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-3 px-1">Dernières transactions</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto px-1 py-2">
                {filteredTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center space-x-3 p-2 border-b">
                    <div className={`w-2 h-10 rounded-full ${transaction.amount >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div className="flex-1">
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('fr-FR')} • {transaction.category}
                      </div>
                    </div>
                    <div className={`font-medium ${transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.amount.toLocaleString()} €
                    </div>
                  </div>
                ))}
                {filteredTransactions.length === 0 && (
                  <div className="text-center text-muted-foreground p-4">
                    Aucune transaction pour cette période
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Date</th>
                  <th className="border p-2 text-left">Description</th>
                  <th className="border p-2 text-right">Montant</th>
                  <th className="border p-2 text-center">Catégorie</th>
                  <th className="border p-2 text-center">Vérifié</th>
                  <th className="border p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-muted/50">
                    <td className="border p-2">
                      {new Date(transaction.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="border p-2">{transaction.description}</td>
                    <td className={`border p-2 text-right ${
                      transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.amount.toLocaleString()} €
                    </td>
                    <td className="border p-2 text-center">
                      <span className="px-2 py-1 rounded-full text-xs bg-muted">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="border p-2 text-center">
                      {transaction.isVerified ? (
                        <CreditCard className="inline-block text-green-500" size={16} />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="border p-2 text-center">
                      <button 
                        className="p-1 rounded hover:bg-muted text-red-500"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center p-10 border border-dashed rounded-md">
          <CreditCard size={40} className="mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground font-medium mb-2">
            Aucune transaction pour {selectedMonth === 'Tous' ? 'cette période' : selectedMonth}
          </p>
          <p className="text-muted-foreground text-sm mb-4">
            Ajoutez votre première transaction en cliquant sur le bouton "Ajouter"
          </p>
          <button 
            className="pixel-button"
            onClick={() => setShowDialog(true)}
          >
            <Plus size={16} className="mr-1 inline-block" />
            Ajouter une transaction
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionTracker;
