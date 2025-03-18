
import { UserData } from '@/types/UserDataTypes';
import { defaultHeroProfile } from './defaultHeroProfile';
import { defaultStatusModule } from './defaultStatusModule';
import { defaultLookModule } from './defaultLookModule';
import { defaultFinanceModule } from './defaultFinanceModule';
import { defaultSkills } from './defaultSkills';
import { defaultSportModule } from './defaultSportModule';
import { defaultKingdomModule } from './defaultKingdomModule';

// Default user data structure
export const defaultUserData: UserData = {
  uid: 'guest',
  heroProfile: defaultHeroProfile,
  statusModule: defaultStatusModule,
  lookModule: defaultLookModule,
  financeModule: defaultFinanceModule,
  sportModule: defaultSportModule,
  kingdomModule: defaultKingdomModule,
  statusItems: [],
  skills: defaultSkills,
};
