
import { useState, ReactNode, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Import types
import { HeroProfile } from '@/types/HeroTypes';
import { StatusModule, StatusItem } from '@/types/StatusTypes';
import { LookModule } from '@/types/LookTypes';
import { FinanceModule } from '@/types/FinanceTypes';
import { SportModule } from '@/types/SportTypes';
import { KingdomModule } from '@/types/KingdomTypes';
import { UserData } from '@/types/UserDataTypes';

// Import default data and utilities
import { defaultUserData } from '@/data/defaultUserData';
import { saveUserData, loadUserData, playUpdateSound } from '@/utils/userDataUtils';
import { useSyncUserData } from '@/hooks/useSyncUserData';
import { toast } from '@/hooks/use-toast';

// Import context
import { UserDataContext } from './userDataContext';

// Provider component
export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [loading, setLoading] = useState<boolean>(true);

  // Utiliser notre hook de synchronisation
  const { 
    isOnline, 
    isSyncing, 
    lastSyncTime, 
    synchronizeData, 
    refreshData,
    hasPendingChanges 
  } = useSyncUserData(userData.uid, userData, setUserData);

  // Load user data on startup
  useEffect(() => {
    const initializeUserData = async () => {
      const { userData: loadedData, error } = await loadUserData('guest');
      
      if (loadedData) {
        console.log("Données utilisateur chargées:", loadedData);
        // Vérifier si le sportModule existe, sinon l'ajouter
        if (!loadedData.sportModule) {
          loadedData.sportModule = defaultUserData.sportModule;
          console.log("SportModule ajouté aux données utilisateur:", loadedData);
        }
        
        // Vérifier si le kingdomModule existe, sinon l'ajouter
        if (!loadedData.kingdomModule) {
          loadedData.kingdomModule = defaultUserData.kingdomModule;
          console.log("KingdomModule ajouté aux données utilisateur:", loadedData);
        }
        
        setUserData(loadedData);
      } else {
        // If no data found, create new document with default data
        try {
          console.log("Création de nouvelles données utilisateur");
          const userDocRef = doc(db, 'users', 'guest');
          await setDoc(userDocRef, {
            ...defaultUserData,
            lastSyncTimestamp: new Date().toISOString(),
          });
          setUserData(defaultUserData);
        } catch (err) {
          console.error("Error creating new user data:", err);
          toast({
            title: "Erreur d'initialisation",
            description: "Impossible de créer vos données. Mode hors ligne activé.",
            variant: "destructive",
          });
          setUserData(defaultUserData);
        }
      }
      
      setLoading(false);
    };

    initializeUserData();
  }, []);

  // Synchroniser les données périodiquement
  useEffect(() => {
    // Synchroniser toutes les 5 minutes ou si des changements sont en attente
    const syncInterval = setInterval(() => {
      if (hasPendingChanges) {
        synchronizeData();
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(syncInterval);
  }, [hasPendingChanges, synchronizeData]);

  // Synchroniser les données avant de fermer l'application
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasPendingChanges) {
        // Essayer de synchroniser avant de fermer
        localStorage.setItem('zouUserData', JSON.stringify(userData));
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [userData, hasPendingChanges]);

  // Update functions with synchronized data saving
  const updateHeroProfile = async (updates: Partial<HeroProfile>) => {
    const newData = {
      ...userData,
      heroProfile: { ...userData.heroProfile, ...updates },
    };
    setUserData(newData);
    await synchronizeData();
    playUpdateSound();
  };

  const updateStatusModule = async (updates: Partial<StatusModule>) => {
    const newData = {
      ...userData,
      statusModule: { ...userData.statusModule, ...updates },
    };
    setUserData(newData);
    await synchronizeData();
  };

  const updateLookModule = async (updates: Partial<LookModule>) => {
    const newData = {
      ...userData,
      lookModule: { ...userData.lookModule, ...updates },
    };
    setUserData(newData);
    await synchronizeData();
  };

  const updateFinanceModule = async (updates: Partial<FinanceModule>) => {
    const newData = {
      ...userData,
      financeModule: { ...userData.financeModule, ...updates },
    };
    setUserData(newData);
    await synchronizeData();
  };

  const updateSportModule = async (updates: Partial<SportModule>) => {
    const newData = {
      ...userData,
      sportModule: { ...userData.sportModule, ...updates },
    };
    setUserData(newData);
    await synchronizeData();
    playUpdateSound();
  };

  const updateKingdomModule = async (updates: Partial<KingdomModule>) => {
    const newData = {
      ...userData,
      kingdomModule: { ...userData.kingdomModule, ...updates },
    };
    setUserData(newData);
    await synchronizeData();
    playUpdateSound();
  };

  const updateStatusItems = async (items: StatusItem[]) => {
    const newData = {
      ...userData,
      statusItems: items,
    };
    setUserData(newData);
    await synchronizeData();
  };

  const updateSkills = async (skills: any[]) => {
    const newData = {
      ...userData,
      skills,
    };
    setUserData(newData);
    await synchronizeData();
  };

  // Fonction pour rafraîchir les données en vidant le cache
  const forceRefreshData = async () => {
    setLoading(true);
    const success = await refreshData();
    setLoading(false);
    return success;
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
        updateSportModule,
        updateKingdomModule,
        updateStatusItems,
        updateSkills,
        forceRefreshData,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};
