import React from 'react';
import { Bookmark, Plus } from 'lucide-react';
import TemplateItem from './TemplateItem';
import { BudgetTemplate } from "@/types/finance";

interface TemplateListProps {
  templates: BudgetTemplate[];
  handleEditTemplate: (templateId: string) => void;
  handleDeleteTemplate: (templateId: string) => void;
  openNewTemplateDialog: () => void;
  formatCurrency: (value: number) => string;
}

const TemplateList = ({
  templates,
  handleEditTemplate,
  handleDeleteTemplate,
  openNewTemplateDialog,
  formatCurrency
}: TemplateListProps) => {
  return (
    <div className="mt-8 border-t pt-4 px-6">
      <h3 className="font-medium text-base mb-3 flex items-center gap-2">
        <Bookmark size={18} className="text-muted-foreground" />
        Modèles de budget
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {templates?.map((template) => (
          <TemplateItem
            key={template.id}
            template={template}
            handleEditTemplate={handleEditTemplate}
            handleDeleteTemplate={handleDeleteTemplate}
            formatCurrency={formatCurrency}
          />
        ))}
        
        {/* Add new template card */}
        <div 
          className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={openNewTemplateDialog}
        >
          <Plus size={24} className="text-gray-400" />
          <span className="text-sm text-gray-500">Nouveau modèle</span>
        </div>
      </div>
    </div>
  );
};

export default TemplateList;
