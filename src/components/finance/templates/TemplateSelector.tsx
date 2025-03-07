
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BudgetTemplate } from "@/context/UserDataContext";
import { Download } from 'lucide-react';

interface TemplateSelectorProps {
  type: 'income' | 'expense';
  templates: BudgetTemplate[];
  onApplyTemplate: (templateId: string) => void;
}

const TemplateSelector = ({ type, templates, onApplyTemplate }: TemplateSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const handleApplyTemplate = () => {
    onApplyTemplate(selectedTemplateId);
    setSelectedTemplateId('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="template" size="sm" className="w-full mt-2">
          <Download size={14} className="mr-2" />
          Ajouter template
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Appliquer un template de {type === 'income' ? 'revenus' : 'dépenses'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="template" className="text-right">Template</Label>
            <div className="col-span-3">
              <Select 
                value={selectedTemplateId} 
                onValueChange={setSelectedTemplateId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez un template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
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
              <div className={`p-3 ${type === 'income' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} border rounded-md text-sm`}>
                {(() => {
                  const template = templates.find(t => t.id === selectedTemplateId);
                  
                  if (!template) return <p>Template introuvable</p>;
                  
                  const items = type === 'income' ? template.incomeItems || [] : template.expenseItems || [];
                  const total = type === 'income' ? template.income : template.expenses;
                  
                  return (
                    <>
                      <p className="font-medium mb-2">Contenu du template :</p>
                      {items.length === 0 ? (
                        <p>Ce template ne contient pas de {type === 'income' ? 'revenus' : 'dépenses'}</p>
                      ) : (
                        <div className="space-y-2">
                          <p>{items.length} {type === 'income' ? 'revenus' : 'dépenses'} pour un total de {total} €</p>
                          <ul className="list-disc list-inside space-y-1">
                            {items.map((item, idx) => (
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
          <Button onClick={handleApplyTemplate}>
            Appliquer le template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelector;
