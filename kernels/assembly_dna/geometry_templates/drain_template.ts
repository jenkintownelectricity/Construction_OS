/**
 * Roof Drain Geometry Template
 * Generates 2D cross-section coordinates for roof drain assemblies.
 * Origin: centerline of drain bowl at finished roof membrane surface (0, 0).
 * X: horizontal (positive = away from drain center). Y: vertical (positive = up).
 */

export interface Point2D { x: number; y: number; }
export interface AnnotationAnchor { id: string; point: Point2D; label: string; leader: Point2D; }
export interface DimensionAnchor { id: string; start: Point2D; end: Point2D; value: string; axis: 'x' | 'y'; }

export interface DrainGeometry {
  outline: Point2D[];
  layerPolygons: Record<string, Point2D[]>;
  annotationAnchors: AnnotationAnchor[];
  dimensionAnchors: DimensionAnchor[];
  boundingBox: { minX: number; minY: number; maxX: number; maxY: number };
}

export interface AssemblyLayer {
  component_id: string;
  name: string;
  position: string;
  parameters?: Record<string, unknown>;
}

export interface Assembly { components: AssemblyLayer[]; }

export function generateDrainGeometry(assembly: Assembly): DrainGeometry {
  const fieldWidth = 500;
  const deckThickness = 150;
  const insulationMm = 100;
  const membraneMm = 8;
  const sumpDepth = 50;
  const sumpRadius = 125;
  const bowlRadius = 75;
  const drainBodyRadius = 60;
  const drainBodyDepth = 200;
  const flangeMm = 6;
  const clamperRingMm = 10;

  const layers: Record<string, Point2D[]> = {};

  layers['deck'] = [
    { x: -fieldWidth, y: -deckThickness }, { x: fieldWidth, y: -deckThickness },
    { x: fieldWidth, y: 0 }, { x: -fieldWidth, y: 0 },
  ];

  // Tapered insulation — slopes to drain
  layers['insulation'] = [
    { x: -fieldWidth, y: 0 }, { x: -sumpRadius, y: 0 },
    { x: -sumpRadius, y: insulationMm - sumpDepth },
    { x: -bowlRadius, y: insulationMm - sumpDepth },
    { x: bowlRadius, y: insulationMm - sumpDepth },
    { x: sumpRadius, y: insulationMm - sumpDepth },
    { x: sumpRadius, y: 0 }, { x: fieldWidth, y: 0 },
    { x: fieldWidth, y: insulationMm }, { x: -fieldWidth, y: insulationMm },
  ];

  const memTop = insulationMm + membraneMm;
  layers['membrane'] = [
    { x: -fieldWidth, y: insulationMm }, { x: -bowlRadius, y: insulationMm - sumpDepth },
    { x: bowlRadius, y: insulationMm - sumpDepth },
    { x: fieldWidth, y: insulationMm },
    { x: fieldWidth, y: memTop }, { x: -fieldWidth, y: memTop },
  ];

  layers['drain_flange'] = [
    { x: -bowlRadius, y: insulationMm - sumpDepth - flangeMm },
    { x: bowlRadius, y: insulationMm - sumpDepth - flangeMm },
    { x: bowlRadius, y: insulationMm - sumpDepth },
    { x: -bowlRadius, y: insulationMm - sumpDepth },
  ];

  layers['drain_body'] = [
    { x: -drainBodyRadius, y: -deckThickness - drainBodyDepth },
    { x: drainBodyRadius, y: -deckThickness - drainBodyDepth },
    { x: drainBodyRadius, y: insulationMm - sumpDepth - flangeMm },
    { x: -drainBodyRadius, y: insulationMm - sumpDepth - flangeMm },
  ];

  layers['clamping_ring'] = [
    { x: -bowlRadius, y: insulationMm - sumpDepth },
    { x: bowlRadius, y: insulationMm - sumpDepth },
    { x: bowlRadius, y: insulationMm - sumpDepth + clamperRingMm },
    { x: -bowlRadius, y: insulationMm - sumpDepth + clamperRingMm },
  ];

  const outline: Point2D[] = [
    { x: -fieldWidth, y: -deckThickness }, { x: fieldWidth, y: -deckThickness },
    { x: fieldWidth, y: memTop }, { x: -fieldWidth, y: memTop },
  ];

  const annotationAnchors: AnnotationAnchor[] = [
    { id: 'ann_sump', point: { x: 0, y: insulationMm - sumpDepth }, label: 'Tapered insulation sump', leader: { x: -350, y: insulationMm - sumpDepth - 20 } },
    { id: 'ann_flange', point: { x: bowlRadius, y: insulationMm - sumpDepth - flangeMm / 2 }, label: 'Cast iron drain flange', leader: { x: 300, y: insulationMm - sumpDepth } },
    { id: 'ann_clamp', point: { x: 0, y: insulationMm - sumpDepth + clamperRingMm }, label: 'Clamping ring — membrane sandwich', leader: { x: 280, y: insulationMm } },
    { id: 'ann_slope', point: { x: -300, y: insulationMm + 20 }, label: 'Min 1% slope to drain', leader: { x: -300, y: memTop + 15 } },
  ];

  const dimensionAnchors: DimensionAnchor[] = [
    { id: 'dim_sump_depth', start: { x: fieldWidth + 20, y: insulationMm - sumpDepth }, end: { x: fieldWidth + 20, y: insulationMm }, value: `${sumpDepth}mm sump`, axis: 'y' },
    { id: 'dim_insulation', start: { x: -fieldWidth - 20, y: 0 }, end: { x: -fieldWidth - 20, y: insulationMm }, value: `${insulationMm}mm insul.`, axis: 'y' },
    { id: 'dim_bowl_dia', start: { x: -bowlRadius, y: -20 }, end: { x: bowlRadius, y: -20 }, value: `${bowlRadius * 2}mm bowl`, axis: 'x' },
  ];

  return {
    outline, layerPolygons: layers, annotationAnchors, dimensionAnchors,
    boundingBox: { minX: -fieldWidth, minY: -deckThickness - drainBodyDepth, maxX: fieldWidth, maxY: memTop },
  };
}
