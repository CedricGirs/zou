
import React from 'react';
import { DollarSign, ArrowUp, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface IncomeCardProps {
  income: number;
  selectedMonth: string;
  onSaveIncome: (value: number) => void;
}

const IncomeCard = ({ income, selectedMonth, onSaveIncome }: IncomeCardProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [incomeValue, setIncomeValue] = React.useState(income);

  const handleOpenDialog = () => {
    setIncomeValue(income);
    setIsEditing(true);
  };

  const handleSave = () => {
    onSaveIncome(incomeValue);
    setIsEditing(false);
  };

  return (
    <>
      <Card 
        onClick={handleOpenDialog}
        className="hover:shadow-md transition-all cursor-pointer relative group overflow-hidden"
      >
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green-400 to-green-600"></div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit size={16} />
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
              <DollarSign size={20} />
            </div>
            <CardTitle>Revenus du mois</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total des revenus pour {selectedMonth}</p>
              <p className="text-2xl font-bold">{income} €</p>
            </div>
            <div className={`flex items-center text-sm ${income > 0 ? 'text-green-500' : 'text-gray-400'}`}>
              <ArrowUp size={16} className="mr-1" />
              <span>Entrées</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les revenus</DialogTitle>
            <DialogDescription>
              Définissez vos revenus pour {selectedMonth}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="income" className="text-right">
                Montant
              </Label>
              <Input
                id="income"
                type="number"
                value={incomeValue}
                onChange={(e) => setIncomeValue(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IncomeCard;
