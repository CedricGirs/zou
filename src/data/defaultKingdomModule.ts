
import { KingdomModule } from '@/types/KingdomTypes';

export const defaultKingdomModule: KingdomModule = {
  level: 1,
  experience: 0,
  maxExperience: 100,
  style: 'roman',
  buildings: [],
  decorations: [],
  roads: [],
  lastSaved: new Date().toISOString()
};
