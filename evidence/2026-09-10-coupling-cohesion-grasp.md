# Coupling, Cohesion & GRASP — Applied Evidence

Date: 2026-09-10

## Context

Design Principles & Patterns block. The user analyzed two frontend-specific responsibility-assignment scenarios without hints: a profile form and a product-search feature.

## Independent evidence

The user independently demonstrated the following:

- identified low cohesion in UI components that mixed form/search interaction with HTTP, auth-token access, backend schema knowledge, global-store synchronization, analytics, and storage concerns,
- distinguished necessary dependency from undesirable coupling and proposed replacing infrastructure knowledge in UI with smaller explicit contracts such as injected props/callbacks,
- recognized backend DTO/schema coupling and proposed a mapping boundary to keep UI models insulated from backend response shape,
- identified direct `window.gtag` usage as coupling to an external analytics provider and proposed an analytics abstraction,
- recognized `localStorage` as an external dependency and considered isolating persistence behind a boundary,
- proposed a custom hook/feature-level boundary for search orchestration instead of adding a mechanically separate container layer,
- reasoned that fetch/search behavior, mapping, analytics, and persistence should not remain directly embedded in the page component,
- applied the ideas of Information Expert, Controller/orchestration, Protected Variations, low coupling, and high cohesion to a new frontend scenario rather than only repeating definitions.

## Corrections / unstable details

- `Information Expert` needs more precise use: responsibility should go to the boundary that already has the relevant information; a search API adapter may be the expert for HTTP/DTO concerns, while the feature orchestrator is responsible for coordinating the user intent. These are distinct responsibilities.
- Backend response data is the DTO; mapping usually converts DTO -> domain/UI model. The UI model itself should not automatically be called a DTO.
- The user currently tends to protect any dependency that *might* change. `localStorage` should not automatically receive a generic abstraction merely because replacement is imaginable; the variation should be real, probable, reused, costly, or semantically meaningful enough to justify indirection.
- Orchestration ownership needs clearer wording: if a custom hook performs the flow, the page detects/delegates the system event while the hook/feature action orchestrates it. Both should not be described as the orchestrator simultaneously.

## Assessment

### Coupling / Cohesion

**3 — APPLY**

The user independently identifies responsibility leakage, knowledge coupling, and suitable UI boundaries in realistic frontend code. Trade-off precision around how much separation is enough still needs spaced testing.

### GRASP / Responsibility Assignment

**2-3 — EXPLAIN/APPLY (developing)**

The user can apply Information Expert, Controller, Protected Variations, low coupling, and high cohesion to a new scenario, but exact responsibility ownership and the threshold for adding indirection still need reinforcement and retesting.

## Next verification

- Spaced retest of GRASP responsibility assignment without naming the principles first.
- Distinguish feature orchestration from API/data mapping responsibility.
- Decide when an external dependency merits an abstraction versus when direct use is the simpler design.
- Continue to applied SOLID in frontend architecture.
