
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SavingsGoal } from "@/context/UserDataContext";

interface ContributionDialogProps {
  selectedGoal: SavingsGoal | undefined;
  contribution: number;
  setContribution: (amount: number) => void;
  onContribute: () => Promise<void>;
  onCancel: () => void;
  currentBalance: number;
}

const ContributionDialog = ({
  selectedGoal,
  contribution,
  setContribution,
  onContribute,
  onCancel,
  currentBalance
}: ContributionDialogProps) => {
  if (!selectedGoal) return null;
  
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Ajouter à votre épargne</DialogTitle>
        <DialogDescription>
          Combien souhaitez-vous ajouter à l'objectif "{selectedGoal.name}"?
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <div className="space-y-2">
          <Label htmlFor="contribution">Montant</Label>
          <Input
            id="contribution"
            type="number"
            value={contribution}
            onChange={(e) => setContribution(Number(e.target.value))}
          />
        </div>
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Solde actuel:</span>
            <span>{currentBalance} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Épargné jusqu'ici:</span>
            <span>{selectedGoal.saved} €</span>
          </div>
          <div className="flex justify-between text-sm font-medium pt-1 border-t mt-1">
            <span>Après cette contribution:</span>
            <span>{selectedGoal.saved + contribution} €</span>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={onContribute}>
          Ajouter
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ContributionDialog;
