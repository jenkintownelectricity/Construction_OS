/**
 * Construction OS — Panel-Local Nudge Controls
 *
 * Small, low-visibility controls that appear on major panels:
 *   Explorer, Work, Reference, right visual/spatial, bottom dock
 *
 * Behavior:
 * - Low-visibility by default (nearly invisible)
 * - Soft glow on cursor approach
 * - Full visibility on hover/focus
 * - Must not introduce new permanent chrome
 *
 * Controls:
 *   ← → nudge horizontal bias
 *   + - nudge workspace scale
 */

import { useCallback, useState } from 'react';
import { tokens } from '../theme/tokens';
import { PROXIMITY } from './ProximityConstants';
import { layoutStore } from './LayoutState';

type NudgePosition = 'left' | 'right' | 'center' | 'bottom';

interface NudgeControlsProps {
  position: NudgePosition;
}

export function NudgeControls({ position }: NudgeControlsProps) {
  const [hovered, setHovered] = useState(false);

  const handleNudgeLeft = useCallback(() => {
    layoutStore.nudgeHorizontalBias(-PROXIMITY.biasStep);
  }, []);

  const handleNudgeRight = useCallback(() => {
    layoutStore.nudgeHorizontalBias(PROXIMITY.biasStep);
  }, []);

  const handleExpand = useCallback(() => {
    layoutStore.nudgeWorkspaceScale(PROXIMITY.biasStep);
  }, []);

  const handleShrink = useCallback(() => {
    layoutStore.nudgeWorkspaceScale(-PROXIMITY.biasStep);
  }, []);

  // Determine which buttons to show based on position
  const showLeftRight = position === 'center' || position === 'left' || position === 'right';
  const showExpandShrink = position === 'center' || position === 'bottom';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1px',
        opacity: hovered ? 0.9 : 0.15,
        transition: `opacity ${PROXIMITY.expandDuration}ms ${PROXIMITY.easing}`,
        pointerEvents: 'auto',
      }}
    >
      {showLeftRight && (
        <NudgeBtn
          label={'\u2190'}
          title="Shift bias left (visual/spatial)"
          onClick={handleNudgeLeft}
          hovered={hovered}
        />
      )}
      {showExpandShrink && (
        <NudgeBtn
          label={'\u2212'}
          title="Shrink workspace"
          onClick={handleShrink}
          hovered={hovered}
        />
      )}
      {showExpandShrink && (
        <NudgeBtn
          label={'\u002B'}
          title="Expand workspace"
          onClick={handleExpand}
          hovered={hovered}
        />
      )}
      {showLeftRight && (
        <NudgeBtn
          label={'\u2192'}
          title="Shift bias right (document/reference)"
          onClick={handleNudgeRight}
          hovered={hovered}
        />
      )}
    </div>
  );
}

function NudgeBtn({ label, title, onClick, hovered }: {
  label: string; title: string; onClick: () => void; hovered: boolean;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={title}
      style={{
        width: '20px',
        height: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: hovered ? tokens.color.bgElevated : 'transparent',
        color: hovered ? tokens.color.fgSecondary : tokens.color.fgMuted,
        border: 'none',
        borderRadius: '2px',
        cursor: 'pointer',
        fontSize: '0.75rem',
        padding: 0,
        transition: `all ${PROXIMITY.expandDuration}ms ${PROXIMITY.easing}`,
        boxShadow: hovered ? `0 0 4px ${tokens.color.accentPrimary}20` : 'none',
      }}
    >
      {label}
    </button>
  );
}
