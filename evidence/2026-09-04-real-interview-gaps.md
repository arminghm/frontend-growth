# Real Interview Gap Evidence — 2026-09-04

This evidence comes from the user's recollection of a recent real Frontend interview and is therefore a high-priority signal for interview preparation.

## React patterns

- Could not identify or confidently apply the Compound Components pattern in a Tabs design question.
- React knowledge is stronger in hooks/state/performance than in reusable component API/design patterns.
- Context-vs-Zustand reasoning was not strong enough under interview pressure.

## Design principles and patterns

- GRASP was unknown.
- Coupling and cohesion terminology/mental models were not sufficiently established.
- SOLID was recognized but not deep/applied enough for design trade-off questions.
- Factory vs Open/Closed Principle produced uncertainty/disagreement and needs precise treatment.
- Strategy was recognized as a way to support extensibility, but the broader pattern/OCP relationship needs consolidation.

## API design / GraphQL

- GraphQL trade-offs were not reasoned confidently.
- Need to understand when GraphQL is useful, when REST/BFF may be simpler, and how security/cost-control concerns are handled.
- Important correction target: GraphQL is not inherently unsuitable for public sites solely because users can submit arbitrary queries; authorization, persisted/allow-listed queries, depth/complexity limits, rate limiting, and schema design affect the risk profile.

## Browser platform APIs

- Did not know the appropriate browser API for communication between tabs.
- Browser-platform API knowledge is weaker than browser event-loop/rendering knowledge.
- Need focused coverage of BroadcastChannel, storage events, postMessage, MessageChannel, SharedWorker, Service Worker messaging, and when each applies.

## Caching / Service Worker

- Limited knowledge of caching strategies and their relation to Service Workers.
- Need mental models for Cache Storage vs HTTP cache, Service Worker fetch interception, cache-first, network-first, stale-while-revalidate, offline behavior, invalidation/versioning, and Workbox-level abstractions.

## TypeScript

- Current high-level TypeScript assessment needs deeper verification.
- Specific interview targets: `infer`, `satisfies`, `unknown` vs `any` vs `never`, conditional types, and generics.

## Preparation consequence

For the one-week sprint, raise priority of React design patterns, design principles/patterns, browser platform APIs, caching/Service Worker, GraphQL/API design, and advanced TypeScript. Keep JavaScript language semantics as a parallel high-risk track rather than the only primary track.
