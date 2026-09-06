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
- identified URL state as an external source of truth and proposed keeping URL concerns in the consumer via the controlled API rather than coupling the reusable Tabs implementation to routing,
- independently identified controlled and uncontrolled modes as mutually exclusive API contracts,
- proposed enforcing that contract at compile time with a TypeScript discriminated-union-style API,
- correctly chose controlled `value` semantics over `defaultValue` when both are supplied at runtime,
- compared prop-heavy APIs and Compound Components in terms of markup ownership, flexibility, component control, and coupling.

## Corrections / unstable details

- Initially described `useMemo` mainly as a cache for expensive calculations; reinforced that reference stability is also important for Context provider values.
- Initially suggested `React.memo` as relevant to avoiding Context-driven rerenders; reinforced that Context updates bypass prop-only memoization when the consumed value changes.
- For URL-backed tabs, initially suggested lazy-initializing local state from the URL. This preserves refresh state but is insufficient for browser Back/Forward unless URL changes are subscribed to; controlled mode with URL/router state as the source of truth is the cleaner model.
- Reinforced that external store does not necessarily mean global singleton state; a per-instance scoped store can preserve ownership and encapsulation.
- Controlled-mode detection should be based on whether `value` is controlled, not on the presence of `onValueChange`; uncontrolled components may still expose `onValueChange` as a notification callback.
- `defaultValue` is only the initial value for uncontrolled mode; later changes to `defaultValue` should not become a second source of truth.
- Render Props mental model was incomplete: it is primarily a mechanism for sharing behavior/state while giving the consumer control over rendering through a function, not mainly a wrapper for telemetry or incidental side effects.

## Assessment

### Compound Components / component API design

**4 — REASON**

Evidence includes independent trade-off reasoning across composition, ownership, Context, `cloneElement`, subscription granularity, external stores, multiple instances, controlled/uncontrolled APIs, URL state, and API-shape comparison.

### Context rendering semantics

**3 — APPLY, approaching REASON**

The user reasons well about subscription boundaries, but exact rerender/memoization semantics required correction and should be retested later without hints.

### Controlled/uncontrolled component APIs

**3-4 — APPLY/REASON**

The user independently reasoned about mutually exclusive API contracts, compile-time prevention, runtime precedence, and external ownership. Switching modes across renders and exact controlled-mode detection still need verification.

### Render Props

**2-3 — EXPLAIN/APPLY developing**

The user understands that Render Props can give consumers rendering freedom, but the core behavior-sharing/data-exposure model and its trade-offs need reinforcement and retesting.

## Next verification

- Retest Compound Components vs Render Props / prop-heavy APIs after reinforcing the Render Props mental model.
- Controlled/uncontrolled mode switching across renders and exact detection semantics.
- Context/store rendering semantics under nested-provider and selector scenarios.
