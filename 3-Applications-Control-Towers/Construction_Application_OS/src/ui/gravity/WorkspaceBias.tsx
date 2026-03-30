/**
 * Construction OS — Workspace Bias Controls (Stabilized)
 *
 * Controls wire to shared LayoutState — changes real layout state,
 * not visual placeholders.
 *
 *   + expand workspace (increases workspace_scale)
 *   - shrink workspace (decreases workspace_scale)
 *   ← visual/spatial bias (decreases horizontal_bias)
 *   → document/reference bias (increases horizontal_bias)
 */

import { useCallback } from 'react';
import { tokens } from '../theme/tokens';
import { PROXIMITY } from './ProximityConstants';
import { layoutStore } from './LayoutState';

export interface BiasState {
  workspaceShare: number;
  horizontalBias: number;
}

interface WorkspaceBiasProps {
  bias: BiasState;
  onBiasChange: (bias: BiasState) => void;
}

export function WorkspaceBiasControls({ bias, onBiasChange }: WorkspaceBiasProps) {
  const handleExpand = useCallback(() => {
    const newShare = Math.min(bias.workspaceShare + PROXIMITY.biasStep, PROXIMITY.workspaceMaxShare);
    layoutStore.setWorkspaceScale(newShare);
    onBiasChange({ ...bias, workspaceShare: newShare });
  }, [bias, onBiasChange]);

  const handleShrink = useCallback(() => {
    const newShare = Math.max(bias.workspaceShare - PROXIMITY.biasStep, PROXIMITY.workspaceMinShare);
    layoutStore.setWorkspaceScale(newShare);
    onBiasChange({ ...bias, workspaceShare: newShare });
  }, [bias, onBiasChange]);

  const handleVisualBias = useCallback(() => {
    const newBias = Math.max(bias.horizontalBias - PROXIMITY.biasStep, -40);
    layoutStore.setHorizontalBias(newBias);
    onBiasChange({ ...bias, horizontalBias: newBias });
  }, [bias, onBiasChange]);

  const handleDocBias = useCallback(() => {
    const newBias = Math.min(bias.horizontalBias + PROXIMITY.biasStep, 40);
    layoutStore.setHorizontalBias(newBias);
    onBiasChange({ ...bias, horizontalBias: newBias });
  }, [bias, onBiasChange]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1px',
      background: tokens.color.border,
      borderRadius: tokens.radius.sm,
      overflow: 'hidden',
    }}>
      <BiasButton
        label={'\u2190'}
        title="Visual/spatial bias — expand right panels"
        onClick={handleVisualBias}
        active={bias.horizontalBias < 0}
      />
      <BiasButton
        label={'\u2212'}
        title="Shrink workspace — increase surrounding panel visibility"
        onClick={handleShrink}
        active={bias.workspaceShare < PROXIMITY.workspaceDefaultShare}
      />
      <BiasButton
        label={'\u002B'}
        title="Expand workspace — increase workspace dominance"
        onClick={handleExpand}
        active={bias.workspaceShare > PROXIMITY.workspaceDefaultShare}
      />
      <BiasButton
        label={'\u2192'}
        title="Document/reference bias — expand left panels"
        onClick={handleDocBias}
        active={bias.horizontalBias > 0}
      />
    </div>
  );
}

function BiasButton({ label, title, onClick, active }: {
  label: string; title: string; onClick: () => void; active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: '28px',
        height: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: active ? tokens.color.bgActive : tokens.color.bgElevated,
        color: active ? tokens.color.accentPrimary : tokens.color.fgMuted,
        border: 'none',
        cursor: 'pointer',
        fontSize: tokens.font.sizeSm,
        fontWeight: tokens.font.weightSemibold,
        padding: 0,
        transition: `all ${tokens.transition.fast}`,
      }}
    >
      {label}
    </button>
  );
}

export function getDefaultBias(): BiasState {
  return {
    workspaceShare: PROXIMITY.workspaceDefaultShare,
    horizontalBias: 0,
  };
}
