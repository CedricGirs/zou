
export type KingdomElementType = 
  // Buildings
  | "castle" 
  | "house" 
  | "tower" 
  | "wall" 
  | "gate"
  // Nature
  | "tree" 
  | "mountain" 
  | "water"
  // Resources
  | "gold" 
  | "farm"
  // Special
  | "flag" 
  | "chest" 
  | "character";

export type KingdomElementCategory = 
  | "buildings" 
  | "nature" 
  | "resources" 
  | "special";

export interface KingdomElement {
  id: string;
  type: KingdomElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color?: string;
  description?: string;
  category: KingdomElementCategory;
  xp?: number;
  created: string;
}

export interface KingdomElementTemplate {
  type: KingdomElementType;
  name: string;
  defaultWidth: number;
  defaultHeight: number;
  icon: string;
  category: KingdomElementCategory;
  xp: number;
  colors?: string[];
}
