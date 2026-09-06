# React

## Current level

**2-3 — EXPLAIN/APPLY overall**, with stronger demonstrated depth in component API design than in internals/lifecycle details.

## Demonstrated strengths

- render vs DOM mutation distinction,
- reconciliation and key identity basics,
- derived vs essential state,
- `React.memo`, `useMemo`, `useCallback`, `useRef` trade-offs,
- virtualization before premature memoization,
- `useDeferredValue` / transition reasoning,
- local vs shared state ownership,
- optimistic UI caution for financial state,
- Compound Components and reusable component API design,
- controlled/uncontrolled API ownership reasoning,
- Context vs scoped external-store trade-offs,
- splitting subscription boundaries by ownership and update frequency,
- prop-heavy vs Compound Component API trade-off reasoning.

## Subskill assessments

- **Compound Components / component API design: 4 — REASON**
  - independently reasoned through `Tabs` API composition, state ownership, `cloneElement` limitations, Context boundaries, multiple instances, controlled URL-backed state, scoped external-store alternatives, and API-shape trade-offs.
- **Context rendering semantics: 3 — APPLY, approaching REASON**
  - good subscription-boundary reasoning; exact memoization/rerender semantics still need spaced retesting.
- **Controlled/uncontrolled component APIs: 3-4 — APPLY/REASON**
  - good ownership and API-contract reasoning; mode switching and exact detection semantics need retesting.
- **Render Props: 2-3 — EXPLAIN/APPLY developing**
  - understands rendering flexibility, but behavior-sharing/data-exposure mental model and trade-offs need reinforcement.

## Recently reinforced / needs retest

- `PureComponent` vs conceptual render purity,
- Fiber tree and current/work-in-progress trees,
- effect ordering and cleanup details,
- `useLayoutEffect` timing and use cases,
- Portal semantics and event propagation,
- Context provider reference stability and consumer update semantics,
- `cloneElement` and modern alternatives,
- external store does not imply global singleton ownership,
- SSR vs Server Component hook constraints,
- Render Props as behavior/state sharing with consumer-controlled rendering.

## Remaining interview gaps

- Retest Compound Components vs Render Props / prop-heavy APIs after reinforcement.
- Need controlled/uncontrolled failure modes, including switching modes and synchronization with an external source of truth.
- Headless/compound APIs, HOC legacy context, state reducer/slot-style patterns still need applied coverage.
- React internals/lifecycle remain less stable than component API design.

## Next verification

1. Render Props mental model and trade-offs, then retest against Compound Components / props,
2. controlled/uncontrolled failure modes,
3. Fiber/reconciliation scenario,
4. effect lifecycle scenario,
5. Context/store rendering scenario without hints,
6. Suspense with Client Component vs Server Component distinctions.
