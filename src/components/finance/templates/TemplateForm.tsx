
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Transaction } from "@/context/UserDataContext";
import { Save } from 'lucide-react';

interface TemplateFormProps {
  transactions: Transaction[];
  onCreateTemplate: (name: string, description: string) => void;
}

const TemplateForm = ({ transactions, onCreateTemplate }: TemplateFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  const handleCreateTemplate = () => {
    onCreateTemplate(templateName, templateDescription);
    setTemplateName('');
    setTemplateDescription('');
    setIsOpen(false);
  };

  return (
    <div className="flex justify-end mb-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                  <li>{transactions.filter(t => t.type === 'income').length} revenus pour un total de {transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)} €</li>
                  <li>{transactions.filter(t => t.type === 'expense').length} dépenses pour un total de {transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)} €</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleCreateTemplate}>Créer template</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateForm;
