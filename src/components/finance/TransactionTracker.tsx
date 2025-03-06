
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
}

const TransactionTracker = ({ selectedMonth }: TransactionTrackerProps) => {
  const { userData, updateFinanceModule } = useUserData();
  const transactions: Transaction[] = []; // Tableau vide pour réinitialiser
  
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
    month: new Date().toLocaleString('fr-FR', { month: 'long' }),
    description: '',
    amount: 0,
    category: 'Autre',
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
      month: newTransaction.month || format(new Date(), 'MMMM', { locale: fr }),
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
  };

  // Filter transactions - empty for reset
  const filteredTransactions: Transaction[] = [];

  // Empty pie chart data
  const pieChartData = [
    { name: 'Logement', value: 0 },
    { name: 'Alimentation', value: 0 },
    { name: 'Transport', value: 0 },
    { name: 'Loisirs', value: 0 },
    { name: 'Autre', value: 0 }
  ];

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
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionTracker;
