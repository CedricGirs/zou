
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Import types
import { HeroProfile } from '@/types/HeroTypes';
import { StatusModule, StatusItem } from '@/types/StatusTypes';
import { LookModule } from '@/types/LookTypes';
import { FinanceModule } from '@/types/FinanceTypes';
import { UserData, UserDataContextType } from '@/types/UserDataTypes';

// Import default data and utilities
import { defaultUserData } from '@/data/defaultUserData';
import { saveUserData, loadUserData, playUpdateSound } from '@/utils/userDataUtils';

// Re-export all types for backward compatibility
export type { 
  HeroProfile,
  StatusModule,
  LookModule,
  FinanceModule,
  Transaction,
  SavingsGoal,
  MonthlyBudget,
  IncomeExpenseItem,
  BudgetTemplate,
  FinanceAchievement,
  FinanceQuest,
  MonthlyData,
  CourseItem,
  LanguageItem,
  SkillItem,
  StatusItem,
  UserData
} from '@/types';

// Create the context
const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// Provider component
export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user data on startup
  useEffect(() => {
    const initializeUserData = async () => {
      const { userData: loadedData, error } = await loadUserData();
      
      if (loadedData) {
        setUserData(loadedData);
      } else {
        // If no data found, create new document with default data
        try {
          const userDocRef = doc(db, 'users', 'guest');
          await setDoc(userDocRef, defaultUserData);
          setUserData(defaultUserData);
        } catch (err) {
          console.error("Error creating new user data:", err);
        }
      }
      
      setLoading(false);
    };

    initializeUserData();
  }, []);

  // Update functions
  const updateHeroProfile = async (updates: Partial<HeroProfile>) => {
    const newData = {
      ...userData,
      heroProfile: { ...userData.heroProfile, ...updates },
    };
    setUserData(newData);
    await saveUserData(newData);
    playUpdateSound();
  };

  const updateStatusModule = async (updates: Partial<StatusModule>) => {
    const newData = {
      ...userData,
      statusModule: { ...userData.statusModule, ...updates },
    };
    setUserData(newData);
    await saveUserData(newData);
  };

  const updateLookModule = async (updates: Partial<LookModule>) => {
    const newData = {
      ...userData,
      lookModule: { ...userData.lookModule, ...updates },
    };
    setUserData(newData);
    await saveUserData(newData);
  };

  const updateFinanceModule = async (updates: Partial<FinanceModule>) => {
    const newData = {
      ...userData,
      financeModule: { ...userData.financeModule, ...updates },
    };
    setUserData(newData);
    await saveUserData(newData);
  };

  const updateStatusItems = async (items: StatusItem[]) => {
    const newData = {
      ...userData,
      statusItems: items,
    };
    setUserData(newData);
    await saveUserData(newData);
  };

  const updateSkills = async (skills: any[]) => {
    const newData = {
      ...userData,
      skills,
    };
    setUserData(newData);
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

// Hook to use the context
export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
