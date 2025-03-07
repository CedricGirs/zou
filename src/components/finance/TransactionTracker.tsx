
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter 
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUserData, Transaction } from "@/context/UserDataContext";
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MonthlyData } from "@/types/FinanceTypes";

// Import our new components
import TransactionForm from './transaction/TransactionForm';
import EmptyTransactionState from './transaction/EmptyTransactionState';
import TransactionList from './transaction/TransactionList';
import TransactionSummary from './transaction/TransactionSummary';
import { recalculateTotals, filterTransactions, preparePieChartData } from './transaction/transactionUtils';

interface TransactionTrackerProps {
  selectedMonth: string;
  transactions: Transaction[];
  updateMonthData: (data: any) => void;
  completeQuestStep?: (questId: string, progress: number) => Promise<void>;
  addTransaction: (transaction: any) => Promise<MonthlyData>;
}

const TransactionTracker = ({ 
  selectedMonth, 
  transactions, 
  updateMonthData,
  completeQuestStep 
}: TransactionTrackerProps) => {
  const { userData, updateFinanceModule } = useUserData();
  
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    category: 'Autre',
    type: 'expense',
    month: selectedMonth,
    isVerified: false
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tous');

  const categories = [
    'Logement', 'Alimentation', 'Transport', 'Loisirs', 
    'Santé', 'Éducation', 'Vêtements', 'Cadeaux', 'Autre'
  ];
  
  // Update new transaction when selected month changes
  useEffect(() => {
    setNewTransaction(prev => ({
      ...prev,
      month: selectedMonth
    }));
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
      month: selectedMonth,
      isVerified: newTransaction.isVerified
    };

    // Mise à jour des transactions
    const updatedTransactions = [...transactions, transaction];
    const updatedData = recalculateTotals(updatedTransactions);
    
    // Mettre à jour les données du mois actuel
    updateMonthData(updatedData);
    
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
      month: selectedMonth,
      isVerified: false
    });
  };

  const handleDeleteTransaction = async (id: string) => {
    // Mettre à jour les transactions
    const updatedTransactions = transactions.filter(t => t.id !== id);
    const updatedData = recalculateTotals(updatedTransactions);
    
    // Mettre à jour les données du mois actuel
    updateMonthData(updatedData);
    
    toast({
      title: "Transaction supprimée",
      description: "La transaction a été supprimée avec succès."
    });
  };

  // Filter transactions
  const filteredTransactions = filterTransactions(transactions, categoryFilter, searchTerm);
  
  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Prepare data for pie chart
  const pieChartData = preparePieChartData(filteredTransactions, categories);

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
                  <TransactionForm
                    newTransaction={newTransaction}
                    handleInputChange={handleInputChange}
                    handleCheckboxChange={handleCheckboxChange}
                    handleCategoryChange={handleCategoryChange}
                    handleTypeChange={handleTypeChange}
                    handleAddTransaction={handleAddTransaction}
                    categories={categories}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <EmptyTransactionState
              selectedMonth={selectedMonth}
              newTransaction={newTransaction}
              handleInputChange={handleInputChange}
              handleCheckboxChange={handleCheckboxChange}
              handleCategoryChange={handleCategoryChange}
              handleTypeChange={handleTypeChange}
              handleAddTransaction={handleAddTransaction}
              categories={categories}
            />
          ) : (
            <>
              <TransactionSummary
                filteredTransactions={filteredTransactions}
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                pieChartData={pieChartData}
                handleDeleteTransaction={handleDeleteTransaction}
              />
              
              <TransactionList
                transactions={filteredTransactions}
                handleDeleteTransaction={handleDeleteTransaction}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionTracker;
