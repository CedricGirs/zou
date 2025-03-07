import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnnualBudgetProps {
  selectedMonth?: string;
  selectedYear?: string;
}

const AnnualBudget = ({ selectedMonth, selectedYear }: AnnualBudgetProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Annuel {selectedYear}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Planification budgétaire pour {selectedMonth} {selectedYear}</p>
        {/* Contenu du budget annuel */}
      </CardContent>
    </Card>
  );
};

export default AnnualBudget;
