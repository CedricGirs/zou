
import { useState } from "react";
import { useUserData } from "../../context/UserDataContext";
import { useLanguage } from "../../context/LanguageContext";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FinanceModule } from "@/context/UserDataContext";

interface EditFinanceModuleFormProps {
  onSave: () => void;
}

const EditFinanceModuleForm = ({ onSave }: EditFinanceModuleFormProps) => {
  const { userData, updateFinanceModule } = useUserData();
  const { t } = useLanguage();
  
  const [monthlyIncome, setMonthlyIncome] = useState(userData.financeModule.monthlyIncome.toString());
  const [fixedExpenses, setFixedExpenses] = useState(userData.financeModule.fixedExpenses.toString());
  const [savingsGoal, setSavingsGoal] = useState(userData.financeModule.savingsGoal.toString());
  
  const handleSubmit = async () => {
    const updates: Partial<FinanceModule> = {
      monthlyIncome: parseInt(monthlyIncome) || 0,
      fixedExpenses: parseInt(fixedExpenses) || 0,
      savingsGoal: parseInt(savingsGoal) || 0
    };
    
    await updateFinanceModule(updates);
    onSave();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="monthlyIncome" className="mb-2 block">{t("monthlyIncome")}</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
          <Input
            id="monthlyIncome"
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            className="pl-8"
            min="0"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="fixedExpenses" className="mb-2 block">{t("fixedExpenses")}</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
          <Input
            id="fixedExpenses"
            type="number"
            value={fixedExpenses}
            onChange={(e) => setFixedExpenses(e.target.value)}
            className="pl-8"
            min="0"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="savingsGoal" className="mb-2 block">{t("savingsGoal")}</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
          <Input
            id="savingsGoal"
            type="number"
            value={savingsGoal}
            onChange={(e) => setSavingsGoal(e.target.value)}
            className="pl-8"
            min="0"
          />
        </div>
      </div>
      
      <div className="p-4 bg-muted/30 rounded-md">
        <h3 className="font-medium mb-2">{t("monthlySummary")}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>{t("income")}:</div>
          <div className="text-right">${parseInt(monthlyIncome) || 0}</div>
          
          <div>{t("expenses")}:</div>
          <div className="text-right">${parseInt(fixedExpenses) || 0}</div>
          
          <div className="font-medium">{t("remaining")}:</div>
          <div className="text-right font-medium">
            ${(parseInt(monthlyIncome) || 0) - (parseInt(fixedExpenses) || 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFinanceModuleForm;
