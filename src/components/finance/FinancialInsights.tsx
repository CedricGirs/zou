
import React from 'react';
import { Transaction, BudgetTemplate } from "@/context/UserDataContext";
import { useUserData } from "@/context/UserDataContext";
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import TemplateForm from './templates/TemplateForm';
import TransactionSection from './transactions/TransactionSection';

interface FinancialInsightsProps {
  transactions: Transaction[];
  month: string;
  updateMonthData: (data: any) => void;
}

const FinancialInsights = ({ transactions, month, updateMonthData }: FinancialInsightsProps) => {
  const { userData, updateFinanceModule } = useUserData();
  
  const incomeCategories = [
    'Salaire', 'Freelance', 'Dividendes', 'Loyers', 'Cadeaux', 'Remboursements', 'Autres'
  ];
  
  const expenseCategories = [
    'Logement', 'Alimentation', 'Transport', 'Loisirs', 'Santé', 'Éducation', 'Vêtements', 'Cadeaux', 'Autre'
  ];
  
  const recalculateTotals = (updatedTransactions: Transaction[]) => {
    const totalIncome = updatedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = updatedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;
    
    return {
      income: totalIncome,
      expenses: totalExpenses,
      balance,
      savingsRate,
      transactions: updatedTransactions
    };
  };
  
  const addTransaction = (type: 'income' | 'expense', description: string, amount: number, category: string) => {
    if (!description || amount <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs correctement.",
        variant: "destructive"
      });
      return;
    }
    
    const transaction: Transaction = {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      description,
      amount,
      category,
      type,
      month,
      isVerified: false
    };
    
    const updatedTransactions = [...transactions, transaction];
    const updatedData = recalculateTotals(updatedTransactions);
    
    updateMonthData(updatedData);
    
    toast({
      title: type === 'income' ? "Revenu ajouté" : "Dépense ajoutée",
      description: `${description} : ${amount}€ a été ajouté${type === 'expense' ? 'e' : ''} avec succès.`
    });
  };
  
  const deleteTransaction = (transactionId: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== transactionId);
    const updatedData = recalculateTotals(updatedTransactions);
    
    updateMonthData(updatedData);
    
    toast({
      title: "Transaction supprimée",
      description: "La transaction a été supprimée avec succès."
    });
  };

  const editTransaction = (transaction: Transaction, newAmount: number) => {
    const updatedTransactions = transactions.map(t => {
      if (t.id === transaction.id) {
        return {
          ...t,
          amount: newAmount
        };
      }
      return t;
    });

    const updatedData = recalculateTotals(updatedTransactions);
    
    updateMonthData(updatedData);
    
    toast({
      title: "Transaction modifiée",
      description: `Le montant a été mis à jour avec succès.`
    });
  };

  const handleCreateTemplate = async (name: string, description: string) => {
    if (!name.trim()) {
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
      name,
      income: totalIncome,
      expenses: totalExpenses,
      description,
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

    const currentTemplates = userData?.financeModule?.budgetTemplates || [];
    await updateFinanceModule({
      budgetTemplates: [...currentTemplates, newTemplate]
    });

    toast({
      title: "Template créé",
      description: `Le template "${name}" a été créé avec succès.`,
    });
  };

  const applyTemplate = (type: 'income' | 'expense', templateId: string) => {
    if (!templateId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un template.",
        variant: "destructive"
      });
      return;
    }

    const template = userData?.financeModule?.budgetTemplates.find(t => t.id === templateId);
    
    if (!template) {
      toast({
        title: "Erreur",
        description: "Template introuvable.",
        variant: "destructive"
      });
      return;
    }
    
    const items = type === 'income' ? template.incomeItems : template.expenseItems;
    
    if (!items || items.length === 0) {
      toast({
        title: "Information",
        description: `Ce template ne contient pas de ${type === 'income' ? 'revenus' : 'dépenses'} à ajouter.`,
      });
      return;
    }
    
    const newTransactions: Transaction[] = items.map(item => ({
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      description: item.description,
      amount: item.amount,
      category: item.category,
      type,
      month,
      isVerified: false
    }));
    
    const updatedTransactions = [...transactions, ...newTransactions];
    const updatedData = recalculateTotals(updatedTransactions);
    
    updateMonthData(updatedData);
    
    toast({
      title: "Template appliqué",
      description: `${newTransactions.length} ${type === 'income' ? 'revenus' : 'dépenses'} ont été ajouté${type === 'expense' ? 'e' : ''}s depuis le template "${template.name}".`,
    });
  };

  return (
    <div className="space-y-6">
      <TemplateForm 
        transactions={transactions} 
        onCreateTemplate={handleCreateTemplate} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TransactionSection
          type="income"
          transactions={transactions}
          categories={incomeCategories}
          defaultCategory="Salaire"
          templates={userData?.financeModule?.budgetTemplates || []}
          onAddTransaction={(description, amount, category) => 
            addTransaction('income', description, amount, category)
          }
          onDeleteTransaction={deleteTransaction}
          onEditTransaction={editTransaction}
          onApplyTemplate={(templateId) => applyTemplate('income', templateId)}
        />
        
        <TransactionSection
          type="expense"
          transactions={transactions}
          categories={expenseCategories}
          defaultCategory="Logement"
          templates={userData?.financeModule?.budgetTemplates || []}
          onAddTransaction={(description, amount, category) => 
            addTransaction('expense', description, amount, category)
          }
          onDeleteTransaction={deleteTransaction}
          onEditTransaction={editTransaction}
          onApplyTemplate={(templateId) => applyTemplate('expense', templateId)}
        />
      </div>
    </div>
  );
};

export default FinancialInsights;
