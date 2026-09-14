# Browser Rendering, Performance, and Web Workers

## Rendering pipeline

Simplified:

```text
JavaScript
→ style calculation
→ layout
→ paint
→ composite
```

Not every update triggers every phase.

## Layout and paint

Layout computes geometry. Paint creates drawing instructions. Composite combines layers.

`transform` and `opacity` can often avoid layout/paint-heavy paths, but "compositor-friendly" does not mean free.

## Layout thrashing

Alternating DOM writes and geometry reads can force synchronous layout repeatedly.

Bad pattern:

```js
el.style.width = '100px';
const a = el.offsetWidth;
el.style.width = '200px';
const b = el.offsetWidth;
```

Better mental model:

```text
batch reads
→ batch writes
```

## `useLayoutEffect`

Runs after DOM mutations but before paint. Useful for measurement/pre-paint correction, but it blocks paint.

Use `useEffect` for side effects that do not need pre-paint synchronization.

## Web Worker

A Worker moves CPU-heavy JavaScript off the browser main thread.

Good for:

- parsing,
- transformations,
- large calculations,
- data preprocessing.

It cannot directly manipulate the DOM.

## Promise vs Worker

A Promise does not move CPU work to another thread.

```js
Promise.resolve().then(() => heavyLoop());
```

`heavyLoop` still runs on the main thread.

## Worker communication

Uses messaging. By default, data uses structured cloning. Large binary data can use Transferables to avoid copying. `SharedArrayBuffer` enables shared memory but adds synchronization complexity.

## Clone vs transfer vs shared memory

- Clone: copy data into the receiver's context.
- Transfer: move ownership of transferable data.
- Shared memory: both sides access the same memory region and must coordinate safely.

## Chunking vs Worker

Chunking keeps work on the main thread but yields between pieces. A Worker changes the execution context and preserves main-thread responsiveness better for CPU-heavy work.

## Performance process

```text
measure
→ identify bottleneck
→ form hypothesis
→ change
→ measure again
```

Useful signals/tools:

- Performance panel,
- React Profiler,
- Long Tasks,
- INP,
- dropped frames,
- layout/paint,
- memory/GC,
- DOM size,
- update flush rate.

## Virtualization

For a 1500-row frequently updating table, reducing DOM nodes with virtualization is often higher leverage than adding memoization first.

A Worker may preprocess data, but it does not render React DOM.

## Observed strength

This was a relatively strong area: main-thread reasoning, Worker boundaries, virtualization prioritization, and profiling-first optimization were solid.

## Review questions

1. What is the rendering pipeline?
2. What is layout thrashing?
3. When should `useLayoutEffect` be used?
4. Why does a Promise not solve CPU blocking?
5. What is the difference between clone, transfer, and shared memory?
6. Why might virtualization beat memoization for a large table?
