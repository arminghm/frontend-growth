# OCP, Strategy, Factory, State, Adapter, Facade & Observer — Applied Evidence

Date: 2026-09-13

## Context

Applied analysis of analytics provider extension, file-upload Strategy/Factory/State composition, a map-service Adapter boundary around Mapbox, a profile-avatar Facade workflow, and login workflow decomposition into explicit core steps versus secondary Observer reactions.

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
- correctly framed the Adapter responsibility as translating the internal frontend contract to the third-party provider contract and localizing provider-specific knowledge,
- correctly identified that UI feedback such as `toast.success()` should generally remain outside a reusable avatar-update subsystem when different consumers may want different presentation behavior,
- identified the presigned-upload sequence (`create upload -> PUT binary -> confirm upload`) as a smaller coherent subsystem that can be hidden behind an upload abstraction,
- correctly reasoned that changing from presigned URL upload to a direct SDK should affect the upload boundary/implementation rather than the higher-level avatar-update workflow,
- correctly kept analytics behind its own abstraction and recognized backend DTO/response translation as Adapter responsibility at the API boundary,
- correctly proposed that compression, upload orchestration, analytics, and cache synchronization can form a higher-level avatar-update façade/orchestrator when the consumer should express only the intent to update the avatar,
- correctly classified access-token persistence, current-user loading, routing, and authenticated WebSocket startup as explicit core login workflow steps rather than Observer reactions,
- correctly identified ordering constraints: authenticated WebSocket startup may depend on token availability, so hiding both behind independent `user.loggedIn` subscribers would create a race/implicit temporal dependency,
- correctly classified analytics as a secondary reaction whose failure should not fail login,
- correctly recognized that an event bus does not remove coupling when consumers depend on the semantic event contract; it can merely make dependencies less visible and harder to trace,
- correctly chose Observer only for independent secondary reactions while keeping critical workflow dependencies explicit.

## Corrections / refinements

- Frontend environment variables are often substituted at build time; true runtime provider selection requires a runtime configuration mechanism such as server-injected globals, a config endpoint/file, or equivalent deployment-time runtime config.
- A startup `switch` that selects a concrete implementation is already acting as a composition/selection boundary. Extracting it into a named Factory is optional; architectural role matters more than pattern name.
- OCP does not require zero modified files. Adding an implementation may legitimately modify the composition root/config mapping while leaving stable application logic unchanged.
- In Factory scenarios, the provider/type string is usually the selector/discriminator; the actual variation point is the family of concrete implementations behind the common contract.
- Strategy is not established merely by having an interface and multiple implementations. The consumer must actually delegate a variable behavior/algorithm to a selected implementation through that contract.
- For Adapter decisions, "the third-party API might change someday" is not sufficient evidence by itself. The stronger justification is current semantic/shape translation, localization of foreign concepts, or a meaningful provider boundary. Future migration risk strengthens the case but should not be the only reason.
- An Adapter should not become an oversized high-level façade. The internal contract should contain only capabilities that the feature genuinely needs and should avoid absorbing unrelated orchestration or domain workflows.
- Merely moving the existing `updateAvatar` lines into another function/class called `AvatarFacade` is code movement, not necessarily a meaningful Facade. A Facade adds value when it removes subsystem knowledge from the consumer and exposes a smaller, cohesive intent-level API.
- `queryClient.invalidateQueries()` can reasonably live inside an application-level avatar-update Facade if cache consistency is part of completing the use case, but this couples the Facade to TanStack Query. If the boundary must remain framework/cache-library independent, cache synchronization should sit outside or behind a narrower cache/update port.
- A Facade becomes a God object when unrelated workflows accumulate behind it, its dependency surface expands across unrelated features, or many independent reasons to change converge in one central service.
- Notification badge refresh is context-dependent: it is secondary if stale badge data is temporarily acceptable, but may be part of required dashboard initialization if the product contract requires it before the post-login screen is considered ready.
- Observer is a poor fit for steps with required ordering, required success, or data dependencies between consumers; those should remain explicit orchestration.
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

The user independently identified meaningful third-party translation boundaries, localized provider-specific knowledge correctly, and justified Adapter usage from present coupling/isolation needs. Further verification should test cases where an Adapter would only add ceremony.

### Facade

**3 — APPLY (developing REASON)**

The user independently separated UI feedback from subsystem orchestration, identified a coherent upload subsystem, and reasoned about preserving the higher-level avatar-update workflow across upload-provider changes. The main refinement is distinguishing a true Facade boundary from merely relocating the same implementation and deciding whether cache-library details belong inside the application-level facade.

### Observer

**3-4 — APPLY/REASON (developing)**

The user independently separated critical ordered login steps from independent secondary reactions, identified hidden semantic and temporal coupling introduced by a global event bus, and correctly reasoned about failure isolation. Further verification should cover event ordering, unsubscribe/lifecycle concerns, and Observer vs explicit store/state communication.

## Next verification

- Spaced retest Strategy/Factory/State without pattern-name cues.
- Retest when a simple startup switch should remain local versus become a Factory/registry.
- Test OCP under multiple simultaneous providers and capability divergence.
- Compare Adapter vs Facade on fresh frontend scenarios.
- Test when direct third-party API use is simpler than introducing an Adapter.
- Retest Facade vs orchestration/service boundaries, including cache and UI-side effects.
- Retest Observer against store/state communication and ordering/lifecycle failures.
- Continue with Command, prioritizing modern frontend use cases and misuse trade-offs.
