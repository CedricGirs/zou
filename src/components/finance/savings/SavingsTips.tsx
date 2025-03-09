
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, Trophy, PiggyBank } from "lucide-react";

const SavingsTips = () => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Conseils d'épargne</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <TrendingUp size={16} />
              </div>
              <CardTitle className="text-base">Règle des 50/30/20</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Essayez d'allouer 50% aux besoins, 30% aux envies et 20% à l'épargne pour une meilleure gestion de budget.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Trophy size={16} />
              </div>
              <CardTitle className="text-base">Petites victoires</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Célébrez chaque étape atteinte vers vos objectifs. Les petites victoires maintiennent votre motivation.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <PiggyBank size={16} />
              </div>
              <CardTitle className="text-base">Automatisez</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Mettez en place des virements automatiques vers vos comptes d'épargne dès réception de votre salaire.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SavingsTips;
