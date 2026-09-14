# JavaScript Object Model: Prototype, Properties, and Descriptors

## Why this matters

Interview questions about objects often test whether you can distinguish property lookup, ownership, enumerability, descriptors, and prototype-chain behavior. The earlier gaps came from mixing these concepts together.

## Property lookup vs ownership

```js
const proto = { role: 'admin' };
const a = Object.create(proto);
a.name = 'Ali';
```

Normal property access searches the object first, then its prototype chain:

```js
a.role // 'admin'
```

Ownership is different:

```js
Object.hasOwn(a, 'role') // false
'role' in a              // true
```

Mental model:

- `obj.x` asks whether normal lookup can resolve `x`.
- `Object.hasOwn(obj, 'x')` checks only the object itself.
- `'x' in obj` checks own + inherited properties.

## `Object.keys`

`Object.keys(obj)` returns properties that are:

- own,
- enumerable,
- string-keyed.

```js
Object.keys(a) // ['name']
```

The inherited `role` does not appear.

## Enumerability does not control readability

```js
const obj = {};
Object.defineProperty(obj, 'x', { value: 10 });
```

By default:

```text
writable: false
enumerable: false
configurable: false
```

But:

```js
obj.x                    // 10
'x' in obj               // true
Object.hasOwn(obj, 'x')  // true
Object.keys(obj)         // []
```

A non-enumerable property is still readable. Enumerability controls participation in certain enumeration operations, not property access.

## Assignment and deletion

For non-writable/non-configurable properties, invalid writes/deletes can fail silently in non-strict mode and throw in strict mode.

## Deep equality caution

Do not reduce deep equality to "the prototype chains differ." First inspect own enumerable structure.

```js
const proto = { role: 'admin' };
const a = Object.create(proto);
a.name = 'Ali';

const b = { name: 'Ali', role: 'admin' };
```

These already differ in own properties:

```js
Object.keys(a) // ['name']
Object.keys(b) // ['name', 'role']
```

## Observed gap

The unstable area was the distinction between inheritance, enumerability, ownership, and readability.

## Review questions

1. Can an inherited property be read with `obj.x`?
2. Does `Object.hasOwn` inspect the prototype chain?
3. Does `in` inspect the prototype chain?
4. Does a non-enumerable property appear in `Object.keys`?
5. Can a non-enumerable property still be read normally?
6. What are the default flags in `Object.defineProperty`?
