/**
 * Plans & Upgrades Page — Construction OS Control Tower
 * Absorbed from VTI control tower Plans/Upgrades surface.
 * Platform packaging, licensing tiers, and upgrade paths.
 */

import { ControlTowerPage, type PageMetric, type AssetItem } from '../../components/control-tower';

const metrics: PageMetric[] = [
  { label: 'Current Tier', value: 'Professional', delta: 'Active subscription', trend: 'neutral' },
  { label: 'Features Active', value: '8', delta: 'Of 14 available', trend: 'up' },
  { label: 'Upgrades Available', value: '3', delta: 'Pro tier eligible', trend: 'up' },
  { label: 'Deployment Class', value: 'Modular', delta: 'Expandable', trend: 'neutral' },
];

const assets: AssetItem[] = [
  { id: 'PLN-001', name: 'Starter Package', category: 'core', status: 'COMPLETE', detail: 'Base platform capabilities' },
  { id: 'PLN-002', name: 'Professional Package', category: 'core', status: 'ACTIVE', detail: 'Current tier — 8 features' },
  { id: 'PLN-003', name: 'Enterprise Package', category: 'core', status: 'AVAILABLE', detail: 'Full platform — all features' },
  { id: 'PLN-004', name: 'DXF Export Add-on', category: 'output', status: 'UPGRADE', detail: 'Available with Pro tier' },
  { id: 'PLN-005', name: 'Calibration Add-on', category: 'intelligence', status: 'UPGRADE', detail: 'Available with Pro tier' },
  { id: 'PLN-006', name: 'Layer Management Add-on', category: 'spatial', status: 'UPGRADE', detail: 'Available with Pro tier' },
];

export function PlansPage() {
  return (
    <ControlTowerPage
      title="Plans & Upgrades"
      subtitle="Platform packaging — licensing tiers, upgrade paths, and feature add-ons"
      statusBadge="ACTIVE"
      metrics={metrics}
      tableLabel="Package Catalog"
      assets={assets}
      chartLabel="Platform Value Composition"
      seedNotice="Plans and upgrade tiers reflect staged packaging configuration. Pricing derived from feature catalog registry."
    />
  );
}
