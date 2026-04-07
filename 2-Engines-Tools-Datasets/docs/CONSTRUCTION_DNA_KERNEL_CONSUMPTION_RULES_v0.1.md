# Construction DNA Kernel Consumption Rules — v0.1

**Date:** 2026-04-07
**Authority:** L0_ARMAND_LEFEBVRE

---

## Rules

1. **Read-only consumption.** All engines, runtime systems, and projection surfaces consume Material DNA and Taxonomy kernel truth as read-only.
2. **Contract-bound access.** Consumers must declare their consumption in a manifest. Undeclared consumption is not permitted.
3. **No mutation.** No engine, runtime, or projection surface may mutate either kernel.
4. **Feed pipeline.** Data ingestion (e.g., from scraper) feeds into a kernel admission queue. It does not directly write to kernel truth.
5. **Version freshness.** Consumers that cache kernel data must respect version metadata and invalidate stale caches.
6. **Projection derivation.** Any view, UI surface, or navigation structure derived from kernel truth is a projection. Projections are ephemeral and reproducible from kernel truth.
7. **No truth invention.** Consumers may not invent material properties, compatibility rules, or navigation nodes that do not exist in the source kernels.
