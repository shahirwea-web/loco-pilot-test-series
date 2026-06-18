import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { DotGroup, GroupResponse, Difficulty } from '../types';
import { generateGroups } from '../utils/groupGenerator';
import DotGroupComponent from './DotGroupComponent';
import CountdownTimer from './CountdownTimer';
import { ChevronRight } from 'lucide-react';

const SESSION_DURATION = 150;
const GROUPS_PER_SESSION = 280;
const GROUPS_PER_PAGE = 70;

interface Props {
  sessionNumber: number;
  difficulty: Difficulty;
  sessionSeed: number;
  onSessionEnd: (responses: GroupResponse[], groups: DotGroup[], duration: number) => void;
  focusViolations: number;
  onFocusViolation: () => void;
}

const TestSession: React.FC<Props> = ({
  sessionNumber,
  difficulty,
  sessionSeed,
  onSessionEnd,
  focusViolations,
  onFocusViolation,
}) => {
  const [groups] = useState<DotGroup[]>(() =>
    generateGroups(GROUPS_PER_SESSION, difficulty, sessionSeed)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [markedGroups, setMarkedGroups] = useState<Set<string>>(new Set());
  const [responses, setResponses] = useState<Map<string, GroupResponse>>(new Map());
  const [groupActiveTimes, setGroupActiveTimes] = useState<Map<string, number>>(
    new Map([[`g-${sessionSeed}-0`, Date.now()]])
  );
  const [sessionStart] = useState(Date.now());
  const [pageTransitioning, setPageTransitioning] = useState(false);
  const [expired, setExpired] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const pageStart = (currentPage - 1) * GROUPS_PER_PAGE;
  const pageEnd = Math.min(currentPage * GROUPS_PER_PAGE, groups.length);
  const pageGroups = groups.slice(pageStart, pageEnd);
  const pageLocalIndex = activeIndex - pageStart;

  const recordResponse = useCallback(
    (groupId: string, marked: boolean) => {
      const activatedAt = groupActiveTimes.get(groupId) ?? Date.now();
      const responseTime = Date.now() - activatedAt;
      const group = groups.find(g => g.id === groupId);
      if (!group) return;

      setResponses(prev => {
        const next = new Map(prev);
        next.set(groupId, {
          groupId,
          marked,
          isTarget: group.isTarget,
          responseTime,
          timestamp: Date.now(),
        });
        return next;
      });
    },
    [groupActiveTimes, groups]
  );

  const handleExpire = useCallback(() => {
    if (expired) return;
    setExpired(true);
    const duration = Date.now() - sessionStart;
    const finalResponses: GroupResponse[] = [];
    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      const existing = responses.get(g.id);
      if (existing) {
        finalResponses.push(existing);
      } else {
        finalResponses.push({
          groupId: g.id,
          marked: markedGroups.has(g.id),
          isTarget: g.isTarget,
          responseTime: 0,
          timestamp: Date.now(),
        });
      }
    }
    onSessionEnd(finalResponses, groups, duration);
  }, [expired, sessionStart, groups, responses, markedGroups, onSessionEnd]);

  const moveToGroup = useCallback(
    (newIndex: number) => {
      if (newIndex < 0 || newIndex >= groups.length) return;
      const prevGroup = groups[activeIndex];

      if (!responses.has(prevGroup.id)) {
        recordResponse(prevGroup.id, markedGroups.has(prevGroup.id));
      }

      const newPage = Math.floor(newIndex / GROUPS_PER_PAGE) + 1;
      if (newPage !== currentPage) {
        setPageTransitioning(true);
        setCurrentPage(newPage);
        setTimeout(() => setPageTransitioning(false), 300);
      }

      setActiveIndex(newIndex);
      setGroupActiveTimes(prev => {
        const next = new Map(prev);
        if (!next.has(groups[newIndex].id)) {
          next.set(groups[newIndex].id, Date.now());
        }
        return next;
      });

      // Scroll active group into view
      if (gridRef.current) {
        setTimeout(() => {
          const activeElement = gridRef.current?.querySelector(`[data-local-index="${newIndex - pageStart}"]`);
          activeElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }, 0);
      }
    },
    [activeIndex, groups, markedGroups, recordResponse, responses, currentPage, pageStart]
  );

  const handleNextPage = useCallback(() => {
    if (currentPage < 4) {
      // Save responses on current page before moving
      for (let i = pageStart; i < pageEnd; i++) {
        const g = groups[i];
        if (!responses.has(g.id)) {
          recordResponse(g.id, markedGroups.has(g.id));
        }
      }
      setPageTransitioning(true);
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      setTimeout(() => setPageTransitioning(false), 300);
      setActiveIndex((nextPage - 1) * GROUPS_PER_PAGE);
    }
  }, [currentPage, pageStart, pageEnd, groups, responses, markedGroups, recordResponse]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (expired || pageTransitioning) return;
      const activeGroup = groups[activeIndex];

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          moveToGroup(activeIndex + 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          moveToGroup(activeIndex - 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setMarkedGroups(prev => {
            const next = new Set(prev);
            next.add(activeGroup.id);
            return next;
          });
          recordResponse(activeGroup.id, true);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setMarkedGroups(prev => {
            const next = new Set(prev);
            next.delete(activeGroup.id);
            return next;
          });
          recordResponse(activeGroup.id, false);
          break;
      }
    },
    [expired, pageTransitioning, activeIndex, groups, moveToGroup, recordResponse]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const handleBlur = () => {
      if (!expired) onFocusViolation();
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [expired, onFocusViolation]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const progress = ((activeIndex + 1) / groups.length) * 100;

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="flex flex-col h-full outline-none bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      onFocus={() => {}}
    >
      {/* Focus violation warning */}
      {focusViolations > 0 && (
        <div className="bg-amber-50 border-b border-amber-300 px-8 py-2 text-xs text-amber-800 font-medium text-center">
          Warning: {focusViolations} focus violation{focusViolations > 1 ? 's' : ''} detected
        </div>
      )}

      {/* Progress bar */}
      <div className="h-1.5 bg-purple-100">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Grid of dot groups for current page */}
      <div className={`flex-1 flex flex-col items-center justify-center px-4 py-6 overflow-auto transition-opacity duration-300 ${pageTransitioning ? 'opacity-50' : 'opacity-100'}`}>
        <div
          ref={gridRef}
          className="grid gap-2 auto-fit-grid w-full max-w-6xl"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(56px, 1fr))',
          }}
        >
          {pageGroups.map((group, localIndex) => {
            const globalIndex = pageStart + localIndex;
            return (
              <div
                key={group.id}
                data-local-index={localIndex}
                onClick={() => moveToGroup(globalIndex)}
                className="cursor-pointer"
              >
                <DotGroupComponent
                  group={group}
                  isActive={globalIndex === activeIndex}
                  isMarked={markedGroups.has(group.id)}
                  isPast={globalIndex < activeIndex}
                  difficulty={difficulty}
                  index={globalIndex}
                />
              </div>
            );
          })}
        </div>

        {/* Page navigation button */}
        {currentPage < 4 && pageEnd % GROUPS_PER_PAGE === 0 && (
          <button
            onClick={handleNextPage}
            disabled={pageTransitioning}
            className="mt-8 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            Next Page <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* Bottom bar with session info and timer */}
      <div className="border-t border-purple-200 bg-white shadow-lg">
        {/* Session info row */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-purple-100">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-widest text-purple-600">
                Session {sessionNumber} of 10
              </span>
              <span className="text-sm font-medium text-gray-600 capitalize">
                {difficulty} | Page {currentPage} of 4
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xs text-purple-500 uppercase tracking-widest font-semibold">
                Group
              </span>
              <span className="text-xl font-bold text-gray-800 tabular-nums">
                {activeIndex + 1}
                <span className="text-sm font-normal text-gray-400"> / {groups.length}</span>
              </span>
            </div>

            <CountdownTimer
              totalSeconds={SESSION_DURATION}
              onExpire={handleExpire}
            />
          </div>
        </div>

        {/* Instructions row */}
        <div className="px-6 py-2 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center justify-center flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-white border border-purple-300 rounded text-xs font-mono text-purple-700 shadow-sm">↑</kbd>
            <span className="font-medium">Mark</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-white border border-purple-300 rounded text-xs font-mono text-purple-700 shadow-sm">↓</kbd>
            <span className="font-medium">Unmark</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-white border border-purple-300 rounded text-xs font-mono text-purple-700 shadow-sm">←</kbd>
            <span className="font-medium">Prev</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-white border border-purple-300 rounded text-xs font-mono text-purple-700 shadow-sm">→</kbd>
            <span className="font-medium">Next</span>
          </div>
          <span className="text-gray-300">|</span>
          <span className="font-bold text-purple-700">Mark all groups with EXACTLY 4 dots</span>
        </div>
      </div>
    </div>
  );
};

export default TestSession;
