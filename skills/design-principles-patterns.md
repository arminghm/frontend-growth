# Design Principles & Patterns

## Current level

**1-2 — AWARE/EXPLAIN (inconsistent under interview pressure)**

## Current gaps

- coupling vs cohesion,
- high cohesion / low coupling as design goals,
- GRASP principles and how they guide responsibility assignment,
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

## Next verification

1. explain coupling/cohesion with frontend examples,
2. GRASP overview with applied responsibility-assignment questions,
3. SOLID applied to React/frontend architecture,
4. compare Factory vs Strategy vs State in concrete frontend scenarios,
5. identify when pattern use becomes misuse or an anti-pattern,
6. answer OCP trade-off questions without relying on slogans.
