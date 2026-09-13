# Design Principles & Patterns — Chat Context Handoff

Date: 2026-09-13

Purpose: compact persistent context for continuing the current learning thread without reconstructing the full conversation.

---

## Current state

Active block: **Design Principles & Patterns**

First applied pass is complete. Current phase is **spaced retest without pattern-name cues**.

Current overall assessment:

```text
3 — APPLY (developing REASON)
```

Do not upgrade to 4 until transfer is demonstrated again in fresh scenarios without hints.

React-specific curriculum remains paused while this block is being verified.

---

## Teaching mode

- Persian by default.
- Frontend-specific scenarios only.
- Start from problem/responsibility/coupling/trade-off, not definitions.
- Do not name the pattern/principle before the user analyzes a retest scenario.
- In mock/retest mode, do not hint before the answer.
- After the answer: validate reasoning, identify corrections, update evidence only when meaningful.
- Avoid adding new patterns now; verify transfer and anti-overengineering judgment.

---

## Topics covered

### Foundations

- Coupling vs Cohesion
- GRASP / responsibility assignment
  - Information Expert
  - Controller/orchestrator
  - Low Coupling / High Cohesion
  - Indirection
  - Protected Variations
  - Creator lightly

### SOLID

- SRP
- OCP
- LSP
- ISP
- DIP

### Patterns

- Strategy
- Factory
- State
- Adapter
- Facade
- Observer
- Command
- Mediator
- Composite

---

## Core mental models already established

```text
Coupling:
What does this boundary know that it should not need to know?

Cohesion:
Do the responsibilities inside this boundary belong to one meaningful purpose?

SRP:
Independent reasons to change at the chosen abstraction level.

DIP:
High-level policy depends on a contract expressed in its own vocabulary, not a copied low-level API shape.

ISP:
Smallest meaningful contract needed by the consumer; not giant interfaces and not mechanical one-method fragmentation.

LSP:
Behavioral substitutability, including preconditions, postconditions and failure semantics.

OCP:
Stable core + meaningful variation points; not zero modification.

Strategy:
How should this behavior be performed?

Factory:
Which concrete implementation should be created/resolved?

State:
Given the current lifecycle state, what behavior/transition is valid?

Adapter:
Translate foreign/incompatible contract to internal contract.

Facade:
Hide a cohesive complex subsystem behind a simpler intent-level API.

Observer:
Independent reactions to an event; avoid for ordered core workflows.

Command:
First-class executable intent.

Mediator:
Centralize coordination policy among peers.

Composite:
Recursive whole/part model with reasonably uniform treatment.
```

---

## Important independent evidence

### Coupling / Cohesion / GRASP

User independently:

- identified low cohesion in ProfileForm mixing UI, HTTP, auth token, DTO, store, analytics, toast,
- proposed `onSubmit(values)` and initial values contract,
- recognized that moving responsibilities does not remove all dependency,
- identified backend mapping and analytics/storage boundaries in ProductSearch,
- used custom hook/feature-level orchestration instead of adding layers mechanically.

### SRP

OrderHistory scenario:

- correctly moved transport/DTO concerns out,
- kept status filtering as cohesive presentation policy,
- initially used reuse as part of CSV extraction reasoning.

Correction: reuse is not primary SRP criterion.

### DIP

ArticleDraft scenario:

- chose `ArticleDraftRepository` over generic `Storage {getItem,setItem}`,
- independently proposed optional lower-level `KeyValueStorage` only if real infrastructure variation exists.

Correction: generic storage is not automatically less coupled; domain coupling can be desirable; direct `localStorage` may be fine for a tiny stable feature.

### ISP

ProductDataSource scenario:

- split based on consumer needs,
- rejected mechanical `Readable/Writable/Searchable/Subscribable` decomposition.

Correction: extending ProductDetails interface into Admin accidentally included `subscribeToStock`; compose shared capabilities instead.

### LSP

UserPreferencesStore scenario:

- independently identified mismatch where local `load()` returns defaults but remote `load()` throws on 404,
- proposed explicit discriminated-union/result semantics.

Correction: subtle `save()` violation was missed initially: remote logs failure and resolves, weakening postcondition.

### OCP / Strategy / Factory

Analytics provider scenario:

- identified provider implementation family as real variation area,
- tracking as stable core,
- chose Strategy-like contract,
- rejected unnecessary Factory/Registry complexity,
- localized provider selection to startup composition.

Corrections:

- provider string is selector, implementation family is variation point,
- runtime frontend config differs from build-time env substitution,
- startup switch already acts as selection/composition boundary even if not named Factory.

### Strategy / Factory / State

Uploader scenario:

- correctly distinguished creation/selection, interchangeable behavior, and lifecycle state,
- correctly composed them in one upload feature.

Correction: Strategy is about delegated variable behavior, not merely interface + implementations.

### Adapter

Mapbox scenario:

- independently justified Adapter from present contract/shape mismatch, even without confirmed MapLibre migration,
- placed `Coordinate -> [lng, lat]` mapping inside Adapter.

Correction: future change alone is not enough; current semantic translation/isolation is stronger evidence.

### Facade

Avatar update scenario:

- kept toast in UI,
- recognized upload sequence as a smaller subsystem,
- proposed higher-level avatar updater for compression/upload/cache/analytics,
- recognized backend response translation as Adapter concern.

Corrections:

- moving lines into `AvatarFacade` alone is only code movement,
- cache invalidation inside facade is a trade-off because it couples to TanStack Query,
- avoid God Facade.

### Observer

Login scenario:

- classified token persistence/current-user load/WebSocket/navigation as core workflow,
- analytics and possibly notification refresh as secondary,
- identified token-before-WebSocket temporal dependency,
- explicitly stated global event bus can hide rather than remove coupling.

Refinement: notification badge may be core initialization if product requires it before dashboard ready.

### Command

Admin actions scenario:

- identified Command as appropriate for reusable executable intents across row menu/bulk toolbar/command palette,
- distinguished `SuspendUserCommand` from `user.suspended`,
- put analytics outside core command via decorator/orchestrator,
- recognized overengineering when commands are created for trivial local UI interactions.

Corrections:

- frontend permission/canExecute is UX/capability, not security authorization boundary,
- pre-execution confirmation is different from post-execution operation verification,
- bulk execution requires explicit sequencing/failure policy.

### Mediator / Composite

Dashboard builder scenario:

- identified recursive dashboard/row/column/widget tree as Composite,
- chose Mediator-style resize coordination for layout recalculation, neighbors, constraints and autosave,
- recognized analytics can remain a secondary reaction.

---

## Current gaps requiring spaced retest

1. GRASP: Information Expert vs orchestrator under a fresh scenario.
2. Coupling/cohesion trade-offs without hints.
3. Abstraction threshold: real variation vs speculative abstraction.
4. SRP without using reuse as primary extraction criterion.
5. DIP: generic abstraction temptation; direct dependency may be better.
6. ISP: composition vs inheritance.
7. LSP: postconditions/error semantics.
8. OCP: dynamic plugins, multiple simultaneous implementations, divergent capabilities.
9. Strategy vs Factory vs State without names.
10. Adapter vs direct dependency use.
11. Adapter vs Facade.
12. Facade vs simple orchestration/code relocation.
13. Observer vs store/state communication; lifecycle/unsubscribe/order problems.
14. Command vs callback/action/event; bulk failure semantics.
15. Mediator vs ordinary shared state ownership.
16. Composite vs incidental nesting/collections.

---

## Full review reference

Detailed study/revision file:

```text
notes/design-principles-patterns-full-review.md
```

Evidence files relevant to this block:

```text
evidence/2026-09-10-coupling-cohesion-grasp.md
evidence/2026-09-13-ocp-strategy-factory.md
```

Primary skill state:

```text
skills/design-principles-patterns.md
```

Current roadmap state:

```text
CURRENT.md
```

---

## Next retest — Product Search

Present this scenario without naming a principle/pattern:

```ts
async function searchProducts(query: string) {
  const cached = localStorage.getItem(
    `search:${query}`
  );

  if (cached) {
    return JSON.parse(cached);
  }

  const response = await fetch(
    `/api/products?q=${encodeURIComponent(query)}`
  );

  const dto = await response.json();

  const products = dto.items.map((item: any) => ({
    id: item.product_id,
    title: item.name,
    price: item.final_price,
  }));

  localStorage.setItem(
    `search:${query}`,
    JSON.stringify(products)
  );

  analytics.track({
    name: "product_search",
    query,
  });

  return products;
}
```

Requirements:

- backend response may change,
- cache is currently localStorage but could move to IndexedDB,
- analytics failure must not fail search,
- caching may be removed entirely later,
- only this search feature currently uses the cache.

Questions:

1. What responsibilities should be separated?
2. Which dependencies deserve abstraction now and which may not?
3. What should the stable contract be?
4. Should cache be abstracted now or kept direct? Why?
5. Where should analytics live?
6. If backend shape changes, which boundary should change?
7. If someone proposes `CacheFactory + CacheStrategy + CacheRegistry` now, how should that be evaluated?

Do not provide hints before the user's answer.
