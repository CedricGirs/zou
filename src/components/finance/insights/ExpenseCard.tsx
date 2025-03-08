
import React, { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Transaction } from "@/context/userData";
import { AlertCircle, TrendingDown, Edit2, Trash2, Check as CheckIcon, Plus, Download, List, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ExpenseCardProps {
  transactions: Transaction[];
  month: string;
  newExpense: {
    description: string;
    amount: number;
    category: string;
  };
  handleExpenseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExpenseCategoryChange: (value: string) => void;
  addExpense: () => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  expenseCategories: string[];
  editingTransaction: {
    id: string;
    amount: number;
    type: 'income' | 'expense';
  } | null;
  handleEditAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startEditTransaction: (transaction: Transaction) => void;
  saveEditedTransaction: () => Promise<void>;
  isApplyExpenseTemplateOpen: boolean;
  setIsApplyExpenseTemplateOpen: (isOpen: boolean) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  applyExpenseTemplate: () => void;
  showRecentExpenses: boolean;
  toggleRecentExpenses: () => void;
  userData: any;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  transactions,
  month,
  newExpense,
  handleExpenseChange,
  handleExpenseCategoryChange,
  addExpense,
  deleteTransaction,
  expenseCategories,
  editingTransaction,
  handleEditAmountChange,
  startEditTransaction,
  saveEditedTransaction,
  isApplyExpenseTemplateOpen,
  setIsApplyExpenseTemplateOpen,
  selectedTemplateId,
  setSelectedTemplateId,
  applyExpenseTemplate,
  showRecentExpenses,
  toggleRecentExpenses,
  userData
}) => {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown size={18} />
          Dépenses
        </CardTitle>
        <CardDescription>Analyse de vos catégories de dépenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenseTransactions.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <span>Vous n'avez pas encore ajouté de dépenses ce mois-ci.</span>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Dépenses récentes :</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleRecentExpenses}
                  className="text-xs"
                >
                  <List size={14} className="mr-1" />
                  {showRecentExpenses ? "Masquer la liste" : "Voir tous"}
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {expenseTransactions
                  .slice(0, showRecentExpenses ? undefined : 5)
                  .map(expense => (
                    <div key={expense.id} className="flex justify-between items-center p-2 border rounded hover:bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">{expense.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {editingTransaction && editingTransaction.id === expense.id ? (
                          <>
                            <Input
                              type="number"
                              value={editingTransaction.amount}
                              onChange={handleEditAmountChange}
                              className="w-24 h-8"
                              min={0}
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={saveEditedTransaction}
                            >
                              <CheckIcon size={16} className="text-green-500" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="text-red-600 font-medium">{expense.amount} €</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => startEditTransaction(expense)}
                            >
                              <Edit2 size={16} className="text-blue-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => deleteTransaction(expense.id)}
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <Plus size={14} className="mr-2" />
                  Ajouter une dépense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une dépense</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expenseDescription" className="text-right">Description</Label>
                    <Input
                      id="expenseDescription"
                      name="description"
                      value={newExpense.description}
                      onChange={handleExpenseChange}
                      className="col-span-3"
                      placeholder="Loyer, Courses, etc."
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expenseAmount" className="text-right">Montant (€)</Label>
                    <Input
                      id="expenseAmount"
                      name="amount"
                      type="number"
                      value={newExpense.amount}
                      onChange={handleExpenseChange}
                      className="col-span-3"
                      min={0}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expenseCategory" className="text-right">Catégorie</Label>
                    <div className="col-span-3">
                      <Select 
                        value={newExpense.category} 
                        onValueChange={handleExpenseCategoryChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisissez une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={addExpense}>Ajouter</Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isApplyExpenseTemplateOpen} onOpenChange={setIsApplyExpenseTemplateOpen}>
              <DialogTrigger asChild>
                <Button variant="template" size="sm" className="w-full mt-2">
                  <Download size={14} className="mr-2" />
                  Ajouter template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Appliquer un template de dépenses</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expenseTemplate" className="text-right">Template</Label>
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
                      <div className="p-3 bg-red-50 border border-red-100 rounded-md text-sm">
                        {(() => {
                          const template = userData?.financeModule?.budgetTemplates.find(
                            t => t.id === selectedTemplateId
                          );
                          
                          if (!template) return <p>Template introuvable</p>;
                          
                          const expenseItems = template.expenseItems || [];
                          
                          return (
                            <>
                              <p className="font-medium mb-2">Contenu du template :</p>
                              {expenseItems.length === 0 ? (
                                <p>Ce template ne contient pas de dépenses</p>
                              ) : (
                                <div className="space-y-2">
                                  <p>{expenseItems.length} dépenses pour un total de {template.expenses} €</p>
                                  <ul className="list-disc list-inside space-y-1">
                                    {expenseItems.map((item, idx) => (
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
                  <Button onClick={applyExpenseTemplate}>Appliquer le template</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 flex justify-between">
        <span className="text-xs text-muted-foreground">
          Dépenses mensuelles totales: {
            expenseTransactions.reduce((sum, t) => sum + t.amount, 0) || 0
          } €
        </span>
        <div className="flex items-center text-xs text-purple-600">
          <Trophy size={12} className="mr-1 text-amber-500" />
          <span>+20 XP pour catégorisation complète</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExpenseCard;
