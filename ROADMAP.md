# Frontend Growth Roadmap

## Phase 1 — Repair high-risk JavaScript foundations

Goal: exact language semantics should no longer undercut Senior-level engineering answers.

Topics:

- lexical scope and execution context,
- closures and memory retention,
- `this`, arrow functions, `bind` / `call` / `apply`,
- prototype chain and property lookup,
- own/inherited/enumerable/configurable/writable properties,
- equality: reference identity, `===`, `Object.is`, deep equality,
- coercion and abstract equality,
- `var` / `let` / `const`, TDZ, loop bindings,
- Promise resolution, microtasks, async/await edge cases,
- modules and module evaluation basics.

Exit criteria:

- answer mixed diagnostic snippets without hints,
- explain *why* from a mental model rather than memorized outputs,
- repeat successfully in a later mock interview.

## Phase 2 — Consolidate React internals

Topics:

- render vs commit,
- Fiber and work-in-progress/current trees,
- reconciliation, type/key identity,
- effect and cleanup lifecycle,
- `useEffect` vs `useLayoutEffect`,
- Context vs external stores,
- portals and event propagation,
- Suspense and concurrent rendering,
- Server/Client Component boundaries.

Exit criteria:

- explain lifecycle and reconciliation accurately,
- reason through component identity/state preservation examples,
- diagnose rerender/effect scenarios without guessing.

## Phase 3 — Build testing competence

Create one small React feature and cover it with:

- Vitest unit tests,
- React Testing Library interaction tests,
- MSW-backed integration tests,
- fake timers,
- one critical E2E flow.

Exit criteria:

- choose test level intentionally,
- test behavior rather than internals,
- debug asynchronous test failures independently.

## Phase 4 — Modern Next.js consolidation

Focus on:

- App Router,
- RSC and Client Components,
- streaming/Suspense,
- caching and revalidation,
- Route Handlers / Server Actions,
- BFF responsibilities,
- rendering strategy decisions,
- auth/security boundaries.

## Phase 5 — Maintain Senior strengths

Use periodic system-design mocks for:

- realtime systems,
- performance,
- architecture,
- state/data ownership,
- reliability/failure recovery.

Do not reteach these from zero unless evidence shows regression.

## Ongoing cadence

- Learning chat: teach/repair one focused domain.
- Mock interview chat: independent assessment without hints.
- Tutor/Navigator chat: decide next priority and update roadmap.
- Repository: persist only durable assessment/evidence.
