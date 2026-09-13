# Current Focus

## Immediate priority

**One-week Senior Frontend interview sprint**

The end-of-week session is a mock interview with an experienced Frontend Chapter Lead. Treat it as a high-value external assessment and optimize the week to expose and repair interview weaknesses.

## Active topic

**Design Principles & Patterns — first pass complete; move to spaced retest**

React study remains temporarily paused. The first applied pass now covers:

- coupling vs cohesion,
- GRASP responsibility assignment,
- applied SOLID,
- OCP and extension-point trade-offs,
- Strategy / Factory / State,
- Adapter / Facade,
- Observer / Command,
- Mediator / Composite.

The current goal is no longer adding more pattern definitions. Shift to fresh mixed scenarios without pattern-name cues and verify transfer under interview conditions.

Teaching constraints for retest:

- do not name the principle/pattern before the user analyzes the scenario,
- use frontend-specific scenarios,
- prioritize trade-offs, boundary placement, failure modes, and over-engineering detection,
- distinguish explicit orchestration from event-driven decoupling,
- test when no abstraction/pattern is the better answer,
- require concise Senior-level explanations after the design reasoning.

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

- spaced retest of coupling/cohesion and GRASP responsibility assignment,
- SRP/DIP/ISP/LSP trade-offs under fresh scenarios,
- Strategy vs Factory vs State without pattern-name cues,
- OCP under dynamic/multi-provider extension models,
- Adapter vs Facade and when direct dependency use is simpler,
- Observer vs explicit state/store communication,
- Command failure/confirmation/authorization semantics,
- browser cross-tab communication APIs,
- Service Worker caching strategies,
- advanced TypeScript (`infer`, `satisfies`, conditional types, `unknown`/`any`/`never`, generics),
- GraphQL trade-offs and security/cost controls,
- JavaScript semantics already identified as unstable.

## Recently demonstrated strengths

- frontend architecture and state ownership,
- coupling/cohesion analysis in realistic UI flows,
- frontend responsibility assignment and boundary reasoning,
- applied SOLID reasoning,
- pattern intent vs implementation-shape reasoning,
- Strategy / Factory / State distinction,
- Adapter / Facade integration boundaries,
- Observer vs explicit orchestration reasoning,
- Command/Event distinction,
- Mediator coordination and Composite tree reasoning,
- realtime/WebSocket system design,
- snapshot + delta reasoning,
- failure recovery and degraded mode,
- performance diagnosis and virtualization prioritization,
- server-state reasoning with TanStack Query,
- concurrency and server-authority reasoning.

## Next action

Run a mixed Design Principles & Patterns spaced retest with fresh frontend scenarios and no hints. Focus first on GRASP/SOLID abstraction thresholds, then pattern selection and anti-pattern detection.
