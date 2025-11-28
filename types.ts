
export enum Finger {
  LeftPinky = 'LP',
  LeftRing = 'LR',
  LeftMiddle = 'LM',
  LeftIndex = 'LI',
  Thumb = 'T',
  RightIndex = 'RI',
  RightMiddle = 'RM',
  RightRing = 'RR',
  RightPinky = 'RP',
}

export interface KeyConfig {
  char: string;
  finger: Finger;
  width?: number; // default 1u
  code?: string; // e.g., KeyA, Space
}

export interface Lesson {
  id: string;
  groupId: string; // New field for sidebar grouping
  groupTitle: string; // Title for the group header
  title: string;
  description: string;
  content: string; // The text to type
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'basics' | 'sentences' | 'code' | 'generated';
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  errors: number;
  totalChars: number;
  startTime: number | null;
}

export interface GameWord {
  id: number;
  word: string;
  x: number; // Percentage position (0-90)
  y: number; // Percentage down
  speed: number;
}
