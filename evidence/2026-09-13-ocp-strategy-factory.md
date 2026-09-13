# OCP, Strategy & Factory — Applied Evidence

Date: 2026-09-13

## Context

Applied analysis of an analytics provider extension scenario. The system had GA and Amplitude, likely future Mixpanel support, enterprise-specific providers, one active provider per deployment, and startup configuration selecting the concrete implementation.

## Independent evidence

The user independently demonstrated the following:

- identified the analytics provider as the real variation/extension point,
- identified event tracking semantics (`track(event)`) as the stable core that application code should depend on,
- proposed a feature-facing `Analytics` contract with `track(event)` and separate concrete implementations for GA, Amplitude, and future providers,
- correctly applied Strategy reasoning: application code should depend on the stable analytics contract while concrete provider behavior varies behind it,
- correctly placed provider selection at application startup/configuration rather than leaking provider knowledge into feature code,
- rejected a registry as unnecessary for a system with exactly one active provider chosen at startup and a small known provider set,
- correctly reasoned that adding a Factory abstraction solely to move a simple startup switch into another file may not add meaningful value,
- recognized that adding Mixpanel should primarily add a new provider implementation and modify the startup selection/composition boundary rather than stable application tracking code.

## Corrections / refinements

- Frontend environment variables are often substituted at build time (for example via Vite/webpack-style env handling); true runtime provider selection requires a runtime configuration mechanism such as server-injected globals, a config endpoint/file, or equivalent deployment-time runtime config.
- A startup `switch` that selects the concrete analytics implementation is already acting as a composition/selection boundary. Extracting it into a named Factory is optional; the architectural role matters more than the pattern name.
- OCP does not require zero modified files. Adding a provider may legitimately modify the composition root/config mapping while leaving the stable tracking contract and application code unchanged.
- The design would need reconsideration if multiple providers must run simultaneously, providers become dynamically pluggable after startup, different features require different providers, provider capabilities diverge beyond the shared `track(event)` contract, or provider-specific semantics begin leaking into the common event model.

## Assessment

### OCP / Extension-point reasoning

**3 — APPLY**

The user independently distinguished stable core from a real variation point and avoided speculative extension mechanisms. The user correctly balanced OCP with complexity cost instead of treating "closed for modification" literally.

### Strategy / Factory distinction

**3 — APPLY (developing comparison depth)**

The user correctly used Strategy for behavioral variation and recognized that Factory is optional when selection is simple and centralized. Further verification should test Strategy vs State vs Factory in scenarios where all three appear superficially plausible.

## Next verification

- Compare Strategy, Factory, and State across similar frontend scenarios without pattern-name hints.
- Retest when a simple startup switch should remain local versus become a Factory/registry.
- Test OCP under multiple simultaneous analytics providers and provider-specific capability divergence.
