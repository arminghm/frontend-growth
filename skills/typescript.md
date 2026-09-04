# TypeScript

## Current level

**3 — APPLY**, but advanced type-system depth needs verification.

## Demonstrated strengths

- discriminated unions,
- narrowing,
- `unknown` vs unsafe assertions at a basic level,
- generics with `keyof` / indexed access,
- `Pick` / `Omit` / `Extract` / `Exclude`,
- exhaustive `never` checks,
- interface vs type basics.

## Current verification gaps

- `infer`,
- conditional types,
- `satisfies`,
- deeper `unknown` vs `any` vs `never`,
- generic constraints and inference edge cases,
- practical utility-type composition,
- mapped types and distributive conditional types.

## Interview evidence

A recent real interview indicated that TypeScript depth has not yet been sufficiently stress-tested. The existing high-level assessment should not be treated as proof of advanced type-system mastery.

## Next verification

1. `unknown` / `any` / `never` comparison,
2. `satisfies` vs annotation vs assertion,
3. conditional types + distributivity,
4. `infer` exercises,
5. generic inference/constraints scenarios.
