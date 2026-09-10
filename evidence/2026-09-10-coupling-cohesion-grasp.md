# Coupling, Cohesion, GRASP & DIP — Applied Evidence

Date: 2026-09-10

## Context

Design Principles & Patterns block. The user analyzed frontend-specific responsibility-assignment scenarios without hints: a profile form, a product-search feature, an order-history page, and an article-draft persistence design.

## Independent evidence

The user independently demonstrated the following:

- identified low cohesion in UI components that mixed form/search interaction with HTTP, auth-token access, backend schema knowledge, global-store synchronization, analytics, and storage concerns,
- distinguished necessary dependency from undesirable coupling and proposed replacing infrastructure knowledge in UI with smaller explicit contracts such as injected props/callbacks,
- recognized backend DTO/schema coupling and proposed a mapping boundary to keep UI models insulated from backend response shape,
- identified direct `window.gtag` usage as coupling to an external analytics provider and proposed an analytics abstraction,
- recognized `localStorage` as an external dependency and considered isolating persistence behind a boundary,
- proposed a custom hook/feature-level boundary for search orchestration instead of adding a mechanically separate container layer,
- reasoned that fetch/search behavior, mapping, analytics, and persistence should not remain directly embedded in the page component,
- applied the ideas of Information Expert, Controller/orchestration, Protected Variations, low coupling, and high cohesion to a new frontend scenario rather than only repeating definitions,
- correctly identified a feature-specific `ArticleDraftRepository` contract as closer to DIP than a generic `Storage { getItem/setItem }` mirror of `localStorage`, because the high-level feature should depend on its own persistence needs rather than low-level browser storage details,
- independently proposed that a generic storage abstraction could sit below a feature-specific repository when multiple key-value storage implementations or multiple consumers create a real infrastructure-level variation point.

## Corrections / unstable details

- `Information Expert` needs more precise use: responsibility should go to the boundary that already has the relevant information; a search API adapter may be the expert for HTTP/DTO concerns, while the feature orchestrator is responsible for coordinating the user intent. These are distinct responsibilities.
- Backend response data is the DTO; mapping usually converts DTO -> domain/UI model. The UI model itself should not automatically be called a DTO.
- The user currently tends to protect any dependency that *might* change. `localStorage` should not automatically receive a generic abstraction merely because replacement is imaginable; the variation should be real, probable, reused, costly, or semantically meaningful enough to justify indirection.
- Orchestration ownership needs clearer wording: if a custom hook performs the flow, the page detects/delegates the system event while the hook/feature action orchestrates it. Both should not be described as the orchestrator simultaneously.
- Reuse is not the primary SRP criterion. A responsibility can deserve separation even when used in one place if it has an independent reason to change; conversely, reuse alone does not prove a new abstraction is needed.
- In the DIP exercise, Design A is not simply "less coupled" because it is more generic. It couples callers to key-value storage semantics (`key`, string values, serialization, naming conventions). Design B intentionally couples the feature to its own domain vocabulary, which is generally desirable coupling.
- Direct `localStorage` is not categorically wrong. For a tiny, stable, local-only feature with no meaningful persistence variation, a repository abstraction may be unnecessary. The decision must weigh expected variation and complexity cost.

## Assessment

### Coupling / Cohesion

**3 — APPLY**

The user independently identifies responsibility leakage, knowledge coupling, and suitable UI boundaries in realistic frontend code. Trade-off precision around how much separation is enough still needs spaced testing.

### GRASP / Responsibility Assignment

**2-3 — EXPLAIN/APPLY (developing)**

The user can apply Information Expert, Controller, Protected Variations, low coupling, and high cohesion to new scenarios, but exact responsibility ownership and the threshold for adding indirection still need spaced retesting.

### SRP

**3 — APPLY (developing trade-off precision)**

The user can separate UI/presentation concerns from transport and DTO concerns and correctly keeps cohesive presentation filtering local. The distinction between reuse and independent reasons to change required correction.

### DIP

**3 — APPLY (developing)**

The user independently preferred a feature-owned persistence contract over a low-level storage-shaped interface and understood that the implementation detail should depend on the high-level contract. The remaining gap is deciding when an abstraction is justified and recognizing that domain-specific coupling can be better than generic infrastructure coupling.

## Next verification

- Spaced retest of GRASP responsibility assignment without naming the principles first.
- Distinguish feature orchestration from API/data mapping responsibility.
- Decide when an external dependency merits an abstraction versus when direct use is the simpler design.
- Retest SRP without using reuse as the main extraction criterion.
- Retest DIP with a case where a generic abstraction is tempting but does not reduce meaningful coupling.
- Continue applied SOLID with ISP/LSP and then OCP trade-offs.
