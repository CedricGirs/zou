
export interface Kingdom {
  elements: Array<{
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    style?: string;
  }>;
  name: string;
  xp: number;
  level: number;
  style: string;
}

export interface HeroProfile {
  name: string;
  username?: string; // Added username as optional
  age: number;
  energy: number;
  maxEnergy: number;
  health: number;
  maxHealth: number;
  happiness: number;
  maxHappiness: number;
  heroXP: number;
  maxXP: number;
  level: number;
  avatarColor: string;
  avatarBgColor: string;
  kingdom?: Kingdom;
  seed?: string; // Added for Avatar component
}
