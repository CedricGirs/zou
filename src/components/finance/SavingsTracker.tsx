
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, PiggyBank, CircleCheckBig, Circle, Calendar, Calculator } from 'lucide-react';
import { useUserData, SavingsGoal } from "@/context/UserDataContext";
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

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
  const [additionalAmount, setAdditionalAmount] = useState<number | ''>('');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Simulated monthly savings data
  const savingsData = [
    { month: 'Jan', amount: 300 },
    { month: 'Fév', amount: 350 },
    { month: 'Mars', amount: 200 },
    { month: 'Avr', amount: 400 },
    { month: 'Mai', amount: 280 },
    { month: 'Juin', amount: 320 },
    { month: 'Juil', amount: 380 },
    { month: 'Août', amount: 450 },
    { month: 'Sept', amount: 400 },
    { month: 'Oct', amount: 320 },
    { month: 'Nov', amount: 380 },
    { month: 'Déc', amount: 500 }
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

  // Average monthly savings
  const averageSavings = savingsData.reduce((sum, item) => sum + item.amount, 0) / savingsData.length;

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
    
    setShowDialog(false);
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
    if (!additionalAmount || additionalAmount <= 0) {
      toast({
        title: "Erreur",
        description: "Le montant doit être supérieur à 0.",
        variant: "destructive"
      });
      return;
    }

    const updatedGoal = {
      ...goal,
      saved: goal.saved + Number(additionalAmount)
    };

    const updatedGoals = savingsGoals.map(g => 
      g.id === goal.id ? updatedGoal : g
    );
    
    await updateFinanceModule({ savingsGoals: updatedGoals });
    
    toast({
      title: "Fonds ajoutés",
      description: `${additionalAmount}€ ont été ajoutés à votre objectif.`
    });
    
    setAdditionalAmount('');
    setSelectedGoalId(null);
  };

  // Calculate total saved and total target across all goals
  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.saved, 0);
  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
  const totalProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="glass-card p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <PiggyBank className="mr-2 text-zou-purple" size={20} />
          <h2 className="font-pixel text-lg">Objectifs d'épargne</h2>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <button className="pixel-button flex items-center">
              <Plus size={16} className="mr-1" />
              Ajouter un objectif
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un objectif d'épargne</DialogTitle>
              <DialogDescription>
                Définissez un nouvel objectif pour organiser votre épargne
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
                  placeholder="Ex: Vacances, Voiture, etc."
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="target" className="text-right">Objectif (€)</Label>
                <div className="col-span-3 relative">
                  <Input
                    id="target"
                    name="target"
                    type="number"
                    value={newGoal.target || ''}
                    onChange={handleInputChange}
                    className="pl-8"
                    placeholder="Montant à atteindre"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">€</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="saved" className="text-right">Déjà épargné (€)</Label>
                <div className="col-span-3 relative">
                  <Input
                    id="saved"
                    name="saved"
                    type="number"
                    value={newGoal.saved || ''}
                    onChange={handleInputChange}
                    className="pl-8"
                    placeholder="Montant déjà épargné"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">€</span>
                </div>
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
              <button 
                className="pixel-button"
                onClick={handleAddGoal}
              >
                Ajouter l'objectif
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="pixel-card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <h3 className="text-sm font-medium mb-2">Total épargné</h3>
          <div className="font-pixel text-xl text-zou-purple">{totalSaved.toLocaleString()} €</div>
          <div className="text-xs text-muted-foreground mt-1">Sur {totalTarget.toLocaleString()} € d'objectifs</div>
        </div>
        
        <div className="pixel-card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <h3 className="text-sm font-medium mb-2">Progression globale</h3>
          <div className="font-pixel text-xl text-zou-orange">{totalProgress.toFixed(1)}%</div>
          <div className="mt-2 w-full bg-black/5 h-1 rounded-full">
            <div className="bg-zou-orange h-1 rounded-full" style={{ width: `${Math.min(totalProgress, 100)}%` }}></div>
          </div>
        </div>
        
        <div className="pixel-card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <h3 className="text-sm font-medium mb-2">Épargne mensuelle moyenne</h3>
          <div className="font-pixel text-xl text-zou-green">{averageSavings.toLocaleString()} €</div>
          <div className="text-xs text-muted-foreground mt-1">Basé sur les 12 derniers mois</div>
        </div>
      </div>
      
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
            <Tooltip formatter={(value) => `${Number(value).toLocaleString()} €`} />
            <Legend />
            <ReferenceLine y={averageSavings} stroke="#8884d8" strokeDasharray="3 3" label="Moyenne mensuelle" />
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savingsGoals.map(goal => {
          const percentComplete = Math.min((goal.saved / goal.target) * 100, 100);
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          const isComplete = goal.saved >= goal.target;
          const isExpired = daysLeft <= 0;
          const remainingToSave = goal.target - goal.saved;
          
          return (
            <div key={goal.id} className={`pixel-card relative ${
              isComplete ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20' : 
              isExpired ? 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20' : 
              'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
            }`}>
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
                      <DialogDescription>
                        Ajustez les détails de votre objectif d'épargne
                      </DialogDescription>
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
                          <div className="col-span-3 relative">
                            <Input
                              id="edit-target"
                              name="target"
                              type="number"
                              value={editGoal.target}
                              onChange={(e) => handleInputChange(e, true)}
                              className="pl-8"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">€</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-saved" className="text-right">Déjà épargné (€)</Label>
                          <div className="col-span-3 relative">
                            <Input
                              id="edit-saved"
                              name="saved"
                              type="number"
                              value={editGoal.saved}
                              onChange={(e) => handleInputChange(e, true)}
                              className="pl-8"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">€</span>
                          </div>
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
                      <button 
                        className="pixel-button"
                        onClick={handleUpdateGoal}
                      >
                        Enregistrer les modifications
                      </button>
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
                <div className={`mr-3 p-2 rounded-full ${
                  isComplete ? 'bg-green-100 text-green-500' : 
                  isExpired ? 'bg-red-100 text-red-500' : 
                  'bg-blue-100 text-blue-500'
                }`}>
                  {isComplete ? (
                    <CircleCheckBig size={20} />
                  ) : (
                    <PiggyBank size={20} />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{goal.name}</h3>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar size={12} className="mr-1" />
                    {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                    {!isComplete && (
                      <span className={`ml-2 ${isExpired ? 'text-red-500' : ''}`}>
                        {isExpired ? 'Délai dépassé' : `${daysLeft} jours restants`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{goal.saved.toLocaleString()} € épargnés</span>
                  <span>Objectif: {goal.target.toLocaleString()} €</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-bar-fill ${
                      isComplete ? 'bg-green-500' : 
                      isExpired ? 'bg-red-500' : 
                      'bg-blue-500'
                    }`}
                    style={{ width: `${percentComplete}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>
                    {isComplete ? (
                      <span className="text-green-500">Objectif atteint!</span>
                    ) : (
                      <>Reste à épargner: {remainingToSave.toLocaleString()} €</>
                    )}
                  </span>
                  <span>{percentComplete.toFixed(0)}% complété</span>
                </div>
              </div>
              
              {!isComplete && (
                <div className="flex items-center mt-4">
                  <div className="flex-1 relative">
                    <Input
                      type="number"
                      placeholder="Montant à ajouter"
                      className="pl-8"
                      value={selectedGoalId === goal.id ? additionalAmount : ''}
                      onChange={(e) => {
                        setAdditionalAmount(e.target.value === '' ? '' : Number(e.target.value));
                        setSelectedGoalId(goal.id);
                      }}
                      onFocus={() => setSelectedGoalId(goal.id)}
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">€</span>
                  </div>
                  <button 
                    className="pixel-button py-1 ml-2"
                    onClick={() => handleAddFunds(goal)}
                  >
                    Ajouter
                  </button>
                </div>
              )}
              
              {isComplete && (
                <div className="mt-4 text-center p-2 bg-green-100 text-green-700 rounded-md">
                  <CircleCheckBig size={16} className="inline-block mr-1" />
                  Félicitations ! Cet objectif a été atteint.
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {savingsGoals.length === 0 && (
        <div className="text-center p-10 border border-dashed rounded-md">
          <PiggyBank size={40} className="mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground font-medium mb-2">
            Vous n'avez pas encore d'objectif d'épargne
          </p>
          <p className="text-muted-foreground text-sm mb-4">
            Créez votre premier objectif en cliquant sur le bouton "Ajouter un objectif"
          </p>
          <button 
            className="pixel-button"
            onClick={() => setShowDialog(true)}
          >
            <Plus size={16} className="mr-1 inline-block" />
            Ajouter un objectif
          </button>
        </div>
      )}
    </div>
  );
};

export default SavingsTracker;
