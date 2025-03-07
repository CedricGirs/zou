
import React from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TransactionForm from './TransactionForm';
import { Transaction } from "@/context/UserDataContext";

interface EmptyTransactionStateProps {
  selectedMonth: string;
  newTransaction: Partial<Transaction>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (checked: boolean) => void;
  handleCategoryChange: (value: string) => void;
  handleTypeChange: (value: 'income' | 'expense') => void;
  handleAddTransaction: () => void;
  categories: string[];
}

const EmptyTransactionState: React.FC<EmptyTransactionStateProps> = ({
  selectedMonth,
  newTransaction,
  handleInputChange,
  handleCheckboxChange,
  handleCategoryChange,
  handleTypeChange,
  handleAddTransaction,
  categories
}) => {
  return (
    <div className="text-center p-6 border border-dashed rounded-md">
      <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-muted-foreground font-medium">
        Aucune transaction pour {selectedMonth}.
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
  );
};

export default EmptyTransactionState;
