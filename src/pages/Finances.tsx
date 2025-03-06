
import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { DollarSign, TrendingUp, PiggyBank, Plus, AlertCircle } from "lucide-react";
import { useSyncUserData } from "../hooks/useSyncUserData";
import { useLanguage } from "../context/LanguageContext";

const Finances = () => {
  const { t } = useLanguage();
  const { financeModule } = useSyncUserData();
  
  // Initialize budget with data from financeModule if available
  const [budget, setBudget] = useState({
    income: 5000,
    categories: [
      { id: "housing", name: "Housing", budget: 1500, spent: 1450, color: "bg-zou-purple" },
      { id: "food", name: "Food", budget: 600, spent: 580, color: "bg-zou-orange" },
      { id: "transport", name: "Transport", budget: 400, spent: 320, color: "bg-zou-blue" },
      { id: "leisure", name: "Leisure", budget: 300, spent: 350, color: "bg-zou-pink" },
      { id: "savings", name: "Savings", budget: 1000, spent: 800, color: "bg-zou-green" },
      { id: "other", name: "Other", budget: 200, spent: 180, color: "bg-gray-400" }
    ]
  });
  
  // Update budget when financeModule changes
  useEffect(() => {
    if (financeModule && financeModule.monthlyIncome) {
      setBudget(prev => ({
        ...prev,
        income: financeModule.monthlyIncome,
        categories: [
          ...prev.categories.filter(cat => cat.id !== "savings"),
          { 
            id: "savings", 
            name: "Savings", 
            budget: financeModule.savingsGoal || prev.categories.find(c => c.id === "savings")?.budget || 1000, 
            spent: prev.categories.find(c => c.id === "savings")?.spent || 800, 
            color: "bg-zou-green" 
          }
        ]
      }));
    }
  }, [financeModule.monthlyIncome, financeModule.savingsGoal]);
  
  // Mock data for savings goals
  const [savingsGoals, setSavingsGoals] = useState([
    { id: "vacation", name: "Vacation", target: 2000, saved: 1200, deadline: "2023-12-31" },
    { id: "laptop", name: "New Laptop", target: 1500, saved: 500, deadline: "2024-03-15" }
  ]);
  
  // Add savings goal from financeModule if it doesn't exist
  useEffect(() => {
    if (financeModule && financeModule.savingsGoal && financeModule.savingsGoal > 0) {
      setSavingsGoals(prev => {
        const hasSavingsGoal = prev.some(goal => goal.id === "main-savings");
        if (!hasSavingsGoal) {
          return [
            ...prev,
            {
              id: "main-savings",
              name: "Main Savings",
              target: financeModule.savingsGoal,
              saved: Math.floor(financeModule.savingsGoal * 0.3), // Example: 30% progress
              deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] // One year from now
            }
          ];
        }
        return prev;
      });
    }
  }, [financeModule.savingsGoal]);
  
  const totalBudget = budget.categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBudget = budget.income - totalSpent;
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="font-pixel text-2xl mb-2">Finances</h1>
        <p className="text-muted-foreground">Track your budget, expenses, and savings goals</p>
        {financeModule.monthlyIncome > 0 && (
          <p className="mt-2 text-zou-purple font-pixel">
            {t("monthlyIncome")}: ${financeModule.monthlyIncome}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="glass-card p-4">
            <div className="flex items-center mb-4">
              <DollarSign size={18} className="text-zou-purple mr-2" />
              <h2 className="font-pixel text-base">Monthly Budget</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="pixel-card flex flex-col items-center">
                <h3 className="text-sm font-medium mb-1">Income</h3>
                <span className="font-pixel text-xl text-zou-purple">${budget.income}</span>
              </div>
              
              <div className="pixel-card flex flex-col items-center">
                <h3 className="text-sm font-medium mb-1">Spent</h3>
                <span className="font-pixel text-xl text-zou-orange">${totalSpent}</span>
              </div>
              
              <div className="pixel-card flex flex-col items-center">
                <h3 className="text-sm font-medium mb-1">Remaining</h3>
                <span className={`font-pixel text-xl ${remainingBudget >= 0 ? 'text-zou-green' : 'text-red-500'}`}>
                  ${remainingBudget}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {budget.categories.map(category => {
                const percentSpent = (category.spent / category.budget) * 100;
                const isOverBudget = category.spent > category.budget;
                
                return (
                  <div key={category.id} className="pixel-card">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs">${category.spent} / ${category.budget}</span>
                        {isOverBudget && (
                          <AlertCircle size={14} className="text-red-500 ml-1" />
                        )}
                      </div>
                    </div>
                    
                    <div className="progress-bar">
                      <div 
                        className={`progress-bar-fill ${category.color} ${isOverBudget ? 'animate-pulse' : ''}`}
                        style={{ width: `${Math.min(percentSpent, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button className="w-full mt-4 pixel-button flex items-center justify-center">
              <Plus size={14} className="mr-1" />
              ADD CATEGORY
            </button>
          </div>
        </div>
        
        <div>
          <div className="glass-card p-4">
            <div className="flex items-center mb-4">
              <PiggyBank size={18} className="text-zou-purple mr-2" />
              <h2 className="font-pixel text-base">Savings Goals</h2>
            </div>
            
            <div className="space-y-4">
              {savingsGoals.map(goal => {
                const percentSaved = (goal.saved / goal.target) * 100;
                const deadline = new Date(goal.deadline);
                const remainingDays = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={goal.id} className="pixel-card">
                    <h3 className="text-sm font-medium mb-2">{goal.name}</h3>
                    
                    <div className="flex justify-between text-xs mb-1">
                      <span>${goal.saved} / ${goal.target}</span>
                      <span>{remainingDays} days left</span>
                    </div>
                    
                    <div className="progress-bar mb-2">
                      <div 
                        className="progress-bar-fill bg-zou-green"
                        style={{ width: `${percentSaved}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {deadline.toLocaleDateString()}
                      </span>
                      <button className="text-xs pixel-button py-1">
                        ADD FUNDS
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button className="w-full mt-4 pixel-button flex items-center justify-center">
              <Plus size={14} className="mr-1" />
              NEW GOAL
            </button>
          </div>
          
          <div className="glass-card p-4 mt-6">
            <div className="flex items-center mb-4">
              <TrendingUp size={18} className="text-zou-purple mr-2" />
              <h2 className="font-pixel text-base">Recent Transactions</h2>
            </div>
            
            <div className="space-y-2">
              {[
                { id: "t1", description: "Grocery Store", amount: -85.20, category: "Food", date: "Nov 15" },
                { id: "t2", description: "Monthly Salary", amount: 5000, category: "Income", date: "Nov 1" },
                { id: "t3", description: "Restaurant", amount: -45.80, category: "Leisure", date: "Oct 28" }
              ].map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-2 border-b border-border">
                  <div>
                    <div className="text-sm font-medium">{transaction.description}</div>
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground mr-2">{transaction.date}</span>
                      <span className="text-xs bg-muted px-1 rounded">{transaction.category}</span>
                    </div>
                  </div>
                  <span className={`font-mono ${transaction.amount > 0 ? 'text-green-500' : ''}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 pixel-button flex items-center justify-center">
              <Plus size={14} className="mr-1" />
              ADD TRANSACTION
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Finances;
