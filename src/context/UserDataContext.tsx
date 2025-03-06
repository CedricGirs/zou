import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { doc, setDoc, getDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from '@/hooks/use-toast';
import { playSound } from '@/utils/audioUtils';

// Types pour les données utilisateur
export interface HeroProfile {
  username: string;
  avatarSeed: string;
  hairColor: string;
  eyeColor: string;
  skinTone: string;
  primaryFocus: 'status' | 'look' | 'finances' | 'mix';
  ambitionLevel: 'casual' | 'pro' | 'hardcore';
  class: 'warrior' | 'mage' | 'healer';
}

export interface StatusModule {
  status: 'student' | 'employee' | 'career-change';
  languages: Array<{
    name: string;
    level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  }>;
  softSkills: string[];
  gauges?: {
    fun: number;
    social: number;
    energy: number;
    hygiene: number;
  };
}

export interface LookModule {
  wardrobe: string[];
  sportsFrequency: string;
  style: 'classic' | 'sporty' | 'streetwear';
}

export interface Transaction {
  id: string;
  date: string;
  month: string;
  description: string;
  amount: number;
  category: string;
  isVerified: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
}

export interface FinanceModule {
  monthlyIncome: number;
  fixedExpenses: number;
  savingsGoal: number;
  additionalIncome?: number;
  housingExpenses?: number;
  transportExpenses?: number;
  foodExpenses?: number;
  leisureExpenses?: number;
  debtPayments?: number;
  emergencyFund?: number;
  transactions?: Transaction[];
  savingsGoals?: SavingsGoal[];
  annualBudget?: {
    [month: string]: {
      income: number;
      expenses: number;
    }
  };
}

export interface CourseItem {
  id: string;
  title: string;
  type: "course";
  progress: number;
  deadline?: string;
  completed: boolean;
  certificate?: string;
}

export interface LanguageItem {
  id: string;
  title: string;
  type: "language";
  level: string;
  progress: number;
  completed: boolean;
  certificate?: string;
}

export interface SkillItem {
  id: string;
  title: string;
  type: "skill";
  progress: number;
  completed: boolean;
  certificate?: string;
}

export type StatusItem = CourseItem | LanguageItem | SkillItem;

export interface UserData {
  uid: string;
  heroProfile: HeroProfile;
  statusModule: StatusModule;
  lookModule: LookModule;
  financeModule: FinanceModule;
  statusItems: StatusItem[];
  skills: any[]; // Vous pouvez définir un type plus précis si nécessaire
}

// Valeurs par défaut
const defaultHeroProfile: HeroProfile = {
  username: '',
  avatarSeed: 'Felix',
  hairColor: 'brown',
  eyeColor: 'blue',
  skinTone: 'light',
  primaryFocus: 'mix',
  ambitionLevel: 'casual',
  class: 'warrior',
};

const defaultStatusModule: StatusModule = {
  status: 'student',
  languages: [],
  softSkills: [],
  gauges: {
    fun: 75,
    social: 60,
    energy: 45,
    hygiene: 90
  }
};

const defaultLookModule: LookModule = {
  wardrobe: [],
  sportsFrequency: '',
  style: 'classic',
};

const defaultFinanceModule: FinanceModule = {
  monthlyIncome: 0,
  fixedExpenses: 0,
  savingsGoal: 0,
  additionalIncome: 0,
  housingExpenses: 0,
  transportExpenses: 0,
  foodExpenses: 0,
  leisureExpenses: 0,
  debtPayments: 0,
  emergencyFund: 0,
  transactions: [],
  savingsGoals: [
    { id: "emergency", name: "Fonds d'urgence", target: 5000, saved: 1500, deadline: "2024-12-31" },
    { id: "vacation", name: "Vacances", target: 2000, saved: 800, deadline: "2024-06-30" }
  ],
  annualBudget: {
    "Janvier": { income: 5000, expenses: 3500 },
    "Février": { income: 5000, expenses: 3600 },
    "Mars": { income: 5000, expenses: 3400 },
    "Avril": { income: 5000, expenses: 3300 },
    "Mai": { income: 5000, expenses: 3700 },
    "Juin": { income: 5000, expenses: 3800 },
    "Juillet": { income: 5000, expenses: 4000 },
    "Août": { income: 5000, expenses: 3900 },
    "Septembre": { income: 5000, expenses: 3500 },
    "Octobre": { income: 5000, expenses: 3600 },
    "Novembre": { income: 5000, expenses: 3700 },
    "Décembre": { income: 5000, expenses: 4200 }
  }
};

// État utilisateur par défaut
const defaultUserData: UserData = {
  uid: 'guest',
  heroProfile: defaultHeroProfile,
  statusModule: defaultStatusModule,
  lookModule: defaultLookModule,
  financeModule: defaultFinanceModule,
  statusItems: [],
  skills: [],
};

// Type pour le contexte
interface UserDataContextType {
  userData: UserData;
  loading: boolean;
  updateHeroProfile: (updates: Partial<HeroProfile>) => Promise<void>;
  updateStatusModule: (updates: Partial<StatusModule>) => Promise<void>;
  updateLookModule: (updates: Partial<LookModule>) => Promise<void>;
  updateFinanceModule: (updates: Partial<FinanceModule>) => Promise<void>;
  updateStatusItems: (items: StatusItem[]) => Promise<void>;
  updateSkills: (skills: any[]) => Promise<void>;
}

// Création du contexte
const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// Provider du contexte
export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [loading, setLoading] = useState<boolean>(true);

  // Charger les données de l'utilisateur au démarrage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Pour l'instant, nous utilisons un ID "guest" pour l'utilisateur
        const userDocRef = doc(db, 'users', 'guest');
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Utilisateur existant
          setUserData(userDoc.data() as UserData);
        } else {
          // Nouvel utilisateur, créer le document
          await setDoc(userDocRef, defaultUserData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos données. Utilisation des données locales.",
          variant: "destructive",
        });
        
        // Utiliser les données par défaut ou du localStorage en cas d'erreur
        const savedData = localStorage.getItem('zouUserData');
        if (savedData) {
          setUserData(JSON.parse(savedData));
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Sauvegarder les données localement et dans Firebase
  const saveUserData = async (newData: UserData) => {
    // Mise à jour locale
    setUserData(newData);
    localStorage.setItem('zouUserData', JSON.stringify(newData));
    
    try {
      // Mise à jour dans Firebase
      const userDocRef = doc(db, 'users', newData.uid);
      
      // Convert UserData to a plain object without methods
      const dataToSave = {
        uid: newData.uid,
        heroProfile: newData.heroProfile,
        statusModule: newData.statusModule,
        lookModule: newData.lookModule,
        financeModule: newData.financeModule,
        statusItems: newData.statusItems,
        skills: newData.skills,
      };
      
      await updateDoc(userDocRef, dataToSave);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données:", error);
      toast({
        title: "Erreur",
        description: "Impossible de synchroniser vos données avec le serveur. Réessayez plus tard.",
        variant: "destructive",
      });
    }
  };

  // Fonctions de mise à jour
  const updateHeroProfile = async (updates: Partial<HeroProfile>) => {
    const newData = {
      ...userData,
      heroProfile: { ...userData.heroProfile, ...updates },
    };
    await saveUserData(newData);
    playSound('click');
  };

  const updateStatusModule = async (updates: Partial<StatusModule>) => {
    const newData = {
      ...userData,
      statusModule: { ...userData.statusModule, ...updates },
    };
    await saveUserData(newData);
  };

  const updateLookModule = async (updates: Partial<LookModule>) => {
    const newData = {
      ...userData,
      lookModule: { ...userData.lookModule, ...updates },
    };
    await saveUserData(newData);
  };

  const updateFinanceModule = async (updates: Partial<FinanceModule>) => {
    const newData = {
      ...userData,
      financeModule: { ...userData.financeModule, ...updates },
    };
    await saveUserData(newData);
  };

  const updateStatusItems = async (items: StatusItem[]) => {
    const newData = {
      ...userData,
      statusItems: items,
    };
    await saveUserData(newData);
  };

  const updateSkills = async (skills: any[]) => {
    const newData = {
      ...userData,
      skills,
    };
    await saveUserData(newData);
  };

  return (
    <UserDataContext.Provider
      value={{
        userData,
        loading,
        updateHeroProfile,
        updateStatusModule,
        updateLookModule,
        updateFinanceModule,
        updateStatusItems,
        updateSkills,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
