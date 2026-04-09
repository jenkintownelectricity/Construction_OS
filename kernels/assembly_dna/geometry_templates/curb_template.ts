/**
 * Curb Flashing Geometry Template
 * Generates 2D cross-section coordinates for rooftop curb / equipment curb assemblies.
 * Origin: outside face of curb at deck plane (0, 0).
 * X: horizontal (positive = into roof field). Y: vertical (positive = up).
 */

export interface Point2D { x: number; y: number; }
export interface AnnotationAnchor { id: string; point: Point2D; label: string; leader: Point2D; }
export interface DimensionAnchor { id: string; start: Point2D; end: Point2D; value: string; axis: 'x' | 'y'; }

export interface CurbGeometry {
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

export function generateCurbGeometry(assembly: Assembly): CurbGeometry {
  const fieldWidth = 500;
  const deckThickness = 150;
  const insulationMm = 100;
  const membraneMm = 8;
  const curbWidth = 150;
  const curbHeight = 250;
  const flashingHeight = 220;
  const cantSize = 50;
  const counterFlashingMm = 4;
  const equipOffset = 50;

  const layers: Record<string, Point2D[]> = {};

  layers['deck'] = [
    { x: -fieldWidth, y: -deckThickness }, { x: 0, y: -deckThickness },
    { x: 0, y: 0 }, { x: -fieldWidth, y: 0 },
  ];

  layers['curb_framing'] = [
    { x: 0, y: 0 }, { x: curbWidth, y: 0 },
    { x: curbWidth, y: curbHeight }, { x: 0, y: curbHeight },
  ];

  layers['insulation'] = [
    { x: -fieldWidth, y: 0 }, { x: 0, y: 0 },
    { x: 0, y: insulationMm }, { x: -fieldWidth, y: insulationMm },
  ];

  const memTop = insulationMm + membraneMm;
  layers['membrane'] = [
    { x: -fieldWidth, y: insulationMm }, { x: cantSize, y: insulationMm },
    { x: cantSize, y: memTop }, { x: -fieldWidth, y: memTop },
  ];

  layers['cant_strip'] = [
    { x: 0, y: 0 }, { x: cantSize, y: 0 },
    { x: cantSize, y: insulationMm }, { x: 0, y: insulationMm },
  ];

  // Base flashing up curb face
  layers['base_flashing'] = [
    { x: cantSize - 4, y: memTop },
    { x: cantSize, y: memTop },
    { x: cantSize, y: memTop + flashingHeight },
    { x: cantSize - 4, y: memTop + flashingHeight },
  ];

  // Counter-flashing reglet
  layers['counter_flashing'] = [
    { x: cantSize - counterFlashingMm, y: memTop + flashingHeight - 20 },
    { x: cantSize + 40, y: memTop + flashingHeight - 20 },
    { x: cantSize + 40, y: memTop + flashingHeight },
    { x: cantSize - counterFlashingMm, y: memTop + flashingHeight },
  ];

  // Equipment deck on top of curb
  layers['equipment_support'] = [
    { x: 0, y: curbHeight },
    { x: curbWidth + equipOffset, y: curbHeight },
    { x: curbWidth + equipOffset, y: curbHeight + 25 },
    { x: 0, y: curbHeight + 25 },
  ];

  const outline: Point2D[] = [
    { x: -fieldWidth, y: -deckThickness }, { x: curbWidth, y: -deckThickness },
    { x: curbWidth, y: curbHeight + 25 }, { x: 0, y: curbHeight + 25 },
    { x: 0, y: 0 }, { x: -fieldWidth, y: 0 },
  ];

  const annotationAnchors: AnnotationAnchor[] = [
    { id: 'ann_flashing_height', point: { x: cantSize, y: memTop + flashingHeight / 2 }, label: 'Min 200mm base flashing', leader: { x: -200, y: memTop + flashingHeight / 2 } },
    { id: 'ann_counter', point: { x: cantSize + 20, y: memTop + flashingHeight }, label: 'Counter-flashing w/ reglet', leader: { x: -150, y: memTop + flashingHeight + 20 } },
    { id: 'ann_cant', point: { x: cantSize / 2, y: insulationMm / 2 }, label: '45° cant strip', leader: { x: -150, y: 20 } },
    { id: 'ann_curb', point: { x: curbWidth / 2, y: curbHeight / 2 }, label: `${curbHeight}mm min curb height`, leader: { x: 350, y: curbHeight / 2 } },
  ];

  const dimensionAnchors: DimensionAnchor[] = [
    { id: 'dim_curb_height', start: { x: curbWidth + 20, y: 0 }, end: { x: curbWidth + 20, y: curbHeight }, value: `${curbHeight}mm`, axis: 'y' },
    { id: 'dim_flashing_height', start: { x: -20, y: memTop }, end: { x: -20, y: memTop + flashingHeight }, value: `${flashingHeight}mm`, axis: 'y' },
    { id: 'dim_insulation', start: { x: -fieldWidth + 20, y: 0 }, end: { x: -fieldWidth + 20, y: insulationMm }, value: `${insulationMm}mm`, axis: 'y' },
  ];

  return {
    outline, layerPolygons: layers, annotationAnchors, dimensionAnchors,
    boundingBox: { minX: -fieldWidth, minY: -deckThickness, maxX: curbWidth + equipOffset, maxY: curbHeight + 25 },
  };
}
