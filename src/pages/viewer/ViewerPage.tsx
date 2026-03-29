/**
 * Viewer Page — Construction OS Control Tower
 * Absorbed from VTI control tower Viewer surface.
 * Document and artifact viewer with donor source integration.
 */

import { ControlTowerPage, type PageMetric, type AssetItem } from '../../components/control-tower';

const metrics: PageMetric[] = [
  { label: 'Supported Formats', value: '3', delta: 'PDF / Image / DXF', trend: 'neutral' },
  { label: 'Active Sessions', value: '0', delta: 'Not yet wired', trend: 'neutral' },
  { label: 'Donor Sources', value: '1', delta: 'OMNI-VIEW', trend: 'neutral' },
  { label: 'Artifacts Cached', value: '0', delta: 'Awaiting integration', trend: 'neutral' },
];

const assets: AssetItem[] = [
  { id: 'VWR-001', name: 'PDF Viewer', category: 'output', status: 'COMING_SOON', detail: 'PDF document rendering' },
  { id: 'VWR-002', name: 'Image Viewer', category: 'output', status: 'COMING_SOON', detail: 'Raster image display' },
  { id: 'VWR-003', name: 'DXF Viewer', category: 'spatial', status: 'COMING_SOON', detail: 'CAD drawing viewer' },
  { id: 'VWR-004', name: 'Detail Artifact Viewer', category: 'output', status: 'COMING_SOON', detail: 'Generated detail display' },
  { id: 'VWR-005', name: 'OMNI-VIEW Donor Source', category: 'infrastructure', status: 'STAGED', detail: 'External viewer integration' },
];

export function ViewerPage() {
  return (
    <ControlTowerPage
      title="Viewer"
      subtitle="Document and artifact viewer — format support and donor source integration"
      statusBadge="COMING_SOON"
      metrics={metrics}
      tableLabel="Viewer Sources"
      assets={assets}
      chartLabel="Viewer Usage Projection"
      seedNotice="Viewer capabilities are staged for future integration. No live viewer sessions are active. Format support and donor sources represent planned capabilities."
    />
  );
}
