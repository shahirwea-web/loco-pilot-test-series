import React from 'react';
import type { DotGroup as DotGroupType } from '../types';
import type { Difficulty } from '../types';
import { SVG_SIZE, getDotRadius } from '../utils/groupGenerator';

interface Props {
  group: DotGroupType;
  isActive: boolean;
  isMarked: boolean;
  isPast: boolean;
  difficulty: Difficulty;
  index: number;
}

const DotGroupComponent: React.FC<Props> = ({ group, isActive, isMarked, isPast, difficulty }) => {
  const radius = getDotRadius(difficulty);

  const borderColor = isActive
    ? 'border-2 border-gray-800 shadow-lg'
    : isPast
    ? 'border border-gray-200'
    : 'border border-gray-300';

  const bgColor = isMarked ? 'bg-red-50' : isActive ? 'bg-white' : 'bg-white';

  return (
    <div
      className={`relative flex-shrink-0 rounded-md ${borderColor} ${bgColor} transition-all duration-150`}
      style={{ width: SVG_SIZE + 8, height: SVG_SIZE + 8 }}
    >
      {isActive && (
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gray-800" />
      )}

      <svg
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        className="m-1"
      >
        {group.dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={radius}
            fill={isMarked ? '#dc2626' : '#111827'}
          />
        ))}
      </svg>

      {isMarked && (
        <div className="absolute inset-0 rounded-md border-2 border-red-500 pointer-events-none" />
      )}
    </div>
  );
};

export default DotGroupComponent;
