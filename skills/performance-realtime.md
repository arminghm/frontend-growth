# Performance & Realtime

## Current level

**4 — REASON**

## Demonstrated strengths

- main-thread vs worker reasoning,
- frame budget and `requestAnimationFrame` limitations,
- buffering/coalescing high-frequency updates,
- state-like stream vs event-stream distinction,
- snapshot + delta synchronization,
- sequence/gap/reconnect reasoning,
- exponential backoff + jitter,
- stale market/update protection,
- virtualization as a high-leverage optimization,
- profiling-first workflow,
- distinguishing JavaScript, React render/commit, layout, paint, and GC bottlenecks,
- recognizing that Web Workers do not move React/DOM rendering off the main thread.

## Needs occasional retest

- `useSyncExternalStore` exact purpose and limitations,
- idempotent realtime projections,
- granular external-store subscriptions.

## Maintenance strategy

Use realistic market/trading dashboards and performance traces rather than isolated trivia.
