
import { useEffect } from "react";
import { useOnboarding } from "../context/OnboardingContext";

/**
 * Hook for synchronizing user data between different sections
 * when updates are made in the profile section
 */
export const useSyncUserData = () => {
  const { 
    onboarding, 
    updateHeroProfile, 
    updateStatusModule, 
    updateLookModule, 
    updateFinanceModule 
  } = useOnboarding();

  // This hook can be expanded with additional synchronization logic
  // For example, automatically updating heroProfile when status changes
  useEffect(() => {
    // Log updates to help with debugging
    console.log("User data synchronized", {
      heroProfile: onboarding.heroProfile,
      statusModule: onboarding.statusModule,
      lookModule: onboarding.lookModule,
      financeModule: onboarding.financeModule
    });
  }, [
    onboarding.heroProfile,
    onboarding.statusModule,
    onboarding.lookModule,
    onboarding.financeModule
  ]);
  
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
