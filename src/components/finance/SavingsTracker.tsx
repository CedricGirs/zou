
import React, { useState } from 'react';
import { useUserData, SavingsGoal } from "@/context/UserDataContext";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/hooks/use-toast";

// Import our new components
import SavingsGoalCard from './savings/SavingsGoalCard';
import EmptySavingsState from './savings/EmptySavingsState';
import SavingsTips from './savings/SavingsTips';
import ContributionDialog from './savings/ContributionDialog';
import NewGoalDialog from './savings/NewGoalDialog';
import { formatDeadline, calculateTimeLeft } from './savings/savingsUtils';

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
  const [isAddingGoal, setIsAddingGoal] = useState<boolean>(false);

  const selectedGoal = savingsGoals.find(goal => goal.id === selectedGoalId);

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
    
    setIsAddingGoal(false);
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

  const openAddGoalDialog = () => {
    setIsAddingGoal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Objectifs d'épargne</h2>
          <p className="text-muted-foreground">Suivez vos progrès vers vos objectifs financiers</p>
        </div>
        
        <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
          <Button onClick={openAddGoalDialog}>
            <Plus size={16} className="mr-2" />
            Nouvel objectif
          </Button>
          
          <NewGoalDialog 
            newGoal={newGoal} 
            onInputChange={handleInputChange} 
            onAddGoal={handleAddGoal} 
          />
        </Dialog>
      </div>
      
      {savingsGoals.length === 0 ? (
        <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
          <EmptySavingsState onOpenDialog={openAddGoalDialog} />
          
          <NewGoalDialog 
            newGoal={newGoal} 
            onInputChange={handleInputChange} 
            onAddGoal={handleAddGoal} 
          />
        </Dialog>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savingsGoals.map(goal => (
            <SavingsGoalCard 
              key={goal.id}
              goal={goal}
              onDelete={handleDeleteGoal}
              onSelectForContribution={setSelectedGoalId}
              formatDeadline={formatDeadline}
              calculateTimeLeft={calculateTimeLeft}
            />
          ))}
        </div>
      )}
      
      {savingsGoals.length > 0 && (
        <SavingsTips />
      )}
      
      <Dialog open={!!selectedGoalId} onOpenChange={(open) => !open && setSelectedGoalId(null)}>
        <ContributionDialog 
          selectedGoal={selectedGoal}
          contribution={contribution}
          setContribution={setContribution}
          onContribute={handleContribute}
          onCancel={() => setSelectedGoalId(null)}
          currentBalance={userData?.financeModule?.balance || 0}
        />
      </Dialog>
    </div>
  );
};

export default SavingsTracker;
