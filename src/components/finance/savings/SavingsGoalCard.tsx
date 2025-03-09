
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { SavingsGoal } from "@/context/UserDataContext";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onDelete: (id: string) => Promise<void>;
  onSelectForContribution: (id: string) => void;
  formatDeadline: (dateString: string) => string;
  calculateTimeLeft: (deadline: string) => string;
}

const SavingsGoalCard = ({ 
  goal, 
  onDelete, 
  onSelectForContribution, 
  formatDeadline,
  calculateTimeLeft 
}: SavingsGoalCardProps) => {
  const progress = goal.target > 0 ? Math.min(Math.round((goal.saved / goal.target) * 100), 100) : 0;
  const completed = progress >= 100;
  
  return (
    <Card key={goal.id} className={`overflow-hidden ${completed ? 'border-green-200 bg-green-50' : ''}`}>
      {completed && (
        <div className="bg-green-500 text-white text-xs text-center py-1">
          Objectif atteint! 🎉
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle>{goal.name}</CardTitle>
            <CardDescription>Échéance: {formatDeadline(goal.deadline)}</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDelete(goal.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm">{goal.saved} € économisés</span>
          <span className="text-sm font-medium">Objectif: {goal.target} €</span>
        </div>
        <Progress value={progress} className="h-2 mb-2" />
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{progress}% complété</span>
          <span>{calculateTimeLeft(goal.deadline)} restants</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="text-xs flex items-center">
          <Target size={14} className="mr-1 text-purple-500" />
          <span>Reste: {goal.target - goal.saved} €</span>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onSelectForContribution(goal.id)}
            >
              Ajouter des fonds
            </Button>
          </DialogTrigger>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default SavingsGoalCard;
