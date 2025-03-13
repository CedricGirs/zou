
import { UserData } from '../types/UserDataTypes';
import { defaultHeroProfile } from './defaultHeroProfile';
import { defaultStatusModule } from './defaultStatusModule';
import { defaultLookModule } from './defaultLookModule';
import { defaultFinanceModule } from './defaultFinanceModule';
import { defaultSkills } from './defaultSkills'; // This file was already created during the previous refactoring

// Default user state
export const defaultUserData: UserData = {
  uid: 'guest',
  heroProfile: defaultHeroProfile,
  statusModule: defaultStatusModule,
  lookModule: defaultLookModule,
  financeModule: defaultFinanceModule,
  statusItems: [],
  skills: defaultSkills,
};

// Re-export the individual defaults for convenience
export {
  defaultHeroProfile,
  defaultStatusModule,
  defaultLookModule,
  defaultFinanceModule,
  defaultSkills
};
