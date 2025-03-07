
import React, { useState, useEffect } from 'react';
import { useUserData } from "@/context/UserDataContext";
import { toast } from '@/hooks/use-toast';
import { DollarSign, TrendingUp, PiggyBank, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { playSound } from "@/utils/audioUtils";
import { v4 as uuidv4 } from 'uuid';

// Import refactored components from subdirectories
import AnnualStats from './stats/AnnualStats';
import BudgetChart from './charts/BudgetChart';
import MonthCard from './monthly/MonthCard';
import TemplateList from './templates/TemplateList';
import EditMonthDialog from './dialogs/EditMonthDialog';
import TemplateDialog from './dialogs/TemplateDialog';
import ApplyTemplateDialog from './dialogs/ApplyTemplateDialog';

// Import utility functions
import { formatCurrency, getMonths, calculateTotals } from './utils/formatters';

const months = getMonths();

const AnnualBudget = () => {
  const { userData, updateFinanceModule } = useUserData();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  
  // Template management state
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateIncome, setTemplateIncome] = useState(0);
  const [templateExpenses, setTemplateExpenses] = useState(0);
  const [templateDescription, setTemplateDescription] = useState('');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [showApplyTemplateDialog, setShowApplyTemplateDialog] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Update chart data when userData changes
  useEffect(() => {
    if (userData?.financeModule?.annualBudget) {
      // Ensure months are in the correct order
      const formattedData = months.map(month => {
        const data = userData.financeModule.annualBudget[month] || { income: 0, expenses: 0 };
        return {
          month,
          income: data.income,
          expenses: data.expenses,
          savings: data.income - data.expenses
        };
      });
      setChartData(formattedData);
    }
  }, [userData?.financeModule?.annualBudget]);

  const handleEditMonth = (month: string) => {
    const monthData = userData?.financeModule?.annualBudget?.[month] || { income: 0, expenses: 0 };
    setMonthlyIncome(monthData.income);
    setMonthlyExpenses(monthData.expenses);
    setSelectedMonth(month);
  };

  const handleSaveMonth = async () => {
    if (selectedMonth && userData?.financeModule?.annualBudget) {
      const updatedBudget = {
        ...userData.financeModule.annualBudget,
        [selectedMonth]: {
          income: monthlyIncome,
          expenses: monthlyExpenses
        }
      };
      
      await updateFinanceModule({ annualBudget: updatedBudget });
      toast({
        title: "Budget mis à jour",
        description: `Le budget de ${selectedMonth} a été mis à jour.`,
      });
      
      playSound('success');
      setSelectedMonth(null);
    }
  };

  const { totalIncome, totalExpenses, totalSavings } = calculateTotals(userData?.financeModule?.annualBudget);

  // Template management functions
  const handleCreateTemplate = async () => {
    if (!templateName) {
      toast({
        title: "Erreur",
        description: "Veuillez donner un nom à votre modèle.",
        variant: "destructive",
      });
      return;
    }

    const currentTemplates = [...(userData?.financeModule?.budgetTemplates || [])];
    
    if (editingTemplateId) {
      // Update existing template
      const updatedTemplates = currentTemplates.map(template => 
        template.id === editingTemplateId ? 
        {
          ...template,
          name: templateName,
          income: templateIncome,
          expenses: templateExpenses,
          description: templateDescription || undefined
        } : template
      );
      
      await updateFinanceModule({ budgetTemplates: updatedTemplates });
      toast({
        title: "Modèle mis à jour",
        description: `Le modèle "${templateName}" a été mis à jour.`,
      });
    } else {
      // Create new template
      const newTemplate = {
        id: uuidv4(),
        name: templateName,
        income: templateIncome,
        expenses: templateExpenses,
        description: templateDescription || undefined
      };
      
      await updateFinanceModule({ budgetTemplates: [...currentTemplates, newTemplate] });
      toast({
        title: "Modèle créé",
        description: `Le modèle "${templateName}" a été créé.`,
      });
    }
    
    // Reset form and close dialog
    resetTemplateForm();
    setIsTemplateDialogOpen(false);
    playSound('success');
  };

  const handleEditTemplate = (templateId: string) => {
    const template = userData?.financeModule?.budgetTemplates?.find(t => t.id === templateId);
    if (template) {
      setEditingTemplateId(templateId);
      setTemplateName(template.name);
      setTemplateIncome(template.income);
      setTemplateExpenses(template.expenses);
      setTemplateDescription(template.description || '');
      setIsTemplateDialogOpen(true);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    const updatedTemplates = userData?.financeModule?.budgetTemplates?.filter(t => t.id !== templateId) || [];
    await updateFinanceModule({ budgetTemplates: updatedTemplates });
    toast({
      title: "Modèle supprimé",
      description: "Le modèle a été supprimé avec succès.",
    });
    playSound('delete');
  };

  const resetTemplateForm = () => {
    setEditingTemplateId(null);
    setTemplateName('');
    setTemplateIncome(0);
    setTemplateExpenses(0);
    setTemplateDescription('');
  };

  const openNewTemplateDialog = () => {
    resetTemplateForm();
    setIsTemplateDialogOpen(true);
  };

  const handleApplyTemplate = async () => {
    if (!selectedMonth || !selectedTemplateId) return;
    
    const template = userData?.financeModule?.budgetTemplates?.find(t => t.id === selectedTemplateId);
    if (template) {
      const updatedBudget = {
        ...(userData?.financeModule?.annualBudget || {}),
        [selectedMonth]: {
          income: template.income,
          expenses: template.expenses
        }
      };
      
      await updateFinanceModule({ annualBudget: updatedBudget });
      toast({
        title: "Modèle appliqué",
        description: `Le modèle "${template.name}" a été appliqué à ${selectedMonth}.`,
      });
      
      setShowApplyTemplateDialog(false);
      setSelectedTemplateId(null);
      playSound('success');
    }
  };

  const openApplyTemplateDialog = (month: string) => {
    setSelectedMonth(month);
    setShowApplyTemplateDialog(true);
  };

  return (
    <Card className="transform transition-all duration-300 hover:shadow-lg">
      <CardHeader className="space-y-3 pb-6 border-b bg-gradient-to-r from-violet-50 to-purple-50">
        <div className="flex items-center justify-between">
          <CardTitle className="font-pixel text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-600">
            Budget Quest
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1" 
              onClick={openNewTemplateDialog}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Nouveau modèle</span>
              <span className="sm:hidden">Modèle</span>
            </Button>
            <DollarSign className="text-muted-foreground" size={18} />
            <TrendingUp className="text-muted-foreground" size={18} />
            <PiggyBank className="text-muted-foreground" size={18} />
          </div>
        </div>
        <CardDescription className="text-base">
          Gérez votre budget mensuel et gagnez des points d'expérience
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Annual Statistics */}
        <AnnualStats 
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          totalSavings={totalSavings}
          formatCurrency={formatCurrency}
        />
        
        {/* Budget Chart */}
        <BudgetChart 
          chartData={chartData}
          formatCurrency={formatCurrency}
        />
        
        {/* Monthly Cards */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {months.map((month) => {
            const monthData = userData?.financeModule?.annualBudget?.[month] || { income: 0, expenses: 0 };
            
            return (
              <MonthCard
                key={month}
                month={month}
                income={monthData.income}
                expenses={monthData.expenses}
                userData={userData}
                hoveredMonth={hoveredMonth}
                setHoveredMonth={setHoveredMonth}
                handleEditMonth={handleEditMonth}
                openApplyTemplateDialog={openApplyTemplateDialog}
                formatCurrency={formatCurrency}
              />
            );
          })}
        </div>
        
        {/* Templates List */}
        <TemplateList
          templates={userData?.financeModule?.budgetTemplates || []}
          handleEditTemplate={handleEditTemplate}
          handleDeleteTemplate={handleDeleteTemplate}
          openNewTemplateDialog={openNewTemplateDialog}
          formatCurrency={formatCurrency}
        />
      </CardContent>
      
      {/* Dialogs */}
      <EditMonthDialog
        selectedMonth={selectedMonth}
        monthlyIncome={monthlyIncome}
        monthlyExpenses={monthlyExpenses}
        setMonthlyIncome={setMonthlyIncome}
        setMonthlyExpenses={setMonthlyExpenses}
        handleSaveMonth={handleSaveMonth}
        setSelectedMonth={setSelectedMonth}
        formatCurrency={formatCurrency}
        showApplyTemplateDialog={showApplyTemplateDialog}
      />
      
      <TemplateDialog
        isTemplateDialogOpen={isTemplateDialogOpen}
        setIsTemplateDialogOpen={setIsTemplateDialogOpen}
        templateName={templateName}
        setTemplateName={setTemplateName}
        templateIncome={templateIncome}
        setTemplateIncome={setTemplateIncome}
        templateExpenses={templateExpenses}
        setTemplateExpenses={setTemplateExpenses}
        templateDescription={templateDescription}
        setTemplateDescription={setTemplateDescription}
        editingTemplateId={editingTemplateId}
        handleCreateTemplate={handleCreateTemplate}
        resetTemplateForm={resetTemplateForm}
        formatCurrency={formatCurrency}
      />
      
      <ApplyTemplateDialog
        showApplyTemplateDialog={showApplyTemplateDialog}
        setShowApplyTemplateDialog={setShowApplyTemplateDialog}
        selectedMonth={selectedMonth}
        selectedTemplateId={selectedTemplateId}
        setSelectedTemplateId={setSelectedTemplateId}
        handleApplyTemplate={handleApplyTemplate}
        userData={userData}
        formatCurrency={formatCurrency}
      />
    </Card>
  );
};

export default AnnualBudget;
