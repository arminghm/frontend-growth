# JavaScript Equality, Copying, and Coercion

## Reference equality

```js
{} === {} // false
```

Objects are compared by reference with `===`.

## `NaN` and signed zero

```js
NaN === NaN // false
+0 === -0   // true
```

## `Object.is`

```js
Object.is(NaN, NaN) // true
Object.is(+0, -0)   // false
Object.is({}, {})   // false
```

`Object.is` is not deep equality and has nothing to do with prototype equality.

## Why React developers care

React uses Object.is-like semantics in several comparison/bailout paths, so referential stability matters in dependency arrays, memoization, and state comparisons.

## Shallow copy

```js
const original = { user: { name: 'Ali' } };
const copy = { ...original };
```

Top level is new:

```js
copy !== original // true
```

Nested reference is shared:

```js
copy.user === original.user // true
```

## Structural sharing

Immutable updates copy only the changed path while reusing unchanged references.

```js
const next = {
  ...state,
  user: {
    ...state.user,
    name: 'Sara',
  },
};
```

## `structuredClone`

It handles many deep-clone cases, including cycles and several built-in data types, but it is not a universal cloning/serialization solution and does not clone arbitrary functions.

## JSON cloning

```js
JSON.parse(JSON.stringify(value))
```

is not a robust generic clone because unsupported values/types may be lost or changed.

# Coercion: explicit review gap

These were left as an unstable area and should be worked through from conversion rules:

```js
[] == false
[] === false
'' == 0
'' === 0
null == undefined
null === undefined
[] + []
[] + {}
{} + []
```

Do not memorize outputs without understanding primitive conversion and the special loose-equality rules.

## Observed gaps

Needed correction:

- `Object.is(NaN, NaN)`
- `Object.is(+0, -0)`
- `Object.is` is not a prototype/deep-equality operation.

Explicit unresolved gap: coercion.

## Review questions

1. Why is `{}` not equal to `{}` with `===`?
2. What does `Object.is(NaN, NaN)` return?
3. What does `Object.is(+0, -0)` return?
4. Why is spread shallow?
5. What does structural sharing mean?
6. Work through `[] == false` step by step.
