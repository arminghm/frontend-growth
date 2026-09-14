# React Server Components, Suspense, Hydration, and Next.js

## Server Components vs Client Components

A Server Component executes on the server and its implementation is not shipped as client JavaScript. A Client Component can use browser-side interactivity and client hooks.

`'use client'` marks a client-capable module boundary; it does not mean "CSR only."

A Client Component can still be server-pre-rendered and then hydrated in the browser.

## Hooks and SSR

Saying "SSR cannot use hooks" is too broad.

- Server Components cannot use client hooks such as `useState`/`useEffect`.
- Client Components may still participate in server rendering.
- Effects do not run during server render.

## Why RSC reduces client JavaScript

If a Server Component renders 50 posts and each contains a client `LikeButton`, the list logic and data access remain server-side. The `LikeButton` implementation is shipped once and instantiated many times.

"One button's worth of code, not fifty" refers to the component implementation in the bundle, not to the number of DOM button instances.

## Hydration

Conceptually:

```text
server HTML
→ browser displays it
→ client JS loads
→ React attaches interactivity/state/event handling
```

Hydration is not simply rebuilding the HTML from scratch.

## Hydration mismatch

Common causes:

- random/time-dependent output,
- browser-only state during initial render,
- environment/locale differences,
- client-only branching that changes initial markup.

## Suspense

Suspense is a boundary for waiting/fallback behavior. It is not synonymous with lazy loading.

### Code loading

```jsx
const Chart = lazy(() => import('./Chart'));

<Suspense fallback={<Spinner />}>
  <Chart />
</Suspense>
```

### Server streaming

Suspense can define streaming boundaries so earlier parts of a page can be sent while slower content resolves.

### Client Component inside Suspense

A Client Component can live inside Suspense. It does not suspend merely because it is a Client Component; something must actually suspend, such as a lazy module or framework-integrated async resource.

## Rendering strategy

Choose based on requirements, not labels.

- Public SEO content that updates periodically: ISR can fit.
- Authenticated/personalized content can still be server-rendered.
- Browser-specific highly interactive areas may use client rendering.

## Private caching risk

Personalized SSR can leak data if cached with public/shared semantics. Always reason about cache scope and audience.

## RSC serialization boundary

Do not pass arbitrary functions, database handles, or class instances with behavior as ordinary props across the boundary. Server Functions have special semantics and should still treat client-provided arguments as untrusted.

## Observed gaps

Stable:

- `'use client'` != CSR-only,
- RSC can reduce client bundle code,
- hydration attaches behavior,
- authenticated content is not automatically CSR.

Needs more depth: Suspense variants and modern Next.js App Router caching/revalidation.

## Review questions

1. What code from a Server Component reaches the browser?
2. Does `'use client'` mean CSR-only?
3. Why can 50 button instances use one shipped implementation?
4. What is hydration?
5. What causes hydration mismatches?
6. What different things can Suspense wait for?
7. Is a Client Component automatically suspending?
