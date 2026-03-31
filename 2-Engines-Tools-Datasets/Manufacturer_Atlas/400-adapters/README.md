# 400-adapters

**Purpose:** Bridges to external systems (OMNI View, CAD, BIM).

## Subdirectories

| Directory | Purpose |
|-----------|----------|
| 410-omni-view-bridge | Bridge to Construction Atlas OMNI View |
| 420-cad-export | CAD format export adapters |
| 430-bim-export | BIM format export adapters |
| 440-importers | External data importers |
| 450-signal-emitters | Signal bus emitters |
| 460-projection-contracts | Projection format contracts |
| 470-external-connectors | Third-party system connectors |

## Dependency Rules

- **Consumes:** Results from 200-engines, 300-tools
- **Exports:** Results to external systems
- **MUST NOT modify:** 000-governance-truth
- **MUST NOT build:** CAD projection engines, Revit/AutoCAD plugins (prohibited this wave)
