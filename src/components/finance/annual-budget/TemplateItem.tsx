
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BudgetTemplate } from "@/types/finance";

interface TemplateItemProps {
  template: BudgetTemplate;
  handleEditTemplate: (templateId: string) => void;
  handleDeleteTemplate: (templateId: string) => void;
  formatCurrency: (value: number) => string;
}

const TemplateItem = ({ 
  template, 
  handleEditTemplate, 
  handleDeleteTemplate,
  formatCurrency 
}: TemplateItemProps) => {
  return (
    <div className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{template.name}</h4>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0"
            onClick={() => handleEditTemplate(template.id)}
          >
            <Edit size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 text-red-500"
            onClick={() => handleDeleteTemplate(template.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      
      {template.description && (
        <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
      )}
      
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Revenus:</span>
          <span className="font-medium">{formatCurrency(template.income)}</span>
        </div>
        <div className="flex justify-between">
          <span>Dépenses:</span>
          <span className="font-medium">{formatCurrency(template.expenses)}</span>
        </div>
        <div className="flex justify-between">
          <span>Solde:</span>
          <span className={cn(
            "font-medium",
            template.income - template.expenses > 0 ? "text-green-600" : 
            template.income - template.expenses < 0 ? "text-red-600" : ""
          )}>
            {formatCurrency(template.income - template.expenses)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TemplateItem;
