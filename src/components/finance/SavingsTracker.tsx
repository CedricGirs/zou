
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PiggyBank, Plus, Target, Trophy, Trash2, TrendingUp } from "lucide-react";
import { useUserData, SavingsGoal } from "@/context/UserDataContext";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface SavingsTrackerProps {
  unlockAchievement?: (achievementId: string) => Promise<void>;
  completeQuestStep?: (questId: string, progress: number) => Promise<void>;
}

const SavingsTracker = ({ unlockAchievement, completeQuestStep }: SavingsTrackerProps) => {
  const { userData, updateFinanceModule } = useUserData();
  const savingsGoals = userData?.financeModule?.savingsGoals || [];

  const [newGoal, setNewGoal] = useState<Partial<SavingsGoal>>({
    name: '',
    target: 0,
    saved: 0,
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]
  });

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [contribution, setContribution] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewGoal({
      ...newGoal,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleAddGoal = async () => {
    // Validation
    if (!newGoal.name || !newGoal.target || !newGoal.deadline) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    const goal: SavingsGoal = {
      id: uuidv4(),
      name: newGoal.name || '',
      target: newGoal.target || 0,
      saved: newGoal.saved || 0,
      deadline: newGoal.deadline || '',
    };

    const updatedGoals = [...savingsGoals, goal];
    
    await updateFinanceModule({ savingsGoals: updatedGoals });
    
    toast({
      title: "Objectif ajouté",
      description: "Votre objectif d'épargne a été ajouté avec succès."
    });
    
    // Complete quest step if provided
    if (completeQuestStep) {
      completeQuestStep("create_savings", 100);
    }
    
    // Unlock achievement if first savings goal
    if (unlockAchievement && savingsGoals.length === 0) {
      unlockAchievement("first_savings");
    }
    
    // Reset form
    setNewGoal({
      name: '',
      target: 0,
      saved: 0,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]
    });
  };

  const handleDeleteGoal = async (id: string) => {
    const updatedGoals = savingsGoals.filter(goal => goal.id !== id);
    await updateFinanceModule({ savingsGoals: updatedGoals });
    
    toast({
      title: "Objectif supprimé",
      description: "Votre objectif d'épargne a été supprimé avec succès."
    });
  };

  const handleContribute = async () => {
    if (!selectedGoalId || contribution <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un montant valide.",
        variant: "destructive"
      });
      return;
    }

    const updatedGoals = [...savingsGoals];
    const goalIndex = updatedGoals.findIndex(goal => goal.id === selectedGoalId);
    
    if (goalIndex === -1) return;
    
    updatedGoals[goalIndex] = {
      ...updatedGoals[goalIndex],
      saved: updatedGoals[goalIndex].saved + contribution
    };
    
    await updateFinanceModule({ 
      savingsGoals: updatedGoals,
      // Réduire le solde actuel
      balance: (userData?.financeModule?.balance || 0) - contribution
    });
    
    // Ajouter une transaction pour cet épargne
    if (userData?.financeModule?.transactions) {
      const newTransaction = {
        id: uuidv4(),
        date: new Date().toISOString().split('T')[0],
        description: `Épargne - ${updatedGoals[goalIndex].name}`,
        amount: contribution,
        category: 'Épargne',
        type: 'expense' as const,
        month: new Date().toLocaleString('fr-FR', { month: 'long' }),
        isVerified: true
      };
      
      await updateFinanceModule({ 
        transactions: [...userData.financeModule.transactions, newTransaction],
        monthlyExpenses: (userData.financeModule.monthlyExpenses || 0) + contribution
      });
    }
    
    toast({
      title: "Contribution ajoutée",
      description: `Vous avez ajouté ${contribution}€ à votre objectif "${updatedGoals[goalIndex].name}".`
    });
    
    setSelectedGoalId(null);
    setContribution(0);
  };

  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  const calculateTimeLeft = (deadline: string) => {
    const today = new Date();
    const targetDate = new Date(deadline);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Dépassé";
    if (diffDays === 0) return "Aujourd'hui!";
    if (diffDays === 1) return "Demain";
    
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    
    if (months > 0) {
      return `${months} mois${months > 1 ? '' : ''} ${days > 0 ? `et ${days} jour${days > 1 ? 's' : ''}` : ''}`;
    }
    
    return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Objectifs d'épargne</h2>
          <p className="text-muted-foreground">Suivez vos progrès vers vos objectifs financiers</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Nouvel objectif
            </Button>
          </DialogTrigger>
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
      </div>
      
      {savingsGoals.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <PiggyBank className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium text-lg mb-2">Pas d'objectifs d'épargne</h3>
            <p className="text-muted-foreground mb-4">
              Commencez à définir vos objectifs d'épargne pour suivre vos progrès financiers
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={16} className="mr-2" />
                  Créer mon premier objectif
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un nouvel objectif d'épargne</DialogTitle>
                  <DialogDescription>
                    Définissez un montant cible et une date limite pour votre objectif
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name2" className="text-right">
                      Nom
                    </Label>
                    <Input
                      id="name2"
                      name="name"
                      value={newGoal.name}
                      onChange={handleInputChange}
                      placeholder="Vacances, fonds d'urgence..."
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="target2" className="text-right">
                      Montant cible
                    </Label>
                    <Input
                      id="target2"
                      name="target"
                      type="number"
                      value={newGoal.target}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="deadline2" className="text-right">
                      Date limite
                    </Label>
                    <Input
                      id="deadline2"
                      name="deadline"
                      type="date"
                      value={newGoal.deadline}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="saved2" className="text-right">
                      Déjà épargné
                    </Label>
                    <Input
                      id="saved2"
                      name="saved"
                      type="number"
                      value={newGoal.saved}
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
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savingsGoals.map(goal => {
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
                      onClick={() => handleDeleteGoal(goal.id)}
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
                        onClick={() => setSelectedGoalId(goal.id)}
                      >
                        Ajouter des fonds
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ajouter à votre épargne</DialogTitle>
                        <DialogDescription>
                          Combien souhaitez-vous ajouter à l'objectif "{goal.name}"?
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
                            <span>{userData?.financeModule?.balance || 0} €</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Épargné jusqu'ici:</span>
                            <span>{goal.saved} €</span>
                          </div>
                          <div className="flex justify-between text-sm font-medium pt-1 border-t mt-1">
                            <span>Après cette contribution:</span>
                            <span>{goal.saved + contribution} €</span>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedGoalId(null)}>
                          Annuler
                        </Button>
                        <Button onClick={handleContribute}>
                          Ajouter
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      
      {savingsGoals.length > 0 && (
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
      )}
    </div>
  );
};

export default SavingsTracker;
