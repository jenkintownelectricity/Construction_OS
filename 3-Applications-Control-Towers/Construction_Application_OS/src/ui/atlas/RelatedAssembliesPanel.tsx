/**
 * Related Assemblies Panel — Construction Intelligence Layer
 *
 * Shows related assemblies for the currently selected roof assembly.
 * Derives all display data from roofAssemblyObjects.ts via
 * roofAssemblyGraph.ts query. No data duplication.
 *
 * Click on related assembly performs exact existing selection behavior:
 *   projectToSourceContext → setSourceContext → setActiveObject →
 *   emit object.selected → navigate('tools')
 *
 * No auto-generation. No graph mutation. No persistence.
 *
 * Governance: VKGL04R — Ring 3 TOUCH-ALLOWED
 */

import { useEffect, useState } from 'react';
import { DEFAULT_BRANDING } from '../../lib/branding/branding-types';
import {
  getRelatedAssemblies,
  type RelatedAssembly,
} from './roofAssemblyGraph';
import {
  ROOF_ASSEMBLY_OBJECTS,
  projectToSourceContext,
  type RoofAssemblyObject,
} from './roofAssemblyObjects';
import { generationStore } from '../stores/generationStore';
import { activeObjectStore } from '../stores/activeObjectStore';
import { eventBus } from '../events/EventBus';
import type { AtlasRoute } from './types';

const c = DEFAULT_BRANDING.colors;

// ─── Relationship kind display ───────────────────────────────────────

const KIND_LABELS: Record<string, { label: string; color: string }> = {
  adjacent: { label: 'Adjacent', color: '#3b82f6' },
  'up-slope': { label: 'Up-Slope', color: '#22c55e' },
  'down-slope': { label: 'Down-Slope', color: '#f59e0b' },
  'service-linked': { label: 'Service-Linked', color: '#a855f7' },
};

// ─── Props ───────────────────────────────────────────────────────────

interface RelatedAssembliesPanelProps {
  selectedAssemblyId: string | null;
  onNavigate: (route: AtlasRoute) => void;
}

// ─── Component ───────────────────────────────────────────────────────

export function RelatedAssembliesPanel({
  selectedAssemblyId,
  onNavigate,
}: RelatedAssembliesPanelProps) {
  const [related, setRelated] = useState<readonly RelatedAssembly[]>([]);

  useEffect(() => {
    if (selectedAssemblyId) {
      setRelated(getRelatedAssemblies(selectedAssemblyId));
    } else {
      setRelated([]);
    }
  }, [selectedAssemblyId]);

  const selectedObj = selectedAssemblyId
    ? ROOF_ASSEMBLY_OBJECTS.find((o) => o.objectId === selectedAssemblyId)
    : null;

  const handleRelatedClick = (obj: RoofAssemblyObject) => {
    const sourceContext = projectToSourceContext(obj);
    if (!sourceContext) return;

    // Exact same behavior as BuildingRoofMap and ShopDrawings
    generationStore.setSourceContext(sourceContext);

    activeObjectStore.setActiveObject(
      { id: obj.objectId, type: 'document', name: obj.areaName },
      'explorer',
      'canonical',
    );

    eventBus.emit('object.selected', {
      object: { id: obj.objectId, type: 'document', name: obj.areaName },
      source: 'explorer',
      basis: 'canonical',
    });

    onNavigate('tools');
  };

  return (
    <div
      data-testid="related-assemblies-panel"
      style={{
        background: '#ffffff',
        border: `1px solid ${c.border}`,
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      <h3 style={{
        fontSize: '14px',
        fontWeight: 700,
        color: c.text,
        margin: '0 0 12px',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}>
        Related Assemblies
      </h3>

      {/* Empty state */}
      {!selectedAssemblyId && (
        <div
          data-testid="related-empty-state"
          style={{
            color: c.textMuted,
            fontSize: '13px',
            textAlign: 'center',
            padding: '16px 0',
          }}
        >
          Select a roof assembly to see related assemblies
        </div>
      )}

      {/* Selected assembly header */}
      {selectedObj && (
        <div style={{
          padding: '8px 12px',
          background: c.surfaceAlt,
          borderRadius: '6px',
          marginBottom: '12px',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: c.text }}>
            {selectedObj.label}
          </div>
          <div style={{ fontSize: '11px', color: c.textMuted }}>
            {selectedObj.manufacturer} | {selectedObj.spec}
          </div>
        </div>
      )}

      {/* No related assemblies */}
      {selectedAssemblyId && related.length === 0 && (
        <div style={{
          color: c.textMuted,
          fontSize: '12px',
          fontStyle: 'italic',
          padding: '8px 0',
        }}>
          No related assemblies found
        </div>
      )}

      {/* Related assembly items */}
      {related.map((rel) => {
        const kindMeta = KIND_LABELS[rel.relationshipKind] ?? { label: rel.relationshipKind, color: c.textMuted };
        return (
          <button
            key={rel.edgeId}
            data-testid={`related-item-${rel.assemblyObject.objectId}`}
            onClick={() => handleRelatedClick(rel.assemblyObject)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '10px 12px',
              marginBottom: '4px',
              borderRadius: '6px',
              background: 'transparent',
              border: `1px solid ${c.border}`,
              cursor: 'pointer',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '4px',
            }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: c.text }}>
                {rel.assemblyObject.label}
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '10px',
                background: `${kindMeta.color}15`,
                color: kindMeta.color,
              }}>
                {kindMeta.label}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: c.textMuted }}>
              {rel.assemblyObject.manufacturer} | {rel.assemblyObject.spec}
            </div>
          </button>
        );
      })}
    </div>
  );
}
