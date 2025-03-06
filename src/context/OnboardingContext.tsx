
import { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the hero profile structure
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

// Define the status module configuration
export interface StatusModule {
  status: 'student' | 'employee' | 'career-change';
  languages: Array<{
    name: string;
    level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  }>;
  softSkills: string[];
}

// Define the look module configuration
export interface LookModule {
  wardrobe: string[];
  sportsFrequency: string;
  style: 'classic' | 'sporty' | 'streetwear';
}

// Define the finance module configuration
export interface FinanceModule {
  monthlyIncome: number;
  fixedExpenses: number;
  savingsGoal: number;
}

// Define the onboarding state
interface OnboardingState {
  isCompleted: boolean;
  currentStep: number;
  heroProfile: HeroProfile;
  statusModule: StatusModule;
  lookModule: LookModule;
  financeModule: FinanceModule;
}

// Define the onboarding context type
type OnboardingContextType = {
  onboarding: OnboardingState;
  setOnboardingCompleted: (completed: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateHeroProfile: (updates: Partial<HeroProfile>) => void;
  updateStatusModule: (updates: Partial<StatusModule>) => void;
  updateLookModule: (updates: Partial<LookModule>) => void;
  updateFinanceModule: (updates: Partial<FinanceModule>) => void;
  totalSteps: number;
};

const defaultOnboardingState: OnboardingState = {
  isCompleted: false,
  currentStep: 1,
  heroProfile: {
    username: '',
    avatarSeed: 'Felix',
    hairColor: 'brown',
    eyeColor: 'blue',
    skinTone: 'light',
    primaryFocus: 'mix',
    ambitionLevel: 'casual',
    class: 'warrior',
  },
  statusModule: {
    status: 'student',
    languages: [],
    softSkills: [],
  },
  lookModule: {
    wardrobe: [],
    sportsFrequency: '',
    style: 'classic',
  },
  financeModule: {
    monthlyIncome: 0,
    fixedExpenses: 0,
    savingsGoal: 0,
  }
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [onboarding, setOnboarding] = useState<OnboardingState>(() => {
    // Check if onboarding state exists in localStorage
    const savedState = localStorage.getItem('zouOnboarding');
    return savedState ? JSON.parse(savedState) : defaultOnboardingState;
  });
  
  const navigate = useNavigate();
  const totalSteps = 5; // Total number of onboarding steps
  
  // Save onboarding state to localStorage whenever it changes
  const saveOnboarding = (state: OnboardingState) => {
    localStorage.setItem('zouOnboarding', JSON.stringify(state));
    setOnboarding(state);
  };
  
  const setOnboardingCompleted = (completed: boolean) => {
    const newState = { ...onboarding, isCompleted: completed };
    saveOnboarding(newState);
    
    if (completed) {
      navigate('/');
    }
  };
  
  const nextStep = () => {
    if (onboarding.currentStep < totalSteps) {
      const newState = { ...onboarding, currentStep: onboarding.currentStep + 1 };
      saveOnboarding(newState);
    } else {
      setOnboardingCompleted(true);
    }
  };
  
  const prevStep = () => {
    if (onboarding.currentStep > 1) {
      const newState = { ...onboarding, currentStep: onboarding.currentStep - 1 };
      saveOnboarding(newState);
    }
  };
  
  const updateHeroProfile = (updates: Partial<HeroProfile>) => {
    const newState = {
      ...onboarding,
      heroProfile: { ...onboarding.heroProfile, ...updates },
    };
    saveOnboarding(newState);
  };
  
  const updateStatusModule = (updates: Partial<StatusModule>) => {
    const newState = {
      ...onboarding,
      statusModule: { ...onboarding.statusModule, ...updates },
    };
    saveOnboarding(newState);
  };
  
  const updateLookModule = (updates: Partial<LookModule>) => {
    const newState = {
      ...onboarding,
      lookModule: { ...onboarding.lookModule, ...updates },
    };
    saveOnboarding(newState);
  };
  
  const updateFinanceModule = (updates: Partial<FinanceModule>) => {
    const newState = {
      ...onboarding,
      financeModule: { ...onboarding.financeModule, ...updates },
    };
    saveOnboarding(newState);
  };
  
  return (
    <OnboardingContext.Provider
      value={{
        onboarding,
        setOnboardingCompleted,
        nextStep,
        prevStep,
        updateHeroProfile,
        updateStatusModule,
        updateLookModule,
        updateFinanceModule,
        totalSteps
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

// Custom hook to use the onboarding context
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
