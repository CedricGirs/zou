
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthSelectorProps {
  selectedMonth: string;
  previousMonth: string;
  nextMonth: string;
  handleMonthChange: (month: string) => void;
  transactionsCount: number;
}

const MonthSelector = ({ 
  selectedMonth, 
  previousMonth, 
  nextMonth, 
  handleMonthChange,
  transactionsCount
}: MonthSelectorProps) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg shadow-sm">
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => handleMonthChange(previousMonth)}
        title={`Mois précédent: ${previousMonth}`}
        className="transition-all hover:bg-purple-100"
      >
        <ChevronLeft size={18} />
      </Button>
      
      <div className="flex flex-col items-center min-w-[120px]">
        <h3 className="font-medium text-lg">{selectedMonth}</h3>
        <p className="text-xs text-muted-foreground">
          {transactionsCount > 0 
            ? `${transactionsCount} transactions` 
            : "Aucune donnée"}
        </p>
      </div>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => handleMonthChange(nextMonth)}
        title={`Mois suivant: ${nextMonth}`}
        className="transition-all hover:bg-purple-100"
      >
        <ChevronRight size={18} />
      </Button>
    </div>
  );
};

export default MonthSelector;
