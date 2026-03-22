/**
 * Construction OS — Reactive Edge Panel (Stabilized)
 *
 * Uses discrete intent-state widths instead of continuous pointer-driven sizing.
 * States: idle (4px) → armed (4px) → preview (320px) → locked (380px)
 *
 * No raw-pointer width multiplication. Transitions are deterministic.
 */

import { type ReactNode, useCallback } from 'react';
import { tokens } from '../theme/tokens';
import { PROXIMITY, type EdgeState } from './ProximityConstants';
import { glassMorphStyle } from './GlassMorph';
import { proximityField } from './ProximityField';

interface EdgePanelProps {
  edge: 'left' | 'right';
  edgeState: EdgeState;
  proximity: number;
  children: ReactNode;
  title: string;
}

export function EdgePanel({ edge, edgeState, proximity, children, title }: EdgePanelProps) {
  const isActive = edgeState === 'preview' || edgeState === 'locked';
  const isLocked = edgeState === 'locked';

  // Discrete state-based width — no continuous raw-pointer multiplication
  const width = (() => {
    switch (edgeState) {
      case 'idle': return PROXIMITY.edgeIdleWidth;
      case 'sensing': return PROXIMITY.edgeIdleWidth;
      case 'expanding': return PROXIMITY.edgePreviewWidth; // jump to preview
      case 'preview': return PROXIMITY.edgePreviewWidth;
      case 'locked': return PROXIMITY.edgeLockedWidth;
      default: return PROXIMITY.edgeIdleWidth;
    }
  })();

  const handleUnlock = useCallback(() => {
    proximityField.unlockEdge(edge);
  }, [edge]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        [edge]: 0,
        width: `${width}px`,
        background: isActive ? (glassMorphStyle.background as string) : 'transparent',
        backdropFilter: isActive ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: isActive ? 'blur(12px)' : 'none',
        borderRight: edge === 'left' && isActive ? '1px solid rgba(255,255,255,0.06)' : 'none',
        borderLeft: edge === 'right' && isActive ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: `width ${PROXIMITY.expandDuration}ms ${PROXIMITY.easing}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        zIndex: isActive ? 100 : 1,
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      {/* Edge idle indicator strip — subtle, not jumpy */}
      {!isActive && (
        <div style={{
          position: 'absolute',
          top: '50%',
          [edge]: 0,
          width: `${PROXIMITY.edgeIdleWidth}px`,
          height: '60px',
          transform: 'translateY(-50%)',
          background: edgeState === 'sensing'
            ? `${tokens.color.accentPrimary}30`
            : `${tokens.color.fgMuted}15`,
          borderRadius: edge === 'left' ? '0 2px 2px 0' : '2px 0 0 2px',
          transition: `background ${PROXIMITY.expandDuration}ms ${PROXIMITY.easing}`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Panel content — visible when in preview or locked state */}
      {isActive && (
        <>
          {/* Panel header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${tokens.space.sm} ${tokens.space.md}`,
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            minHeight: '36px',
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: tokens.font.sizeXs,
              fontWeight: tokens.font.weightSemibold,
              color: tokens.color.fgSecondary,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {title}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.space.xs }}>
              {isLocked && (
                <span style={{
                  fontSize: tokens.font.sizeXs,
                  color: tokens.color.accentPrimary,
                  fontFamily: tokens.font.familyMono,
                }}>
                  LOCKED
                </span>
              )}
              <button
                onClick={handleUnlock}
                style={{
                  padding: `${tokens.space.xs} ${tokens.space.sm}`,
                  background: 'rgba(255,255,255,0.06)',
                  color: tokens.color.fgMuted,
                  border: 'none',
                  borderRadius: tokens.radius.sm,
                  cursor: 'pointer',
                  fontSize: tokens.font.sizeXs,
                }}
                title="Close panel"
              >
                {'\u2715'}
              </button>
            </div>
          </div>

          {/* Panel body */}
          <div style={{ flex: 1, overflow: 'auto', padding: tokens.space.sm }}>
            {children}
          </div>
        </>
      )}
    </div>
  );
}
