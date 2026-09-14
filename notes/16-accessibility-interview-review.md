# Frontend Accessibility Interview Review

## Native semantics first

Use a native button for actions rather than a clickable `div`. A button already provides focusability, keyboard behavior, semantic role, and expected assistive-technology behavior.

## Link vs button

- Link: navigation.
- Button: action.

Choose by semantics, not appearance.

## Labels

Inputs need accessible labels. Placeholder text is not a replacement for a label.

```html
<label for="email">Email</label>
<input id="email" type="email" />
```

## Validation

Useful relationships:

```html
aria-invalid="true"
aria-describedby="email-error"
```

This lets assistive tech connect the input to its error description.

## Dynamic announcements

Appropriate live-region semantics (`role="alert"`, `aria-live`) can make important dynamic updates perceivable. Choose urgency carefully.

## Accessible modal

A modal needs more than an overlay:

- move focus into it,
- contain focus appropriately while modal,
- support Escape where expected,
- expose dialog semantics and name,
- restore focus to the trigger after close.

## Portal does not solve accessibility

React Portal solves DOM placement. It does not automatically implement focus management, keyboard behavior, dialog semantics, or screen-reader support.

## Native `<dialog>` / primitives

Native dialog and accessible libraries can help, but behavior and labeling still need verification.

## Observed strength

Accessibility was a relatively solid conceptual area. Continue answering from user/semantic behavior rather than memorized ARIA attributes.

## Review questions

1. Why is `<button>` better than a clickable `<div>` for actions?
2. When should you use a link?
3. Why is placeholder not a label?
4. What do `aria-invalid` and `aria-describedby` communicate?
5. What behaviors make a modal accessible?
6. Does Portal solve modal accessibility?
