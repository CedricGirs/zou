
import React, { createContext, useState, useContext, useEffect } from "react";

// User profile types
interface HeroProfile {
  username: string;
  avatarSeed: string;
  class: "warrior" | "mage" | "healer";
  primaryFocus: "status" | "look" | "finances" | "mix";
  ambitionLevel: "casual" | "pro" | "hardcore";
}

interface StatusModule {
  education: string[];
  languages: { name: string; level: string }[];
  skills: string[];
  softSkills: string[];
}

interface LookModule {
  style: string;
  favoriteColors: string[];
  selectedClothing: string[];
}

interface FinanceModule {
  monthlyIncome: number;
  fixedExpenses: number;
  savingsGoal: number;
}

export interface UserData {
  heroProfile: HeroProfile;
  statusModule: StatusModule;
  lookModule: LookModule;
  financeModule: FinanceModule;
  completedOnboarding: boolean;
}

const defaultUserData: UserData = {
  heroProfile: {
    username: "",
    avatarSeed: "Default",
    class: "warrior",
    primaryFocus: "mix",
    ambitionLevel: "casual",
  },
  statusModule: {
    education: [],
    languages: [],
    skills: [],
    softSkills: []
  },
  lookModule: {
    style: "casual",
    favoriteColors: [],
    selectedClothing: []
  },
  financeModule: {
    monthlyIncome: 0,
    fixedExpenses: 0,
    savingsGoal: 0
  },
  completedOnboarding: false
};

interface UserDataContextType {
  userData: UserData;
  updateHeroProfile: (updates: Partial<HeroProfile>) => void;
  updateStatusModule: (updates: Partial<StatusModule>) => void;
  updateLookModule: (updates: Partial<LookModule>) => void;
  updateFinanceModule: (updates: Partial<FinanceModule>) => void;
  setCompletedOnboarding: (completed: boolean) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(() => {
    // Try to load user data from localStorage on initial load
    const savedData = localStorage.getItem('zouUserData');
    return savedData ? JSON.parse(savedData) : defaultUserData;
  });

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('zouUserData', JSON.stringify(userData));
  }, [userData]);

  const updateHeroProfile = (updates: Partial<HeroProfile>) => {
    setUserData(prev => ({
      ...prev,
      heroProfile: {
        ...prev.heroProfile,
        ...updates
      }
    }));
  };

  const updateStatusModule = (updates: Partial<StatusModule>) => {
    setUserData(prev => ({
      ...prev,
      statusModule: {
        ...prev.statusModule,
        ...updates
      }
    }));
  };

  const updateLookModule = (updates: Partial<LookModule>) => {
    setUserData(prev => ({
      ...prev,
      lookModule: {
        ...prev.lookModule,
        ...updates
      }
    }));
  };

  const updateFinanceModule = (updates: Partial<FinanceModule>) => {
    setUserData(prev => ({
      ...prev,
      financeModule: {
        ...prev.financeModule,
        ...updates
      }
    }));
  };

  const setCompletedOnboarding = (completed: boolean) => {
    setUserData(prev => ({
      ...prev,
      completedOnboarding: completed
    }));
  };

  return (
    <UserDataContext.Provider value={{
      userData,
      updateHeroProfile,
      updateStatusModule,
      updateLookModule,
      updateFinanceModule,
      setCompletedOnboarding
    }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
