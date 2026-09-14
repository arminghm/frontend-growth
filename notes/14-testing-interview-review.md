# Frontend Testing Interview Review

Testing was one of the weaker practical areas. The need was implementation practice, not more terminology alone.

## Test behavior, not implementation details

Prefer:

```text
user clicks Save
→ request succeeds
→ success message appears
```

over asserting private internal state transitions.

## Unit, integration, E2E

### Unit

Small isolated units: pure functions, reducers, parsers, domain rules.

### Integration

Multiple frontend parts working together: component + hooks + provider/network boundary, forms, async state.

### E2E

Critical user journeys through the real app stack: authentication, checkout/order placement, important route-level flows.

## Testing Library queries

Prefer semantic queries such as:

```js
getByRole
getByLabelText
getByText
```

### `getBy*`

Element must exist immediately; otherwise query throws.

### `findBy*`

Async query for content that appears later.

### `queryBy*`

Returns null when missing; useful for asserting absence.

## AAA

```text
Arrange
Act
Assert
```

A useful structure, not a rigid ceremony.

## Test doubles

- Stub: controlled return behavior.
- Spy: records interactions/calls.
- Mock: configured expected behavior/interactions.
- Fake: simplified working implementation, e.g. in-memory repository.
- Fixture: known test data/setup.

## Network mocking

Mocking `fetch` directly can couple tests to implementation details. MSW intercepts at the network boundary, allowing application request code to stay realistic.

## Fake timers

Useful for debounce, throttle, timeouts, and polling. Avoid them when time is not actually the behavior under test.

## Practical testing shape

A healthy frontend commonly has many unit/integration tests and a smaller number of critical E2E tests. Exact ratios matter less than risk coverage.

## Observed gap

Conceptual understanding improved, but practical test implementation remained limited.

## Review questions

1. Difference between unit, integration, and E2E?
2. Why prefer behavior over implementation details?
3. When do you use `getBy`, `findBy`, `queryBy`?
4. Why can MSW be better than mocking `fetch`?
5. What is a fake?
6. When are fake timers appropriate?
