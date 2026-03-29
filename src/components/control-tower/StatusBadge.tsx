/**
 * Status Badge — Construction OS Control Tower
 *
 * Adapts the VTI StatusBadge pattern to Construction OS design tokens.
 * Provides consistent status indicators across all absorbed surfaces.
 */

import { tokens } from '../../ui/theme/tokens';

const t = tokens;

export type BadgeStatus =
  | 'ACTIVE'
  | 'STABLE'
  | 'AVAILABLE'
  | 'PENDING'
  | 'BLOCKED'
  | 'EXPERIMENTAL'
  | 'UPGRADE'
  | 'COMING_SOON'
  | 'COMPLETE'
  | 'FAILED'
  | 'PREVIEW'
  | 'STAGED'
  | 'GOVERNED'
  | 'SEED';

const STATUS_COLORS: Record<BadgeStatus, string> = {
  ACTIVE: t.color.success,
  STABLE: t.color.success,
  AVAILABLE: t.color.accentPrimary,
  PENDING: t.color.warning,
  BLOCKED: t.color.error,
  EXPERIMENTAL: '#a855f7',
  UPGRADE: '#a855f7',
  COMING_SOON: t.color.fgMuted,
  COMPLETE: t.color.success,
  FAILED: t.color.error,
  PREVIEW: t.color.warning,
  STAGED: t.color.info,
  GOVERNED: t.color.accentPrimary,
  SEED: t.color.fgMuted,
};

interface StatusBadgeProps {
  status: BadgeStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const color = STATUS_COLORS[status] ?? t.color.fgMuted;
  const fontSize = size === 'sm' ? '9px' : '10px';
  const padding = size === 'sm' ? '2px 6px' : '3px 8px';

  return (
    <span
      style={{
        display: 'inline-block',
        fontSize,
        fontFamily: t.font.family,
        fontWeight: Number(t.font.weightSemibold),
        color,
        background: `${color}18`,
        border: `1px solid ${color}30`,
        borderRadius: t.radius.sm,
        padding,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {status.replace('_', ' ')}
    </span>
  );
}
