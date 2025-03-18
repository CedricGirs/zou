
import { UserData } from '@/types/UserDataTypes';
import { defaultHeroProfile } from './defaultHeroProfile';
import { defaultStatusModule } from './defaultStatusModule';
import { defaultLookModule } from './defaultLookModule';
import { defaultFinanceModule } from './defaultFinanceModule';
import { defaultSportModule } from './defaultSportModule';

export const defaultUserData: UserData = {
  uid: 'guest',
  heroProfile: defaultHeroProfile,
  statusModule: defaultStatusModule,
  lookModule: defaultLookModule,
  financeModule: defaultFinanceModule,
  sportModule: defaultSportModule,
  statusItems: [],
  skills: [],
  lastSyncTimestamp: new Date().toISOString()
};
