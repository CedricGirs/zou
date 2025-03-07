import React from 'react';
import { DollarSign, ArrowUp, ArrowDown, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TemplateDialogProps {
  isTemplateDialogOpen: boolean;
  setIsTemplateDialogOpen: (open: boolean) => void;
  templateName: string;
  setTemplateName: (name: string) => void;
  templateIncome: number;
  setTemplateIncome: (income: number) => void;
  templateExpenses: number;
  setTemplateExpenses: (expenses: number) => void;
  templateDescription: string;
  setTemplateDescription: (description: string) => void;
  editingTemplateId: string | null;
  handleCreateTemplate: () => Promise<void>;
  resetTemplateForm: () => void;
  formatCurrency: (value: number) => string;
}

const TemplateDialog = ({
  isTemplateDialogOpen,
  setIsTemplateDialogOpen,
  templateName,
  setTemplateName,
  templateIncome,
  setTemplateIncome,
  templateExpenses,
  setTemplateExpenses,
  templateDescription,
  setTemplateDescription,
  editingTemplateId,
  handleCreateTemplate,
  resetTemplateForm,
  formatCurrency
}: TemplateDialogProps) => {
  return (
    <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingTemplateId ? 'Modifier le modèle' : 'Créer un nouveau modèle'}</DialogTitle>
          <DialogDescription>
            {editingTemplateId 
              ? 'Modifiez les détails de votre modèle de budget.' 
              : 'Créez un modèle réutilisable pour vos budgets mensuels.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="templateName">Nom du modèle</Label>
            <Input
              id="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="ex: Budget mensuel standard"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="templateDescription">Description (optionnelle)</Label>
            <Input
              id="templateDescription"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="ex: Pour les mois ordinaires sans dépenses exceptionnelles"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="templateIncome" className="flex items-center gap-2">
              <ArrowUp size={16} className="text-green-500" />
              Revenus
            </Label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="templateIncome"
                type="number"
                value={templateIncome}
                onChange={(e) => setTemplateIncome(Number(e.target.value))}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="templateExpenses" className="flex items-center gap-2">
              <ArrowDown size={16} className="text-red-500" />
              Dépenses
            </Label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="templateExpenses"
                type="number"
                value={templateExpenses}
                onChange={(e) => setTemplateExpenses(Number(e.target.value))}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Summary calculation */}
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">Solde:</span>
              <span className={cn(
                "font-medium",
                templateIncome - templateExpenses > 0 ? "text-green-600" : 
                templateIncome - templateExpenses < 0 ? "text-red-600" : ""
              )}>
                {formatCurrency(templateIncome - templateExpenses)}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              resetTemplateForm();
              setIsTemplateDialogOpen(false);
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleCreateTemplate}
            className="gap-1"
          >
            <Save size={16} />
            {editingTemplateId ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDialog;
