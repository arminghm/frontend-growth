# React

## Current level

**2-3 — EXPLAIN/APPLY**, with uneven depth across practical APIs and component-design patterns.

## Demonstrated strengths

- render vs DOM mutation distinction,
- reconciliation and key identity basics,
- derived vs essential state,
- `React.memo`, `useMemo`, `useCallback`, `useRef` trade-offs,
- virtualization before premature memoization,
- `useDeferredValue` / transition reasoning,
- local vs shared state ownership,
- optimistic UI caution for financial state.

## Recently reinforced / needs retest

- `PureComponent` vs conceptual render purity,
- Fiber tree and current/work-in-progress trees,
- effect ordering and cleanup details,
- `useLayoutEffect` timing and use cases,
- Portal semantics and event propagation,
- Context vs external-store subscription granularity,
- `cloneElement` and modern alternatives,
- SSR vs Server Component hook constraints.

## Newly identified interview gaps

- React component API/design patterns are not yet deep enough.
- Compound Components pattern was not recognized/applied in a Tabs design question.
- Need applied coverage of Compound Components, Controlled/Uncontrolled components, Headless/compound APIs, Render Props, HOC legacy context, state reducer/slot-style patterns, and when composition is preferable to prop-heavy APIs.
- Context vs Zustand/global-store reasoning needs stronger ownership/update-frequency/subscription-granularity explanations under interview pressure.

## Next verification

1. design a Tabs API using Compound Components and explain trade-offs,
2. compare Compound Components vs controlled props vs render props,
3. Fiber/reconciliation scenario,
4. effect lifecycle scenario,
5. Context/store design scenario,
6. Suspense with Client Component vs Server Component distinctions.
