
import { useState } from 'react';
import { useUserData } from '@/context/userData';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, BudgetTemplate } from '@/types/FinanceTypes';

export const useTemplateManagement = (transactions: Transaction[]) => {
  const { userData, updateFinanceModule } = useUserData();
  
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  
  const [isApplyIncomeTemplateOpen, setIsApplyIncomeTemplateOpen] = useState(false);
  const [isApplyExpenseTemplateOpen, setIsApplyExpenseTemplateOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const handleCreateTemplate = async () => {
    if (!templateName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez donner un nom à votre template.",
        variant: "destructive"
      });
      return;
    }

    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    const newTemplate: BudgetTemplate = {
      id: uuidv4(),
      name: templateName,
      income: totalIncome,
      expenses: totalExpenses,
      description: templateDescription,
      incomeItems: incomeTransactions.map(t => ({
        id: uuidv4(),
        description: t.description,
        amount: t.amount,
        category: t.category
      })),
      expenseItems: expenseTransactions.map(t => ({
        id: uuidv4(),
        description: t.description,
        amount: t.amount,
        category: t.category
      }))
    };

    try {
      const currentTemplates = userData?.financeModule?.budgetTemplates || [];
      await updateFinanceModule({
        budgetTemplates: [...currentTemplates, newTemplate]
      });

      toast({
        title: "Template créé",
        description: `Le template "${templateName}" a été créé avec succès.`,
      });

      setTemplateName('');
      setTemplateDescription('');
      setIsCreateTemplateOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création du template:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création du template.",
        variant: "destructive"
      });
    }
  };

  return {
    isCreateTemplateOpen,
    setIsCreateTemplateOpen,
    templateName,
    setTemplateName,
    templateDescription,
    setTemplateDescription,
    handleCreateTemplate,
    isApplyIncomeTemplateOpen,
    setIsApplyIncomeTemplateOpen,
    isApplyExpenseTemplateOpen,
    setIsApplyExpenseTemplateOpen,
    selectedTemplateId,
    setSelectedTemplateId
  };
};
