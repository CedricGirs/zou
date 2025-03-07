
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Transaction } from "@/context/UserDataContext";
import { AlertCircle, TrendingUp, TrendingDown, Trophy, List } from 'lucide-react';
import TransactionsList from './TransactionsList';
import TransactionForm from './TransactionForm';
import TemplateSelector from '../templates/TemplateSelector';
import { BudgetTemplate } from '@/context/UserDataContext';

interface TransactionSectionProps {
  type: 'income' | 'expense';
  transactions: Transaction[];
  categories: string[];
  defaultCategory: string;
  templates: BudgetTemplate[];
  onAddTransaction: (description: string, amount: number, category: string) => void;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction, amount: number) => void;
  onApplyTemplate: (templateId: string) => void;
}

const TransactionSection = ({
  type,
  transactions,
  categories,
  defaultCategory,
  templates,
  onAddTransaction,
  onDeleteTransaction,
  onEditTransaction,
  onApplyTemplate,
}: TransactionSectionProps) => {
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const toggleShowAll = () => {
    setShowAllTransactions(!showAllTransactions);
  };

  const filteredTransactions = transactions.filter(t => t.type === type);
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === 'income' ? 
            <TrendingUp size={18} /> : 
            <TrendingDown size={18} />
          }
          {type === 'income' ? 'Revenus' : 'Dépenses'}
        </CardTitle>
        <CardDescription>
          {type === 'income' 
            ? 'Analyse de vos sources de revenus' 
            : 'Analyse de vos catégories de dépenses'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <span>
                  Vous n'avez pas encore ajouté de {type === 'income' ? 'revenus' : 'dépenses'} ce mois-ci.
                </span>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {type === 'income' ? 'Sources de revenus récentes :' : 'Dépenses récentes :'}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleShowAll}
                  className="text-xs"
                >
                  <List size={14} className="mr-1" />
                  {showAllTransactions ? "Masquer la liste" : "Voir tous"}
                </Button>
              </div>
              
              <TransactionsList
                transactions={transactions}
                type={type}
                showAll={showAllTransactions}
                onDeleteTransaction={onDeleteTransaction}
                onEditTransaction={onEditTransaction}
              />
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <TransactionForm
              type={type}
              onAddTransaction={onAddTransaction}
              categories={categories}
              defaultCategory={defaultCategory}
            />
            
            <TemplateSelector
              type={type}
              templates={templates}
              onApplyTemplate={onApplyTemplate}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 flex justify-between">
        <span className="text-xs text-muted-foreground">
          {type === 'income' ? 'Revenu mensuel total: ' : 'Dépenses mensuelles totales: '}
          {totalAmount} €
        </span>
        <div className="flex items-center text-xs text-purple-600">
          <Trophy size={12} className="mr-1 text-amber-500" />
          <span>
            {type === 'income' 
              ? '+30 XP pour 3 sources de revenus' 
              : '+20 XP pour catégorisation complète'
            }
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TransactionSection;
