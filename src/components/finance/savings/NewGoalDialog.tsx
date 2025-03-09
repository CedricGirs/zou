
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SavingsGoal } from "@/context/UserDataContext";

interface NewGoalDialogProps {
  newGoal: Partial<SavingsGoal>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddGoal: () => Promise<void>;
}

const NewGoalDialog = ({ newGoal, onInputChange, onAddGoal }: NewGoalDialogProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Créer un nouvel objectif d'épargne</DialogTitle>
        <DialogDescription>
          Définissez un montant cible et une date limite pour votre objectif
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nom
          </Label>
          <Input
            id="name"
            name="name"
            value={newGoal.name}
            onChange={onInputChange}
            placeholder="Vacances, fonds d'urgence..."
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="target" className="text-right">
            Montant cible
          </Label>
          <Input
            id="target"
            name="target"
            type="number"
            value={newGoal.target}
            onChange={onInputChange}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="deadline" className="text-right">
            Date limite
          </Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            value={newGoal.deadline}
            onChange={onInputChange}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="saved" className="text-right">
            Déjà épargné
          </Label>
          <Input
            id="saved"
            name="saved"
            type="number"
            value={newGoal.saved}
            onChange={onInputChange}
            className="col-span-3"
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button onClick={onAddGoal}>Ajouter</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default NewGoalDialog;
