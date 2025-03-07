
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { playSound } from "@/utils/audioUtils";
import { toast } from "@/hooks/use-toast";

interface FinanceHeaderProps {
  selectedMonth: string;
  onMonthChange: (value: string) => void;
}

const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const FinanceHeader: React.FC<FinanceHeaderProps> = ({ 
  selectedMonth, 
  onMonthChange 
}) => {
  const handleMonthChange = (value: string) => {
    onMonthChange(value);
    playSound('click');
    toast({
      title: "Mois sélectionné",
      description: `Données financières pour ${value} chargées.`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export des données financières",
      description: "Vos données financières ont été exportées avec succès.",
    });
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
        
        <Button variant="outline" size="sm" onClick={handleExportData}>
          <Trophy size={16} className="mr-2 text-amber-500" />
          Récompenses
        </Button>
      </div>
    </div>
  );
};

export default FinanceHeader;
