# Design Principles & Patterns

## Current level

**3 — APPLY (developing REASON)**

## Current strengths

- coupling/cohesion analysis in realistic frontend boundaries,
- consumer-driven responsibility and interface design,
- applied SRP, DIP, ISP, and LSP reasoning,
- identifying stable core vs real variation points,
- using Strategy for behavioral variation without mechanically introducing Factory/registry layers,
- recognizing that OCP protects stable logic rather than requiring zero modified files.

## Current gaps

- coupling vs cohesion trade-offs need spaced retesting,
- GRASP responsibility assignment needs more precision around Information Expert vs orchestration,
- deciding when indirection/protected variation is justified versus speculative abstraction,
- SRP extraction criteria need continued separation from reuse concerns,
- DIP abstraction thresholds and domain-specific vs generic infrastructure contracts need retesting,
- ISP composition/inheritance needs more precision,
- LSP postconditions/error semantics need spaced retesting,
- Strategy vs Factory vs State comparison needs deeper reasoning across similar scenarios,
- Factory, State, Observer, Adapter, Facade, Command, Mediator, Composite and related trade-offs still need coverage,
- Open/Closed Principle under dynamic/multi-provider/plugin scenarios still needs verification,
- distinguishing pattern intent from mechanical implementation remains an ongoing verification target.

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
- Factory vs OCP previously produced uncertainty.
- 2026-09-10: independently identified responsibility leakage and knowledge coupling in profile/search scenarios, proposed UI contracts and DTO mapping boundaries, and applied Information Expert / Controller / Protected Variations reasoning.
- 2026-09-10: applied SRP, DIP, ISP, and LSP to frontend data/persistence/component contracts; some trade-off details required correction.
- 2026-09-13: independently identified analytics provider as a real variation point, tracking semantics as the stable core, selected Strategy appropriately, rejected unnecessary Factory/registry indirection, and localized provider selection to startup composition. This resolves the earlier basic Factory-vs-OCP uncertainty, though deeper comparison with State and dynamic extension models is still required.

## Next verification

1. compare Strategy vs Factory vs State in concrete frontend scenarios,
2. spaced retest coupling/cohesion and GRASP without hints,
3. decide when external dependencies merit indirection versus direct use,
4. retest SRP/DIP/ISP/LSP trade-offs under fresh scenarios,
5. identify when pattern use becomes misuse or an anti-pattern,
6. test OCP under dynamic registration, multiple simultaneous implementations, and capability divergence,
7. continue with other high-value frontend patterns after Strategy/Factory/State.
