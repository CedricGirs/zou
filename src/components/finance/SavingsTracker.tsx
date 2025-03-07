import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useUserData } from "@/context/UserDataContext";
import { PiggyBank, Target, Plus, Edit2, Trash2, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SavingsTrackerProps {
  unlockAchievement?: (achievementId: string) => Promise<void>;
  completeQuestStep?: (questId: string, progress: number) => Promise<void>;
  monthlyIncome?: number;
}

const SavingsTracker = ({ 
  unlockAchievement, 
  completeQuestStep,
  monthlyIncome = 0
}: SavingsTrackerProps) => {
  const { userData, updateFinanceModule } = useUserData();
  const savingsGoals = userData?.financeModule?.savingsGoals || [];
  
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState<string | null>(null);
  
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: 0,
    saved: 0,
    deadline: ''
  });
  
  const [editGoal, setEditGoal] = useState({
    name: '',
    target: 0,
    saved: 0,
    deadline: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewGoal({
      ...newGoal,
      [name]: type === 'number' ? Number(value) : value
    });
  };
  
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditGoal({
      ...editGoal,
      [name]: type === 'number' ? Number(value) : value
    });
  };
  
  const handleAddGoal = async () => {
    if (!newGoal.name || newGoal.target <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    const goal = {
      id: uuidv4(),
      name: newGoal.name,
      target: newGoal.target,
      saved: newGoal.saved,
      deadline: newGoal.deadline
    };
    
    const updatedGoals = [...savingsGoals, goal];
    await updateFinanceModule({ savingsGoals: updatedGoals });
    
    toast({
      title: "Objectif ajouté",
      description: "Votre objectif d'épargne a été ajouté avec succès."
    });
    
    // Advance quest if applicable
    if (completeQuestStep) {
      completeQuestStep("create_savings", 100);
    }
    
    // Unlock achievement if applicable
    if (unlockAchievement && savingsGoals.length === 0) {
      unlockAchievement("first_savings");
    }
    
    setNewGoal({
      name: '',
      target: 0,
      saved: 0,
      deadline: ''
    });
    
    setIsAddingGoal(false);
  };
  
  const handleEditGoal = (goalId: string) => {
    const goal = savingsGoals.find(g => g.id === goalId);
    if (!goal) return;
    
    setEditGoal({
      name: goal.name,
      target: goal.target,
      saved: goal.saved,
      deadline: goal.deadline
    });
    
    setIsEditingGoal(goalId);
  };
  
  const handleSaveEdit = async () => {
    if (!isEditingGoal) return;
    
    const updatedGoals = savingsGoals.map(goal => 
      goal.id === isEditingGoal 
        ? { ...goal, name: editGoal.name, target: editGoal.target, saved: editGoal.saved, deadline: editGoal.deadline }
        : goal
    );
    
    await updateFinanceModule({ savingsGoals: updatedGoals });
    
    toast({
      title: "Objectif mis à jour",
      description: "Votre objectif d'épargne a été mis à jour avec succès."
    });
    
    setIsEditingGoal(null);
  };
  
  const handleDeleteGoal = async (goalId: string) => {
    const updatedGoals = savingsGoals.filter(goal => goal.id !== goalId);
    await updateFinanceModule({ savingsGoals: updatedGoals });
    
    toast({
      title: "Objectif supprimé",
      description: "Votre objectif d'épargne a été supprimé avec succès."
    });
  };
  
  const handleAddSavings = async (goalId: string, amount: number) => {
    const updatedGoals = savingsGoals.map(goal => {
      if (goal.id === goalId) {
        const newSaved = goal.saved + amount;
        return { ...goal, saved: newSaved };
      }
      return goal;
    });
    
    await updateFinanceModule({ savingsGoals: updatedGoals });
    
    toast({
      title: "Épargne ajoutée",
      description: `${amount}€ ont été ajoutés à votre objectif.`
    });
    
    // Check if goal is completed
    const updatedGoal = updatedGoals.find(g => g.id === goalId);
    if (updatedGoal && updatedGoal.saved >= updatedGoal.target) {
      toast({
        title: "Objectif atteint!",
        description: "Félicitations, vous avez atteint votre objectif d'épargne!"
      });
      
      // Unlock achievement if applicable
      if (unlockAchievement) {
        unlockAchievement("goal_achiever");
      }
    }
  };
  
  const calculateProgress = (saved: number, target: number) => {
    return Math.min((saved / target) * 100, 100);
  };
  
  const getProgressVariant = (progress: number) => {
    if (progress < 25) return "danger";
    if (progress < 50) return "warning";
    if (progress < 75) return "purple";
    return "success";
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "Non définie";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const calculateMonthlyAmount = (target: number, saved: number, deadline: string) => {
    if (!deadline) return 0;
    
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const monthsLeft = (deadlineDate.getFullYear() - today.getFullYear()) * 12 + 
                       (deadlineDate.getMonth() - today.getMonth());
    
    if (monthsLeft <= 0) return target - saved;
    
    return Math.ceil((target - saved) / monthsLeft);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Objectifs d'épargne</CardTitle>
              <CardDescription>Suivez vos progrès vers vos objectifs financiers</CardDescription>
            </div>
            <Button onClick={() => setIsAddingGoal(true)} size="sm">
              <Plus size={16} className="mr-2" />
              Nouvel objectif
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {savingsGoals.length === 0 ? (
            <div className="text-center p-6 border border-dashed rounded-md">
              <PiggyBank className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-medium">
                Vous n'avez pas encore d'objectifs d'épargne.
              </p>
              <p className="text-muted-foreground text-sm mt-1 mb-4">
                Créez votre premier objectif pour commencer à suivre votre progression.
              </p>
              <Button onClick={() => setIsAddingGoal(true)}>
                <Plus size={16} className="mr-2" />
                Créer un objectif
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savingsGoals.map(goal => {
                const progress = calculateProgress(goal.saved, goal.target);
                const progressVariant = getProgressVariant(progress);
                const monthlyAmount = calculateMonthlyAmount(goal.target, goal.saved, goal.deadline);
                
                return (
                  <Card key={goal.id} className="overflow-hidden">
                    <div className={`h-1 w-full ${
                      progress === 100 ? 'bg-green-500' : 'bg-purple-500'
                    }`}></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                            <Target size={16} />
                          </div>
                          <CardTitle className="text-base">{goal.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEditGoal(goal.id)}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleDeleteGoal(goal.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        Échéance: {formatDate(goal.deadline)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{goal.saved} € épargnés</span>
                          <span className="text-sm font-medium">{goal.target} €</span>
                        </div>
                        <Progress value={progress} className="h-2" variant={progressVariant} />
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Reste: {goal.target - goal.saved} €</span>
                          <span>{progress.toFixed(0)}% complété</span>
                        </div>
                        
                        {goal.deadline && monthlyAmount > 0 && (
                          <div className="p-2 bg-muted/50 rounded-md text-xs">
                            <div className="flex items-center gap-1">
                              <Sparkles size={12} className="text-amber-500" />
                              <span>Épargnez <strong>{monthlyAmount} €/mois</strong> pour atteindre votre objectif à temps</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="w-full flex justify-between items-center">
                        <div className="flex items-center text-xs text-purple-600">
                          <Trophy size={12} className="mr-1 text-amber-500" />
                          <span>+15 XP pour 25% atteints</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAddSavings(goal.id, 100)}
                        >
                          Ajouter 100€
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog for adding a new goal */}
      <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un objectif d'épargne</DialogTitle>
            <DialogDescription>
              Définissez un nouvel objectif pour votre épargne
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nom</Label>
              <Input
                id="name"
                name="name"
                value={newGoal.name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Vacances, Voiture, etc."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="target" className="text-right">Objectif (€)</Label>
              <Input
                id="target"
                name="target"
                type="number"
                value={newGoal.target}
                onChange={handleInputChange}
                className="col-span-3"
                min={0}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="saved" className="text-right">Déjà épargné (€)</Label>
              <Input
                id="saved"
                name="saved"
                type="number"
                value={newGoal.saved}
                onChange={handleInputChange}
                className="col-span-3"
                min={0}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline" className="text-right">Échéance</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={newGoal.deadline}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddGoal}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for editing a goal */}
      <Dialog open={!!isEditingGoal} onOpenChange={(open) => !open && setIsEditingGoal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'objectif d'épargne</DialogTitle>
            <DialogDescription>
              Mettez à jour les détails de votre objectif
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Nom</Label>
              <Input
                id="edit-name"
                name="name"
                value={editGoal.name}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-target" className="text-right">Objectif (€)</Label>
              <Input
                id="edit-target"
                name="target"
                type="number"
                value={editGoal.target}
                onChange={handleEditInputChange}
                className="col-span-3"
                min={0}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-saved" className="text-right">Épargné (€)</Label>
              <Input
                id="edit-saved"
                name="saved"
                type="number"
                value={editGoal.saved}
                onChange={handleEditInputChange}
                className="col-span-3"
                min={0}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-deadline" className="text-right">Échéance</Label>
              <Input
                id="edit-deadline"
                name="deadline"
                type="date"
                value={editGoal.deadline}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEdit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
          <CardTitle>Conseils d'épargne</CardTitle>
          <CardDescription>Optimisez votre stratégie d'épargne</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/30">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <PiggyBank size={16} className="text-purple-500" />
                Règle des 50/30/20
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Répartissez votre revenu mensuel de {monthlyIncome}€ comme suit:
              </p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Besoins essentiels (50%)</span>
                    <span>{Math.round(monthlyIncome * 0.5)}€</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Plaisirs personnels (30%)</span>
                    <span>{Math.round(monthlyIncome * 0.3)}€</span>
                  </div>
                  <Progress value={30} className="h-2" variant="purple" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Épargne et investissements (20%)</span>
                    <span>{Math.round(monthlyIncome * 0.2)}€</span>
                  </div>
                  <Progress value={20} className="h-2" variant="success" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Fonds d'urgence</h3>
                <p className="text-sm text-muted-foreground">
                  Visez 3 à 6 mois de dépenses: {Math.round(monthlyIncome * 0.7 * 3)}€ à {Math.round(monthlyIncome * 0.7 * 6)}€
                </p>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Automatisez votre épargne</h3>
                <p className="text-sm text-muted-foreground">
                  Mettez en place un virement automatique de {Math.round(monthlyIncome * 0.1)}€ par mois
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SavingsTracker;
