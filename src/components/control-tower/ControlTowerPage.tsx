/**
 * Construction OS — Control Tower Page
 * Primary control tower view consuming the shared design-token system.
 *
 * Token source: src/ui/theme/tokens.ts
 * Spacing: tokens.spacing (governed named steps)
 * Typography: tokens.font (line heights via lineNormal / lineTight)
 */

import { tokens } from '../../ui/theme/tokens';

const t = tokens;

export function ControlTowerPage() {
  return (
    <div
      style={{
        padding: t.spacing.lg,
        fontFamily: t.font.family,
        color: t.color.fgPrimary,
        lineHeight: t.font.lineNormal,
      }}
    >
      {/* Page header */}
      <header
        style={{
          marginBottom: t.spacing.xl,
        }}
      >
        <h1
          style={{
            fontSize: t.font.sizeXl,
            fontWeight: Number(t.font.weightBold),
            lineHeight: t.font.lineTight,
            margin: 0,
          }}
        >
          Control Tower
        </h1>
        <p
          style={{
            fontSize: t.font.sizeSm,
            color: t.color.fgSecondary,
            marginTop: t.spacing.xs,
          }}
        >
          System overview and operational command surface
        </p>
      </header>

      {/* Status strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: t.spacing.md,
          padding: `${t.spacing.sm} ${t.spacing.lg}`,
          background: t.color.bgSurface,
          borderRadius: t.radius.md,
          border: `1px solid ${t.color.border}`,
          marginBottom: t.spacing.xl,
          fontSize: t.font.sizeXs,
        }}
      >
        <span style={{ color: t.color.fgMuted }}>STATUS</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: t.spacing.xs }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: t.color.success,
              display: 'inline-block',
            }}
          />
          <span style={{ color: t.color.success, fontWeight: Number(t.font.weightSemibold) }}>
            NOMINAL
          </span>
        </span>
      </div>

      {/* Panel grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: t.spacing.lg,
        }}
      >
        {(['Runtime', 'Registry', 'Governance', 'Kernel'] as const).map((label) => (
          <div
            key={label}
            style={{
              background: t.color.bgSurface,
              border: `1px solid ${t.color.border}`,
              borderRadius: t.radius.md,
              padding: t.spacing.lg,
            }}
          >
            <h2
              style={{
                fontSize: t.font.sizeMd,
                fontWeight: Number(t.font.weightSemibold),
                lineHeight: t.font.lineTight,
                margin: 0,
                marginBottom: t.spacing.sm,
              }}
            >
              {label}
            </h2>
            <p
              style={{
                fontSize: t.font.sizeSm,
                color: t.color.fgSecondary,
                lineHeight: t.font.lineNormal,
                margin: 0,
              }}
            >
              Subsystem telemetry panel
            </p>
          </div>
        ))}
      </div>
 * Control Tower Page Template — Construction OS
 *
 * Reusable page template for absorbed VTI control tower surfaces.
 * Provides metrics strip, asset table, and chart placeholder
 * in a consistent premium dark enterprise layout.
 *
 * Each page supplies its own data; this component handles layout.
 */

import { tokens } from '../../ui/theme/tokens';
import { StatusBadge, type BadgeStatus } from './StatusBadge';

const t = tokens;

export interface PageMetric {
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface AssetItem {
  id: string;
  name: string;
  category: string;
  categoryColor?: string;
  status: BadgeStatus;
  detail: string;
}

export interface ControlTowerPageProps {
  title: string;
  subtitle: string;
  statusBadge: BadgeStatus;
  metrics: PageMetric[];
  tableLabel: string;
  assets: AssetItem[];
  chartLabel?: string;
  seedNotice?: string;
  children?: React.ReactNode;
}

const TREND_ARROWS: Record<string, string> = {
  up: '\u2191',
  down: '\u2193',
  neutral: '\u2192',
};

const CATEGORY_COLORS: Record<string, string> = {
  core: t.color.warning,
  governance: t.color.accentPrimary,
  intelligence: '#a855f7',
  infrastructure: t.color.success,
  output: '#06b6d4',
  execution: t.color.warning,
  spatial: '#3b82f6',
  domain: t.color.accentPrimary,
  birth: '#eab308',
  sentinel: t.color.error,
  registry: '#06b6d4',
  default: t.color.fgMuted,
};

function getCategoryColor(category: string, override?: string): string {
  if (override) return override;
  return CATEGORY_COLORS[category.toLowerCase()] ?? CATEGORY_COLORS.default;
}

export function ControlTowerPage({
  title,
  subtitle,
  statusBadge,
  metrics,
  tableLabel,
  assets,
  chartLabel,
  seedNotice,
  children,
}: ControlTowerPageProps) {
  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: t.spacing.md, marginBottom: t.spacing.xl }}>
        <div>
          <h1
            style={{
              fontSize: t.font.sizeXl,
              fontWeight: Number(t.font.weightBold),
              color: t.color.fgPrimary,
              margin: 0,
              lineHeight: t.font.lineHeight.tight,
            }}
          >
            {title}
          </h1>
          <div style={{ fontSize: t.font.sizeXs, color: t.color.fgMuted, marginTop: 4 }}>{subtitle}</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <StatusBadge status={statusBadge} size="md" />
        </div>
      </div>

      {/* Seed / Honest Data Notice */}
      {seedNotice && (
        <div
          style={{
            fontSize: t.font.sizeXs,
            color: t.color.warning,
            background: `${t.color.warning}10`,
            border: `1px solid ${t.color.warning}25`,
            borderRadius: t.radius.md,
            padding: `${t.spacing.sm}px ${t.spacing.md}px`,
            marginBottom: t.spacing.lg,
            fontFamily: t.font.family,
          }}
        >
          {seedNotice}
        </div>
      )}

      {/* Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(metrics.length, 4)}, 1fr)`,
          gap: t.spacing.md,
          marginBottom: t.spacing.xl,
        }}
      >
        {metrics.map((metric, i) => (
          <div
            key={i}
            style={{
              background: t.color.bgSurface,
              border: `1px solid ${t.color.border}`,
              borderRadius: t.radius.lg,
              padding: t.spacing.lg,
            }}
          >
            <div style={{ fontSize: t.font.sizeXs, color: t.color.fgMuted, marginBottom: 6 }}>{metric.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: Number(t.font.weightBold), color: t.color.fgPrimary }}>
              {metric.value}
            </div>
            {metric.delta && (
              <div
                style={{
                  fontSize: '11px',
                  color:
                    metric.trend === 'up'
                      ? t.color.success
                      : metric.trend === 'down'
                        ? t.color.error
                        : t.color.fgMuted,
                  marginTop: 4,
                }}
              >
                {metric.delta} {TREND_ARROWS[metric.trend ?? 'neutral']}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Asset Table */}
      <div
        style={{
          background: t.color.bgSurface,
          border: `1px solid ${t.color.border}`,
          borderRadius: t.radius.lg,
          marginBottom: t.spacing.xl,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: `${t.spacing.md}px ${t.spacing.lg}px`,
            borderBottom: `1px solid ${t.color.border}`,
            fontSize: t.font.sizeXs,
            fontWeight: Number(t.font.weightSemibold),
            color: t.color.fgSecondary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {tableLabel}
        </div>
        <div style={{ maxHeight: 340, overflowY: 'auto' }}>
          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 1fr 100px 90px',
              padding: `${t.spacing.sm}px ${t.spacing.lg}px`,
              borderBottom: `1px solid ${t.color.border}`,
              fontSize: '10px',
              color: t.color.fgMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            <span>ID</span>
            <span>Name</span>
            <span>Detail</span>
            <span>Category</span>
            <span>Status</span>
          </div>

          {/* Table Rows */}
          {assets.map((asset) => {
            const catColor = getCategoryColor(asset.category, asset.categoryColor);
            return (
              <div
                key={asset.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 1fr 100px 90px',
                  padding: `${t.spacing.sm}px ${t.spacing.lg}px`,
                  borderBottom: `1px solid ${t.color.border}`,
                  fontSize: t.font.sizeXs,
                  alignItems: 'center',
                  transition: `background ${t.transition.fast}`,
                  cursor: 'default',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = t.color.bgHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ color: t.color.fgMuted, fontFamily: 'monospace', fontSize: '11px' }}>{asset.id}</span>
                <span style={{ color: t.color.fgPrimary, fontWeight: Number(t.font.weightMedium) }}>{asset.name}</span>
                <span style={{ color: t.color.fgSecondary }}>{asset.detail}</span>
                <span>
                  <span
                    style={{
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: t.radius.sm,
                      background: `${catColor}18`,
                      color: catColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {asset.category}
                  </span>
                </span>
                <span>
                  <StatusBadge status={asset.status} />
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Placeholder */}
      {chartLabel && (
        <div
          style={{
            background: t.color.bgSurface,
            border: `1px solid ${t.color.border}`,
            borderRadius: t.radius.lg,
            padding: t.spacing.lg,
            marginBottom: t.spacing.xl,
          }}
        >
          <div
            style={{
              fontSize: t.font.sizeXs,
              fontWeight: Number(t.font.weightSemibold),
              color: t.color.fgSecondary,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: t.spacing.md,
            }}
          >
            {chartLabel}
          </div>
          <div
            style={{
              height: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: t.color.fgMuted,
              fontSize: t.font.sizeXs,
              border: `1px dashed ${t.color.border}`,
              borderRadius: t.radius.md,
            }}
          >
            Chart visualization staged for live data integration
          </div>
        </div>
      )}

      {/* Optional custom content */}
      {children}
    </div>
  );
}
