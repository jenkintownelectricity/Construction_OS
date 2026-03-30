/**
 * Roof Assembly Panel — Tests
 *
 * Proves:
 *   - Panel renders with data-testid
 *   - SVG canvas renders with roof area rectangles
 *   - All 4 static roof areas are rendered as clickable elements
 *   - Click on area calls generationStore.setSourceContext with projected context
 *   - Click on area calls activeObjectStore.setActiveObject
 *   - Click on area calls eventBus.emit('object.selected')
 *   - Click on area calls onNavigate('tools')
 *   - No auto-generation on click
 *
 * Governance: VKGL04R — Ring 2 gate proof
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoofAssemblyPanel } from './RoofAssemblyPanel';
import { ROOF_ASSEMBLY_OBJECTS } from './roofAssemblyObjects';
import { generationStore } from '../stores/generationStore';
import { activeObjectStore } from '../stores/activeObjectStore';
import { eventBus } from '../events/EventBus';

beforeEach(() => {
  generationStore.clear();
  activeObjectStore.reset();
  eventBus.clear();
});

describe('RoofAssemblyPanel — rendering', () => {
  it('renders panel with data-testid', () => {
    const onNavigate = vi.fn();
    render(<RoofAssemblyPanel onNavigate={onNavigate} />);
    expect(screen.getByTestId('roof-assembly-panel')).toBeDefined();
  });

  it('renders SVG canvas', () => {
    const onNavigate = vi.fn();
    render(<RoofAssemblyPanel onNavigate={onNavigate} />);
    expect(screen.getByTestId('roof-assembly-canvas')).toBeDefined();
  });

  it('renders all roof area rectangles', () => {
    const onNavigate = vi.fn();
    render(<RoofAssemblyPanel onNavigate={onNavigate} />);
    for (const obj of ROOF_ASSEMBLY_OBJECTS) {
      expect(screen.getByTestId(`roof-area-${obj.objectId}`)).toBeDefined();
    }
  });

  it('renders "Roof Assembly Map" header', () => {
    const onNavigate = vi.fn();
    render(<RoofAssemblyPanel onNavigate={onNavigate} />);
    expect(screen.getByText('Roof Assembly Map')).toBeDefined();
  });

  it('shows area count', () => {
    const onNavigate = vi.fn();
    render(<RoofAssemblyPanel onNavigate={onNavigate} />);
    expect(screen.getByText(`${ROOF_ASSEMBLY_OBJECTS.length} areas`)).toBeDefined();
  });
});

describe('RoofAssemblyPanel — click behavior', () => {
  it('clicking area sets sourceContext via generationStore', () => {
    const onNavigate = vi.fn();
    render(<RoofAssemblyPanel onNavigate={onNavigate} />);

    const obj = ROOF_ASSEMBLY_OBJECTS[0];
    fireEvent.click(screen.getByTestId(`roof-area-${obj.objectId}`));

    const state = generationStore.getState();
    expect(state.sourceContext).toEqual({
      submittalId: obj.objectId,
      title: obj.areaName,
      manufacturer: obj.manufacturer,
      spec: obj.spec,
      project: obj.project,
    });
  });

  it('clicking area navigates to tools', () => {
    const onNavigate = vi.fn();
    render(<RoofAssemblyPanel onNavigate={onNavigate} />);

    const obj = ROOF_ASSEMBLY_OBJECTS[1];
    fireEvent.click(screen.getByTestId(`roof-area-${obj.objectId}`));

    expect(onNavigate).toHaveBeenCalledWith('tools');
  });

  it('clicking area sets activeObject', () => {
    const onNavigate = vi.fn();
    render(<RoofAssemblyPanel onNavigate={onNavigate} />);

    const obj = ROOF_ASSEMBLY_OBJECTS[0];
    fireEvent.click(screen.getByTestId(`roof-area-${obj.objectId}`));

    const active = activeObjectStore.getState();
    expect(active.activeObject).toEqual({
      id: obj.objectId,
      type: 'document',
      name: obj.areaName,
    });
  });

  it('clicking area emits object.selected event', async () => {
    const handler = vi.fn();
    eventBus.on('object.selected', handler);

    const onNavigate = vi.fn();
    render(<RoofAssemblyPanel onNavigate={onNavigate} />);

    const obj = ROOF_ASSEMBLY_OBJECTS[2];
    fireEvent.click(screen.getByTestId(`roof-area-${obj.objectId}`));

    await new Promise((r) => setTimeout(r, 20));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        object: { id: obj.objectId, type: 'document', name: obj.areaName },
        source: 'explorer',
        basis: 'canonical',
      }),
    );
  });

  it('clicking area does NOT auto-generate (requestState stays idle)', () => {
    const onNavigate = vi.fn();
    render(<RoofAssemblyPanel onNavigate={onNavigate} />);

    const obj = ROOF_ASSEMBLY_OBJECTS[0];
    fireEvent.click(screen.getByTestId(`roof-area-${obj.objectId}`));

    // requestState should still be idle — no auto-generation
    expect(generationStore.getState().requestState.status).toBe('idle');
  });

  it('all roof areas are clickable and project valid sourceContext', () => {
    const onNavigate = vi.fn();
    render(<RoofAssemblyPanel onNavigate={onNavigate} />);

    for (const obj of ROOF_ASSEMBLY_OBJECTS) {
      generationStore.clear();
      fireEvent.click(screen.getByTestId(`roof-area-${obj.objectId}`));

      const state = generationStore.getState();
      expect(state.sourceContext).not.toBeNull();
      expect(state.sourceContext!.submittalId).toBe(obj.objectId);
      expect(state.sourceContext!.manufacturer).toBe(obj.manufacturer);
      expect(state.sourceContext!.spec).toBe(obj.spec);
    }
    expect(onNavigate).toHaveBeenCalledTimes(ROOF_ASSEMBLY_OBJECTS.length);
  });
});
