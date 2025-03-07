import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FinancialReportsProps {
  selectedMonth?: string;
  selectedYear?: string;
}

const FinancialReports = ({ selectedMonth, selectedYear }: FinancialReportsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rapports Financiers</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Analyses et rapports pour {selectedMonth} {selectedYear}</p>
        {/* Contenu des rapports financiers */}
      </CardContent>
    </Card>
  );
};

export default FinancialReports;
