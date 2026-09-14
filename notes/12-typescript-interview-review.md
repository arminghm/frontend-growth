# TypeScript Interview Review

TypeScript was assessed as practically solid, but several advanced areas still needed verification.

## Discriminated unions

```ts
type Result =
  | { status: 'success'; data: User }
  | { status: 'error'; error: Error };
```

The discriminant gives TypeScript a stable narrowing signal.

## Exhaustiveness with `never`

```ts
function render(status: Status) {
  switch (status) {
    case 'idle': return 'Idle';
    case 'loading': return 'Loading';
    case 'success': return 'Success';
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}
```

If a new union member is added, the impossible `never` assignment reveals an unhandled case.

## Generics preserve relationships

```ts
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

The key idea is not merely "reusability." Generics preserve relationships between input and output types.

## `unknown`, `any`, `never`

- `any`: opts out of meaningful checking for that value.
- `unknown`: type is not yet known; narrowing is required before use.
- `never`: impossible value/path.

`unknown` is a safer choice at untrusted boundaries.

## Conditional types

```ts
type IsString<T> = T extends string ? true : false;
```

## Distributive conditional types

A conditional type with a naked generic parameter can distribute over a union.

```ts
type ToArray<T> = T extends unknown ? T[] : never;
type X = ToArray<string | number>;
// string[] | number[]
```

## `infer`

```ts
type Return<T> =
  T extends (...args: any[]) => infer R
    ? R
    : never;
```

Mental model: pattern-match a type shape and capture a part of it into a type variable.

## `satisfies`

`satisfies` verifies compatibility with a target type while often preserving more useful inferred/narrow literal information than replacing the expression with a direct annotation.

```ts
const routes = {
  home: '/',
  profile: '/profile',
} satisfies Record<string, string>;
```

## Utility types

- `Pick<T, K>`: keep selected object keys.
- `Omit<T, K>`: remove selected object keys.
- `Extract<T, U>`: keep union members assignable to `U`.
- `Exclude<T, U>`: remove union members assignable to `U`.

## Interface vs type

Interfaces support declaration merging. Type aliases can model unions, intersections, tuples, primitives, and broader type expressions. Avoid rigid rules like "always use interface for objects."

## Observed gaps

Stronger: unions, narrowing, generics, `keyof`, utility types, exhaustive `never`.

Needs explicit retesting: `infer`, `satisfies`, conditional/distributive types, deep `unknown`/`any`/`never`, advanced generic inference.

## Review questions

1. What relationship does a generic preserve?
2. Why is `unknown` safer than `any`?
3. What does `never` represent?
4. What makes a conditional type distributive?
5. What does `infer` do?
6. Why use `satisfies`?
