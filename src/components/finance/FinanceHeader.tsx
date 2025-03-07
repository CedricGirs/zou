
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { playSound } from "@/utils/audioUtils";
import { useUserData, MonthlyData } from "@/context/UserDataContext";

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

  const handleMonthChange = async (value: string) => {
    if (userData?.financeModule) {
      const monthlyData = {
        ...(userData.financeModule.monthlyData || {}),
        [selectedMonth]: currentMonthData
      };
      
      await updateFinanceModule({ monthlyData });
    }
    
    setSelectedMonth(value);
    
    const newMonthData = userData?.financeModule?.monthlyData?.[value] || {
      income: 0,
      expenses: 0,
      balance: 0,
      savingsRate: 0,
      transactions: []
    };
    
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
