
import React, { useState } from 'react';
import { Edit, Target, Trophy, Sparkles, Zap, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { useUserData } from '@/context/UserDataContext';
import { toast } from '@/hooks/use-toast';

interface SavingsGoalCardProps {
  savingsGoal: number;
  totalCumulativeSavings: number;
  completeQuestStep?: (questId: string, progress: number) => Promise<void>;
  updateXPAndLevel: () => void;
}

const SavingsGoalCard = ({ 
  savingsGoal, 
  totalCumulativeSavings, 
  completeQuestStep,
  updateXPAndLevel
}: SavingsGoalCardProps) => {
  const { userData, updateFinanceModule } = useUserData();
  const [isEditingSavingsGoal, setIsEditingSavingsGoal] = useState(false);
  const [savingsGoalValue, setSavingsGoalValue] = useState(userData.financeModule?.savingsGoal || 0);

  const handleOpenSavingsGoalDialog = () => {
    setSavingsGoalValue(userData.financeModule?.savingsGoal || 0);
    setIsEditingSavingsGoal(true);
  };
  
  const handleSaveSavingsGoal = async () => {
    await updateFinanceModule({ savingsGoal: savingsGoalValue });
    
    toast({
      title: "Objectif d'épargne mis à jour",
      description: "Votre objectif d'épargne a été mis à jour avec succès. +20 XP!",
    });
    
    if (completeQuestStep && userData.financeModule?.quests) {
      const createSavingsQuest = userData.financeModule.quests.find(q => q.id === "create_savings");
      if (createSavingsQuest) {
        await completeQuestStep("create_savings", 50);
        updateXPAndLevel();
      }
    }
    
    setIsEditingSavingsGoal(false);
  };

  const calculateSavingsProgress = () => {
    if (!userData.financeModule?.savingsGoal || userData.financeModule.savingsGoal <= 0) return 0;
    const progress = (totalCumulativeSavings / userData.financeModule.savingsGoal) * 100;
    return Math.min(progress, 100);
  };

  const savingsProgress = calculateSavingsProgress();

  const getProgressVariant = () => {
    if (savingsProgress < 25) return "danger";
    if (savingsProgress < 50) return "warning";
    if (savingsProgress < 75) return "purple";
    return "success";
  };

  const getMotivationalMessage = () => {
    if (savingsProgress < 10) return "Commencez à épargner dès maintenant!";
    if (savingsProgress < 30) return "Bon début, continuez comme ça!";
    if (savingsProgress < 60) return "Vous êtes sur la bonne voie!";
    if (savingsProgress < 90) return "Presque là, encore un effort!";
    return "Félicitations, objectif atteint! 🎉";
  };

  return (
    <Dialog open={isEditingSavingsGoal} onOpenChange={setIsEditingSavingsGoal}>
      <div 
        onClick={handleOpenSavingsGoalDialog}
        className="glass-card p-6 flex flex-col gap-4 hover:shadow-md transition-all cursor-pointer relative group overflow-hidden"
      >
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit size={16} />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
              <Target size={20} />
            </div>
            <div>
              <h3 className="font-semibold">Objectif épargne</h3>
              <p className="text-sm text-muted-foreground">Suivi de votre progression</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{userData.financeModule?.savingsGoal || 0} €</div>
            <p className="text-sm text-purple-600">Objectif</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Économies cumulées: {totalCumulativeSavings} €</span>
            <span className="font-medium">{savingsProgress.toFixed(0)}%</span>
          </div>
          <Progress 
            value={savingsProgress} 
            className="h-3" 
            variant={getProgressVariant()}
          />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-xs">
              <Sparkles size={14} className="text-amber-500" />
              <span>{getMotivationalMessage()}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              Reste: {Math.max(0, (userData.financeModule?.savingsGoal || 0) - totalCumulativeSavings)} €
            </span>
          </div>
        </div>
        
        <div className="mt-2 p-2 rounded-md bg-purple-50 border border-purple-100 flex items-center justify-between">
          <div className="flex items-center text-xs text-purple-700">
            <Trophy size={12} className="mr-1 text-amber-500" />
            <span>+20 XP pour un objectif atteint</span>
          </div>
          <div className="flex items-center">
            {savingsProgress >= 100 && (
              <Award size={16} className="ml-2 text-amber-500 animate-pulse" />
            )}
          </div>
        </div>
      </div>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'objectif d'épargne</DialogTitle>
          <DialogDescription>
            Définissez votre objectif d'épargne à atteindre
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="savingsGoal" className="text-right">
              Objectif
            </Label>
            <Input
              id="savingsGoal"
              type="number"
              value={savingsGoalValue}
              onChange={(e) => setSavingsGoalValue(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-1">
              Progression
            </Label>
            <div className="col-span-3">
              <Progress 
                value={savingsProgress} 
                className="h-2" 
                variant={getProgressVariant()}
              />
              <p className="text-xs text-muted-foreground mt-1">{savingsProgress.toFixed(0)}% réalisé</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-purple-600">
            <Zap size={16} className="mr-1 text-amber-500" />
            <span>+20 XP</span>
          </div>
          <Button onClick={handleSaveSavingsGoal}>
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SavingsGoalCard;
