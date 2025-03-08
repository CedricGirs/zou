
import React from 'react';
import { Transaction } from "@/context/UserDataContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from 'lucide-react';

interface TransactionFormProps {
  newTransaction: Partial<Transaction>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (checked: boolean) => void;
  handleCategoryChange: (value: string) => void;
  handleTypeChange: (value: 'income' | 'expense') => void;
  handleAddTransaction: () => void;
  categories: string[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  newTransaction,
  handleInputChange,
  handleCheckboxChange,
  handleCategoryChange,
  handleTypeChange,
  handleAddTransaction,
  categories
}) => {
  return (
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
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">Description</Label>
        <Input
          id="description"
          name="description"
          value={newTransaction.description}
          onChange={handleInputChange}
          className="col-span-3"
          required
          placeholder={newTransaction.type === 'income' ? "Salaire, Prime, etc." : "Loyer, Courses, etc."}
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="amount" className="text-right">Montant</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          value={newTransaction.amount || ''}
          onChange={handleInputChange}
          className="col-span-3"
          min={0}
          step="0.01"
          required
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
      
      <div className="flex justify-end">
        <Button onClick={handleAddTransaction}>
          <Plus size={16} className="mr-2" />
          Ajouter la transaction
        </Button>
      </div>
    </div>
  );
};

export default TransactionForm;
