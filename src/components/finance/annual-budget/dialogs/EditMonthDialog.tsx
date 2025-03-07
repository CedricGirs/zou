import React from 'react';
import { DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EditMonthDialogProps {
  selectedMonth: string | null;
  monthlyIncome: number;
  monthlyExpenses: number;
  setMonthlyIncome: (value: number) => void;
  setMonthlyExpenses: (value: number) => void;
  handleSaveMonth: () => void;
  setSelectedMonth: (month: string | null) => void;
  formatCurrency: (value: number) => string;
  showApplyTemplateDialog: boolean;
}

const EditMonthDialog = ({
  selectedMonth,
  monthlyIncome,
  monthlyExpenses,
  setMonthlyIncome,
  setMonthlyExpenses,
  handleSaveMonth,
  setSelectedMonth,
  formatCurrency,
  showApplyTemplateDialog
}: EditMonthDialogProps) => {
  return (
    <Dialog open={!!selectedMonth && !showApplyTemplateDialog} onOpenChange={(open) => !open && setSelectedMonth(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le budget de {selectedMonth}</DialogTitle>
          <DialogDescription>
            Ajustez les revenus et dépenses pour ce mois
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="income" className="flex items-center gap-2">
                <ArrowUp size={16} className="text-green-500" />
                Revenus mensuels
              </Label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="income"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expenses" className="flex items-center gap-2">
                <ArrowDown size={16} className="text-red-500" />
                Dépenses mensuelles
              </Label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="expenses"
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Summary calculation */}
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Épargne mensuelle:</span>
                <span className={cn(
                  "font-pixel text-lg",
                  monthlyIncome - monthlyExpenses > 0 ? "text-green-600" : 
                  monthlyIncome - monthlyExpenses < 0 ? "text-red-600" : ""
                )}>
                  {formatCurrency(monthlyIncome - monthlyExpenses)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => setSelectedMonth(null)}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSaveMonth}
          >
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditMonthDialog;
