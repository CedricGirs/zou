
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ApplyTemplateDialogProps {
  isApplyIncomeTemplateOpen: boolean;
  setIsApplyIncomeTemplateOpen: (isOpen: boolean) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  applyIncomeTemplate: () => void;
  userData: any;
}

const ApplyTemplateDialog: React.FC<ApplyTemplateDialogProps> = ({
  isApplyIncomeTemplateOpen,
  setIsApplyIncomeTemplateOpen,
  selectedTemplateId,
  setSelectedTemplateId,
  applyIncomeTemplate,
  userData
}) => {
  return (
    <Dialog open={isApplyIncomeTemplateOpen} onOpenChange={setIsApplyIncomeTemplateOpen}>
      <DialogTrigger asChild>
        <Button variant="template" size="sm" className="w-full mt-2">
          <Download size={14} className="mr-2" />
          Ajouter template
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Appliquer un template de revenus</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="incomeTemplate" className="text-right">Template</Label>
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
              <div className="p-3 bg-green-50 border border-green-100 rounded-md text-sm">
                {(() => {
                  const template = userData?.financeModule?.budgetTemplates.find(
                    t => t.id === selectedTemplateId
                  );
                  
                  if (!template) return <p>Template introuvable</p>;
                  
                  const incomeItems = template.incomeItems || [];
                  
                  return (
                    <>
                      <p className="font-medium mb-2">Contenu du template :</p>
                      {incomeItems.length === 0 ? (
                        <p>Ce template ne contient pas de revenus</p>
                      ) : (
                        <div className="space-y-2">
                          <p>{incomeItems.length} revenus pour un total de {template.income} €</p>
                          <ul className="list-disc list-inside space-y-1">
                            {incomeItems.map((item, idx) => (
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
          <Button onClick={applyIncomeTemplate}>Appliquer le template</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyTemplateDialog;
