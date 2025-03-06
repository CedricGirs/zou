
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, PiggyBank, Target } from 'lucide-react';
import { useUserData, SavingsGoal } from "@/context/UserDataContext";
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const SavingsTracker = () => {
  const { userData, updateFinanceModule } = useUserData();
  const savingsGoals = userData.financeModule.savingsGoals || [];
  
  const [newGoal, setNewGoal] = useState<Partial<SavingsGoal>>({
    name: '',
    target: 0,
    saved: 0,
    deadline: new Date().toISOString().split('T')[0]
  });
  
  const [editGoal, setEditGoal] = useState<SavingsGoal | null>(null);
  const [additionalAmount, setAdditionalAmount] = useState(0);

  // Simulated monthly savings data - reset
  const savingsData = [
    { month: 'Jan', amount: 0 },
    { month: 'Fév', amount: 0 },
    { month: 'Mars', amount: 0 },
    { month: 'Avr', amount: 0 },
    { month: 'Mai', amount: 0 },
    { month: 'Juin', amount: 0 },
    { month: 'Juil', amount: 0 },
    { month: 'Août', amount: 0 },
    { month: 'Sept', amount: 0 },
    { month: 'Oct', amount: 0 },
    { month: 'Nov', amount: 0 },
    { month: 'Déc', amount: 0 }
  ];

  // Cumulative savings chart data
  const cumulativeSavingsData = savingsData.reduce((acc, curr, index) => {
    const prevAmount = index > 0 ? acc[index - 1].cumulative : 0;
    acc.push({
      ...curr,
      cumulative: prevAmount + curr.amount
    });
    return acc;
  }, [] as Array<{ month: string, amount: number, cumulative: number }>);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const { name, value, type } = e.target;
    
    if (isEdit && editGoal) {
      setEditGoal({
        ...editGoal,
        [name]: type === 'number' ? Number(value) : value
      });
    } else {
      setNewGoal({
        ...newGoal,
        [name]: type === 'number' ? Number(value) : value
      });
    }
  };

  const handleAddGoal = async () => {
    // Validate
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
      deadline: newGoal.deadline || ''
    };

    const updatedGoals = [...savingsGoals, goal];
    
    await updateFinanceModule({ savingsGoals: updatedGoals });
    
    toast({
      title: "Objectif ajouté",
      description: "L'objectif d'épargne a été ajouté avec succès."
    });
    
    // Reset form
    setNewGoal({
      name: '',
      target: 0,
      saved: 0,
      deadline: new Date().toISOString().split('T')[0]
    });
  };

  const handleDeleteGoal = async (id: string) => {
    const updatedGoals = savingsGoals.filter(g => g.id !== id);
    await updateFinanceModule({ savingsGoals: updatedGoals });
    
    toast({
      title: "Objectif supprimé",
      description: "L'objectif d'épargne a été supprimé avec succès."
    });
  };

  const handleUpdateGoal = async () => {
    if (!editGoal) return;
    
    const updatedGoals = savingsGoals.map(g => 
      g.id === editGoal.id ? editGoal : g
    );
    
    await updateFinanceModule({ savingsGoals: updatedGoals });
    
    toast({
      title: "Objectif mis à jour",
      description: "L'objectif d'épargne a été mis à jour avec succès."
    });
    
    setEditGoal(null);
  };

  const handleAddFunds = async (goal: SavingsGoal) => {
    if (additionalAmount <= 0) {
      toast({
        title: "Erreur",
        description: "Le montant doit être supérieur à 0.",
        variant: "destructive"
      });
      return;
    }

    const updatedGoal = {
      ...goal,
      saved: goal.saved + additionalAmount
    };

    const updatedGoals = savingsGoals.map(g => 
      g.id === goal.id ? updatedGoal : g
    );
    
    await updateFinanceModule({ savingsGoals: updatedGoals });
    
    toast({
      title: "Fonds ajoutés",
      description: `${additionalAmount}€ ont été ajoutés à votre objectif.`
    });
    
    setAdditionalAmount(0);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Objectifs d'épargne</CardTitle>
            <CardDescription>Suivez vos progrès vers vos objectifs financiers</CardDescription>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center">
                <Plus size={16} className="mr-1" />
                Nouvel objectif
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un objectif d'épargne</DialogTitle>
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
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deadline" className="text-right">Date limite</Label>
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
              <div className="flex justify-end">
                <Button onClick={handleAddGoal}>
                  Ajouter l'objectif
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Évolution de votre épargne</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={cumulativeSavingsData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} €`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="amount" 
                name="Épargne mensuelle" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                name="Épargne cumulée" 
                stroke="#82ca9d" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {savingsGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savingsGoals.map(goal => {
              const percentComplete = Math.min((goal.saved / goal.target) * 100, 100);
              const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={goal.id} className="pixel-card relative">
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button 
                          className="p-1 rounded hover:bg-muted"
                          onClick={() => setEditGoal(goal)}
                        >
                          <Edit size={16} />
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier l'objectif</DialogTitle>
                        </DialogHeader>
                        {editGoal && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">Nom</Label>
                              <Input
                                id="edit-name"
                                name="name"
                                value={editGoal.name}
                                onChange={(e) => handleInputChange(e, true)}
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
                                onChange={(e) => handleInputChange(e, true)}
                                className="col-span-3"
                              />
                            </div>
                            
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-saved" className="text-right">Déjà épargné (€)</Label>
                              <Input
                                id="edit-saved"
                                name="saved"
                                type="number"
                                value={editGoal.saved}
                                onChange={(e) => handleInputChange(e, true)}
                                className="col-span-3"
                              />
                            </div>
                            
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-deadline" className="text-right">Date limite</Label>
                              <Input
                                id="edit-deadline"
                                name="deadline"
                                type="date"
                                value={editGoal.deadline}
                                onChange={(e) => handleInputChange(e, true)}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex justify-end">
                          <Button onClick={handleUpdateGoal}>
                            Enregistrer les modifications
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <button 
                      className="p-1 rounded hover:bg-muted text-red-500"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex items-start mb-3">
                    <div className="mr-3 p-2 bg-muted/30 rounded-full">
                      <PiggyBank className="text-zou-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{goal.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Échéance: {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                        {daysLeft > 0 ? ` (${daysLeft} jours restants)` : ' (Terminé)'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{goal.saved} € épargnés</span>
                      <span>Objectif: {goal.target} €</span>
                    </div>
                    <Progress value={percentComplete} className="h-2" />
                    <div className="text-right text-xs mt-1">
                      {percentComplete.toFixed(0)}% complété
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-4">
                    <Input
                      type="number"
                      placeholder="Montant à ajouter"
                      className="mr-2"
                      value={additionalAmount || ''}
                      onChange={(e) => setAdditionalAmount(Number(e.target.value))}
                    />
                    <Button 
                      size="sm"
                      onClick={() => handleAddFunds(goal)}
                    >
                      Ajouter
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-6 border border-dashed rounded-md">
            <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Vous n'avez pas encore d'objectif d'épargne.
            </p>
            <p className="text-muted-foreground text-sm mt-1 mb-4">
              Créez votre premier objectif en cliquant sur le bouton "Nouvel objectif".
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={16} className="mr-2" />
                  Ajouter un objectif
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un objectif d'épargne</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Contenu du formulaire - identique à celui ci-dessus */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name2" className="text-right">Nom</Label>
                    <Input
                      id="name2"
                      name="name"
                      value={newGoal.name}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="target2" className="text-right">Objectif (€)</Label>
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
                    <Label htmlFor="saved2" className="text-right">Déjà épargné (€)</Label>
                    <Input
                      id="saved2"
                      name="saved"
                      type="number"
                      value={newGoal.saved}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="deadline2" className="text-right">Date limite</Label>
                    <Input
                      id="deadline2"
                      name="deadline"
                      type="date"
                      value={newGoal.deadline}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddGoal}>
                    Ajouter l'objectif
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingsTracker;
