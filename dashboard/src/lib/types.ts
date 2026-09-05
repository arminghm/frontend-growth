export type ProficiencyLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface ScaleEntry {
  score: ProficiencyLevel;
  label: string;
}

export interface Subskill {
  id: string;
  name: string;
  score: number;
  status: 'gap' | 'developing' | 'good' | 'strong';
}

export interface Domain {
  id: string;
  name: string;
  score: number;
  status: 'gap' | 'developing' | 'good' | 'strong';
  summary: string;
  subskills: Subskill[];
}

export interface CurrentProgress {
  updatedAt: string;
  currentFocus: string;
  scale: ScaleEntry[];
  domains: Domain[];
}

export interface HistorySnapshot {
  date: string;
  scores: Record<string, number>;
}

export interface ProgressHistory {
  snapshots: HistorySnapshot[];
}

export interface TimelineItem {
  date: string;
  type: 'assessment' | 'evidence' | 'roadmap' | 'milestone';
  title: string;
  detail: string;
}

export interface TimelineData {
  items: TimelineItem[];
}
