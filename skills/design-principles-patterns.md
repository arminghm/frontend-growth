# Design Principles & Patterns

## Current level

**3 — APPLY (developing REASON)**

## Current strengths

- coupling/cohesion analysis in realistic frontend boundaries,
- consumer-driven responsibility and interface design,
- applied SRP, DIP, ISP, and LSP reasoning,
- identifying stable core vs real variation points,
- Strategy / Factory / State distinction in realistic frontend flows,
- Adapter boundaries around third-party APIs and foreign data shapes,
- Facade/orchestration reasoning with attention to cohesion and God-object risk,
- Observer reasoning that distinguishes secondary reactions from core ordered workflows,
- Command reasoning around executable intent, multiple invokers, and bulk execution,
- Mediator reasoning for coordination-heavy sibling/component interactions,
- Composite reasoning for recursive whole/part UI structures,
- recognizing that OCP protects stable logic rather than requiring zero modified files,
- recognizing when patterns overlap in role without being interchangeable.

## Current gaps

- coupling vs cohesion trade-offs still need spaced retesting,
- GRASP responsibility assignment still needs more precision around Information Expert vs orchestration,
- deciding when indirection/protected variation is justified versus speculative abstraction needs spaced retesting,
- SRP extraction criteria need continued separation from reuse concerns,
- DIP abstraction thresholds and domain-specific vs generic infrastructure contracts need retesting,
- ISP composition/inheritance needs more precision,
- LSP postconditions/error semantics need spaced retesting,
- OCP under dynamic registration, multiple simultaneous implementations, and capability divergence needs verification,
- Adapter vs Facade needs spaced retesting in fresh scenarios,
- Observer vs store/state communication and lifecycle/unsubscribe concerns need retesting,
- Command confirmation/authorization/bulk failure policies need more precision,
- Mediator vs ordinary shared state ownership needs retesting,
- Composite should be retested against ordinary nesting/collections to avoid over-application,
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
- 2026-09-13: independently identified analytics provider as a real variation point, tracking semantics as the stable core, selected Strategy appropriately, rejected unnecessary Factory/registry indirection, and localized provider selection to startup composition.
- 2026-09-13: independently distinguished Strategy, Factory, and State in a combined upload feature; applied Adapter and Facade boundaries; separated core login workflow from Observer reactions; distinguished Command intent from events; and applied Mediator/Composite to a dashboard-builder scenario.

## Next verification

1. spaced retest coupling/cohesion and GRASP without hints,
2. retest SRP/DIP/ISP/LSP on fresh scenarios,
3. retest Strategy/Factory/State without pattern-name cues,
4. test OCP under dynamic and multi-provider extension models,
5. compare Adapter vs Facade in fresh integration scenarios,
6. test Observer vs explicit state/store communication,
7. test Command bulk/confirmation/authorization semantics,
8. test Mediator vs shared state ownership and Composite vs ordinary nesting.
