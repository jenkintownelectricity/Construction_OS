# ValidKernel Construction Ecosystem Map

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                    GOVERNANCE LAYER                              │
│  00-validkernel-governance    00-validkernel-registry            │
│  Doctrine, policy, topology   Service registry, system map      │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────┼─────────────────────────────────┐
│                    DESIGN LAYER                                  │
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────────────────┐     │
│  │ 10-White-Lightning   │  │ Construction_ALEXANDER       │     │
│  │ Vision_OS            │  │ Engine                       │     │
│  │ DESIGN WORKSTATION   │  │ PATTERN ADVISORY             │     │
│  │ • Sandbox geometry   │  │ • 8-stage resolution         │     │
│  │ • Visual inspection  │  │ • Condition classification   │     │
│  │ • Interactive export │  │ • Advisory proposals         │     │
│  └──────────┬───────────┘  └──────────────┬──────────────┘     │
│             │ design input                 │ condition proposals │
└─────────────┼──────────────────────────────┼────────────────────┘
              │                              │
┌─────────────┼──────────────────────────────┼────────────────────┐
│             ▼         COMPILATION LAYER    ▼                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              10-Construction_OS                           │   │
│  │              DETAIL COMPILER (CANONICAL)                  │   │
│  │                                                           │   │
│  │  generators/    → Condition → Geometry JSON               │   │
│  │  renderers/     → Geometry JSON → SVG Sheet               │   │
│  │  tools/         → SVG → PDF, JSON → DXF                  │   │
│  │  source/        → Calibration, Barrett data               │   │
│  │  kernels/       → Assembly DNA templates                  │   │
│  │  atlas/         → 120 canonical conditions                │   │
│  │  schemas/       → Validation schemas                      │   │
│  │  output/        → Generated packets                       │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                              │ artifacts (SVG, PDF, DXF)         │
│  ┌──────────────┐  ┌───────┴──────────┐  ┌────────────────┐   │
│  │ Construction │  │ ShopDrawing      │  │ GPC_Shop       │   │
│  │ _Runtime     │  │ _Compiler        │  │ _Drawings      │   │
│  │ REFERENCE    │  │ REFERENCE        │  │ DXF ENGINE     │   │
│  │ svg/dxf      │  │ pipeline stages  │  │ 28.8KB gen     │   │
│  │ writers      │  │ + export engines │  │ CAD builder    │   │
│  └──────────────┘  └──────────────────┘  └────────────────┘   │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────┐
│                   KNOWLEDGE LAYER                                │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │ Construction   │  │ Construction   │  │ construction     │  │
│  │ _Atlas         │  │ _Assembly      │  │ _dna             │  │
│  │ DATA_ATLAS     │  │ _Kernel        │  │ DOMAIN_KERNEL    │  │
│  │ Vercel web UI  │  │ Schema/maps    │  │ TS monorepo      │  │
│  └────────────────┘  └────────────────┘  └──────────────────┘  │
│                                                                  │
│  Construction_Material_Kernel  Construction_Chemistry_Kernel     │
│  Construction_Scope_Kernel     Construction_Specification_Kernel │
│  Construction_Kernel           (All: schema-only reference)      │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────┐
│                   MANUFACTURER LAYER                             │
│                                                                  │
│  ┌────────────────────────┐  ┌──────────────────────────────┐  │
│  │ 70-manufacturer-mirror │  │ 10-building-envelope         │  │
│  │ MANUFACTURER_PORTAL    │  │ -manufacturer-os             │  │
│  │ Barrett pilot          │  │ DOMAIN_KERNEL                │  │
│  │ Multi-tenant Next.js   │  │ Envelope rules               │  │
│  └────────────────────────┘  └──────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────┐
│                   PLATFORM LAYER                                 │
│                                                                  │
│  30-validkernel-platform       40-validkernel-control-plane      │
│  20-Governed-Multi-Domain-OS   10-domain-foundry-os              │
│  30-validkernel-knowledge-graph 20-VTI_TM                        │
│  00-validkernelos-vkbus                                          │
│  (Infrastructure — not in detail production path)                │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────┐
│                   SALES LAYER                                    │
│                                                                  │
│  ┌────────────────────────────────┐  ┌───────────────────────┐ │
│  │ Construction_OS_Sales          │  │ Construction          │ │
│  │ _Command_Center               │  │ _Application_OS       │ │
│  │ SALES_INTERFACE (scaffold)     │  │ APPLICATION_UI        │ │
│  │ Not yet implemented            │  │ Operator UI surface   │ │
│  └────────────────────────────────┘  └───────────────────────┘ │
│                                                                  │
│  shop_drawings_ai (AI extraction)                                │
│  80-vk-owned-affiliate-domains (hosting config)                  │
└──────────────────────────────────────────────────────────────────┘

GHOST / EMPTY:
  50-validkernel-architect-reasoning-workspace (README only)
  60-validkernel-schematic-digital-twin (README only)
```

## Workflow Spine

```
WLV (Design) → Construction_OS (Compile) → Manufacturer Mirror → Sales CC
     ↓                  ↓                         ↓                  ↓
  sandbox          SVG / PDF / DXF          product validation    client delivery
  exploration      detail packets           manufacturer review   commercial use
```

## One Canonical Production Path

```
Calibration Specimen (source/barrett/calibration/)
  → Assembly DNA Template (kernels/assembly_dna/pmma/)
    → Parametric Generator (generators/pmma/pmma_flash_generator.py)
      → Geometry JSON (output/barrett_pmma_parametric_test/json/)
        → SVG Section Renderer v3 (renderers/svg_section_renderer.py)
          → PRINT_STANDARD SVG (output/barrett_pmma_parametric_rendered/svg/)
            → PDF (tools/export_svg_to_pdf.py)
            → DXF (tools/export_assembly_to_dxf.py)
```

**All in one repo: 10-Construction_OS.**
