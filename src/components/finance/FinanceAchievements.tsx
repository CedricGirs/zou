
import { 
  BarChart3, 
  PiggyBank, 
  DollarSign, 
  ArrowUpDown,
  Flag,
  Crown,
  CircleCheck,
  TrendingUp,
  Bookmark,
  Gem
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import CustomBadge from "@/components/ui/CustomBadge";

interface FinanceAchievementsProps {
  unlockAchievement: (achievementId: string) => Promise<void>;
}

const FinanceAchievements = ({ unlockAchievement }: FinanceAchievementsProps) => {
  const financeAchievements = [
    {
      id: "budget_master",
      icon: <BarChart3 size={18} />,
      name: "Maître du Budget",
      description: "Maintenir un équilibre budgétaire pendant 3 mois consécutifs",
      rarity: "legendary" as const,
      unlocked: false
    },
    {
      id: "saving_expert",
      icon: <PiggyBank size={18} />,
      name: "Expert en Épargne",
      description: "Atteindre un taux d'épargne de 30% pendant 2 mois",
      rarity: "epic" as const,
      unlocked: false
    },
    {
      id: "income_diversifier",
      icon: <DollarSign size={18} />,
      name: "Diversificateur de Revenus",
      description: "Ajouter 3 sources de revenus différentes",
      rarity: "rare" as const,
      unlocked: false
    },
    {
      id: "expense_tracker",
      icon: <ArrowUpDown size={18} />,
      name: "Traqueur de Dépenses",
      description: "Suivre toutes les dépenses pendant un mois entier",
      rarity: "uncommon" as const,
      unlocked: false
    },
    {
      id: "goal_achiever",
      icon: <Flag size={18} />,
      name: "Atteigneur d'Objectifs",
      description: "Atteindre votre premier objectif d'épargne",
      rarity: "uncommon" as const,
      unlocked: false
    },
    {
      id: "financial_planner",
      icon: <Crown size={18} />,
      name: "Planificateur Financier",
      description: "Créer un plan financier annuel complet",
      rarity: "rare" as const,
      unlocked: false
    },
    {
      id: "debt_eliminator",
      icon: <CircleCheck size={18} />,
      name: "Éliminateur de Dettes",
      description: "Rembourser entièrement une dette",
      rarity: "epic" as const,
      unlocked: false
    },
    {
      id: "investment_starter",
      icon: <TrendingUp size={18} />,
      name: "Investisseur Débutant",
      description: "Réaliser votre premier investissement",
      rarity: "rare" as const,
      unlocked: false
    },
    {
      id: "emergency_fund",
      icon: <Bookmark size={18} />,
      name: "Fonds d'Urgence",
      description: "Constituer un fonds d'urgence équivalent à 3 mois de dépenses",
      rarity: "epic" as const,
      unlocked: false
    },
    {
      id: "financial_freedom",
      icon: <Gem size={18} />,
      name: "Liberté Financière",
      description: "Atteindre un patrimoine suffisant pour couvrir vos besoins essentiels",
      rarity: "legendary" as const,
      unlocked: false
    }
  ];

  return (
    <Card variant="minimal">
      <CardHeader>
        <CardTitle>Accomplissements</CardTitle>
        <CardDescription>Débloquez des médailles en progressant</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {financeAchievements.map(achievement => (
            <CustomBadge
              key={achievement.id}
              icon={achievement.icon}
              name={achievement.name}
              description={achievement.description}
              rarity={achievement.rarity}
              unlocked={achievement.unlocked}
              onClick={() => !achievement.unlocked && unlockAchievement(achievement.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceAchievements;
