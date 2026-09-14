# Frontend Security Interview Review

## XSS

Cross-Site Scripting occurs when attacker-controlled content becomes executable/active content in a trusted origin.

React escapes text content by default:

```jsx
<div>{userInput}</div>
```

But `dangerouslySetInnerHTML` creates a high-risk boundary and requires robust sanitization when HTML must be accepted.

## Context-sensitive encoding

"Escape user input" is too vague. HTML text, attributes, URLs, JS strings, and CSS have different safety rules.

## localStorage tokens

Tokens in localStorage are readable by JavaScript, so XSS can steal them.

## HttpOnly cookies

HttpOnly prevents direct JavaScript access to a cookie. It reduces credential theft through XSS but does not eliminate XSS impact; malicious script may still perform authenticated actions from the origin.

## Secure / SameSite

- `Secure`: cookie only over HTTPS.
- `SameSite`: controls cross-site cookie sending and helps defend against CSRF.

## CSRF

CSRF abuses browser-automatically-sent credentials to cause state-changing requests from another site.

Defenses include:

- SameSite,
- CSRF tokens,
- Origin/Referer validation,
- Fetch Metadata,
- never using GET for state changes.

## CORS is not sufficient CSRF protection

CORS controls whether another origin's frontend can read certain responses; some cross-site requests can still be sent even when the response is unreadable.

## CSP

Content Security Policy is defense in depth for restricting executable/resource sources and reducing XSS impact. Nonces, hashes, `strict-dynamic`, and report-only rollout are useful concepts.

## Clickjacking

Defend with `Content-Security-Policy: frame-ancestors ...` and, where relevant, legacy `X-Frame-Options`.

## iframe controls

Do not confuse:

- `frame-src`: what your page may embed.
- `frame-ancestors`: who may embed your page.

For `postMessage`, validate `event.origin` and prefer a specific `targetOrigin`.

## Observed strength

Security mental models were comparatively good. The main goal is precise wording and avoiding oversimplifications.

## Review questions

1. Why is localStorage exposed to XSS?
2. What does HttpOnly prevent?
3. Why does HttpOnly not eliminate XSS impact?
4. Why is CORS not enough for CSRF?
5. What does SameSite help with?
6. Difference between `frame-src` and `frame-ancestors`?
7. What should you validate for `postMessage`?
