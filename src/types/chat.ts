export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isStreaming?: boolean;
  error?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

export type StandardGrade = 'all' | 'std6' | 'std7' | 'std8';

export type SubjectCategory =
  | 'maths'
  | 'science'
  | 'social'
  | 'gujarati'
  | 'english'
  | 'sanskrit'
  | 'hindi'
  | 'computer'
  | 'farming'
  | 'health'
  | 'general';

export interface SubjectMeta {
  id: SubjectCategory;
  nameGu: string;
  gradeBadge?: string;
  applicableLanguageDesc: string;
  icon: string;
}

export interface PromptSuggestion {
  category: SubjectCategory;
  categoryLabel: string;
  grade?: StandardGrade;
  gradeLabel?: string;
  prompt: string;
  iconName: string;
}
