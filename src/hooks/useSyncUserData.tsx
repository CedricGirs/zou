
import { useUserData } from "../context/UserDataContext";

/**
 * Hook pour synchroniser les données utilisateur entre les différentes sections
 * lorsque des mises à jour sont effectuées dans le profil
 */
export const useSyncUserData = () => {
  const { 
    userData, 
    updateHeroProfile, 
    updateStatusModule, 
    updateLookModule, 
    updateFinanceModule 
  } = useUserData();
  
  return {
    heroProfile: userData.heroProfile,
    statusModule: userData.statusModule,
    lookModule: userData.lookModule,
    financeModule: userData.financeModule,
    updateHeroProfile,
    updateStatusModule,
    updateLookModule,
    updateFinanceModule
  };
};
