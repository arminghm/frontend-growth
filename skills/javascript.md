# JavaScript

## Current level

**2 — EXPLAIN (inconsistent under pressure)**

## Demonstrated strengths

- understands lexical scope after explanation,
- understands closure retention and reachability,
- understands shallow copy/reference sharing,
- understands broad event-loop ordering,
- recognizes server/client async work does not imply off-main-thread execution.

## Current gaps / unstable areas

- property lookup vs enumerability,
- `in` vs `hasOwn` / `Object.hasOwn`,
- property descriptors,
- `this` in normal vs arrow functions,
- `call` / `apply` / `bind`,
- `Object.is` semantics,
- coercion,
- exact `var` loop closure behavior,
- TDZ terminology,
- Promise resolution edge cases.

## Evidence requiring retest

Recently corrected:

- inherited properties are still readable through normal property access,
- `in` checks own + inherited properties regardless of enumerability,
- arrow functions capture lexical `this`,
- `Object.is(NaN, NaN)` is true and distinguishes `+0` from `-0`,
- `var` loop callbacks observe final value `3` in the tested example,
- `let`/`const` bindings exist before declaration but remain uninitialized in the TDZ.

Do not upgrade these topics until they are answered independently in a later session.

## Next verification

1. coercion diagnostic,
2. prototype/property-model diagnostic,
3. `this` + bind/call/apply diagnostic,
4. Promise/microtask chaining diagnostic,
5. delayed retest without hints.
