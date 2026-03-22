/**
 * Roof Assembly Panel — Clickable Mini-Map
 *
 * First bounded construction map surface. Renders Roof Assembly objects
 * as clickable rectangles on a dark-chrome UI canvas.
 *
 * Click behavior: performs exactly the existing Shop Drawings selection:
 *   setSourceContext(projected)
 *   activeObjectStore.setActiveObject(...)
 *   eventBus.emit('object.selected', ...)
 *   onNavigate('tools')
 *
 * No auto-generation. No drag/drop. No zoom/pan. No GIS. No persistence.
 *
 * Governance: VKGL04R — Ring 3 TOUCH-ALLOWED
 */

import { useState } from 'react';
import {
  ROOF_ASSEMBLY_OBJECTS,
  projectToSourceContext,
  type RoofAssemblyObject,
} from './roofAssemblyObjects';
import { generationStore } from '../stores/generationStore';
import { activeObjectStore } from '../stores/activeObjectStore';
import { eventBus } from '../events/EventBus';
import type { AtlasRoute } from './types';

// ─── Canvas dimensions ───────────────────────────────────────────────

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 280;

// ─── Area colors by manufacturer ─────────────────────────────────────

const AREA_COLORS: Record<string, string> = {
  'Carlisle SynTec': '#3b82f6',
  'GAF': '#22c55e',
  'Johns Manville': '#a855f7',
  'Henry Company': '#f59e0b',
};

// ─── Props ───────────────────────────────────────────────────────────

interface RoofAssemblyPanelProps {
  onNavigate: (route: AtlasRoute) => void;
}

// ─── Component ───────────────────────────────────────────────────────

export function RoofAssemblyPanel({ onNavigate }: RoofAssemblyPanelProps) {
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const handleAreaClick = (obj: RoofAssemblyObject) => {
    const sourceContext = projectToSourceContext(obj);
    if (!sourceContext) return;

    setSelectedObjectId(obj.objectId);

    // Exact same behavior as Shop Drawings row selection (ShopDrawingsPage lines 155-176)
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
      data-testid="roof-assembly-panel"
      style={{
        background: '#0c0f15',
        borderRadius: '8px',
        border: '1px solid #1e2538',
        padding: '12px',
        marginBottom: '24px',
      }}
    >
      {/* Panel header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#8b93a8',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          Roof Assembly Map
        </span>
        <span style={{
          fontSize: '10px',
          color: '#555d73',
        }}>
          {ROOF_ASSEMBLY_OBJECTS.length} areas
        </span>
      </div>

      {/* Canvas */}
      <svg
        data-testid="roof-assembly-canvas"
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        width="100%"
        style={{
          background: '#121620',
          borderRadius: '4px',
          border: '1px solid #1e2538',
          display: 'block',
        }}
      >
        {/* Building outline */}
        <rect
          x="10"
          y="20"
          width={CANVAS_WIDTH - 20}
          height={CANVAS_HEIGHT - 30}
          fill="none"
          stroke="#252d42"
          strokeWidth="1"
          strokeDasharray="4 2"
        />

        {/* Roof areas */}
        {ROOF_ASSEMBLY_OBJECTS.map((obj) => {
          const color = AREA_COLORS[obj.manufacturer] ?? '#555d73';
          const isSelected = obj.objectId === selectedObjectId;

          return (
            <g key={obj.objectId}>
              <rect
                data-testid={`roof-area-${obj.objectId}`}
                x={obj.geometry.x}
                y={obj.geometry.y}
                width={obj.geometry.width}
                height={obj.geometry.height}
                fill={`${color}${isSelected ? '40' : '20'}`}
                stroke={isSelected ? '#e0e4ec' : color}
                strokeWidth={isSelected ? 2 : 1}
                rx="3"
                style={{ cursor: 'pointer' }}
                onClick={() => handleAreaClick(obj)}
              />
              {/* Area label */}
              <text
                x={obj.geometry.x + obj.geometry.width / 2}
                y={obj.geometry.y + obj.geometry.height / 2 - 6}
                textAnchor="middle"
                fill={isSelected ? '#e0e4ec' : '#8b93a8'}
                fontSize="10"
                fontWeight={isSelected ? 700 : 500}
                fontFamily="system-ui, -apple-system, sans-serif"
                style={{ pointerEvents: 'none' }}
              >
                {obj.label}
              </text>
              {/* Manufacturer sub-label */}
              <text
                x={obj.geometry.x + obj.geometry.width / 2}
                y={obj.geometry.y + obj.geometry.height / 2 + 8}
                textAnchor="middle"
                fill="#555d73"
                fontSize="8"
                fontFamily="system-ui, -apple-system, sans-serif"
                style={{ pointerEvents: 'none' }}
              >
                {obj.manufacturer} | {obj.spec}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '8px',
        flexWrap: 'wrap',
      }}>
        {Object.entries(AREA_COLORS).map(([mfr, color]) => (
          <div key={mfr} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '2px',
              background: color,
              display: 'inline-block',
            }} />
            <span style={{
              fontSize: '9px',
              color: '#555d73',
            }}>
              {mfr}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
