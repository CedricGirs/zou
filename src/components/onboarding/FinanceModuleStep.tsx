
import { useState } from "react";
import { useOnboarding } from "../../context/OnboardingContext";
import { useLanguage } from "../../context/LanguageContext";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DollarSign, PiggyBank, Wallet } from "lucide-react";

const FinanceModuleStep = () => {
  const { onboarding, updateFinanceModule } = useOnboarding();
  const { t } = useLanguage();
  
  const [monthlyIncome, setMonthlyIncome] = useState(onboarding.financeModule.monthlyIncome);
  const [fixedExpenses, setFixedExpenses] = useState(onboarding.financeModule.fixedExpenses);
  const [savingsGoal, setSavingsGoal] = useState(onboarding.financeModule.savingsGoal);
  
  const handleMonthlyIncomeChange = (value: number) => {
    setMonthlyIncome(value);
    updateFinanceModule({ monthlyIncome: value });
  };
  
  const handleFixedExpensesChange = (value: number) => {
    setFixedExpenses(value);
    updateFinanceModule({ fixedExpenses: value });
  };
  
  const handleSavingsGoalChange = (value: number) => {
    setSavingsGoal(value);
    updateFinanceModule({ savingsGoal: value });
  };
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label htmlFor="monthly-income" className="flex items-center gap-2">
          <DollarSign size={16} className="text-zou-purple" />
          {t("monthlyIncome")}
        </Label>
        <Input
          id="monthly-income"
          type="number"
          min="0"
          value={monthlyIncome}
          onChange={(e) => handleMonthlyIncomeChange(Number(e.target.value))}
          placeholder="0"
          className="font-mono"
        />
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="fixed-expenses" className="flex items-center gap-2">
          <Wallet size={16} className="text-zou-purple" />
          {t("fixedExpenses")}
        </Label>
        <Input
          id="fixed-expenses"
          type="number"
          min="0"
          value={fixedExpenses}
          onChange={(e) => handleFixedExpensesChange(Number(e.target.value))}
          placeholder="0"
          className="font-mono"
        />
        
        {fixedExpenses > monthlyIncome && monthlyIncome > 0 && (
          <p className="text-sm text-destructive">{t("expensesExceedIncome")}</p>
        )}
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="savings-goal" className="flex items-center gap-2">
          <PiggyBank size={16} className="text-zou-purple" />
          {t("savingsGoal")}
        </Label>
        <Input
          id="savings-goal"
          type="number"
          min="0"
          value={savingsGoal}
          onChange={(e) => handleSavingsGoalChange(Number(e.target.value))}
          placeholder="0"
          className="font-mono"
        />
      </div>
      
      {monthlyIncome > 0 && (
        <div className="pixel-card p-4 bg-zou-purple/10">
          <h3 className="font-pixel text-sm mb-2">{t("monthlySummary")}</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t("income")}:</span>
              <span className="font-mono">{monthlyIncome}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("fixedExpenses")}:</span>
              <span className="font-mono">{fixedExpenses}</span>
            </div>
            <div className="border-t border-dashed border-zou-purple/30 my-1"></div>
            <div className="flex justify-between font-medium">
              <span>{t("availableForSavings")}:</span>
              <span className={`font-mono ${monthlyIncome - fixedExpenses < 0 ? 'text-destructive' : 'text-zou-purple'}`}>
                {monthlyIncome - fixedExpenses}
              </span>
            </div>
            
            {savingsGoal > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs">
                  <span>{t("monthsToReachGoal")}:</span>
                  <span className="font-mono">
                    {monthlyIncome - fixedExpenses > 0 
                      ? Math.ceil(savingsGoal / (monthlyIncome - fixedExpenses))
                      : "∞"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceModuleStep;
