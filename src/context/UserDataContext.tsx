
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { playSound } from '@/utils/audioUtils';
import { UserData } from '@/types/userData';
import { HeroProfile, StatusModule, LookModule, StatusItem } from '@/types/profile';
import { FinanceModule } from '@/types/finance';
import { defaultUserData } from './defaultValues';
import { loadUserDataFromFirestore, saveUserDataToFirestore } from '@/utils/firebaseUtils';

// Re-export types for convenience
export * from '@/types/userData';
export * from '@/types/profile';
export * from '@/types/finance';

// Type for the context
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

// Create the context
const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// Provider component
export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user data on startup
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const loadedData = await loadUserDataFromFirestore('guest', defaultUserData);
        setUserData(loadedData);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Save user data locally and to Firebase
  const saveUserData = async (newData: UserData) => {
    // Local update
    setUserData(newData);
    localStorage.setItem('zouUserData', JSON.stringify(newData));
    
    // Remote update
    await saveUserDataToFirestore(newData);
  };

  // Update functions
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

// Hook for using the context
export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
