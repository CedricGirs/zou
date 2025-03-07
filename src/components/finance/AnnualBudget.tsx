
import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Edit, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown, 
  DollarSign, 
  Wallet, 
  PiggyBank, 
  Copy, 
  Bookmark,
  Plus,
  Save,
  Trash2
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserData } from "@/context/UserDataContext";
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { playSound } from "@/utils/audioUtils";
import { v4 as uuidv4 } from 'uuid';
import { Progress } from "@/components/ui/progress";

const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

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

  const calculateTotals = () => {
    if (!userData?.financeModule?.annualBudget) return { totalIncome: 0, totalExpenses: 0, totalSavings: 0 };
    
    let totalIncome = 0;
    let totalExpenses = 0;
    
    Object.values(userData.financeModule.annualBudget).forEach(month => {
      totalIncome += month.income;
      totalExpenses += month.expenses;
    });
    
    return {
      totalIncome,
      totalExpenses,
      totalSavings: totalIncome - totalExpenses
    };
  };

  const { totalIncome, totalExpenses, totalSavings } = calculateTotals();

  const getMonthColor = (month: string) => {
    if (!userData?.financeModule?.annualBudget?.[month]) return "bg-gray-100 border-gray-200";
    
    const data = userData.financeModule.annualBudget[month];
    const savings = data.income - data.expenses;
    
    if (savings > 0) return "bg-green-50 border-green-200 hover:bg-green-100";
    if (savings < 0) return "bg-red-50 border-red-200 hover:bg-red-100";
    return "bg-gray-50 border-gray-200 hover:bg-gray-100";
  };

  const getMonthIcon = (month: string) => {
    if (!userData?.financeModule?.annualBudget?.[month]) return <Wallet className="text-gray-400" size={18} />;
    
    const data = userData.financeModule.annualBudget[month];
    const savings = data.income - data.expenses;
    
    if (savings > 0) return <ArrowUp className="text-green-500" size={18} />;
    if (savings < 0) return <ArrowDown className="text-red-500" size={18} />;
    return <Wallet className="text-gray-400" size={18} />;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

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

  const COLORS = {
    income: '#8B5CF6', // Vivid purple
    expenses: '#F97316', // Bright orange
    savings: '#10B981', // Emerald green
    background: '#E5DEFF', // Soft purple
  };

  const customBarChart = {
    background: "linear-gradient(180deg, #E5DEFF 0%, rgba(229, 222, 255, 0.2) 100%)",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid rgba(139, 92, 246, 0.2)",
  };

  const monthCardStyle = (month: string) => {
    if (!userData?.financeModule?.annualBudget?.[month]) return "bg-gray-50";
    
    const data = userData.financeModule.annualBudget[month];
    const savings = data.income - data.expenses;
    
    if (savings > 0) return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200";
    if (savings < 0) return "bg-gradient-to-br from-red-50 to-orange-50 border-red-200";
    return "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200";
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 border border-purple-100 transform transition-all duration-200 hover:scale-105">
            <h3 className="text-sm font-medium text-purple-800 mb-2">Revenus Annuels</h3>
            <span className="font-pixel text-xl text-purple-600">
              {formatCurrency(totalIncome)}
            </span>
            <div className="mt-2">
              <Progress value={(totalIncome / (totalIncome + totalExpenses)) * 100} className="h-2 bg-purple-100" indicatorClassName="bg-gradient-to-r from-purple-500 to-violet-500" />
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 transform transition-all duration-200 hover:scale-105">
            <h3 className="text-sm font-medium text-orange-800 mb-2">Dépenses Annuelles</h3>
            <span className="font-pixel text-xl text-orange-600">
              {formatCurrency(totalExpenses)}
            </span>
            <div className="mt-2">
              <Progress value={(totalExpenses / (totalIncome + totalExpenses)) * 100} className="h-2 bg-orange-100" indicatorClassName="bg-gradient-to-r from-orange-500 to-red-500" />
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 transform transition-all duration-200 hover:scale-105">
            <h3 className="text-sm font-medium text-emerald-800 mb-2">Épargne Annuelle</h3>
            <span className="font-pixel text-xl text-emerald-600">
              {formatCurrency(totalSavings)}
            </span>
            <div className="mt-2">
              <Progress value={(totalSavings / totalIncome) * 100} className="h-2 bg-emerald-100" indicatorClassName="bg-gradient-to-r from-emerald-500 to-green-500" />
            </div>
          </div>
        </div>
        
        <div className="mb-8" style={customBarChart}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.income} stopOpacity={0.8}/>
                  <stop offset="100%" stopColor={COLORS.income} stopOpacity={0.4}/>
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.expenses} stopOpacity={0.8}/>
                  <stop offset="100%" stopColor={COLORS.expenses} stopOpacity={0.4}/>
                </linearGradient>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.savings} stopOpacity={0.8}/>
                  <stop offset="100%" stopColor={COLORS.savings} stopOpacity={0.4}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => formatCurrency(value as number)}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{
                  paddingBottom: '20px',
                  fontSize: '14px'
                }}
              />
              <Bar 
                dataKey="income" 
                name="Revenus" 
                fill="url(#incomeGradient)"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="expenses" 
                name="Dépenses" 
                fill="url(#expensesGradient)"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="savings" 
                name="Épargne" 
                fill="url(#savingsGradient)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {months.map((month) => {
            const monthData = userData?.financeModule?.annualBudget?.[month] || { income: 0, expenses: 0 };
            const savings = monthData.income - monthData.expenses;
            
            return (
              <div 
                key={month}
                className={`relative border rounded-lg p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer overflow-hidden ${monthCardStyle(month)}`}
                onMouseEnter={() => setHoveredMonth(month)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-transparent via-purple-300 to-transparent pointer-events-none" />
                
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-pixel text-sm">{month}</h4>
                  {getMonthIcon(month)}
                </div>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-purple-600">Revenus:</span>
                    <span className="font-medium">{formatCurrency(monthData.income)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-600">Dépenses:</span>
                    <span className="font-medium">{formatCurrency(monthData.expenses)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-emerald-600">Épargne:</span>
                    <span className={cn(
                      savings > 0 ? "text-emerald-600" : 
                      savings < 0 ? "text-red-600" : "text-gray-600"
                    )}>
                      {formatCurrency(savings)}
                    </span>
                  </div>
                </div>
                
                {/* Show action buttons on hover */}
                <div className={cn(
                  "absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 transition-opacity",
                  hoveredMonth === month ? "opacity-100" : "opacity-0"
                )}>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
                      onClick={() => handleEditMonth(month)}
                    >
                      <Edit size={14} className="text-purple-700" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
                      onClick={() => openApplyTemplateDialog(month)}
                    >
                      <Copy size={14} className="text-purple-700" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      
      {/* Templates section */}
      <div className="mt-8 border-t pt-4 px-6">
        <h3 className="font-medium text-base mb-3 flex items-center gap-2">
          <Bookmark size={18} className="text-muted-foreground" />
          Modèles de budget
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {userData?.financeModule?.budgetTemplates?.map((template) => (
            <div 
              key={template.id}
              className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
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
      
      {/* Edit month dialog */}
      <Dialog open={!!selectedMonth && !showApplyTemplateDialog} onOpenChange={(open) => !open && setSelectedMonth(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le budget de {selectedMonth}</DialogTitle>
            <DialogDescription>
              Ajustez les revenus et dépenses pour ce mois
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="income" className="flex items-center gap-2">
                  <ArrowUp size={16} className="text-green-500" />
                  Revenus mensuels
                </Label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="income"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expenses" className="flex items-center gap-2">
                  <ArrowDown size={16} className="text-red-500" />
                  Dépenses mensuelles
                </Label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="expenses"
                    type="number"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Summary calculation */}
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Épargne mensuelle:</span>
                  <span className={cn(
                    "font-pixel text-lg",
                    monthlyIncome - monthlyExpenses > 0 ? "text-green-600" : 
                    monthlyIncome - monthlyExpenses < 0 ? "text-red-600" : ""
                  )}>
                    {formatCurrency(monthlyIncome - monthlyExpenses)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setSelectedMonth(null)}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSaveMonth}
            >
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Create/Edit Template Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTemplateId ? 'Modifier le modèle' : 'Créer un nouveau modèle'}</DialogTitle>
            <DialogDescription>
              {editingTemplateId 
                ? 'Modifiez les détails de votre modèle de budget.' 
                : 'Créez un modèle réutilisable pour vos budgets mensuels.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Nom du modèle</Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="ex: Budget mensuel standard"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="templateDescription">Description (optionnelle)</Label>
              <Input
                id="templateDescription"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="ex: Pour les mois ordinaires sans dépenses exceptionnelles"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="templateIncome" className="flex items-center gap-2">
                <ArrowUp size={16} className="text-green-500" />
                Revenus
              </Label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="templateIncome"
                  type="number"
                  value={templateIncome}
                  onChange={(e) => setTemplateIncome(Number(e.target.value))}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="templateExpenses" className="flex items-center gap-2">
                <ArrowDown size={16} className="text-red-500" />
                Dépenses
              </Label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="templateExpenses"
                  type="number"
                  value={templateExpenses}
                  onChange={(e) => setTemplateExpenses(Number(e.target.value))}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Summary calculation */}
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Solde:</span>
                <span className={cn(
                  "font-medium",
                  templateIncome - templateExpenses > 0 ? "text-green-600" : 
                  templateIncome - templateExpenses < 0 ? "text-red-600" : ""
                )}>
                  {formatCurrency(templateIncome - templateExpenses)}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                resetTemplateForm();
                setIsTemplateDialogOpen(false);
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleCreateTemplate}
              className="gap-1"
            >
              <Save size={16} />
              {editingTemplateId ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Apply template dialog */}
      <Dialog open={showApplyTemplateDialog} onOpenChange={setShowApplyTemplateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Appliquer un modèle à {selectedMonth}</DialogTitle>
            <DialogDescription>
              Choisissez un modèle de budget à appliquer pour ce mois
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="templateSelect">Sélectionner un modèle</Label>
              <Select onValueChange={setSelectedTemplateId} defaultValue={selectedTemplateId || undefined}>
                <SelectTrigger id="templateSelect">
                  <SelectValue placeholder="Choisir un modèle" />
                </SelectTrigger>
                <SelectContent>
                  {(userData?.financeModule?.budgetTemplates || []).map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} ({formatCurrency(template.income)} / {formatCurrency(template.expenses)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedTemplateId && (
              <div className="border rounded-md p-3 bg-gray-50">
                {(() => {
                  const template = userData?.financeModule?.budgetTemplates?.find(t => t.id === selectedTemplateId);
                  if (!template) return null;
                  
                  return (
                    <>
                      <div className="font-medium mb-2">{template.name}</div>
                      {template.description && (
                        <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                      )}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Revenus:</span>
                          <span className="ml-2 font-medium">{formatCurrency(template.income)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Dépenses:</span>
                          <span className="ml-2 font-medium">{formatCurrency(template.expenses)}</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowApplyTemplateDialog(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleApplyTemplate}
              disabled={!selectedTemplateId}
            >
              Appliquer le modèle
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AnnualBudget;
