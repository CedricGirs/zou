
import { ChevronDown } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface MonthSelectorProps {
  selectedMonth: string;
  months: string[];
  handleMonthChange: (month: string) => void;
  transactionsCount: number;
}

const MonthSelector = ({ 
  selectedMonth, 
  months,
  handleMonthChange,
  transactionsCount
}: MonthSelectorProps) => {
  return (
    <div className="flex flex-col gap-1 p-2 bg-muted rounded-lg shadow-sm">
      <Select
        value={selectedMonth}
        onValueChange={handleMonthChange}
      >
        <SelectTrigger className="w-[180px] bg-white">
          <div className="flex justify-between items-center w-full">
            <SelectValue placeholder="Sélectionner un mois" />
            <ChevronDown size={16} className="ml-2 shrink-0" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white">
          {months.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground text-center">
        {transactionsCount > 0 
          ? `${transactionsCount} transactions` 
          : "Aucune donnée"}
      </p>
    </div>
  );
};

export default MonthSelector;
