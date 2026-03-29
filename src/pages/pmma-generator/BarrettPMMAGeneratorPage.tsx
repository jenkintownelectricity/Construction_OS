/**
 * Barrett PMMA Generator Cockpit
 *
 * L0-CMD-BARRETT-PMMA-GEN-005
 * Wave 7 — Application OS Generator Cockpit
 *
 * UI capabilities:
 *   - Condition input form
 *   - Product search with chemistry badges
 *   - PMMA system selector
 *   - Preview detail manifest
 *   - Review gate warning display
 */

import { useState } from 'react';
import { tokens } from '../../ui/theme/tokens';

const t = tokens;

// ─── Local type mirrors (avoids cross-repo import) ──────────────

type ChemistryBadge = 'PMMA' | 'Hybrid Trafficable Coating' | 'Pending Review';

interface ProductDisplay {
  canonical_name: string;
  product_class: string;
  chemistry_badge: ChemistryBadge;
  branch_status: string;
}

const PMMA_PRODUCTS: ProductDisplay[] = [
  { canonical_name: 'Barrett PMMA', product_class: 'Barrett PMMA', chemistry_badge: 'PMMA', branch_status: 'In PMMA Generator' },
  { canonical_name: 'PUMA PROOF', product_class: 'PUMA PROOF', chemistry_badge: 'PMMA', branch_status: 'In PMMA Generator' },
  { canonical_name: 'Generic PMMA', product_class: 'Generic PMMA', chemistry_badge: 'PMMA', branch_status: 'In PMMA Generator' },
  { canonical_name: 'HIPPA COAT', product_class: 'HIPPA COAT', chemistry_badge: 'PMMA', branch_status: 'In PMMA Generator' },
  { canonical_name: 'HyppoCoat 100', product_class: 'HyppoCoat 100', chemistry_badge: 'Hybrid Trafficable Coating', branch_status: 'Excluded From PMMA Generator' },
  { canonical_name: 'HyppoCoat BC', product_class: 'HyppoCoat BC', chemistry_badge: 'Hybrid Trafficable Coating', branch_status: 'Excluded From PMMA Generator' },
  { canonical_name: 'HyppoCoat TC', product_class: 'HyppoCoat TC', chemistry_badge: 'Hybrid Trafficable Coating', branch_status: 'Excluded From PMMA Generator' },
  { canonical_name: 'HyppoCoat GC', product_class: 'HyppoCoat GC', chemistry_badge: 'Hybrid Trafficable Coating', branch_status: 'Excluded From PMMA Generator' },
  { canonical_name: 'HyppoCoat 250', product_class: 'HyppoCoat 250', chemistry_badge: 'Pending Review', branch_status: 'Review Gate Required' },
];

const SUBSTRATES = ['concrete', 'plywood', 'metal deck', 'existing membrane', 'masonry', 'metal', 'wood'] as const;
const WALL_TYPES = ['masonry', 'metal stud', 'concrete', 'wood frame', 'curtain wall', 'none'] as const;
const EXPOSURES = ['exposed', 'covered', 'semi-exposed', 'buried'] as const;
const REINFORCEMENTS = ['standard fleece', 'heavy fleece', 'dual fleece', 'none'] as const;
const DRAIN_TYPES = ['interior drain', 'scupper', 'overflow drain', 'gutter', 'none'] as const;
const PENETRATION_TYPES = ['pipe', 'conduit', 'mechanical curb', 'vent', 'none'] as const;
const CURB_TYPES = ['mechanical curb', 'skylight curb', 'raised curb', 'none'] as const;
const JOINT_TYPES = ['expansion joint', 'area divider', 'control joint', 'none'] as const;
const CANT_CONDITIONS = ['pre-formed cant', 'field-built cant', 'no cant'] as const;
const BRANDS = ['Barrett PMMA', 'PUMA PROOF', 'Generic PMMA', 'HIPPA COAT'] as const;

interface FormState {
  substrate: string;
  wall_type: string;
  exposure: string;
  reinforcement: string;
  drain_type: string;
  penetration_type: string;
  curb_type: string;
  joint_type: string;
  cant_condition: string;
  brand: string;
}

interface ManifestPreview {
  detail_name: string;
  system: string;
  family_code: string;
  condition: string;
  variant: string;
  assembly_id: string;
  render_formats: string[];
}

function getBadgeColor(badge: ChemistryBadge): string {
  switch (badge) {
    case 'PMMA': return '#2d7d46';
    case 'Hybrid Trafficable Coating': return '#8b5e3c';
    case 'Pending Review': return '#b8860b';
  }
}

function deriveTaxonomyCode(form: FormState): string {
  if (form.drain_type !== 'none') return 'DR';
  if (form.penetration_type !== 'none') return 'PT';
  if (form.curb_type !== 'none') return 'CU';
  if (form.joint_type !== 'none') return 'EJ';
  if (form.cant_condition !== 'no cant') return 'CO';
  return 'AS';
}

function deriveCondition(form: FormState, code: string): string {
  switch (code) {
    case 'DR': return form.drain_type.toUpperCase().replace(/\s+/g, '-');
    case 'PT': return form.penetration_type.toUpperCase().replace(/\s+/g, '-');
    case 'CU': return form.curb_type.toUpperCase().replace(/\s+/g, '-');
    case 'EJ': return form.joint_type.toUpperCase().replace(/\s+/g, '-');
    case 'CO': return form.cant_condition.toUpperCase().replace(/\s+/g, '-');
    default: return 'FIELD';
  }
}

export function BarrettPMMAGeneratorPage() {
  const [form, setForm] = useState<FormState>({
    substrate: 'concrete',
    wall_type: 'masonry',
    exposure: 'exposed',
    reinforcement: 'standard fleece',
    drain_type: 'none',
    penetration_type: 'none',
    curb_type: 'none',
    joint_type: 'none',
    cant_condition: 'no cant',
    brand: 'Barrett PMMA',
  });

  const [manifest, setManifest] = useState<ManifestPreview | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewGateWarning, setReviewGateWarning] = useState<string | null>(null);

  const filteredProducts = PMMA_PRODUCTS.filter((p) =>
    p.canonical_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleGenerate = () => {
    setReviewGateWarning(null);

    const selectedProduct = PMMA_PRODUCTS.find((p) => p.canonical_name === form.brand);
    if (selectedProduct?.branch_status === 'Excluded From PMMA Generator') {
      setReviewGateWarning(`${selectedProduct.canonical_name} is excluded from the PMMA generator (Hybrid Polyurea/Polyurethane chemistry).`);
      setManifest(null);
      return;
    }
    if (selectedProduct?.branch_status === 'Review Gate Required') {
      setReviewGateWarning(`${selectedProduct.canonical_name} requires review gate approval before rendering through PMMA generator. Classification: Pending Review.`);
      setManifest(null);
      return;
    }

    const code = deriveTaxonomyCode(form);
    const condition = deriveCondition(form, code);
    const variant = form.brand.toUpperCase().replace(/\s+/g, '');
    const detailName = `PMMA-${code}-${condition}-${variant}`;

    setManifest({
      detail_name: detailName,
      system: 'PMMA',
      family_code: code,
      condition,
      variant,
      assembly_id: `PMMA-${code}-${condition}-${variant}`,
      render_formats: ['DXF', 'SVG', 'PDF'],
    });
  };

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px 8px',
    background: t.color.bgDeep,
    color: t.color.fgPrimary,
    border: `1px solid ${t.color.border}`,
    borderRadius: t.radius.sm,
    fontFamily: t.font.family,
    fontSize: t.font.sizeXs,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: Number(t.font.weightSemibold),
    color: t.color.fgMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '4px',
    display: 'block',
  };

  const renderSelect = (label: string, field: keyof FormState, options: readonly string[]) => (
    <div style={{ marginBottom: '12px' }}>
      <label style={labelStyle}>{label}</label>
      <select
        style={selectStyle}
        value={form[field]}
        onChange={(e) => update(field, e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: t.font.sizeLg, fontWeight: Number(t.font.weightBold), color: t.color.fgPrimary, margin: 0 }}>
          Barrett PMMA Detail Generator
        </h1>
        <p style={{ fontSize: t.font.sizeXs, color: t.color.fgMuted, margin: '4px 0 0' }}>
          Deterministic detail manifest generation with chemistry boundary enforcement
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Column — Input Form */}
        <div>
          <div style={{
            background: t.color.bgSurface,
            border: `1px solid ${t.color.border}`,
            borderRadius: t.radius.md,
            padding: '16px',
            marginBottom: '16px',
          }}>
            <h2 style={{ fontSize: t.font.sizeSm, fontWeight: Number(t.font.weightSemibold), color: t.color.fgPrimary, margin: '0 0 16px' }}>
              Condition Input
            </h2>
            {renderSelect('Brand / System', 'brand', BRANDS)}
            {renderSelect('Substrate', 'substrate', SUBSTRATES)}
            {renderSelect('Wall Type', 'wall_type', WALL_TYPES)}
            {renderSelect('Exposure', 'exposure', EXPOSURES)}
            {renderSelect('Reinforcement', 'reinforcement', REINFORCEMENTS)}
            {renderSelect('Drain Type', 'drain_type', DRAIN_TYPES)}
            {renderSelect('Penetration Type', 'penetration_type', PENETRATION_TYPES)}
            {renderSelect('Curb Type', 'curb_type', CURB_TYPES)}
            {renderSelect('Joint Type', 'joint_type', JOINT_TYPES)}
            {renderSelect('Cant Condition', 'cant_condition', CANT_CONDITIONS)}

            <button
              onClick={handleGenerate}
              style={{
                width: '100%',
                padding: '10px',
                background: t.color.accentPrimary,
                color: '#ffffff',
                border: 'none',
                borderRadius: t.radius.md,
                fontFamily: t.font.family,
                fontSize: t.font.sizeSm,
                fontWeight: Number(t.font.weightSemibold),
                cursor: 'pointer',
                marginTop: '8px',
              }}
            >
              Generate Detail Manifest
            </button>
          </div>
        </div>

        {/* Right Column — Product Search + Manifest Preview */}
        <div>
          {/* Product Search */}
          <div style={{
            background: t.color.bgSurface,
            border: `1px solid ${t.color.border}`,
            borderRadius: t.radius.md,
            padding: '16px',
            marginBottom: '16px',
          }}>
            <h2 style={{ fontSize: t.font.sizeSm, fontWeight: Number(t.font.weightSemibold), color: t.color.fgPrimary, margin: '0 0 12px' }}>
              Product Registry
            </h2>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                ...selectStyle,
                marginBottom: '12px',
              }}
            />
            <div style={{ maxHeight: 240, overflowY: 'auto' }}>
              {filteredProducts.map((p) => (
                <div
                  key={p.canonical_name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderBottom: `1px solid ${t.color.border}`,
                    fontSize: t.font.sizeXs,
                  }}
                >
                  <span style={{ color: t.color.fgPrimary }}>{p.canonical_name}</span>
                  <span style={{
                    fontSize: '9px',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    background: getBadgeColor(p.chemistry_badge),
                    color: '#ffffff',
                    fontWeight: Number(t.font.weightSemibold),
                    whiteSpace: 'nowrap',
                  }}>
                    {p.chemistry_badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Gate Warning */}
          {reviewGateWarning && (
            <div style={{
              background: '#3d2800',
              border: '1px solid #b8860b',
              borderRadius: t.radius.md,
              padding: '12px 16px',
              marginBottom: '16px',
              fontSize: t.font.sizeXs,
              color: '#ffd700',
            }}>
              <strong>REVIEW GATE</strong>
              <div style={{ marginTop: '4px', color: '#e6c200' }}>{reviewGateWarning}</div>
            </div>
          )}

          {/* Manifest Preview */}
          {manifest && (
            <div style={{
              background: t.color.bgSurface,
              border: `1px solid ${t.color.border}`,
              borderRadius: t.radius.md,
              padding: '16px',
            }}>
              <h2 style={{ fontSize: t.font.sizeSm, fontWeight: Number(t.font.weightSemibold), color: t.color.fgPrimary, margin: '0 0 12px' }}>
                Detail Manifest Preview
              </h2>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', lineHeight: 1.6, color: t.color.fgSecondary }}>
                <div><span style={{ color: t.color.fgMuted }}>detail_name:</span> <span style={{ color: t.color.accentPrimary }}>{manifest.detail_name}</span></div>
                <div><span style={{ color: t.color.fgMuted }}>system:</span> {manifest.system}</div>
                <div><span style={{ color: t.color.fgMuted }}>family_code:</span> {manifest.family_code}</div>
                <div><span style={{ color: t.color.fgMuted }}>condition:</span> {manifest.condition}</div>
                <div><span style={{ color: t.color.fgMuted }}>variant:</span> {manifest.variant}</div>
                <div><span style={{ color: t.color.fgMuted }}>assembly_id:</span> {manifest.assembly_id}</div>
                <div><span style={{ color: t.color.fgMuted }}>render_formats:</span> {manifest.render_formats.join(', ')}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
