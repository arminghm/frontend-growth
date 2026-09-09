# Current Focus

## Immediate priority

**One-week Senior Frontend interview sprint**

The end-of-week session is a mock interview with an experienced Frontend Chapter Lead. Treat it as a high-value external assessment and optimize the week to expose and repair interview weaknesses.

## Active topic

**Design Principles & Patterns**

React study is temporarily paused. Coupling/cohesion and introductory GRASP responsibility assignment have now been applied successfully in frontend scenarios. Continue with:

1. applied SOLID in frontend/React architecture,
2. Strategy / Factory / State comparisons,
3. Open/Closed Principle and extension-point trade-offs,
4. later spaced retest of GRASP abstraction thresholds and responsibility ownership.

Teaching constraints for this block:

- use frontend-specific examples and scenarios,
- prioritize patterns that remain useful in modern frontend architecture,
- for each pattern, distinguish intended use from misuse, over-engineering, and anti-pattern forms,
- explain why a pattern or implementation becomes an anti-pattern in a given frontend context instead of labeling it mechanically,
- start from the problem and trade-offs rather than from pattern names.

Keep JavaScript semantics as a parallel diagnostic track rather than the primary teaching topic for now.

## Sprint cadence

### Days 1–3 — Breadth and high-frequency interview coverage

Goal: close obvious gaps and make common Senior Frontend questions answerable without hesitation.

Priority order based on real-interview evidence:

1. React component/design patterns and Context/store reasoning.
2. Design principles/patterns: coupling/cohesion, GRASP, SOLID, Factory/Strategy/OCP.
3. JavaScript language semantics.
4. Browser platform APIs and Service Worker caching.
5. TypeScript advanced features.
6. GraphQL/API design trade-offs.
7. React internals/lifecycle consolidation.

### Days 4–6 — Depth and reasoning

Goal: deepen mental models rather than add many new topics.

Focus on:

- explaining why, not only what,
- edge cases and trade-offs,
- hard JavaScript snippets,
- React component API design and reconciliation reasoning,
- applied SOLID/GRASP/pattern scenarios,
- browser API selection scenarios,
- GraphQL/REST/BFF architecture trade-offs,
- advanced TypeScript exercises,
- concise Senior-level answers.

### Day 7 — Mock interview only

Run a mixed Senior Frontend mock without hints. Use it to identify the final remaining weak spots before the external mock interview.

## Must-fix interview gaps

- applied SOLID and design-pattern trade-offs,
- Factory vs Strategy vs State and OCP extension-point reasoning,
- GRASP responsibility assignment under fresh scenarios,
- browser cross-tab communication APIs,
- Service Worker caching strategies,
- advanced TypeScript (`infer`, `satisfies`, conditional types, `unknown`/`any`/`never`, generics),
- GraphQL trade-offs and security/cost controls,
- JavaScript semantics already identified as unstable.

## Recently demonstrated strengths

- frontend architecture and state ownership,
- coupling/cohesion analysis in realistic UI flows,
- frontend responsibility assignment and boundary reasoning,
- realtime/WebSocket system design,
- snapshot + delta reasoning,
- failure recovery and degraded mode,
- performance diagnosis and virtualization prioritization,
- server-state reasoning with TanStack Query,
- concurrency and server-authority reasoning.

## Next action

Start Applied SOLID from concrete frontend failure modes. Keep GRASP as a later spaced retest rather than continuing with more definitions now.
