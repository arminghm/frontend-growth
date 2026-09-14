# JavaScript Scope, Closures, `this`, and Binding

## Lexical scope

Identifier lookup is primarily determined by where code is defined.

```js
function makeFn() {
  const value = 'inner';
  return function () {
    return value;
  };
}
```

The returned function closes over the lexical binding from `makeFn`.

## Closures capture bindings, not frozen values

```js
function createCounter() {
  let count = 0;
  return () => ++count;
}
```

The closure retains the `count` binding, whose value changes over time.

## Closure lifetime and memory

If a reachable callback closes over a large object, that object can remain reachable too. Garbage collection is about reachability, not simply whether a function has returned.

## `var` loop behavior

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

Output:

```text
3
3
3
```

All callbacks share one function-scoped binding. With `let`, each iteration gets its own binding, producing `0,1,2`.

## TDZ

A precise model for `let`/`const`:

- the binding is created when entering scope,
- it remains uninitialized,
- it is initialized when execution reaches the declaration.

Access during that interval throws `ReferenceError`.

This is more accurate than saying "let/const are not hoisted."

## TDZ and shadowing

```js
const x = 1;
{
  console.log(x); // ReferenceError
  let x = 2;
}
```

The inner `x` shadows the outer binding for the whole block; before initialization it is in the TDZ.

# `this`

## Normal functions

For normal functions, `this` is primarily determined by how the function is called.

```js
const user = {
  name: 'Ali',
  print() {
    console.log(this.name);
  },
};

user.print(); // 'Ali'
```

## Extracted methods

```js
const print = user.print;
print();
```

The original receiver is gone. In strict mode, `this` is `undefined`.

## Arrow functions

Arrows do not get a dynamic `this`; they capture it lexically.

```js
const obj = {
  name: 'Ali',
  print: () => console.log(this.name),
};
```

The arrow's `this` is not automatically `obj`.

## `call`, `apply`, `bind`

- `call` invokes immediately with explicit `this` and positional args.
- `apply` invokes immediately with explicit `this` and array-like args.
- `bind` returns a new bound function.

Arrow `this` cannot be dynamically rebound with these APIs.

## Observed gaps

- Normal-function and arrow-function `this` were initially reversed.
- Object-literal placement was incorrectly treated as assigning arrow `this`.
- `var` loop output was predicted as `2` instead of the final binding value `3`.

## Review questions

1. What determines `this` for a normal function?
2. What determines `this` for an arrow function?
3. Why does an extracted method lose its receiver?
4. Can `call` replace an arrow's `this`?
5. Why does the `var` loop print `3,3,3`?
6. Are `let` and `const` hoisted? Give the precise answer.
