# Initial Assessment Evidence — 2026-09-04

## Strong evidence

- Independently proposed REST snapshot + WebSocket delta architecture for an order book.
- Identified buffering/coalescing and `requestAnimationFrame` as UI flush strategy while recognizing that rAF itself does not guarantee frame-budget safety.
- Correctly reasoned about reconnect with exponential backoff + jitter.
- Correctly identified stale-market protection when users switch markets rapidly.
- Strong state-ownership reasoning: server state vs local feature state vs global/navigation state.
- Strong feature-boundary and higher-level orchestration reasoning for frontend architecture.
- Correctly kept server authoritative for financial validation and treated frontend validation as UX assistance only.
- Reached the need for request identity when reasoning about ambiguous order-submission timeouts; refined to idempotency-key semantics.
- Correctly reasoned that concurrent balance/order correctness must be enforced atomically on the backend/database boundary.
- Correctly prioritized virtualization for 1500-row high-frequency order-book rendering before memoization or Worker offloading.
- Correctly used profiling categories to consider JavaScript, React, layout/paint, and GC costs.

## Developing / corrected evidence

- Initially confused inherited property readability with enumerability.
- Initially expected `'role' in obj` to ignore inherited/non-enumerable properties.
- Initially attributed Lodash deep equality mainly to prototype differences in an example whose own-property shapes differed.
- Initially reversed normal-function and arrow-function `this` behavior.
- Needed clarification that `const name = ...` does not imply `this.name`.
- Needed clarification of `Object.is`: did not know `NaN` and signed-zero semantics and incorrectly associated it with prototype checks.
- Predicted `var` loop closures as final value 2 rather than 3; core shared-binding idea was present.
- Understood TDZ effect but lacked precise binding/initialization model.
- Promise/microtask chain ordering required correction for a returned resolved Promise and queued microtask.
- JavaScript coercion explicitly marked as currently unknown and deferred for later learning.
- Used `deadlock` when the intended concurrency concept was locking/serialization/transaction isolation.

## Assessment conclusion

Applied frontend engineering reasoning is currently stronger than exact JavaScript language-semantics recall. The next highest-leverage intervention is targeted JavaScript foundations with delayed no-hint retesting, while maintaining architecture/realtime/performance strengths through periodic system-design practice.
