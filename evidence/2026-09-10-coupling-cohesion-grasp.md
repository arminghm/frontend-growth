# Coupling, Cohesion, GRASP & SOLID — Applied Evidence

Date: 2026-09-10

## Context

Design Principles & Patterns block. The user analyzed frontend-specific responsibility-assignment and SOLID scenarios without hints: a profile form, product search, order history, article-draft persistence, consumer-specific product data-source contracts, and substitutability across local/remote preference stores.

## Independent evidence

The user independently demonstrated the following:

- identified low cohesion in UI components that mixed form/search interaction with HTTP, auth-token access, backend schema knowledge, global-store synchronization, analytics, and storage concerns,
- distinguished necessary dependency from undesirable coupling and proposed replacing infrastructure knowledge in UI with smaller explicit contracts such as injected props/callbacks,
- recognized backend DTO/schema coupling and proposed a mapping boundary to keep UI models insulated from backend response shape,
- identified direct `window.gtag` usage as coupling to an external analytics provider and proposed an analytics abstraction,
- recognized `localStorage` as an external dependency and considered isolating persistence behind a boundary,
- proposed a custom hook/feature-level boundary for search orchestration instead of adding a mechanically separate container layer,
- reasoned that fetch/search behavior, mapping, analytics, and persistence should not remain directly embedded in the page component,
- applied Information Expert, Controller/orchestration, Protected Variations, low coupling, and high cohesion to new frontend scenarios rather than only repeating definitions,
- correctly identified a feature-specific `ArticleDraftRepository` contract as closer to DIP than a generic `Storage { getItem/setItem }` mirror of `localStorage`, because the high-level feature should depend on its own persistence needs rather than low-level browser storage details,
- independently proposed that a generic storage abstraction could sit below a feature-specific repository when multiple key-value storage implementations or consumers create a real infrastructure-level variation point,
- correctly identified the ISP problem in a broad `ProductDataSource`: `SearchPage`, `ProductDetailsPage`, and `AdminProductEditor` each need only a subset of capabilities,
- independently chose consumer/feature needs rather than generic capability names as the primary boundary for smaller interfaces, and explicitly rejected mechanical `Readable/Writable/Searchable/Subscribable` decomposition as potentially misleading,
- correctly identified that `RemotePreferencesStore` is not safely substitutable for `LocalPreferencesStore` when `load()` throws on 404 while the local implementation returns defaults,
- independently proposed making remote failure explicit in the contract via a discriminated union/result-style return instead of relying on undeclared throwing semantics.

## Corrections / unstable details

- `Information Expert` needs more precise use: a search API adapter may be the expert for HTTP/DTO concerns, while the feature orchestrator coordinates the user intent. These are distinct responsibilities.
- Backend response data is the DTO; mapping usually converts DTO -> domain/UI model. The UI model itself should not automatically be called a DTO.
- The user tends to protect dependencies that merely *might* change. Variation should be real, probable, reused, costly, or semantically meaningful enough to justify indirection.
- Orchestration ownership needs clearer wording: if a custom hook performs the flow, the page detects/delegates the system event while the hook/feature action orchestrates it.
- Reuse is not the primary SRP criterion. A responsibility can deserve separation even when used in one place if it has an independent reason to change; reuse alone does not prove a new abstraction is needed.
- In the DIP exercise, a generic storage contract is not automatically less coupled. It still couples callers to key-value semantics, serialization, and key naming. Domain-specific coupling can be preferable.
- Direct `localStorage` is not categorically wrong. For a tiny, stable, local-only feature with no meaningful persistence variation, a repository abstraction may be unnecessary.
- In the ISP exercise, extending the entire `ProductDetailsPage` contract from `AdminProductEditor` would be incorrect if that contract also contains `subscribeToStock`; shared capabilities should be factored separately or composed structurally so each consumer gets only what it needs.
- Consumer-oriented interfaces should not become unnecessarily UI-name-coupled if the same semantic capability is shared by multiple consumers; name and boundary should reflect the smallest meaningful role/capability, not necessarily the page component name.
- In the LSP exercise, the subtler `save()` violation was initially missed: `RemotePreferencesStore.save()` logs and resolves on failure, so callers cannot distinguish persistence success from failure. This weakens the observable postcondition of `save()` compared with a contract that implies successful completion on resolution.

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

### ISP

**3 — APPLY**

The user independently analyzed a broad frontend data-source interface from the perspective of separate consumers and proposed consumer-driven contracts rather than mechanical capability-based splitting. Interface composition/inheritance needs refinement so shared capabilities do not accidentally pull unrelated methods back into consumers.

### LSP

**3 — APPLY (developing)**

The user independently identified a substitutability violation caused by inconsistent `load()` behavior across local and remote implementations and proposed explicit result semantics in the shared contract. Postcondition consistency for `save()` required prompting and explanation.

## Next verification

- Spaced retest of GRASP responsibility assignment without naming the principles first.
- Distinguish feature orchestration from API/data mapping responsibility.
- Decide when an external dependency merits an abstraction versus when direct use is simpler.
- Retest SRP without using reuse as the main extraction criterion.
- Retest DIP with a case where a generic abstraction is tempting but does not reduce meaningful coupling.
- Retest ISP composition versus page-specific interfaces.
- Retest LSP with preconditions/postconditions and error semantics across adapters.
- Continue to OCP trade-offs, then Strategy / Factory / State comparisons.
