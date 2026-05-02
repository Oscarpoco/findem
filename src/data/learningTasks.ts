import type { LearningModuleDto } from "../types/learningModule";

export interface ModuleContent {
  topics: string[];
  explanations: string;
  examples: string[];
  keyTakeaways: string[];
  practiceProjects: string[];
}

export interface LearningTask {
  id: string;
  week: string;
  title: string;
  subtitle: string;
  dueDate?: string;
  difficulty: string;
  progress: number;
  gradient: [string, string];
  accentColor: string;
  lessons: number;
  duration: string;
  content: ModuleContent;
}

export function mapApiLearningModuleToTask(
  row: LearningModuleDto,
  progressPct: number,
): LearningTask {
  const due = row.dueDate?.trim();
  return {
    id: row.id,
    week: row.week,
    title: row.title,
    subtitle: row.subtitle,
    dueDate: due ? due : undefined,
    difficulty: row.difficulty,
    progress: progressPct,
    gradient: row.gradient,
    accentColor: row.accentColor,
    lessons: row.lessons,
    duration: row.duration,
    content: row.content,
  };
}
