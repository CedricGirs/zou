
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const ReportsTabContent = () => {
  return (
    <TabsContent value="reports">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Rapports financiers</h3>
          <p className="text-muted-foreground">
            Cette section sera disponible prochainement...
          </p>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default ReportsTabContent;
