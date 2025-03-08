
import { useCallback } from 'react';
import { Transaction, useUserData } from '@/context/userData';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const useTemplateApplication = (
  transactions: Transaction[],
  month: string,
  selectedTemplateId: string,
  recalculateTotals: (updatedTransactions: Transaction[]) => any,
  updateMonthData: (data: any) => void
) => {
  const { userData } = useUserData();

  const applyIncomeTemplate = useCallback(() => {
    if (!selectedTemplateId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un template.",
        variant: "destructive"
      });
      return;
    }

    try {
      const template = userData?.financeModule?.budgetTemplates.find(t => t.id === selectedTemplateId);
      
      if (!template || !template.incomeItems || template.incomeItems.length === 0) {
        toast({
          title: "Information",
          description: "Ce template ne contient pas de revenus à ajouter.",
        });
        return;
      }
      
      const newTransactions: Transaction[] = template.incomeItems.map(item => ({
        id: uuidv4(),
        date: new Date().toISOString().split('T')[0],
        description: item.description,
        amount: item.amount,
        category: item.category,
        type: 'income',
        month: month,
        isVerified: false
      }));
      
      const updatedTransactions = [...transactions, ...newTransactions];
      const updatedData = recalculateTotals(updatedTransactions);
      
      updateMonthData(updatedData);
      
      toast({
        title: "Template appliqué",
        description: `${newTransactions.length} revenus ont été ajoutés depuis le template "${template.name}".`,
      });
    } catch (error) {
      console.error("Erreur lors de l'application du template de revenus:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'application du template.",
        variant: "destructive"
      });
    }
  }, [selectedTemplateId, userData?.financeModule?.budgetTemplates, month, transactions, recalculateTotals, updateMonthData]);

  const applyExpenseTemplate = useCallback(() => {
    if (!selectedTemplateId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un template.",
        variant: "destructive"
      });
      return;
    }

    try {
      const template = userData?.financeModule?.budgetTemplates.find(t => t.id === selectedTemplateId);
      
      if (!template || !template.expenseItems || template.expenseItems.length === 0) {
        toast({
          title: "Information",
          description: "Ce template ne contient pas de dépenses à ajouter.",
        });
        return;
      }
      
      const newTransactions: Transaction[] = template.expenseItems.map(item => ({
        id: uuidv4(),
        date: new Date().toISOString().split('T')[0],
        description: item.description,
        amount: item.amount,
        category: item.category,
        type: 'expense',
        month: month,
        isVerified: false
      }));
      
      const updatedTransactions = [...transactions, ...newTransactions];
      const updatedData = recalculateTotals(updatedTransactions);
      
      updateMonthData(updatedData);
      
      toast({
        title: "Template appliqué",
        description: `${newTransactions.length} dépenses ont été ajoutées depuis le template "${template.name}".`,
      });
    } catch (error) {
      console.error("Erreur lors de l'application du template de dépenses:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'application du template.",
        variant: "destructive"
      });
    }
  }, [selectedTemplateId, userData?.financeModule?.budgetTemplates, month, transactions, recalculateTotals, updateMonthData]);

  return {
    applyIncomeTemplate,
    applyExpenseTemplate
  };
};
