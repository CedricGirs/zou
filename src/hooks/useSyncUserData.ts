
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
      updateOnboardingHeroProfile({
        username: userData.heroProfile.username,
        avatarSeed: userData.heroProfile.avatarSeed,
        class: userData.heroProfile.class,
        primaryFocus: userData.heroProfile.primaryFocus,
        ambitionLevel: userData.heroProfile.ambitionLevel,
      });
    }
    
    // For status module, map the values to compatible types
    if (userData.statusModule.education?.length > 0 || userData.statusModule.languages?.length > 0 || 
        userData.statusModule.skills?.length > 0 || userData.statusModule.softSkills?.length > 0) {
      
      // Map languages to ensure level is of the correct type
      const mappedLanguages = userData.statusModule.languages?.map(lang => ({
        name: lang.name,
        level: (lang.level as "A1" | "A2" | "B1" | "B2" | "C1" | "C2") || "A1"
      }));
      
      updateOnboardingStatusModule({
        languages: mappedLanguages,
        softSkills: userData.statusModule.softSkills || []
      });
    }
    
    // For look module, ensure style is one of the allowed values
    if (userData.lookModule.favoriteColors?.length > 0 || userData.lookModule.selectedClothing?.length > 0) {
      const style = (userData.lookModule.style as "classic" | "sporty" | "streetwear") || "classic";
      
      updateOnboardingLookModule({
        style: style,
        wardrobe: userData.lookModule.selectedClothing || []
      });
    }
    
    // Finance module
    if (userData.financeModule.monthlyIncome > 0 || userData.financeModule.fixedExpenses > 0 || 
        userData.financeModule.savingsGoal > 0) {
      updateOnboardingFinanceModule({
        monthlyIncome: userData.financeModule.monthlyIncome,
        fixedExpenses: userData.financeModule.fixedExpenses,
        savingsGoal: userData.financeModule.savingsGoal
      });
    }
  }, [userData]);

  // Sync from Onboarding context to User Data
  useEffect(() => {
    // Only update if there's actual data to sync (to avoid loops)
    if (onboarding.heroProfile.username) {
      updateHeroProfile({
        username: onboarding.heroProfile.username,
        avatarSeed: onboarding.heroProfile.avatarSeed,
        class: onboarding.heroProfile.class,
        primaryFocus: onboarding.heroProfile.primaryFocus,
        ambitionLevel: onboarding.heroProfile.ambitionLevel
      });
    }
    
    // For the status module - convert onboarding data to userData format
    if (onboarding.statusModule.languages.length > 0 || onboarding.statusModule.softSkills.length > 0) {
      const userStatusUpdate = {
        languages: onboarding.statusModule.languages.map(lang => ({
          name: lang.name,
          level: lang.level
        })),
        softSkills: onboarding.statusModule.softSkills
      };
      
      updateStatusModule(userStatusUpdate);
    }
    
    // For the look module - convert onboarding data to userData format
    if (onboarding.lookModule.wardrobe.length > 0) {
      updateLookModule({
        style: onboarding.lookModule.style,
        selectedClothing: onboarding.lookModule.wardrobe,
        // Maintain favorite colors if they exist in userData
        favoriteColors: userData.lookModule.favoriteColors
      });
    }
    
    // For the finance module
    if (onboarding.financeModule.monthlyIncome > 0 || onboarding.financeModule.fixedExpenses > 0 ||
        onboarding.financeModule.savingsGoal > 0) {
      updateFinanceModule({
        monthlyIncome: onboarding.financeModule.monthlyIncome,
        fixedExpenses: onboarding.financeModule.fixedExpenses,
        savingsGoal: onboarding.financeModule.savingsGoal
      });
    }
  }, [onboarding, userData.lookModule.favoriteColors]);

  return { userData, onboarding };
};
