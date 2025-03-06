
export interface BaseCourseItem {
  id: string;
  title: string;
  progress: number;
  completed: boolean;
}

export interface CourseItem extends BaseCourseItem {
  type: "course";
  deadline: string;
}

export interface LanguageItem extends BaseCourseItem {
  type: "language";
  level: string;
}

export interface SkillItem extends BaseCourseItem {
  type: "skill";
  certificate?: string;
}

export type StatusItem = CourseItem | LanguageItem | SkillItem;
