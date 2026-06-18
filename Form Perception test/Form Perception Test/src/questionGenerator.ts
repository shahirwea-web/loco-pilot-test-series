import { Question, SymbolConfig, SymbolType } from './types';

const SYMBOL_TYPES: SymbolType[] = [
  'arrow',
  'rightTriangle',
  'chevron',
  'lShape',
  'zShape',
  'tShape',
  'angleBracket',
  'hook',
  'flag',
  'parallelLines',
  'stepShape',
  'crossHatch',
];

const ROTATIONS = [0, 45, 90, 135, 180, 225, 270, 315];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickExcluding<T>(arr: T[], excluded: T): T {
  const filtered = arr.filter((x) => x !== excluded);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function createOddVariant(base: SymbolConfig, type: SymbolType): SymbolConfig {
  const strategy = Math.random();

  if (strategy < 0.45) {
    // Different rotation
    const oddRotation = pickExcluding(ROTATIONS, base.rotation);
    return { type, rotation: oddRotation, mirror: base.mirror };
  } else if (strategy < 0.75) {
    // Mirror flip
    return { type, rotation: base.rotation, mirror: !base.mirror };
  } else {
    // Both: different rotation AND mirror
    const oddRotation = pickExcluding(ROTATIONS, base.rotation);
    return { type, rotation: oddRotation, mirror: !base.mirror };
  }
}

export function generateQuestions(count = 50): Question[] {
  const questions: Question[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let type: SymbolType;
    let baseRotation: number;
    let baseMirror: boolean;
    let comboKey: string;
    let attempts = 0;

    do {
      type = pick(SYMBOL_TYPES);
      baseRotation = pick(ROTATIONS);
      baseMirror = Math.random() < 0.5;
      comboKey = `${type}-${baseRotation}-${baseMirror}`;
      attempts++;
    } while (usedCombinations.has(comboKey) && attempts < 50);

    usedCombinations.add(comboKey);

    const baseSymbol: SymbolConfig = { type, rotation: baseRotation, mirror: baseMirror };
    const oddSymbol = createOddVariant(baseSymbol, type);

    const oddIndex = Math.floor(Math.random() * 5);
    const symbols: SymbolConfig[] = Array.from({ length: 5 }, (_, idx) =>
      idx === oddIndex ? oddSymbol : { ...baseSymbol }
    );

    // Display time: 1000ms; answer time: 2 seconds
    const displayTime = 1000;

    questions.push({
      id: i + 1,
      symbols,
      oddIndex,
      displayTime,
      answerTime: 2000,
    });
  }

  return questions;
}
