export type SymbolType =
  | 'arrow'
  | 'rightTriangle'
  | 'chevron'
  | 'lShape'
  | 'zShape'
  | 'tShape'
  | 'angleBracket'
  | 'hook'
  | 'flag'
  | 'parallelLines'
  | 'stepShape'
  | 'crossHatch';

export interface SymbolConfig {
  type: SymbolType;
  rotation: number;
  mirror: boolean;
}

export interface Question {
  id: number;
  symbols: SymbolConfig[];
  oddIndex: number;
  displayTime: number;
  answerTime: number;
}

export interface Answer {
  questionId: number;
  selectedIndex: number | null;
  correct: boolean;
  responseTime: number;
}

export type TestPhase = 'intro' | 'display' | 'answer' | 'results';
