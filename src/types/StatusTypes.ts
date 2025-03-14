
// Status module types
export interface StatusModule {
  status: string;
  statusLevel: number;
  statusXP: number;
  maxXP: number;
  softSkills: SoftSkill[];
  languages: LanguageEntry[];
  achievements?: Achievement[];
}

export interface SoftSkill {
  id: string;
  name: string;
  level: number;
}

export interface LanguageEntry {
  id: string;
  language: string;
  level: string;
}

// Status items and skills
export interface StatusItem {
  id: string;
  type: "course" | "language" | "skill";
  title: string;
  deadline?: string;
  completed?: boolean;
  progress?: number;
  certificate?: string;
  level?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  xpReward: number;
  icon?: React.ReactNode;
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

export interface StatusAdvice {
  title: string;
  advice: string;
  resources: string[];
  nextSteps: string[];
}

export interface SkillRequirement {
  skillId: string;
  level?: number;
}

export interface SkillPosition {
  x: number;
  y: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  branch: "weapons" | "defense" | "magic";
  position: SkillPosition;
  icon: string;
  unlocked: boolean;
  level: number;
  maxLevel: number;
  connections: string[];
  xpReward: number;
  requirements?: SkillRequirement[];
}
