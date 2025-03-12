
import { HeroProfile } from '../types/HeroTypes';
import { StatusModule } from '../types/StatusTypes';
import { LookModule } from '../types/LookTypes';
import { FinanceModule } from '../types/FinanceTypes';
import { UserData } from '../types/UserDataTypes';

// Default values
export const defaultHeroProfile: HeroProfile = {
  username: '',
  avatarSeed: 'Felix',
  hairColor: 'brown',
  eyeColor: 'blue',
  skinTone: 'light',
  primaryFocus: 'mix',
  ambitionLevel: 'casual',
  class: 'warrior',
};

export const defaultStatusModule: StatusModule = {
  status: 'student',
  languages: [],
  softSkills: [],
  statusXP: 0,
  statusLevel: 1,
  maxXP: 100,
  achievements: [
    { id: "first_course", name: "Première Formation", description: "Ajouter votre première formation", completed: false, xpReward: 25 },
    { id: "first_language", name: "Polyglotte", description: "Ajouter votre première langue", completed: false, xpReward: 20 },
    { id: "first_skill", name: "Compétent", description: "Ajouter votre première compétence", completed: false, xpReward: 15 },
    { id: "language_master", name: "Maître Linguiste", description: "Atteindre le niveau C2 dans une langue", completed: false, xpReward: 50 },
    { id: "course_complete", name: "Diplômé", description: "Terminer une formation à 100%", completed: false, xpReward: 30 },
    { id: "certificate_collector", name: "Collectionneur", description: "Obtenir 3 certificats", completed: false, xpReward: 40 },
    { id: "skill_expert", name: "Expert", description: "Atteindre 100% dans 3 compétences", completed: false, xpReward: 35 },
    { id: "jack_of_all_trades", name: "Touche-à-tout", description: "Avoir au moins une entrée dans chaque catégorie", completed: false, xpReward: 45 }
  ]
};

export const defaultLookModule: LookModule = {
  wardrobe: [],
  sportsFrequency: '',
  style: 'classic',
  styleXP: 0,
  styleLevel: 1,
  maxXP: 100,
  achievements: [],
};

export const defaultFinanceModule: FinanceModule = {
  // Core financial data
  balance: 0,
  monthlyIncome: 0,
  monthlyExpenses: 0,
  savingsRate: 0,
  transactions: [],
  savingsGoals: [
    { id: "emergency", name: "Fonds d'urgence", target: 3000, saved: 0, deadline: "2024-12-31" },
    { id: "vacation", name: "Vacances", target: 1200, saved: 0, deadline: "2024-06-30" }
  ],
  savingsGoal: 0,
  
  // Monthly data storage
  monthlyData: {},
  
  // Expense categories
  housingExpenses: 0,
  foodExpenses: 0,
  transportExpenses: 0,
  leisureExpenses: 0,
  fixedExpenses: 0,
  debtPayments: 0,
  additionalIncome: 0,
  
  // Budgeting
  annualBudget: {
    "Janvier": { income: 0, expenses: 0 },
    "Février": { income: 0, expenses: 0 },
    "Mars": { income: 0, expenses: 0 },
    "Avril": { income: 0, expenses: 0 },
    "Mai": { income: 0, expenses: 0 },
    "Juin": { income: 0, expenses: 0 },
    "Juillet": { income: 0, expenses: 0 },
    "Août": { income: 0, expenses: 0 },
    "Septembre": { income: 0, expenses: 0 },
    "Octobre": { income: 0, expenses: 0 },
    "Novembre": { income: 0, expenses: 0 },
    "Décembre": { income: 0, expenses: 0 }
  },
  
  // Default budget templates
  budgetTemplates: [
    { id: "regular", name: "Budget standard", income: 2000, expenses: 1500, description: "Revenus et dépenses mensuels typiques" },
    { id: "vacation", name: "Mois de vacances", income: 2000, expenses: 2200, description: "Budget pour un mois de vacances" },
    { id: "bonus", name: "Mois avec prime", income: 3000, expenses: 1500, description: "Mois avec une prime ou revenu supplémentaire" }
  ],
  
  // Gamification elements
  financeLevel: 1,
  currentXP: 0,
  maxXP: 100,
  achievements: [
    { id: "first_budget", name: "Planificateur", description: "Créer votre premier budget", completed: false, xpReward: 25 },
    { id: "first_transaction", name: "Comptable", description: "Enregistrer votre première transaction", completed: false, xpReward: 15 },
    { id: "first_savings", name: "Épargnant", description: "Créer votre premier objectif d'épargne", completed: false, xpReward: 20 },
    { id: "financial_balance", name: "Équilibriste", description: "Maintenir un budget équilibré pendant 1 mois", completed: false, xpReward: 50 }
  ],
  quests: [
    { id: "set_budget", name: "Définir un budget", description: "Établir vos revenus et dépenses mensuels", completed: false, progress: 0, xpReward: 30 },
    { id: "track_transactions", name: "Suivre vos dépenses", description: "Enregistrer 5 transactions", completed: false, progress: 0, xpReward: 25 },
    { id: "create_savings", name: "Objectif d'épargne", description: "Créer un objectif d'épargne avec échéance", completed: false, progress: 0, xpReward: 20 }
  ]
};

// Default user state
export const defaultUserData: UserData = {
  uid: 'guest',
  heroProfile: defaultHeroProfile,
  statusModule: defaultStatusModule,
  lookModule: defaultLookModule,
  financeModule: defaultFinanceModule,
  statusItems: [],
  skills: [],
};
