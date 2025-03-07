
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from 'lucide-react';

interface TransactionFormProps {
  type: 'income' | 'expense';
  onAddTransaction: (description: string, amount: number, category: string) => void;
  categories: string[];
  defaultCategory: string;
}

const TransactionForm = ({
  type,
  onAddTransaction,
  categories,
  defaultCategory,
}: TransactionFormProps) => {
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: 0,
    category: defaultCategory,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type: inputType } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: inputType === 'number' ? Number(value) : value
    });
  };

  const handleCategoryChange = (value: string) => {
    setNewTransaction({
      ...newTransaction,
      category: value
    });
  };

  const handleSubmit = () => {
    onAddTransaction(
      newTransaction.description,
      newTransaction.amount,
      newTransaction.category
    );
    
    setNewTransaction({
      description: '',
      amount: 0,
      category: defaultCategory
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mt-4">
          <Plus size={14} className="mr-2" />
          Ajouter {type === 'income' ? 'un revenu' : 'une dépense'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Ajouter {type === 'income' ? 'un revenu' : 'une dépense'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Input
              id="description"
              name="description"
              value={newTransaction.description}
              onChange={handleChange}
              className="col-span-3"
              placeholder={type === 'income' ? "Salaire, Freelance, etc." : "Loyer, Courses, etc."}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Montant (€)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={newTransaction.amount}
              onChange={handleChange}
              className="col-span-3"
              min={0}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Catégorie</Label>
            <div className="col-span-3">
              <Select 
                value={newTransaction.category} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Ajouter</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
