
import { useEffect } from 'react';
import { useUserData } from '../context/UserDataContext';
import { useOnboarding } from '../context/OnboardingContext';

/**
 * Custom hook to synchronize data between onboarding context and user data context
 * This ensures all sections stay in sync when updates happen in any section
 */
export const useSyncUserData = () => {
  const { userData, updateHeroProfile, updateStatusModule, updateLookModule, updateFinanceModule } = useUserData();
  const { onboarding, updateHeroProfile: updateOnboardingHeroProfile, updateStatusModule: updateOnboardingStatusModule, 
          updateLookModule: updateOnboardingLookModule, updateFinanceModule: updateOnboardingFinanceModule } = useOnboarding();

  // Sync from User Data to Onboarding context
  useEffect(() => {
    // Only update if there's actual data to sync (to avoid loops)
    if (userData.heroProfile.username) {
      updateOnboardingHeroProfile(userData.heroProfile);
    }
    
    if (userData.statusModule.education?.length > 0 || userData.statusModule.languages?.length > 0 || 
        userData.statusModule.skills?.length > 0 || userData.statusModule.softSkills?.length > 0) {
      updateOnboardingStatusModule(userData.statusModule);
    }
    
    if (userData.lookModule.favoriteColors?.length > 0 || userData.lookModule.selectedClothing?.length > 0) {
      updateOnboardingLookModule(userData.lookModule);
    }
    
    if (userData.financeModule.monthlyIncome > 0 || userData.financeModule.fixedExpenses > 0 || 
        userData.financeModule.savingsGoal > 0) {
      updateOnboardingFinanceModule(userData.financeModule);
    }
  }, [userData]);

  // Sync from Onboarding context to User Data
  useEffect(() => {
    // Only update if there's actual data to sync (to avoid loops)
    if (onboarding.heroProfile.username) {
      updateHeroProfile(onboarding.heroProfile);
    }
    
    if (onboarding.statusModule.education?.length > 0 || onboarding.statusModule.languages?.length > 0 || 
        onboarding.statusModule.skills?.length > 0 || onboarding.statusModule.softSkills?.length > 0) {
      updateStatusModule(onboarding.statusModule);
    }
    
    if (onboarding.lookModule.favoriteColors?.length > 0 || onboarding.lookModule.selectedClothing?.length > 0) {
      updateLookModule(onboarding.lookModule);
    }
    
    if (onboarding.financeModule.monthlyIncome > 0 || onboarding.financeModule.fixedExpenses > 0 ||
        onboarding.financeModule.savingsGoal > 0) {
      updateFinanceModule(onboarding.financeModule);
    }
  }, [onboarding]);

  return { userData, onboarding };
};
