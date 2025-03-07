
export interface StatusModule {
  status: 'student' | 'employee' | 'career-change';
  languages: Array<{
    name: string;
    level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  }>;
  softSkills: string[];
}

export interface CourseItem {
  id: string;
  title: string;
  type: "course";
  progress: number;
  deadline?: string;
  completed: boolean;
  certificate?: string;
}

export interface LanguageItem {
  id: string;
  title: string;
  type: "language";
  level: string;
  progress: number;
  completed: boolean;
  certificate?: string;
}

export interface SkillItem {
  id: string;
  title: string;
  type: "skill";
  progress: number;
  completed: boolean;
  certificate?: string;
}

export type StatusItem = CourseItem | LanguageItem | SkillItem;
