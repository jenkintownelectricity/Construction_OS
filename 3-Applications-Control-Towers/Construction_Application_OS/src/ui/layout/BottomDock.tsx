/**
 * Construction OS — Bottom Command Dock (Stabilized)
 *
 * Behavior:
 * - Idle height: 28px (thin strip)
 * - Expands on tab click or proximity (respects cooldown)
 * - Close button collapses immediately + enters 300ms cooldown
 * - Proximity cannot reopen during cooldown
 * - Pin/lock overrides collapse
 * - Preserves panel state when switching tabs
 * - Glass morph styling when expanded
 * - Panel-local nudge controls on dock host
 */

import { useCallback, useRef, useState } from 'react';
import { tokens } from '../theme/tokens';
import { PROXIMITY } from '../gravity/ProximityConstants';
import { glassMorphDockStyle } from '../gravity/GlassMorph';
import { NudgeControls } from '../gravity/NudgeControls';
import { AwarenessPanel } from '../panels/awareness/AwarenessPanel';
import { RuntimeDiagnosticsPanel } from '../panels/diagnostics/RuntimeDiagnosticsPanel';
import { ProposalMailbox } from '../panels/proposals/ProposalMailbox';
import { SpatialPanel } from '../panels/spatial/SpatialPanel';
import { AssistantConsole } from '../panels/assistant/AssistantConsole';
import { SystemPanel } from '../panels/system/SystemPanel';

export type DockTab = 'awareness' | 'diagnostics' | 'proposals' | 'spatial' | 'assistant' | 'system';

const DOCK_TABS: { id: DockTab; label: string }[] = [
  { id: 'awareness', label: 'Awareness' },
  { id: 'diagnostics', label: 'Diagnostics' },
  { id: 'proposals', label: 'Proposals' },
  { id: 'spatial', label: 'Spatial' },
  { id: 'assistant', label: 'Assistant' },
  { id: 'system', label: 'System' },
];

interface BottomDockProps {
  bottomProximity?: number;
  bottomActive?: boolean;
}

export function BottomDock({ bottomProximity = 0, bottomActive = false }: BottomDockProps) {
  const [activeTab, setActiveTab] = useState<DockTab>('awareness');
  const [expanded, setExpanded] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [userOpened, setUserOpened] = useState(false);
  const cooldownUntilRef = useRef(0);

  const isInCooldown = () => Date.now() < cooldownUntilRef.current;

  // Close button: collapse immediately + enter cooldown
  const handleClose = useCallback(() => {
    setUserOpened(false);
    setExpanded(false);
    cooldownUntilRef.current = Date.now() + PROXIMITY.collapseCooldown;
  }, []);

  const handleToggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
    setUserOpened(true);
  }, []);

  const handleTogglePin = useCallback(() => {
    setPinned((prev) => {
      if (!prev) setUserOpened(true); // pinning also opens
      return !prev;
    });
  }, []);

  const handleTabClick = useCallback((tab: DockTab) => {
    setActiveTab(tab);
    setUserOpened(true);
  }, []);

  // Determine effective open state — proximity respects cooldown
  const proximityCanOpen = bottomActive && !isInCooldown();
  const isOpen = pinned || userOpened || expanded || proximityCanOpen;

  // Dock height: discrete states only
  const dockHeight = (() => {
    if (!isOpen) return PROXIMITY.dockIdleHeight;
    if (expanded) return PROXIMITY.dockExpandedHeight;
    return PROXIMITY.dockPreviewHeight;
  })();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: `${dockHeight}px`,
      minHeight: `${PROXIMITY.dockIdleHeight}px`,
      background: isOpen ? (glassMorphDockStyle.background as string) : tokens.color.bgBase,
      backdropFilter: isOpen ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: isOpen ? 'blur(12px)' : 'none',
      borderTop: `1px solid ${isOpen ? 'rgba(255,255,255,0.06)' : tokens.color.border}`,
      transition: `height ${PROXIMITY.expandDuration}ms ${PROXIMITY.easing}`,
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Dock Tab Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        minHeight: `${PROXIMITY.dockIdleHeight}px`,
        background: isOpen ? 'rgba(255,255,255,0.02)' : 'transparent',
        borderBottom: isOpen ? '1px solid rgba(255,255,255,0.04)' : 'none',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', flex: 1, gap: '1px', overflow: 'hidden' }}>
          {DOCK_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              style={{
                flex: 1,
                padding: `${tokens.space.xs} ${tokens.space.sm}`,
                background: activeTab === tab.id && isOpen ? tokens.color.bgActive : 'transparent',
                color: activeTab === tab.id && isOpen ? tokens.color.fgPrimary : tokens.color.fgMuted,
                border: 'none',
                borderBottom: activeTab === tab.id && isOpen ? `2px solid ${tokens.color.accentPrimary}` : '2px solid transparent',
                cursor: 'pointer',
                fontSize: tokens.font.sizeXs,
                fontWeight: activeTab === tab.id ? tokens.font.weightSemibold : tokens.font.weightNormal,
                fontFamily: tokens.font.family,
                lineHeight: tokens.font.lineTight,
                transition: `all ${tokens.transition.fast}`,
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: `0 ${tokens.space.sm}`, flexShrink: 0 }}>
          {/* Nudge controls on dock host */}
          {isOpen && <NudgeControls position="bottom" />}
          <DockBtn label={pinned ? '\u25C9' : '\u25CB'} title={pinned ? 'Unpin' : 'Pin'} active={pinned} onClick={handleTogglePin} />
          <DockBtn label={expanded ? '\u25BD' : '\u25B3'} title={expanded ? 'Shrink' : 'Expand'} active={expanded} onClick={handleToggleExpand} />
          {/* Close button — collapses immediately with cooldown */}
          {isOpen && !pinned && (
            <DockBtn label={'\u2715'} title="Close dock (cooldown 300ms)" active={false} onClick={handleClose} />
          )}
        </div>
      </div>

      {/* Dock Content */}
      {isOpen && (
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', minHeight: 0 }}>
          <DockPane visible={activeTab === 'awareness'}><AwarenessPanel /></DockPane>
          <DockPane visible={activeTab === 'diagnostics'}><RuntimeDiagnosticsPanel /></DockPane>
          <DockPane visible={activeTab === 'proposals'}><ProposalMailbox /></DockPane>
          <DockPane visible={activeTab === 'spatial'}><SpatialPanel /></DockPane>
          <DockPane visible={activeTab === 'assistant'}><AssistantConsole /></DockPane>
          <DockPane visible={activeTab === 'system'}><SystemPanel /></DockPane>
        </div>
      )}
    </div>
  );
}

function DockPane({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: visible ? 'flex' : 'none',
      flexDirection: 'column', overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}

function DockBtn({ label, title, active, onClick }: {
  label: string; title: string; active: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} title={title} style={{
      width: '24px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: active ? tokens.color.bgActive : 'transparent',
      color: active ? tokens.color.fgPrimary : tokens.color.fgMuted,
      border: 'none', borderRadius: tokens.radius.sm, cursor: 'pointer',
      fontSize: tokens.font.sizeXs, padding: 0,
    }}>
      {label}
    </button>
  );
}
