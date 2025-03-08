
import React, { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Transaction } from "@/context/userData";
import { AlertCircle, TrendingUp, Edit2, Trash2, Check as CheckIcon, Plus, Download, List, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface IncomeCardProps {
  transactions: Transaction[];
  month: string;
  newIncome: {
    description: string;
    amount: number;
    category: string;
  };
  handleIncomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIncomeCategoryChange: (value: string) => void;
  addIncome: () => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  incomeCategories: string[];
  editingTransaction: {
    id: string;
    amount: number;
    type: 'income' | 'expense';
  } | null;
  handleEditAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startEditTransaction: (transaction: Transaction) => void;
  saveEditedTransaction: () => Promise<void>;
  isApplyIncomeTemplateOpen: boolean;
  setIsApplyIncomeTemplateOpen: (isOpen: boolean) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  applyIncomeTemplate: () => void;
  showRecentIncomes: boolean;
  toggleRecentIncomes: () => void;
  userData: any;
}

const IncomeCard: React.FC<IncomeCardProps> = ({
  transactions,
  month,
  newIncome,
  handleIncomeChange,
  handleIncomeCategoryChange,
  addIncome,
  deleteTransaction,
  incomeCategories,
  editingTransaction,
  handleEditAmountChange,
  startEditTransaction,
  saveEditedTransaction,
  isApplyIncomeTemplateOpen,
  setIsApplyIncomeTemplateOpen,
  selectedTemplateId,
  setSelectedTemplateId,
  applyIncomeTemplate,
  showRecentIncomes,
  toggleRecentIncomes,
  userData
}) => {
  const incomeTransactions = transactions.filter(t => t.type === 'income');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp size={18} />
          Revenus
        </CardTitle>
        <CardDescription>Analyse de vos sources de revenus</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {incomeTransactions.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <span>Vous n'avez pas encore ajouté de revenus ce mois-ci.</span>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Sources de revenus récentes :</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleRecentIncomes}
                  className="text-xs"
                >
                  <List size={14} className="mr-1" />
                  {showRecentIncomes ? "Masquer la liste" : "Voir tous"}
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {incomeTransactions
                  .slice(0, showRecentIncomes ? undefined : 5)
                  .map(income => (
                    <div key={income.id} className="flex justify-between items-center p-2 border rounded hover:bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{income.description}</p>
                        <p className="text-xs text-muted-foreground">{income.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {editingTransaction && editingTransaction.id === income.id ? (
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
                            <span className="text-green-600 font-medium">{income.amount} €</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => startEditTransaction(income)}
                            >
                              <Edit2 size={16} className="text-blue-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => deleteTransaction(income.id)}
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
                  Ajouter un revenu
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un revenu</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="incomeDescription" className="text-right">Description</Label>
                    <Input
                      id="incomeDescription"
                      name="description"
                      value={newIncome.description}
                      onChange={handleIncomeChange}
                      className="col-span-3"
                      placeholder="Salaire, Freelance, etc."
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="incomeAmount" className="text-right">Montant (€)</Label>
                    <Input
                      id="incomeAmount"
                      name="amount"
                      type="number"
                      value={newIncome.amount}
                      onChange={handleIncomeChange}
                      className="col-span-3"
                      min={0}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="incomeCategory" className="text-right">Catégorie</Label>
                    <div className="col-span-3">
                      <Select 
                        value={newIncome.category} 
                        onValueChange={handleIncomeCategoryChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisissez une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {incomeCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={addIncome}>Ajouter</Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isApplyIncomeTemplateOpen} onOpenChange={setIsApplyIncomeTemplateOpen}>
              <DialogTrigger asChild>
                <Button variant="template" size="sm" className="w-full mt-2">
                  <Download size={14} className="mr-2" />
                  Ajouter template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Appliquer un template de revenus</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="incomeTemplate" className="text-right">Template</Label>
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
                      <div className="p-3 bg-green-50 border border-green-100 rounded-md text-sm">
                        {(() => {
                          const template = userData?.financeModule?.budgetTemplates.find(
                            t => t.id === selectedTemplateId
                          );
                          
                          if (!template) return <p>Template introuvable</p>;
                          
                          const incomeItems = template.incomeItems || [];
                          
                          return (
                            <>
                              <p className="font-medium mb-2">Contenu du template :</p>
                              {incomeItems.length === 0 ? (
                                <p>Ce template ne contient pas de revenus</p>
                              ) : (
                                <div className="space-y-2">
                                  <p>{incomeItems.length} revenus pour un total de {template.income} €</p>
                                  <ul className="list-disc list-inside space-y-1">
                                    {incomeItems.map((item, idx) => (
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
                  <Button onClick={applyIncomeTemplate}>Appliquer le template</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 flex justify-between">
        <span className="text-xs text-muted-foreground">
          Revenu mensuel total: {
            incomeTransactions.reduce((sum, t) => sum + t.amount, 0) || 0
          } €
        </span>
        <div className="flex items-center text-xs text-purple-600">
          <Trophy size={12} className="mr-1 text-amber-500" />
          <span>+30 XP pour 3 sources de revenus</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default IncomeCard;
