
import { HeroProfile, StatusModule, LookModule, StatusItem } from './profile';
import { FinanceModule } from './finance';

export interface UserData {
  uid: string;
  heroProfile: HeroProfile;
  statusModule: StatusModule;
  lookModule: LookModule;
  financeModule: FinanceModule;
  statusItems: StatusItem[];
  skills: any[]; // This can be defined more precisely if needed
}
