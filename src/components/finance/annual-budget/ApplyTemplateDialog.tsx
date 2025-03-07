
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BudgetTemplate } from "@/types/finance";

interface ApplyTemplateDialogProps {
  showApplyTemplateDialog: boolean;
  setShowApplyTemplateDialog: (show: boolean) => void;
  selectedMonth: string | null;
  selectedTemplateId: string | null;
  setSelectedTemplateId: (id: string | null) => void;
  handleApplyTemplate: () => Promise<void>;
  userData: any;
  formatCurrency: (value: number) => string;
}

const ApplyTemplateDialog = ({
  showApplyTemplateDialog,
  setShowApplyTemplateDialog,
  selectedMonth,
  selectedTemplateId,
  setSelectedTemplateId,
  handleApplyTemplate,
  userData,
  formatCurrency
}: ApplyTemplateDialogProps) => {
  return (
    <Dialog open={showApplyTemplateDialog} onOpenChange={setShowApplyTemplateDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Appliquer un modèle à {selectedMonth}</DialogTitle>
          <DialogDescription>
            Choisissez un modèle de budget à appliquer pour ce mois
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="templateSelect">Sélectionner un modèle</Label>
            <Select onValueChange={setSelectedTemplateId} defaultValue={selectedTemplateId || undefined}>
              <SelectTrigger id="templateSelect">
                <SelectValue placeholder="Choisir un modèle" />
              </SelectTrigger>
              <SelectContent>
                {(userData?.financeModule?.budgetTemplates || []).map((template: BudgetTemplate) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({formatCurrency(template.income)} / {formatCurrency(template.expenses)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedTemplateId && (
            <div className="border rounded-md p-3 bg-gray-50">
              {(() => {
                const template = userData?.financeModule?.budgetTemplates?.find((t: BudgetTemplate) => t.id === selectedTemplateId);
                if (!template) return null;
                
                return (
                  <>
                    <div className="font-medium mb-2">{template.name}</div>
                    {template.description && (
                      <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                    )}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Revenus:</span>
                        <span className="ml-2 font-medium">{formatCurrency(template.income)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Dépenses:</span>
                        <span className="ml-2 font-medium">{formatCurrency(template.expenses)}</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowApplyTemplateDialog(false)}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleApplyTemplate}
            disabled={!selectedTemplateId}
          >
            Appliquer le modèle
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyTemplateDialog;
