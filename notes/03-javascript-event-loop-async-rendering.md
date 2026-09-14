# JavaScript Event Loop, Promises, Microtasks, and Rendering

## Core model

A simplified browser loop:

```text
run current task
→ drain microtasks
→ browser may render
→ run later task
```

Microtasks are drained before the browser proceeds to the next task.

## Typical categories

Tasks/macrotasks include timers and many event callbacks.

Microtasks include:

```js
Promise.then(...)
queueMicrotask(...)
continuation after await
```

## `await Promise.resolve()` does not guarantee paint

```js
setLoading(true);
await Promise.resolve();
heavyWork();
```

The continuation runs as a microtask. The browser may still reach `heavyWork()` before it paints the loading state.

Key rule:

> Yielding to a microtask is not the same as yielding to the browser for paint.

## Heavy work in `setTimeout`

```js
setTimeout(() => heavyWork(), 0);
```

This delays the work to a future task, but once the callback starts, it still blocks the main thread.

## `requestAnimationFrame`

rAF runs before a paint opportunity. It is good for frame-related updates, but a heavy rAF callback can still delay the frame.

Do not memorize one universal ordering between `setTimeout(0)` and rAF; timing and frame boundaries matter.

## Promise/microtask ordering example

```js
console.log('A');
setTimeout(() => console.log('B'), 0);

Promise.resolve()
  .then(() => {
    console.log('C');
    queueMicrotask(() => console.log('D'));
    return Promise.resolve();
  })
  .then(() => console.log('E'));

queueMicrotask(() => console.log('F'));
console.log('G');
```

Correct output:

```text
A
G
C
F
D
E
B
```

The important lesson is to reason from queueing, not indentation.

## Spinner problem

```js
setLoading(true);
heavyLoop();
setLoading(false);
```

The loading state may never visibly paint because the task never returns to the browser before the heavy loop completes.

## Better options

Use a Web Worker for CPU-heavy work that can move off-main. Use chunking when work must remain on the main thread but can be split and yielded between chunks.

## Long Tasks and INP

A Long Task is roughly a main-thread task over 50 ms. INP includes input delay, processing time, and presentation delay.

## Observed gap

Promise/microtask ordering and the idea that `await Promise.resolve()` is not a generic "yield to paint" needed correction.

## Review questions

1. When are microtasks drained?
2. Does `await Promise.resolve()` guarantee paint?
3. Does `setTimeout(0)` make CPU work non-blocking?
4. When does rAF run relative to paint?
5. Why can a spinner fail to appear?
6. What is the difference between chunking and a Worker?
