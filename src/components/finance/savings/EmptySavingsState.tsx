
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PiggyBank, Plus } from "lucide-react";

interface EmptySavingsStateProps {
  onOpenDialog: () => void;
}

const EmptySavingsState = ({ onOpenDialog }: EmptySavingsStateProps) => {
  return (
    <Card className="border-dashed">
      <CardContent className="pt-6 text-center">
        <PiggyBank className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-medium text-lg mb-2">Pas d'objectifs d'épargne</h3>
        <p className="text-muted-foreground mb-4">
          Commencez à définir vos objectifs d'épargne pour suivre vos progrès financiers
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={onOpenDialog}>
              <Plus size={16} className="mr-2" />
              Créer mon premier objectif
            </Button>
          </DialogTrigger>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EmptySavingsState;
