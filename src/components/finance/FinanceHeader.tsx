
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { playSound } from "@/utils/audioUtils";
import { useUserData, MonthlyData } from "@/context/userData";

interface FinanceHeaderProps {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  currentMonthData: MonthlyData;
  setCurrentMonthData: React.Dispatch<React.SetStateAction<MonthlyData>>;
}

const FinanceHeader = ({ 
  selectedMonth, 
  setSelectedMonth, 
  currentMonthData, 
  setCurrentMonthData 
}: FinanceHeaderProps) => {
  const { userData, updateFinanceModule } = useUserData();
  
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Set default month to current month on initial load
  useEffect(() => {
    if (!selectedMonth) {
      const currentMonth = months[new Date().getMonth()];
      setSelectedMonth(currentMonth);
    }
  }, [selectedMonth, setSelectedMonth, months]);

  const handleMonthChange = async (value: string) => {
    // Save current month data before changing
    if (userData?.financeModule) {
      const currentMonthlyData = userData.financeModule.monthlyData || {};
      
      // Create a new object with updated data for the current month
      const updatedMonthlyData = {
        ...currentMonthlyData,
        [selectedMonth]: currentMonthData
      };
      
      // Update finance module with new data
      await updateFinanceModule({ monthlyData: updatedMonthlyData });
      console.log(`Saved data for ${selectedMonth} before switching month`);
    }
    
    // Change selected month
    setSelectedMonth(value);
    
    // Load data for newly selected month
    const monthlyData = userData?.financeModule?.monthlyData || {};
    const newMonthData = monthlyData[value] || {
      income: 0,
      expenses: 0,
      balance: 0,
      savingsRate: 0,
      transactions: []
    };
    
    console.log(`Loading data for ${value}:`, newMonthData);
    setCurrentMonthData(newMonthData);
    
    toast({
      title: "Mois sélectionné",
      description: `Données financières pour ${value} chargées.`,
    });
    
    playSound('click');
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="font-pixel text-3xl mb-2">Finance Quest</h1>
        <p className="text-muted-foreground">Gérez votre argent, progressez, atteignez vos objectifs</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Mois" />
          </SelectTrigger>
          <SelectContent>
            {months.map(month => (
              <SelectItem key={month} value={month}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FinanceHeader;
