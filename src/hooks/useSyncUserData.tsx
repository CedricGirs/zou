
import { useEffect } from "react";
import { useOnboarding } from "../context/OnboardingContext";

/**
 * Hook pour synchroniser les données utilisateur entre les différentes sections
 * lorsque des mises à jour sont effectuées dans le profil
 */
export const useSyncUserData = () => {
  const { 
    onboarding, 
    updateHeroProfile, 
    updateStatusModule, 
    updateLookModule, 
    updateFinanceModule 
  } = useOnboarding();

  // Ici, nous pouvons ajouter plus de logique de synchronisation si nécessaire
  
  return {
    heroProfile: onboarding.heroProfile,
    statusModule: onboarding.statusModule,
    lookModule: onboarding.lookModule,
    financeModule: onboarding.financeModule,
    updateHeroProfile,
    updateStatusModule,
    updateLookModule,
    updateFinanceModule
  };
};
