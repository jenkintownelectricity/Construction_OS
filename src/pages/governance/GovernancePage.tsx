/**
 * Governance Page (Integrity Dashboard) — Construction OS Control Tower
 * Absorbed from VTI control tower Governance surface.
 * Displays governance integrity, sentinel boundaries, and genesis receipts.
 */

import { tokens } from '../../ui/theme/tokens';
import { ControlTowerPage, type PageMetric, type AssetItem } from '../../components/control-tower';
import { StatusBadge } from '../../components/control-tower/StatusBadge';

const t = tokens;

const metrics: PageMetric[] = [
  { label: 'Sentinel Boundary', value: 'ACTIVE', delta: 'All checks passing', trend: 'up' },
  { label: 'Registry Chain', value: 'VALID', delta: 'Integrity confirmed', trend: 'neutral' },
  { label: 'Contracts Active', value: '20', delta: '+6 birth contracts', trend: 'up' },
  { label: 'Violations', value: '0', delta: 'Clean', trend: 'neutral' },
];

const assets: AssetItem[] = [
  { id: 'GOV-001', name: 'Birthing Singularity Check', category: 'sentinel', status: 'ACTIVE', detail: 'DomainFoundryOS sole authority verified' },
  { id: 'GOV-002', name: 'Registry Append-Only Audit', category: 'registry', status: 'ACTIVE', detail: 'No mutations detected' },
  { id: 'GOV-003', name: 'Contract Schema Validation', category: 'governance', status: 'ACTIVE', detail: 'All schemas conformant' },
  { id: 'GOV-004', name: 'Kernel Purity Gate', category: 'core', status: 'ACTIVE', detail: 'All kernels above 85% purity' },
  { id: 'GOV-005', name: 'Signal Integrity Monitor', category: 'execution', status: 'ACTIVE', detail: 'Event bus healthy' },
  { id: 'GOV-006', name: 'Topology Boundary Check', category: 'governance', status: 'ACTIVE', detail: 'No unauthorized edges' },
];

export function GovernancePage() {
  return (
    <ControlTowerPage
      title="Governance"
      subtitle="Platform integrity dashboard — sentinel boundaries, contract validation, and audit state"
      statusBadge="ACTIVE"
      metrics={metrics}
      tableLabel="Governance Checks"
      assets={assets}
      chartLabel="Governance Health Trend"
      seedNotice="Governance integrity data reflects staged demonstration state. Sentinel checks and contract validation are seed representations."
    >
      {/* Integrity Summary Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: t.spacing.md,
          marginBottom: t.spacing.xl,
        }}
      >
        {[
          { label: 'Minted Kernels', value: '6', status: 'STABLE' as const },
          { label: 'Topology Nodes', value: '14', status: 'ACTIVE' as const },
          { label: 'Signal Bus', value: 'Healthy', status: 'ACTIVE' as const },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              background: t.color.bgSurface,
              border: `1px solid ${t.color.border}`,
              borderRadius: t.radius.lg,
              padding: t.spacing.lg,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: t.font.sizeXs, color: t.color.fgMuted }}>{item.label}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: Number(t.font.weightBold), color: t.color.fgPrimary, marginTop: 4 }}>
                {item.value}
              </div>
            </div>
            <StatusBadge status={item.status} />
          </div>
        ))}
      </div>
    </ControlTowerPage>
  );
}
