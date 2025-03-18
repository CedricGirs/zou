
export interface KingdomBuilding {
  id: string;
  type: string;
  name: string;
  purpose: KingdomBuildingPurpose;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  style: string;
  createdAt: string;
}

export type KingdomBuildingPurpose = 
  | 'savingGoal'
  | 'achievement'
  | 'milestone'
  | 'contact'
  | 'other';

export interface KingdomDecoration {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  style: string;
  createdAt: string;
}

export interface KingdomRoad {
  id: string;
  points: { x: number; y: number }[];
  width: number;
  style: string;
  createdAt: string;
}

export interface KingdomModule {
  level: number;
  experience: number;
  maxExperience: number;
  style: KingdomStyle;
  buildings: KingdomBuilding[];
  decorations: KingdomDecoration[];
  roads: KingdomRoad[];
  lastSaved: string;
}

export type KingdomStyle = 'medieval' | 'roman' | 'fantasy';

export interface KingdomAsset {
  id: string;
  name: string;
  category: 'building' | 'decoration' | 'road';
  type: string;
  image: string;
  width: number;
  height: number;
}
