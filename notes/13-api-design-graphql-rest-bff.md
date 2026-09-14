# API Design: GraphQL, REST, and BFF

GraphQL trade-offs were an identified interview gap.

Important correction:

> GraphQL is not inherently unsuitable for public applications simply because clients can submit queries.

The real issues are authorization, governance, cost control, caching, and operational complexity.

## When GraphQL is useful

- clients need variable data shapes,
- over/under-fetching is meaningful,
- multiple client types need different projections,
- graph-shaped aggregation is valuable,
- schema/tooling benefits justify the complexity.

## Costs of GraphQL

Potential costs:

- N+1 resolver problems,
- query cost/depth control,
- caching complexity,
- schema governance,
- field/object authorization,
- observability and operational complexity.

## Public GraphQL controls

### Authorization

Enforce at the correct object/field/business boundaries. Never rely on clients hiding fields.

### Persisted / allow-listed queries

Can limit accepted operation shapes, especially for controlled clients.

### Depth and complexity limits

Reject abusive deeply nested or expensive operations.

### Rate limiting

Still required.

### Introspection

Restricting introspection can reduce information exposure, but it is not the primary security boundary.

## REST

Can be simpler when resource/use-case shapes are stable, HTTP/CDN caching matters, and operational simplicity is valuable.

## BFF

A Backend for Frontend may handle:

- aggregation,
- response shaping,
- topology hiding,
- frontend-specific auth/session adaptation,
- client-specific API ergonomics.

Do not duplicate core business invariants into the BFF merely because the frontend needs them.

## Choosing among them

Consider:

- number/type of clients,
- data-shape variability,
- cache/CDN behavior,
- backend topology,
- operational complexity,
- team ownership,
- schema governance,
- security/cost controls,
- observability.

## Observed gap

The weak mental model was "public GraphQL allows arbitrary queries, therefore it is unsafe." The corrected model is that query flexibility introduces risks that are controlled through authorization, cost limits, persisted queries when appropriate, rate limiting, and schema design.

## Review questions

1. When is GraphQL a good fit?
2. What is N+1?
3. How do you control expensive queries?
4. Are persisted queries mandatory?
5. Is introspection restriction an authorization control?
6. When is REST simpler?
7. What does a BFF solve?
