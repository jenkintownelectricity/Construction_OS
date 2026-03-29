/**
 * Capabilities Page — Construction OS Control Tower
 * Absorbed from VTI control tower Capabilities surface.
 * Displays capability index, installed modules, and upgrade-ready features.
 */

import { ControlTowerPage, type PageMetric, type AssetItem } from '../../components/control-tower';

const metrics: PageMetric[] = [
  { label: 'Installed', value: '8', delta: '+2 this week', trend: 'up' },
  { label: 'Available', value: '14', delta: 'Marketplace', trend: 'neutral' },
  { label: 'Upgrade Ready', value: '3', delta: 'Pro tier', trend: 'up' },
  { label: 'Utilization', value: '72%', delta: '+5%', trend: 'up' },
];

const assets: AssetItem[] = [
  { id: 'CAP-001', name: 'Material Compatibility', category: 'intelligence', status: 'ACTIVE', detail: 'Constraint resolution engine' },
  { id: 'CAP-002', name: 'Spatial Reasoning', category: 'spatial', status: 'ACTIVE', detail: 'Assembly graph topology' },
  { id: 'CAP-003', name: 'Detail Generation', category: 'output', status: 'ACTIVE', detail: 'Construction detail output' },
  { id: 'CAP-004', name: 'Shop Drawing Production', category: 'output', status: 'ACTIVE', detail: 'Fabrication document pipeline' },
  { id: 'CAP-005', name: 'Governance Audit', category: 'governance', status: 'ACTIVE', detail: 'Deterministic audit trail' },
  { id: 'CAP-006', name: 'Event Routing', category: 'infrastructure', status: 'ACTIVE', detail: 'Signal bus infrastructure' },
  { id: 'CAP-007', name: 'DXF Export', category: 'output', status: 'UPGRADE', detail: 'Pro tier — upgrade available' },
  { id: 'CAP-008', name: 'Layer Management', category: 'spatial', status: 'UPGRADE', detail: 'Pro tier — upgrade available' },
  { id: 'CAP-009', name: 'Calibration Engine', category: 'intelligence', status: 'UPGRADE', detail: 'Pro tier — upgrade available' },
  { id: 'CAP-010', name: 'PDF Viewing', category: 'output', status: 'AVAILABLE', detail: 'Marketplace — not installed' },
];

export function CapabilitiesPage() {
  return (
    <ControlTowerPage
      title="Capabilities"
      subtitle="Capability index — installed modules, available marketplace, and upgrade tiers"
      statusBadge="ACTIVE"
      metrics={metrics}
      tableLabel="Capability Index"
      assets={assets}
      chartLabel="Capability Usage Trend"
      seedNotice="Capability index aligned with feature catalog and capability map. Marketplace and upgrade tiers reflect staged platform packaging."
    />
  );
}
