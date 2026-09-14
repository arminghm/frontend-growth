# React Rendering, Reconciliation, Keys, and Memoization

## Render is not DOM recreation

A React render means component logic runs to calculate the next UI description. It does not mean React destroys and rebuilds the DOM every time.

Conceptually:

```text
render phase
→ calculate next tree/work

commit phase
→ apply necessary changes
```

Render work can be restarted or discarded, so render logic should remain pure.

## Reconciliation

React decides how new elements correspond to previous elements. Key identity signals include component/element type and `key`.

Preserved identity can preserve state. Changed identity can remount/reset state.

## Keys

Good:

```jsx
items.map(item => <Row key={item.id} item={item} />)
```

Index keys are dangerous when list order can change because state can become associated with the wrong logical item.

Random keys are worse because they force new identity every render and can cause remounts, state resets, and repeated effects.

## Parent render and child render

Without memoization, a normal child component will generally execute again when its parent renders.

A stable callback reference alone does not stop that.

## `React.memo`

`React.memo` can skip a child render when props compare equal. Default comparison is shallow per prop with Object.is-like semantics.

## `useCallback`

`useCallback` stabilizes a function reference. It does not make the function itself faster.

Typical reasons:

- passing callbacks to memoized children,
- stable hook dependencies,
- APIs where reference identity matters.

## Stale closures

```jsx
const onSelect = useCallback(() => {
  console.log(user.name);
}, []);
```

If `user` changes, the callback can retain stale captured state because dependencies are incorrect.

## `useMemo`

Use for expensive derived computation when dependency-based caching is useful. Treat it as a performance optimization, not semantic state storage.

## `useRef`

A stable mutable container whose `.current` updates do not trigger render. Good for DOM refs, timers, mutable instance-like data, and non-visual state.

## Derived state

Avoid duplicating state when a value can be derived from existing state/props. Compute it directly or memoize if expensive.

## Fiber mental model

Fiber is React's internal work/data structure. Useful interview ideas include current vs work-in-progress trees, child/sibling/return links, flags, and alternate relationships.

Do not describe Fiber as simply "the Virtual DOM."

## Observed gaps

Important clarification:

> Without `React.memo`, stable props do not by themselves prevent a child from executing when the parent renders.

Still worth consolidating: Fiber details and exact reconciliation identity behavior.

## Review questions

1. What is the difference between render and commit?
2. Why must render logic be pure?
3. What determines identity during reconciliation?
4. Why are index keys dangerous?
5. What does changing a key do?
6. Does `useCallback` stop a non-memoized child from rendering?
7. What does `React.memo` compare?
8. How can `useCallback([])` create stale closure bugs?
