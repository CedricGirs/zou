
import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useUserData } from "@/context/UserDataContext";
import { useLanguage } from "@/context/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, PiggyBank, CreditCard } from "lucide-react";
import AnnualBudget from "@/components/finance/AnnualBudget";
import TransactionTracker from "@/components/finance/TransactionTracker";
import SavingsTracker from "@/components/finance/SavingsTracker";
import FinancialReports from "@/components/finance/FinancialReports";

const Finances = () => {
  const { userData } = useUserData();
  const { t } = useLanguage();
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="font-pixel text-2xl mb-2">Finances</h1>
        <p className="text-muted-foreground">Gérez votre budget, vos dépenses et vos objectifs d'épargne</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="pixel-card flex flex-col items-center">
          <h3 className="text-sm font-medium mb-1">Revenus Mensuels</h3>
          <span className="font-pixel text-xl text-zou-purple">
            {userData.financeModule.monthlyIncome + (userData.financeModule.additionalIncome || 0)} €
          </span>
        </div>
        
        <div className="pixel-card flex flex-col items-center">
          <h3 className="text-sm font-medium mb-1">Dépenses Mensuelles</h3>
          <span className="font-pixel text-xl text-zou-orange">
            {userData.financeModule.housingExpenses + 
             userData.financeModule.foodExpenses + 
             userData.financeModule.transportExpenses + 
             userData.financeModule.leisureExpenses + 
             userData.financeModule.fixedExpenses +
             (userData.financeModule.debtPayments || 0)} €
          </span>
        </div>
        
        <div className="pixel-card flex flex-col items-center">
          <h3 className="text-sm font-medium mb-1">Objectif Épargne</h3>
          <span className="font-pixel text-xl text-zou-green">
            {userData.financeModule.savingsGoal} €
          </span>
        </div>
      </div>
      
      <Tabs defaultValue="budget" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="budget" className="flex items-center">
            <DollarSign className="mr-1" size={16} />
            Budget
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center">
            <CreditCard className="mr-1" size={16} />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="savings" className="flex items-center">
            <PiggyBank className="mr-1" size={16} />
            Épargne
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center">
            <TrendingUp className="mr-1" size={16} />
            Rapports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="budget">
          <AnnualBudget />
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionTracker />
        </TabsContent>
        
        <TabsContent value="savings">
          <SavingsTracker />
        </TabsContent>
        
        <TabsContent value="reports">
          <FinancialReports />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Finances;
