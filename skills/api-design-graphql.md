# API Design & GraphQL

## Current level

**1-2 — AWARE/EXPLAIN (trade-off reasoning needs work)**

## Current gaps

- GraphQL strengths: client-driven selection, aggregation, schema/typing, reducing over/under-fetching in some systems,
- GraphQL costs: operational complexity, caching differences, N+1 risk, query-cost control, schema governance,
- public vs internal/admin API considerations,
- authorization vs query flexibility,
- persisted/allow-listed queries, depth/complexity limits, rate limiting, field-level authorization,
- when REST or a BFF is simpler and safer operationally.

## Interview evidence

- Could not confidently explain when GraphQL should or should not be used.
- Security was raised as a concern for exposing flexible queries to public users.

## Important clarification target

Do not reduce the decision to "GraphQL is safe for admin panels but unsafe for public sites." Public GraphQL can be operated safely when authorization and query-cost controls are designed correctly. The decision should include product needs, client diversity, caching, operational complexity, schema governance, performance, and security controls.

## Next verification

1. compare REST vs GraphQL vs BFF for three realistic products,
2. explain GraphQL security controls,
3. explain caching implications,
4. identify N+1 and query-complexity risks,
5. answer when GraphQL adds unnecessary complexity.
