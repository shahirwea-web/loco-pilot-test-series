import type { DotGroup, DotPosition, Difficulty } from '../types';

export const SVG_SIZE = 50;

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function shuffleArray<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function distance(a: DotPosition, b: DotPosition): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function getMinSpacing(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy': return 14;
    case 'medium': return 10;
    case 'hard': return 7;
  }
}

export function getDotRadius(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy': return 3.5;
    case 'medium': return 3;
    case 'hard': return 2.5;
  }
}

function getPadding(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy': return 10;
    case 'medium': return 8;
    case 'hard': return 6;
  }
}

function generateDotsForGroup(count: number, difficulty: Difficulty, rand: () => number): DotPosition[] {
  const minSpacing = getMinSpacing(difficulty);
  const padding = getPadding(difficulty);
  const positions: DotPosition[] = [];
  const maxAttempts = 200;

  for (let i = 0; i < count; i++) {
    let placed = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = padding + rand() * (SVG_SIZE - padding * 2);
      const y = padding + rand() * (SVG_SIZE - padding * 2);
      const candidate: DotPosition = { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };

      const tooClose = positions.some(p => distance(p, candidate) < minSpacing);
      if (!tooClose) {
        positions.push(candidate);
        placed = true;
        break;
      }
    }

    if (!placed) {
      const x = padding + rand() * (SVG_SIZE - padding * 2);
      const y = padding + rand() * (SVG_SIZE - padding * 2);
      positions.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    }
  }

  return positions;
}

export function generateGroups(
  count: number,
  difficulty: Difficulty,
  sessionSeed: number
): DotGroup[] {
  const rand = seededRandom(sessionSeed);
  const groups: DotGroup[] = [];

  const targetCount = Math.round(count * 0.22);
  const nonTargetCount = count - targetCount;

  const dotCounts: number[] = [];
  for (let i = 0; i < targetCount; i++) dotCounts.push(4);

  const sizes = [2, 3, 5];
  for (let i = 0; i < nonTargetCount; i++) {
    dotCounts.push(sizes[Math.floor(rand() * sizes.length)]);
  }

  const shuffledCounts = shuffleArray(dotCounts, rand);

  for (let i = 0; i < shuffledCounts.length; i++) {
    const dotCount = shuffledCounts[i];
    const dots = generateDotsForGroup(dotCount, difficulty, rand);
    groups.push({
      id: `g-${sessionSeed}-${i}`,
      dots,
      count: dotCount,
      isTarget: dotCount === 4,
    });
  }

  return groups;
}
