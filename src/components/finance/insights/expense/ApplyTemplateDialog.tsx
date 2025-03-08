
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ApplyTemplateDialogProps {
  isApplyExpenseTemplateOpen: boolean;
  setIsApplyExpenseTemplateOpen: (isOpen: boolean) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  applyExpenseTemplate: () => void;
  userData: any;
}

const ApplyTemplateDialog: React.FC<ApplyTemplateDialogProps> = ({
  isApplyExpenseTemplateOpen,
  setIsApplyExpenseTemplateOpen,
  selectedTemplateId,
  setSelectedTemplateId,
  applyExpenseTemplate,
  userData
}) => {
  return (
    <Dialog open={isApplyExpenseTemplateOpen} onOpenChange={setIsApplyExpenseTemplateOpen}>
      <DialogTrigger asChild>
        <Button variant="template" size="sm" className="w-full mt-2">
          <Download size={14} className="mr-2" />
          Ajouter template
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Appliquer un template de dépenses</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expenseTemplate" className="text-right">Template</Label>
            <div className="col-span-3">
              <Select 
                value={selectedTemplateId} 
                onValueChange={setSelectedTemplateId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez un template" />
                </SelectTrigger>
                <SelectContent>
                  {userData?.financeModule?.budgetTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedTemplateId && (
            <div className="col-span-4 mt-2">
              <div className="p-3 bg-red-50 border border-red-100 rounded-md text-sm">
                {(() => {
                  const template = userData?.financeModule?.budgetTemplates.find(
                    t => t.id === selectedTemplateId
                  );
                  
                  if (!template) return <p>Template introuvable</p>;
                  
                  const expenseItems = template.expenseItems || [];
                  
                  return (
                    <>
                      <p className="font-medium mb-2">Contenu du template :</p>
                      {expenseItems.length === 0 ? (
                        <p>Ce template ne contient pas de dépenses</p>
                      ) : (
                        <div className="space-y-2">
                          <p>{expenseItems.length} dépenses pour un total de {template.expenses} €</p>
                          <ul className="list-disc list-inside space-y-1">
                            {expenseItems.map((item, idx) => (
                              <li key={idx} className="text-xs">
                                {item.description}: {item.amount} € ({item.category})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button onClick={applyExpenseTemplate}>Appliquer le template</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyTemplateDialog;
