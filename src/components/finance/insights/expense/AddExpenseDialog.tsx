
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

interface AddExpenseDialogProps {
  newExpense: {
    description: string;
    amount: number;
    category: string;
  };
  handleExpenseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExpenseCategoryChange: (value: string) => void;
  addExpense: () => Promise<void>;
  expenseCategories: string[];
}

const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  newExpense,
  handleExpenseChange,
  handleExpenseCategoryChange,
  addExpense,
  expenseCategories
}) => {
  const [open, setOpen] = React.useState(false);
  
  const handleSubmit = async () => {
    if (!newExpense.description || newExpense.amount <= 0) {
      return;
    }
    
    await addExpense();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
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
        <DialogFooter>
          <Button onClick={handleSubmit}>Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;
