/**
 * Contracts Page (Contract Vault) — Construction OS Control Tower
 * Absorbed from VTI control tower Contracts surface.
 * Displays versioned contract schemas, domain and birth contracts.
 */

import { ControlTowerPage, type PageMetric, type AssetItem } from '../../components/control-tower';

const metrics: PageMetric[] = [
  { label: 'Total Contracts', value: '20', delta: '+6 birth contracts', trend: 'up' },
  { label: 'Domain Contracts', value: '5', delta: 'VTI auth/cmd/reg', trend: 'neutral' },
  { label: 'Birth Contracts', value: '6', delta: 'Plan/receipt/upgrade', trend: 'neutral' },
  { label: 'Violations', value: '0', delta: 'Clean', trend: 'neutral' },
];

const assets: AssetItem[] = [
  { id: 'CTR-001', name: 'construction_auth_v1', category: 'domain', status: 'STABLE', detail: 'Authentication contract' },
  { id: 'CTR-002', name: 'construction_cmd_v1', category: 'domain', status: 'STABLE', detail: 'Command contract' },
  { id: 'CTR-003', name: 'construction_registry_v1', category: 'domain', status: 'STABLE', detail: 'Registry contract' },
  { id: 'CTR-004', name: 'construction_receipt_v1', category: 'domain', status: 'STABLE', detail: 'Receipt contract' },
  { id: 'CTR-005', name: 'construction_signals_v1', category: 'domain', status: 'STABLE', detail: 'Signal contract' },
  { id: 'CTR-006', name: 'birth_target_v1', category: 'birth', status: 'STABLE', detail: 'Birth target schema' },
  { id: 'CTR-007', name: 'birth_plan_v1', category: 'birth', status: 'STABLE', detail: 'Birth plan schema' },
  { id: 'CTR-008', name: 'execution_receipt_v1', category: 'birth', status: 'STABLE', detail: 'Execution receipt schema' },
  { id: 'CTR-009', name: 'upgrade_definition_v1', category: 'birth', status: 'STABLE', detail: 'Upgrade definition schema' },
  { id: 'CTR-010', name: 'mirror_state_v1', category: 'domain', status: 'STABLE', detail: 'Mirror state contract' },
];

export function ContractsPage() {
  return (
    <ControlTowerPage
      title="Contracts"
      subtitle="Contract vault — versioned schemas for domain, birth, and platform contracts"
      statusBadge="STABLE"
      metrics={metrics}
      tableLabel="Contract Vault"
      assets={assets}
      chartLabel="Contract Governance Health"
      seedNotice="Contract vault presents staged schema references. Contract authority originates from VTI governance layer."
    />
  );
}
