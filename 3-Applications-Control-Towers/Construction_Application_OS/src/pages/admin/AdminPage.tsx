/**
 * Admin Page — Construction OS Control Tower
 * Platform administration and system oversight.
 * Role-gated surface for internal platform management.
 */

import { tokens } from '../../ui/theme/tokens';
import { ControlTowerPage, type PageMetric, type AssetItem } from '../../components/control-tower';
import { StatusBadge } from '../../components/control-tower/StatusBadge';

const t = tokens;

const metrics: PageMetric[] = [
  { label: 'System Status', value: 'Operational', delta: 'All systems healthy', trend: 'up' },
  { label: 'Active Sessions', value: '1', delta: 'Current', trend: 'neutral' },
  { label: 'Pending Actions', value: '0', delta: 'Queue clear', trend: 'neutral' },
  { label: 'Last Audit', value: 'Today', delta: '2026-03-29', trend: 'neutral' },
];

const assets: AssetItem[] = [
  { id: 'ADM-001', name: 'User Management', category: 'governance', status: 'STAGED', detail: 'User and role administration' },
  { id: 'ADM-002', name: 'Session Monitor', category: 'execution', status: 'STAGED', detail: 'Active session oversight' },
  { id: 'ADM-003', name: 'Audit Log', category: 'registry', status: 'STAGED', detail: 'System audit trail' },
  { id: 'ADM-004', name: 'Feature Flags', category: 'governance', status: 'STAGED', detail: 'Feature toggle management' },
  { id: 'ADM-005', name: 'System Health', category: 'execution', status: 'ACTIVE', detail: 'Platform health monitoring' },
];

export function AdminPage() {
  return (
    <ControlTowerPage
      title="Admin"
      subtitle="Platform administration — system oversight, sessions, and audit management"
      statusBadge="GOVERNED"
      metrics={metrics}
      tableLabel="Admin Surfaces"
      assets={assets}
      seedNotice="Admin surfaces are staged for production integration. Role gating will use the upstream session provider when available."
    >
      {/* Role Notice */}
      <div
        style={{
          background: t.color.bgSurface,
          border: `1px solid ${t.color.border}`,
          borderRadius: t.radius.lg,
          padding: t.spacing.lg,
          display: 'flex',
          alignItems: 'center',
          gap: t.spacing.md,
        }}
      >
        <StatusBadge status="GOVERNED" size="md" />
        <div>
          <div style={{ fontSize: t.font.sizeXs, color: t.color.fgPrimary, fontWeight: Number(t.font.weightSemibold) }}>
            Admin Mirror Available
          </div>
          <div style={{ fontSize: '11px', color: t.color.fgMuted, marginTop: 2 }}>
            Use the Mirror Builder (Core group) with Admin lens for registry/capability/pricing inspection.
          </div>
        </div>
      </div>
    </ControlTowerPage>
  );
}
