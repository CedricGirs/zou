
import { HeroProfile } from './HeroTypes';
import { StatusModule, StatusItem } from './StatusTypes';
import { LookModule } from './LookTypes';
import { FinanceModule } from './FinanceTypes';
import { SportModule } from './SportTypes';
import { KingdomModule } from './KingdomTypes';

export interface UserData {
  uid: string;
  heroProfile: HeroProfile;
  statusModule: StatusModule;
  lookModule: LookModule;
  financeModule: FinanceModule;
  sportModule: SportModule;
  kingdomModule: KingdomModule;
  statusItems: StatusItem[];
  skills: any[]; // You can define a more precise type if necessary
  lastSyncTimestamp?: string; // Timestamp de la dernière synchronisation
}

export interface UserDataContextType {
  userData: UserData;
  loading: boolean;
  updateHeroProfile: (updates: Partial<HeroProfile>) => Promise<void>;
  updateStatusModule: (updates: Partial<StatusModule>) => Promise<void>;
  updateLookModule: (updates: Partial<LookModule>) => Promise<void>;
  updateFinanceModule: (updates: Partial<FinanceModule>) => Promise<void>;
  updateSportModule: (updates: Partial<SportModule>) => Promise<void>;
  updateKingdomModule: (updates: Partial<KingdomModule>) => Promise<void>;
  updateStatusItems: (items: StatusItem[]) => Promise<void>;
  updateSkills: (skills: any[]) => Promise<void>;
  forceRefreshData: () => Promise<boolean>; // Nouvelle fonction pour rafraîchir les données
}

// Interface pour le contexte de synchronisation des données
export interface SyncContextType {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  synchronizeData: () => Promise<boolean>;
  refreshData: () => Promise<boolean>;
  hasPendingChanges: boolean;
}
