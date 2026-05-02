export interface ModuleContentDto {
  topics: string[];
  explanations: string;
  examples: string[];
  keyTakeaways: string[];
  practiceProjects: string[];
}

export interface LearningModuleDto {
  id: string;
  categoryId: string;
  sortOrder: number;
  week: string;
  title: string;
  subtitle: string;
  dueDate?: string;
  difficulty: string;
  gradient: [string, string];
  accentColor: string;
  lessons: number;
  duration: string;
  content: ModuleContentDto;
}
