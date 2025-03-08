
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from 'lucide-react';
import { Transaction } from "@/context/userData";

interface TemplateCreationDialogProps {
  isCreateTemplateOpen: boolean;
  setIsCreateTemplateOpen: (isOpen: boolean) => void;
  templateName: string;
  setTemplateName: (name: string) => void;
  templateDescription: string;
  setTemplateDescription: (description: string) => void;
  handleCreateTemplate: () => Promise<void>;
  transactions: Transaction[];
}

const TemplateCreationDialog: React.FC<TemplateCreationDialogProps> = ({
  isCreateTemplateOpen,
  setIsCreateTemplateOpen,
  templateName,
  setTemplateName,
  templateDescription,
  setTemplateDescription,
  handleCreateTemplate,
  transactions
}) => {
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  return (
    <Dialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Save size={16} />
          <span>Créer template</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un template</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="templateName" className="text-right">Nom</Label>
            <Input
              id="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="col-span-3"
              placeholder="Ex: Budget mensuel standard"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="templateDescription" className="text-right">Description</Label>
            <Textarea
              id="templateDescription"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              className="col-span-3"
              placeholder="Description du template (optionnel)"
            />
          </div>
          <div className="col-span-4 mt-2">
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-md text-sm text-amber-700">
              <p>Ce template contiendra :</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>{incomeTransactions.length} revenus pour un total de {incomeTransactions.reduce((sum, t) => sum + t.amount, 0)} €</li>
                <li>{expenseTransactions.length} dépenses pour un total de {expenseTransactions.reduce((sum, t) => sum + t.amount, 0)} €</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleCreateTemplate}>Créer template</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateCreationDialog;
