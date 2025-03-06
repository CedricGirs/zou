
import { useState } from "react";
import { useUserData } from "../../context/UserDataContext";
import { useLanguage } from "../../context/LanguageContext";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { 
  DollarSign, 
  PiggyBank, 
  Wallet, 
  BadgeDollarSign, 
  Coins, 
  CreditCard,
  Receipt
} from "lucide-react";
import { FinanceModule } from "@/context/UserDataContext";
import { useToast } from "@/hooks/use-toast";

interface EditFinanceModuleFormProps {
  onSave: () => void;
}

const EditFinanceModuleForm = ({ onSave }: EditFinanceModuleFormProps) => {
  const { userData, updateFinanceModule } = useUserData();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [monthlyIncome, setMonthlyIncome] = useState(userData.financeModule.monthlyIncome.toString());
  const [fixedExpenses, setFixedExpenses] = useState(userData.financeModule.fixedExpenses.toString());
  const [savingsGoal, setSavingsGoal] = useState(userData.financeModule.savingsGoal.toString());
  
  // Additional financial information
  const [additionalIncome, setAdditionalIncome] = useState("0");
  const [housingExpenses, setHousingExpenses] = useState("0");
  const [transportExpenses, setTransportExpenses] = useState("0");
  const [foodExpenses, setFoodExpenses] = useState("0");
  const [leisureExpenses, setLeisureExpenses] = useState("0");
  const [debtPayments, setDebtPayments] = useState("0");
  const [emergencyFund, setEmergencyFund] = useState("0");
  
  const handleSubmit = async () => {
    // Parse all values as integers (or default to 0 if invalid)
    const parsedValues = {
      monthlyIncome: parseInt(monthlyIncome) || 0,
      fixedExpenses: parseInt(fixedExpenses) || 0,
      savingsGoal: parseInt(savingsGoal) || 0,
      additionalIncome: parseInt(additionalIncome) || 0,
      housingExpenses: parseInt(housingExpenses) || 0,
      transportExpenses: parseInt(transportExpenses) || 0,
      foodExpenses: parseInt(foodExpenses) || 0,
      leisureExpenses: parseInt(leisureExpenses) || 0,
      debtPayments: parseInt(debtPayments) || 0,
      emergencyFund: parseInt(emergencyFund) || 0
    };
    
    // Add up fixed expenses
    const totalFixedExpenses = 
      parsedValues.housingExpenses + 
      parsedValues.transportExpenses + 
      parsedValues.foodExpenses + 
      parsedValues.leisureExpenses + 
      parsedValues.debtPayments;
    
    // Calculate total income
    const totalIncome = parsedValues.monthlyIncome + parsedValues.additionalIncome;
    
    // Prepare updates for finance module
    const updates: Partial<FinanceModule> = {
      monthlyIncome: totalIncome,
      fixedExpenses: totalFixedExpenses,
      savingsGoal: parsedValues.savingsGoal,
      // Add additional properties to FinanceModule
      additionalIncome: parsedValues.additionalIncome,
      housingExpenses: parsedValues.housingExpenses,
      transportExpenses: parsedValues.transportExpenses,
      foodExpenses: parsedValues.foodExpenses,
      leisureExpenses: parsedValues.leisureExpenses,
      debtPayments: parsedValues.debtPayments,
      emergencyFund: parsedValues.emergencyFund
    };
    
    await updateFinanceModule(updates);
    
    toast({
      title: t("success"),
      description: t("financesUpdated"),
    });
    
    onSave();
  };
  
  // Calculate totals for display
  const totalIncome = (parseInt(monthlyIncome) || 0) + (parseInt(additionalIncome) || 0);
  const totalExpenses = 
    (parseInt(housingExpenses) || 0) + 
    (parseInt(transportExpenses) || 0) + 
    (parseInt(foodExpenses) || 0) + 
    (parseInt(leisureExpenses) || 0) + 
    (parseInt(debtPayments) || 0);
  const remainingAmount = totalIncome - totalExpenses;
  const savingsAmount = parseInt(savingsGoal) || 0;
  const disposableIncome = remainingAmount - savingsAmount;
  
  return (
    <div className="space-y-6">
      <div className="glass-card p-4">
        <h3 className="font-pixel text-base mb-4 flex items-center">
          <BadgeDollarSign size={18} className="text-zou-purple mr-2" />
          {t("incomeDetails")}
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="monthlyIncome" className="mb-2 block flex items-center">
              <DollarSign size={16} className="text-zou-purple mr-2" />
              {t("monthlyIncome")}
            </Label>
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
            <Label htmlFor="additionalIncome" className="mb-2 block flex items-center">
              <Coins size={16} className="text-zou-purple mr-2" />
              {t("additionalIncome")}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input
                id="additionalIncome"
                type="number"
                value={additionalIncome}
                onChange={(e) => setAdditionalIncome(e.target.value)}
                className="pl-8"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-4">
        <h3 className="font-pixel text-base mb-4 flex items-center">
          <Wallet size={18} className="text-zou-purple mr-2" />
          {t("expensesDetails")}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="housingExpenses" className="mb-2 block">{t("housingExpenses")}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input
                id="housingExpenses"
                type="number"
                value={housingExpenses}
                onChange={(e) => setHousingExpenses(e.target.value)}
                className="pl-8"
                min="0"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="transportExpenses" className="mb-2 block">{t("transportExpenses")}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input
                id="transportExpenses"
                type="number"
                value={transportExpenses}
                onChange={(e) => setTransportExpenses(e.target.value)}
                className="pl-8"
                min="0"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="foodExpenses" className="mb-2 block">{t("foodExpenses")}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input
                id="foodExpenses"
                type="number"
                value={foodExpenses}
                onChange={(e) => setFoodExpenses(e.target.value)}
                className="pl-8"
                min="0"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="leisureExpenses" className="mb-2 block">{t("leisureExpenses")}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input
                id="leisureExpenses"
                type="number"
                value={leisureExpenses}
                onChange={(e) => setLeisureExpenses(e.target.value)}
                className="pl-8"
                min="0"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="debtPayments" className="mb-2 block flex items-center">
              <CreditCard size={16} className="text-zou-purple mr-2" />
              {t("debtPayments")}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input
                id="debtPayments"
                type="number"
                value={debtPayments}
                onChange={(e) => setDebtPayments(e.target.value)}
                className="pl-8"
                min="0"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="fixedExpenses" className="mb-2 block flex items-center">
              <Receipt size={16} className="text-zou-purple mr-2" />
              {t("otherFixedExpenses")}
            </Label>
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
        </div>
      </div>
      
      <div className="glass-card p-4">
        <h3 className="font-pixel text-base mb-4 flex items-center">
          <PiggyBank size={18} className="text-zou-purple mr-2" />
          {t("savingsAndGoals")}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="savingsGoal" className="mb-2 block">{t("monthlySavingsGoal")}</Label>
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
          
          <div>
            <Label htmlFor="emergencyFund" className="mb-2 block">{t("emergencyFund")}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input
                id="emergencyFund"
                type="number"
                value={emergencyFund}
                onChange={(e) => setEmergencyFund(e.target.value)}
                className="pl-8"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-muted/30 rounded-md">
        <h3 className="font-medium mb-2">{t("monthlySummary")}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>{t("totalIncome")}:</div>
          <div className="text-right font-mono">${totalIncome}</div>
          
          <div>{t("totalExpenses")}:</div>
          <div className="text-right font-mono">${totalExpenses}</div>
          
          <div className="font-medium">{t("remaining")}:</div>
          <div className={`text-right font-mono font-medium ${remainingAmount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            ${remainingAmount}
          </div>
          
          <div>{t("savingsGoal")}:</div>
          <div className="text-right font-mono">${savingsAmount}</div>
          
          <div className="font-medium">{t("disposableIncome")}:</div>
          <div className={`text-right font-mono font-medium ${disposableIncome >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            ${disposableIncome}
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleSubmit} 
        className="w-full pixel-button"
      >
        {t("saveChanges")}
      </Button>
    </div>
  );
};

export default EditFinanceModuleForm;
