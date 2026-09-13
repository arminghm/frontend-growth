# OCP, Strategy, Factory, State & Adapter — Applied Evidence

Date: 2026-09-13

## Context

Applied analysis of analytics provider extension, file-upload Strategy/Factory/State composition, and a map-service Adapter boundary around Mapbox.

## Independent evidence

The user independently demonstrated the following:

- identified the analytics provider as the real variation/extension point,
- identified event tracking semantics (`track(event)`) as the stable core that application code should depend on,
- proposed a feature-facing `Analytics` contract with `track(event)` and separate concrete implementations for GA, Amplitude, and future providers,
- correctly applied Strategy reasoning: application code should depend on the stable analytics contract while concrete provider behavior varies behind it,
- correctly placed provider selection at application startup/configuration rather than leaking provider knowledge into feature code,
- rejected a registry as unnecessary for a system with exactly one active provider chosen at startup and a small known provider set,
- correctly reasoned that adding a Factory abstraction solely to move a simple startup switch into another file may not add meaningful value,
- recognized that adding Mixpanel should primarily add a new provider implementation and modify the startup selection/composition boundary rather than stable application tracking code,
- correctly identified `createUploader(provider)` as responsible for resolving/creating a concrete `FileUploader`,
- correctly identified the uploader implementations (`S3Uploader`, `CloudinaryUploader`, `LocalUploader`) as interchangeable behavioral strategies consumed through the `FileUploader` contract,
- correctly identified the upload lifecycle (`idle -> selectingFile -> uploading -> processing -> completed/failed`) as state-driven behavior with transitions and per-state allowed behavior,
- correctly composed all three roles in one feature: Factory-like selection provides a concrete uploader strategy, while the upload workflow/state machine owns lifecycle transitions and invokes the injected uploader while in the uploading phase,
- correctly identified a Mapbox-facing Adapter as a valuable boundary even before a confirmed MapLibre migration, because the frontend feature has its own stable `MapService` vocabulary while Mapbox exposes a foreign contract and data shape,
- correctly assigned coordinate translation (`Coordinate` -> `[lng, lat]`) to the Adapter rather than leaking Mapbox tuple semantics into feature/UI code,
- correctly framed the Adapter responsibility as translating the internal frontend contract to the third-party provider contract and localizing provider-specific knowledge.

## Corrections / refinements

- Frontend environment variables are often substituted at build time; true runtime provider selection requires a runtime configuration mechanism such as server-injected globals, a config endpoint/file, or equivalent deployment-time runtime config.
- A startup `switch` that selects a concrete implementation is already acting as a composition/selection boundary. Extracting it into a named Factory is optional; architectural role matters more than pattern name.
- OCP does not require zero modified files. Adding an implementation may legitimately modify the composition root/config mapping while leaving stable application logic unchanged.
- In Factory scenarios, the provider/type string is usually the selector/discriminator; the actual variation point is the family of concrete implementations behind the common contract.
- Strategy is not established merely by having an interface and multiple implementations. The consumer must actually delegate a variable behavior/algorithm to a selected implementation through that contract.
- For Adapter decisions, "the third-party API might change someday" is not sufficient evidence by itself. The stronger justification is current semantic/shape translation, localization of foreign concepts, or a meaningful provider boundary. Future migration risk strengthens the case but should not be the only reason.
- An Adapter should not become an oversized high-level façade. The internal `MapService` contract should contain only capabilities that the map feature genuinely needs and should avoid absorbing unrelated orchestration or domain workflows.
- The design would need reconsideration if multiple providers must run simultaneously, implementations become dynamically pluggable after startup, different features require different providers, capabilities diverge beyond the shared contract, or provider-specific semantics leak upward.

## Assessment

### OCP / Extension-point reasoning

**3 — APPLY**

The user independently distinguishes stable core from real variation points and avoids speculative extension mechanisms. The user balances OCP against complexity cost rather than treating "closed for modification" literally.

### Strategy / Factory / State comparison

**3-4 — APPLY/REASON (developing)**

The user independently distinguished creation/selection responsibility, interchangeable behavior, and lifecycle-driven behavior across similar scenarios and composed all three in a single frontend feature. Remaining refinement is precision around selector vs variation point and recognizing Strategy by delegation intent rather than interface shape alone.

### Adapter

**3-4 — APPLY/REASON (developing)**

The user independently identified a meaningful third-party translation boundary, localized coordinate/provider-specific knowledge correctly, and justified the Adapter from present coupling/isolation needs rather than requiring an active migration. Further verification should test Adapter vs Facade and cases where an Adapter would only add ceremony.

## Next verification

- Spaced retest Strategy/Factory/State without pattern-name cues.
- Retest when a simple startup switch should remain local versus become a Factory/registry.
- Test OCP under multiple simultaneous providers and capability divergence.
- Compare Adapter vs Facade on frontend orchestration and third-party integration scenarios.
- Test when direct third-party API use is simpler than introducing an Adapter.
- Continue with Facade, Observer, and Command, prioritizing modern frontend use cases and misuse trade-offs.
