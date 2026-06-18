import React from 'react';
import { SymbolConfig, SymbolType } from './types';

const SIZE = 80;
const CX = SIZE / 2;
const CY = SIZE / 2;

const STROKE = '#1a1a2e';
const STROKE_WIDTH = 3;
const FILL = 'none';

const symbolPaths: Record<SymbolType, React.ReactNode> = {
  arrow: (
    <>
      <line x1="15" y1="40" x2="65" y2="40" stroke={STROKE} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
      <polyline points="50,25 65,40 50,55" fill={FILL} stroke={STROKE} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" strokeLinecap="round" />
    </>
  ),
  rightTriangle: (
    <polygon
      points="18,62 62,62 18,18"
      fill="none"
      stroke={STROKE}
      strokeWidth={STROKE_WIDTH}
      strokeLinejoin="round"
    />
  ),
  chevron: (
    <polyline
      points="22,58 40,22 58,58"
      fill={FILL}
      stroke={STROKE}
      strokeWidth={STROKE_WIDTH}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  ),
  lShape: (
    <polyline
      points="28,18 28,62 62,62"
      fill={FILL}
      stroke={STROKE}
      strokeWidth={STROKE_WIDTH}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  ),
  zShape: (
    <polyline
      points="20,22 60,22 20,58 60,58"
      fill={FILL}
      stroke={STROKE}
      strokeWidth={STROKE_WIDTH}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  ),
  tShape: (
    <>
      <line x1="18" y1="30" x2="62" y2="30" stroke={STROKE} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
      <line x1="40" y1="30" x2="40" y2="62" stroke={STROKE} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </>
  ),
  angleBracket: (
    <polyline
      points="58,18 22,40 58,62"
      fill={FILL}
      stroke={STROKE}
      strokeWidth={STROKE_WIDTH}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  ),
  hook: (
    <path
      d="M 48,18 L 48,54 Q 48,64 38,64 Q 28,64 28,54"
      fill={FILL}
      stroke={STROKE}
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
    />
  ),
  flag: (
    <>
      <line x1="28" y1="18" x2="28" y2="62" stroke={STROKE} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
      <polyline
        points="28,18 62,28 28,42"
        fill={FILL}
        stroke={STROKE}
        strokeWidth={STROKE_WIDTH}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </>
  ),
  parallelLines: (
    <>
      <line x1="20" y1="28" x2="60" y2="28" stroke={STROKE} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
      <line x1="20" y1="52" x2="60" y2="52" stroke={STROKE} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
      <line x1="32" y1="28" x2="32" y2="52" stroke={STROKE} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </>
  ),
  stepShape: (
    <polyline
      points="20,60 20,40 40,40 40,20 60,20"
      fill={FILL}
      stroke={STROKE}
      strokeWidth={STROKE_WIDTH}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  ),
  crossHatch: (
    <>
      <line x1="20" y1="40" x2="60" y2="40" stroke={STROKE} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
      <line x1="40" y1="20" x2="40" y2="60" stroke={STROKE} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
      <line x1="22" y1="22" x2="50" y2="50" stroke={STROKE} strokeWidth={STROKE_WIDTH} strokeLinecap="round" />
    </>
  ),
};

interface SymbolRendererProps {
  config: SymbolConfig;
  size?: number;
}

export const SymbolRenderer: React.FC<SymbolRendererProps> = ({ config, size = SIZE }) => {
  const { type, rotation, mirror } = config;

  const scale = size / SIZE;

  const transform = [
    `rotate(${rotation}, ${CX}, ${CY})`,
    mirror ? `scale(-1, 1) translate(-${SIZE}, 0)` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <g transform={transform}>{symbolPaths[type]}</g>
    </svg>
  );
};
