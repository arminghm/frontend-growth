# Design Principles & Patterns

## Current level

**2-3 — EXPLAIN/APPLY (developing)**

## Current gaps

- coupling vs cohesion trade-offs need spaced retesting,
- GRASP responsibility assignment needs more precision around Information Expert vs orchestration,
- deciding when indirection/protected variation is justified versus speculative abstraction,
- SOLID beyond definitions: practical trade-offs and code/design examples,
- Factory, Strategy, State, Observer, Adapter, Facade, Command, Mediator, Composite and related trade-offs,
- Open/Closed Principle in relation to factories, strategies, registries, and extension points,
- distinguishing pattern intent from mechanical implementation.

## Teaching constraints

- Use frontend-specific examples and use cases rather than generic OO examples.
- Prefer patterns that remain useful in modern frontend architecture and component/state/data-flow design.
- For every pattern, distinguish intended use from common misuse, over-engineering, and anti-pattern forms.
- If a pattern or a common implementation is considered an anti-pattern in a frontend context, explain exactly why, which failure mode it creates, and when the criticism does or does not apply.
- Do not teach patterns as recipes to apply mechanically; start from the problem, responsibility, coupling, cohesion, and trade-offs.
- Prefer realistic scenarios involving component APIs, state ownership, data fetching, forms, routing, feature boundaries, external services, and frontend orchestration.

## Interview evidence

- GRASP was unknown in a recent real interview.
- SOLID knowledge was not sufficiently deep/applied.
- Factory vs OCP produced uncertainty and needs precise treatment.
- 2026-09-10: independently identified responsibility leakage and knowledge coupling in profile/search scenarios, proposed UI contracts and DTO mapping boundaries, and applied Information Expert / Controller / Protected Variations reasoning. Exact abstraction thresholds and responsibility ownership still need retesting.

## Next verification

1. spaced retest coupling/cohesion without hints,
2. distinguish Information Expert from feature orchestration in a fresh scenario,
3. decide when external dependencies merit indirection versus direct use,
4. SOLID applied to React/frontend architecture,
5. compare Factory vs Strategy vs State in concrete frontend scenarios,
6. identify when pattern use becomes misuse or an anti-pattern,
7. answer OCP trade-off questions without relying on slogans.
