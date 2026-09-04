# React

## Current level

**3 — APPLY**, with internals at **2-3**.

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

## Next verification

- Fiber/reconciliation scenario,
- effect lifecycle scenario,
- Context/store design scenario,
- Suspense with Client Component vs Server Component distinctions.
