# Frontend Build Tooling: Vite, Bundling, Transpilation, and Monorepo Pitfalls

## Tooling knowledge changes over time

Historical implementation details can become stale. The durable interview model matters more: dev serving, HMR, transformation, type checking, bundling, chunking, minification, caching, and module resolution.

Modern Vite has moved away from the old simplified "esbuild dev / Rollup production" description toward Rolldown/Oxc-based internals. Verify current architecture rather than repeating old assumptions.

## Dev server vs production build

Development optimizes for fast module serving and HMR. Production optimizes for bundling, chunking, minification, hashing, and deployment efficiency.

## HMR vs React Fast Refresh

HMR is the generic module-update mechanism. React Fast Refresh is React-specific state-preserving refresh behavior layered on the development experience.

## Transpilation vs type checking

A tool can strip TypeScript types and emit JavaScript without performing a full semantic type check.

That is why projects commonly run:

```bash
tsc --noEmit
```

or equivalent checking separately.

## Babel

Babel is primarily a compiler/transformation system, not fundamentally a bundler.

## Transpile vs polyfill

Transpilation changes syntax. Polyfills provide missing runtime APIs. You can transpile syntax successfully and still fail in an older runtime that lacks a required API.

## Tree shaking

ES modules support static analysis for removing unused exports, but side effects, module formats, and package metadata can limit tree shaking.

## Code splitting

Dynamic import can create deferred chunks:

```js
const module = await import('./heavy-module');
```

Benefits: smaller initial payload. Costs: runtime request latency, loading waterfalls, and more loading-state complexity.

## Hashed assets

Content-hashed filenames enable long-lived immutable caching because content changes produce a new URL.

## Source maps

Map transformed/minified code back to original source for debugging/observability. Production exposure should follow the project's security/operations policy.

## Duplicate React in monorepos

Shipping multiple React instances can produce invalid hook call errors. A component library commonly declares React as a peer dependency and also a dev dependency for local development.

Bundler dedupe options can help, but they are not a substitute for correct dependency ownership.

## Observed gap

The main risk was stale tooling knowledge. Keep durable concepts strong and verify version-specific internals when needed.

## Review questions

1. Difference between HMR and React Fast Refresh?
2. Can TS transpile while type errors still exist?
3. Difference between Babel and a bundler?
4. Transpilation vs polyfill?
5. Why do ES modules help tree shaking?
6. What are code-splitting trade-offs?
7. Why can duplicate React cause invalid hook calls?
8. Why use peerDependencies for React libraries?
