
export interface HeroProfile {
  username: string;
  avatarSeed: string;
  hairColor: string;
  eyeColor: string;
  skinTone: string;
  primaryFocus: 'status' | 'look' | 'finances' | 'mix';
  ambitionLevel: 'casual' | 'pro' | 'hardcore';
  class: 'warrior' | 'mage' | 'healer';
  kingdom?: KingdomElement[];
}

import { KingdomElement } from './KingdomTypes';
