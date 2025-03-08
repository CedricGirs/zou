
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AddIncomeDialogProps {
  newIncome: {
    description: string;
    amount: number;
    category: string;
  };
  handleIncomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIncomeCategoryChange: (value: string) => void;
  addIncome: () => Promise<void>;
  incomeCategories: string[];
}

const AddIncomeDialog: React.FC<AddIncomeDialogProps> = ({
  newIncome,
  handleIncomeChange,
  handleIncomeCategoryChange,
  addIncome,
  incomeCategories
}) => {
  return (
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
  );
};

export default AddIncomeDialog;
