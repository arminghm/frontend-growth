# React Compound Components — Interview Evidence

Date: 2026-09-06

## Context

Day 1 of the Senior Frontend interview sprint focused on Compound Components through a realistic `Tabs` API and progressively harder design-review scenarios.

## Independent evidence

The user independently demonstrated the following without hints:

- recognized Compound Components as a good fit for a flexible `Tabs` API,
- identified `Tabs.Root` as the natural owner of active-tab state,
- explained why Context supports loose structural composition across nested wrappers,
- identified limitations of `cloneElement` for deep/nested composition and direct-child coupling,
- reasoned about Context update propagation and the cost of broad subscription boundaries,
- proposed splitting focus-related and active-tab Contexts based on different consumers and update frequency,
- identified the ownership and multiple-instance problems of placing reusable Tabs state in a singleton external store,
- explained that state should remain local to the Tabs feature unless finer-grained subscriptions justify a scoped external store,
- identified URL state as an external source of truth and proposed keeping URL concerns in the consumer via the controlled API rather than coupling the reusable Tabs implementation to routing.

## Corrections / unstable details

- Initially described `useMemo` mainly as a cache for expensive calculations; reinforced that reference stability is also important for Context provider values.
- Initially suggested `React.memo` as relevant to avoiding Context-driven rerenders; reinforced that Context updates bypass prop-only memoization when the consumed value changes.
- For URL-backed tabs, initially suggested lazy-initializing local state from the URL. This preserves refresh state but is insufficient for browser Back/Forward unless URL changes are subscribed to; controlled mode with URL/router state as the source of truth is the cleaner model.
- Reinforced that external store does not necessarily mean global singleton state; a per-instance scoped store can preserve ownership and encapsulation.

## Assessment

### Compound Components / component API design

**4 — REASON**

Evidence includes independent trade-off reasoning across composition, ownership, Context, `cloneElement`, subscription granularity, external stores, multiple instances, controlled/uncontrolled APIs, and URL state.

### Context rendering semantics

**3 — APPLY, approaching REASON**

The user reasons well about subscription boundaries, but exact rerender/memoization semantics required correction and should be retested later without hints.

## Next verification

- Spaced retest: Compound Components vs Render Props / prop-heavy APIs without prompting.
- Controlled/uncontrolled failure modes, including switching modes and external source-of-truth synchronization.
- Context/store rendering semantics under nested-provider and selector scenarios.
