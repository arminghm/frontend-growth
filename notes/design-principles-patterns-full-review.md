# Design Principles & Patterns — Full Review Notes

> A complete review of the Design Principles & Patterns block for Senior Frontend interview preparation.
>
> The goal of this file is to support revision, pre-interview review, and precise differentiation between principles, patterns, responsibilities, trade-offs, and failure modes.

---

## Table of Contents

1. Coupling vs Cohesion
2. GRASP & Responsibility Assignment
3. SOLID in Frontend
   - SRP
   - OCP
   - LSP
   - ISP
   - DIP
4. Strategy / Factory / State
5. Adapter
6. Facade
7. Observer
8. Command
9. Mediator
10. Composite
11. Cross-pattern mental map
12. Common over-engineering traps
13. Corrections and gaps discovered during the sessions
14. Current proficiency summary
15. Spaced-retest checklist
16. Concise interview answers

---

# 1. Coupling vs Cohesion

## Mental model

### Cohesion

`Cohesion` describes how strongly the responsibilities inside a boundary belong to the same purpose or concept.

Diagnostic question:

> How many independent reasons are there for this boundary to change?

If a component simultaneously:

- owns form state,
- performs validation,
- reads a token from `localStorage`,
- performs an HTTP request,
- knows the backend DTO,
- synchronizes a global store,
- sends analytics,
- shows a toast,

then its cohesion has probably dropped.

### Coupling

`Coupling` describes how much knowledge or dependency one boundary has about other boundaries.

Diagnostic question:

> What does this part know that it ideally should not need to know?

Coupling is not just about imports. It can include:

- API shape
- backend DTOs
- store shape
- `localStorage` key conventions
- external provider APIs
- temporal ordering
- component contracts
- event names
- runtime protocols

## The actual goal

The goal is:

```text
High cohesion
+
Appropriate / low accidental coupling
```

The goal is **not zero coupling**.

A boundary should still be coupled to what it genuinely needs in order to fulfill its responsibility.

## ProfileForm example

Problematic version:

```ts
async function submitProfile(values: ProfileValues) {
  const token = localStorage.getItem("token");

  const response = await fetch("/api/profile", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      first_name: values.firstName,
      last_name: values.lastName,
    }),
  });

  const user = await response.json();

  userStore.setUser(user);

  gtag("event", "profile_updated");

  toast.success("Profile updated");
}
```

The main issue is not that the function is long. The issue is that multiple independent responsibilities have accumulated inside one boundary.

A better design might expose:

```ts
type ProfileFormProps = {
  initialValues: ProfileValues;
  onSubmit(values: ProfileValues): Promise<void>;
};
```

`ProfileForm` can still cohesively own:

- local form state
- dirty state
- field validation
- submit UX
- loading / disabled state

But it does not necessarily need to know:

- the endpoint,
- where the auth token lives,
- the backend DTO shape,
- which analytics provider is used.

## Important correction

Simply moving code from a component into `utils.ts` does not fix coupling or responsibility assignment.

```text
Move code != improve design
```

The new boundary needs a meaningful responsibility.

---

# 2. GRASP & Responsibility Assignment

We treated GRASP as a collection of responsibility-assignment heuristics rather than a set of definitions to memorize.

## 2.1 Information Expert

Assign a responsibility to the part that has the information required to fulfill it.

Examples:

- an API adapter is the expert for HTTP/DTO concerns,
- a feature orchestrator is the expert for sequence/use-case flow.

These are not the same responsibility.

### Common gap discovered

Initially there was a tendency to blur `Information Expert` and orchestration together.

Correction:

```text
Knowing data/transport details
!=
Owning workflow coordination
```

## 2.2 Controller

In frontend architecture, we did not limit Controller to the MVC definition.

Mental model:

> A boundary that receives a system event / user intent and coordinates the flow.

For example:

```ts
function useProductSearch() {
  async function search(query: string) {
    // call API
    // map result
    // update state
    // secondary reactions
  }

  return { search };
}
```

If the hook performs the flow itself:

```text
Page detects/delegates intent
Hook/feature action orchestrates
```

## 2.3 Low Coupling / High Cohesion

These are desirable outcomes of responsibility assignment, not mechanical rules that require every file to be tiny.

## 2.4 Indirection

Sometimes we introduce an intermediary dependency so two boundaries do not depend directly on one another.

But indirection has a cost:

- more files
- more interfaces
- more navigation
- testing overhead
- cognitive overhead

So ask:

> Is the variation real and meaningful, or merely speculative?

## 2.5 Protected Variations

A real variation point can be hidden behind a boundary so that change does not leak into stable core logic.

Valid examples:

- third-party analytics provider
- Mapbox/MapLibre provider
- payment provider
- upload provider

### Important gap discovered

In several early answers there was a tendency to abstract any dependency that *might* change someday.

Correction:

Variation should have at least one meaningful justification such as:

- currently different semantics or shape
- likely/probable variation
- reused across implementations
- expensive change cost
- third-party contract leakage
- a meaningful domain boundary

Future possibility alone is not enough.

## ProductSearch GRASP example

The scenario contained:

- search input/state
- HTTP fetch
- backend mapping
- analytics
- storage
- rendering

A defensible responsibility split is:

```text
SearchPage / SearchView
    ↓ user intent
Search feature/controller
    ↓
Products API adapter
    ↓ DTO -> model

Secondary dependencies:
Analytics
Persistence
```

### DTO correction

Backend response data is the DTO.

Mapping usually looks like:

```text
DTO -> frontend/domain/UI model
```

The UI model itself should not automatically be called a DTO.

---

# 3. SOLID in Frontend

---

# 3.1 SRP — Single Responsibility Principle

Weak definition:

> Every function should do one thing.

Better mental model:

> A boundary should have closely related reasons to change, rather than multiple independent policies, actors, or concerns.

## Responsibility depends on abstraction level

A page can orchestrate several steps and still be cohesive if its higher-level responsibility is something like:

```text
Handle checkout submission
```

## OrderHistory example

The scenario included:

- reading the user
- fetching orders
- mapping backend fields
- filtering by status
- exporting CSV
- rendering

Analysis:

`status filtering` may be a presentation policy that belongs naturally to OrderHistory and can remain local.

But:

```text
HTTP/endpoint/DTO mapping
```

has an independent reason to change.

CSV extraction should also not be decided primarily by reuse.

### Important correction

```text
Reuse != primary SRP criterion
```

Something used only once can still deserve separation if it has an independent reason to change.

For example, CSV export format may evolve independently of the page.

---

# 3.2 DIP — Dependency Inversion Principle

Mental model:

> High-level policy should depend on a contract expressed in its own language, rather than copying the shape of a low-level dependency.

## Article draft example

Direct implementation:

```ts
function saveDraft(articleId: string, draft: ArticleDraft) {
  localStorage.setItem(
    `article:${articleId}:draft`,
    JSON.stringify(draft)
  );
}
```

Tempting generic abstraction:

```ts
interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
```

This abstraction still couples callers to:

- key-value storage semantics
- strings
- key naming
- serialization

A feature-owned contract can be better:

```ts
interface ArticleDraftRepository {
  save(articleId: string, draft: ArticleDraft): void;
  load(articleId: string): ArticleDraft | null;
}
```

Now the high-level code depends on its own domain language.

## Two-layer abstraction

If there are genuinely multiple key-value backends:

```text
useDraftArticle
    ↓
ArticleDraftRepository
    ↓
KeyValueStorage
    ↓
LocalStorageAdapter / IndexedDBAdapter
```

this can make sense.

But only when each variation point adds real value.

## Important corrections

- Domain-specific coupling is not automatically bad; it is often desirable.
- A generic abstraction does not automatically reduce coupling.
- Direct `localStorage` can be completely acceptable for a small, stable, local-only feature.
- Cookies are not automatically a drop-in replacement for key-value storage because their semantics differ.

---

# 3.3 ISP — Interface Segregation Principle

Mental model:

> A consumer should not depend on capabilities it does not need.

Problematic contract:

```ts
interface ProductDataSource {
  search(query: string): Promise<Product[]>;
  getById(id: string): Promise<Product>;
  create(input: ProductInput): Promise<Product>;
  update(id: string, input: ProductInput): Promise<Product>;
  delete(id: string): Promise<void>;
  subscribeToStock(id: string, cb: StockHandler): () => void;
}
```

Consumers:

```text
SearchPage -> search
ProductDetails -> getById + subscribeToStock
AdminEditor -> getById + create/update/delete
```

A single large interface unnecessarily couples consumers to unrelated capabilities.

A better split may be:

```ts
interface ProductReader {
  getById(id: string): Promise<Product>;
}

interface ProductSearchDataSource {
  search(query: string): Promise<Product[]>;
}

interface ProductStockSource {
  subscribeToStock(
    id: string,
    cb: StockHandler
  ): () => void;
}

interface ProductEditor {
  create(input: ProductInput): Promise<Product>;
  update(id: string, input: ProductInput): Promise<Product>;
  delete(id: string): Promise<void>;
}
```

Composition:

```ts
type ProductDetailsDependencies =
  ProductReader & ProductStockSource;

type AdminProductEditorDependencies =
  ProductReader & ProductEditor;
```

## Important correction

This design is problematic:

```ts
interface AdminDataSource
  extends ProductDetailsDataSource {}
```

If `ProductDetailsDataSource` also contains `subscribeToStock`, then Admin receives a capability it does not need and ISP is violated again.

## Another correction

Two bad extremes are:

```text
One giant interface
```

and:

```text
One generic interface per method:
Readable / Writable / Searchable / Subscribable
```

The goal is:

> the smallest meaningful consumer contract

not the smallest possible type.

---

# 3.4 LSP — Liskov Substitution Principle

Mental model:

> Type compatibility is not enough; a replacement must preserve the observable behavioral contract.

```text
Type-compatible
!=
Behaviorally substitutable
```

Frontend contexts include:

- components
- adapters
- repositories
- hooks
- strategies
- mocks
- platform implementations

## Preconditions

A replacement must not require stronger preconditions than the contract implies.

If the contract says:

```ts
search(query: string): Promise<Result>
```

and a new implementation throws whenever the query is shorter than three characters without that rule being part of the contract, then it has strengthened the precondition.

## Postconditions

A replacement must not weaken the guarantees promised by the contract.

## UserPreferencesStore example

Contract:

```ts
interface UserPreferencesStore {
  load(): Promise<UserPreferences>;
  save(preferences: UserPreferences): Promise<void>;
}
```

Local implementation:

```ts
class LocalPreferencesStore
  implements UserPreferencesStore {
  async load() {
    const raw = localStorage.getItem("preferences");

    return raw
      ? JSON.parse(raw)
      : DEFAULT_PREFERENCES;
  }

  async save(preferences: UserPreferences) {
    localStorage.setItem(
      "preferences",
      JSON.stringify(preferences)
    );
  }
}
```

Problematic remote implementation:

```ts
class RemotePreferencesStore
  implements UserPreferencesStore {
  async load() {
    const response = await fetch("/api/preferences");

    if (response.status === 404) {
      throw new Error("Preferences not initialized");
    }

    return response.json();
  }

  async save(preferences: UserPreferences) {
    const response = await fetch("/api/preferences", {
      method: "PUT",
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      console.error("Save failed");
      return;
    }
  }
}
```

### `load()` problem

The local implementation treats missing data as:

```text
return defaults
```

while the remote implementation:

```text
throws
```

The consumer-visible semantics differ.

### `save()` subtle problem

The remote implementation merely logs on failure and still resolves.

A caller doing:

```ts
await store.save(preferences);
```

will naturally interpret successful resolution as a successful save.

So the postcondition has been weakened.

## Better explicit contract

For example:

```ts
type LoadPreferencesResult =
  | {
      status: "success";
      preferences: UserPreferences;
    }
  | {
      status: "missing";
    }
  | {
      status: "error";
      error: PreferencesError;
    };
```

Or the contract can clearly define rejection semantics.

### Important TypeScript correction

`Promise<UserPreferences>` does not itself guarantee that the Promise cannot reject.

The real issue is the semantic contract, not only the type signature.

### Gap discovered

The `load()` incompatibility was identified independently, but the subtler `save()` postcondition issue was initially missed and required correction.

---

# 3.5 OCP — Open/Closed Principle

Slogan version:

> Open for extension, closed for modification.

Better mental model:

> For real and expected variations, design the stable core so that adding a capability does not repeatedly force changes into stable logic.

The key ideas are:

```text
Stable core
+
Meaningful variation point
```

## OCP does not mean zero modification

Configuration, registries, or the composition root may legitimately change.

The goal is to keep stable behavior stable.

## Analytics example

Initial implementation:

```ts
function track(
  provider: "ga" | "amplitude",
  event: AnalyticsEvent
) {
  if (provider === "ga") {
    window.gtag("event", event.name, event.payload);
    return;
  }

  if (provider === "amplitude") {
    amplitude.track(event.name, event.payload);
  }
}
```

Requirements:

- GA / Amplitude now
- Mixpanel likely later
- enterprise custom providers
- application code must not know the provider
- one provider per deployment
- provider selected at startup/configuration

Stable contract:

```ts
interface Analytics {
  track(event: AnalyticsEvent): void;
}
```

Concrete implementations:

```ts
class GoogleAnalytics implements Analytics {}
class AmplitudeAnalytics implements Analytics {}
class MixpanelAnalytics implements Analytics {}
```

Application code:

```ts
analytics.track(event);
```

## Factory / Registry decision

In this scenario:

- Strategy-like provider implementations are appropriate.
- A startup switch is enough.
- A dedicated Factory class does not necessarily add value.
- A Registry is probably over-engineering if there is only one active provider and the known set is small.

### Important correction

The `provider` string is mostly a selector/discriminator.

The real variation point is:

```text
the family of Analytics implementations
```

### Runtime config correction

In frontend applications, `import.meta.env` is usually substituted at build time.

True runtime selection needs something like:

- server-injected globals
- a runtime config file
- a config endpoint

## OCP and extension-point trade-off

Extension points cost something:

- interfaces
- wiring
- registration
- testing
- indirection
- conceptual overhead

Therefore:

```text
possible variation
!=
automatic extension point
```

---

# 4. Strategy / Factory / State

These three are easy to confuse.

## Mental map

```text
Strategy:
How should I perform this behavior?

Factory:
Which concrete implementation/object should I create or resolve?

State:
Given my current lifecycle state, what behavior/transition is valid now?
```

---

## 4.1 Strategy

Example:

```ts
interface FileUploader {
  upload(file: File): Promise<UploadedFile>;
}
```

Implementations:

```text
S3Uploader
CloudinaryUploader
LocalUploader
```

Consumer:

```ts
function uploadFile(
  file: File,
  uploader: FileUploader
) {
  return uploader.upload(file);
}
```

Important point:

The existence of an interface and multiple implementations alone does not automatically make something Strategy.

Strategy becomes meaningful when the consumer **delegates variable behavior** to the selected implementation.

---

## 4.2 Factory

```ts
function createUploader(
  provider: "s3" | "cloudinary" | "local"
): FileUploader {
  switch (provider) {
    case "s3":
      return new S3Uploader();
    case "cloudinary":
      return new CloudinaryUploader();
    case "local":
      return new LocalUploader();
  }
}
```

Responsibility:

```text
selection / creation knowledge
```

A Factory does not magically remove the switch.

It localizes knowledge about concrete creation/selection.

Factory alone does not guarantee OCP.

---

## 4.3 State

Upload lifecycle:

```text
idle
→ selectingFile
→ uploading
→ processing
→ completed / failed
```

Behavior changes according to the current lifecycle state.

For example, `SUBMIT` may be valid in `idle/editing` but ignored in `submitting`.

Mental shortcut:

```text
Strategy = How?
State = What can I do now?
```

## All three together

```text
Factory
→ selects S3Uploader

Strategy
→ uploader performs upload behavior

State
→ upload workflow owns lifecycle/transitions
```

These patterns are not substitutes for one another.

---

# 5. Adapter

Mental model:

> Translate a foreign/external contract into the internal contract the system wants to use.

```text
Foreign API
   ↓
Adapter
   ↓
Internal contract
```

## DTO example

Backend:

```ts
type UserDTO = {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
};
```

Frontend:

```ts
type User = {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
};
```

Adapter/mapper:

```ts
function adaptUser(dto: UserDTO): User {
  return {
    id: dto.user_id,
    firstName: dto.first_name,
    lastName: dto.last_name,
    avatarUrl: dto.avatar_url ?? null,
  };
}
```

## Mapbox example

Internal contract:

```ts
interface MapService {
  showRoute(
    origin: Coordinate,
    destination: Coordinate
  ): Promise<Route>;

  fitBounds(bounds: Bounds): void;
}
```

Mapbox-specific tuple shape:

```ts
mapboxDirections.getRoute({
  coordinates: [
    [origin.lng, origin.lat],
    [destination.lng, destination.lat],
  ],
});
```

The mapping should remain inside the Adapter.

```ts
class MapboxMapService implements MapService {
  async showRoute(
    origin: Coordinate,
    destination: Coordinate
  ): Promise<Route> {
    const result = await mapboxDirections.getRoute({
      coordinates: [
        [origin.lng, origin.lat],
        [destination.lng, destination.lat],
      ],
    });

    return mapRoute(result);
  }
}
```

## Important reasoning demonstrated

Even without a confirmed migration to MapLibre, the Adapter may already be valuable because it isolates foreign shape and semantics **today**.

Future migration is only an additional justification.

## Adapter misuse

If we merely mirror another API:

```ts
class FetchAdapter {
  get(url: string) {
    return fetch(url);
  }
}
```

without semantic isolation or translation, the abstraction may be ceremony.

### Important rule

Build the contract from feature needs, not from the provider's method list.

Bad example:

```ts
interface MapService {
  fitBounds(): void;
  flyTo(): void;
  easeTo(): void;
  setPitch(): void;
  setBearing(): void;
  addLayer(): void;
  addSource(): void;
}
```

if this is just a copy of the Mapbox API.

---

# 6. Facade

Mental model:

> Hide a complex subsystem behind a simpler, intent-level API.

Facade differs from Adapter:

```text
Adapter = translate interface/contract
Facade  = simplify subsystem knowledge
```

## Checkout example

Without a Facade:

```text
Component
→ validate cart
→ create order
→ payment
→ invalidate cache
→ clear cart
→ analytics
→ navigation
```

Facade:

```ts
interface CheckoutService {
  submit(input: CheckoutInput): Promise<CheckoutResult>;
}
```

The consumer only expresses intent.

## Avatar update example

Initial flow:

```ts
async function updateAvatar(file: File) {
  const compressed =
    await imageCompressor.compress(file);

  const { uploadUrl, fileId } =
    await profileApi.createAvatarUpload();

  await fetch(uploadUrl, {
    method: "PUT",
    body: compressed,
  });

  await profileApi.confirmAvatar(fileId);

  await queryClient.invalidateQueries({
    queryKey: ["current-user"],
  });

  analytics.track({
    name: "avatar_updated",
  });

  toast.success("Avatar updated");
}
```

### Good responsibility split

UI concern:

```text
toast
```

can stay in the component.

Upload subsystem:

```text
create upload session
→ PUT binary
→ confirm upload
```

can live behind:

```ts
interface AvatarUploader {
  upload(file: Blob): Promise<UploadedAvatar>;
}
```

Higher-level facade/orchestrator:

```ts
class AvatarUpdater {
  constructor(
    private compressor: ImageCompressor,
    private uploader: AvatarUploader,
    private analytics: Analytics,
    private currentUserCache: CurrentUserCache
  ) {}

  async update(file: File): Promise<void> {
    const compressed =
      await this.compressor.compress(file);

    await this.uploader.upload(compressed);
    await this.currentUserCache.refresh();

    this.analytics.track({
      name: "avatar_updated",
    });
  }
}
```

Component:

```ts
await avatarUpdater.update(file);
toast.success("Avatar updated");
```

## Important correction: code movement is not Facade value

If we simply move the same lines from function A into class B:

```text
No knowledge removed
No smaller contract
No cohesive boundary
```

we have only moved code.

A Facade adds value when the consumer no longer needs to know subsystem details.

## God Facade smell

```ts
class UserFacade {
  updateAvatar() {}
  updateProfile() {}
  changePassword() {}
  enable2FA() {}
  updateBilling() {}
  cancelSubscription() {}
}
```

Problems:

- unrelated reasons to change
- huge dependency surface
- low cohesion

A shared noun such as `User` is not enough reason to put everything behind one boundary.

## Query cache trade-off

`queryClient.invalidateQueries()` can reasonably live inside an application-level Facade if cache consistency is part of use-case completion.

But this couples the Facade to TanStack Query.

If independence matters:

```ts
interface CurrentUserCache {
  refresh(): Promise<void>;
}
```

may be preferable.

But this abstraction should only exist if its maintenance cost is justified.

---

# 7. Observer

Mental model:

> When an event/change occurs and multiple independent consumers should be notified without the publisher knowing each concrete consumer.

```text
Publisher
   ↓ event
Observers independently react
```

## Example

```ts
events.emit({
  type: "order.created",
  orderId,
});
```

Subscribers:

```ts
events.on("order.created", trackAnalytics);
events.on("order.created", updateActivityFeed);
```

## Observer does not remove coupling

Coupling becomes:

```text
publisher
→ event contract
← subscriber
```

So semantic coupling still exists.

## Hidden coupling problem

If we turn a core workflow into an event chain:

```text
order.created
→ payment observer
payment.completed
→ confirmation observer
order.confirmed
→ clear cart observer
```

the flow becomes harder to trace.

## Core vs secondary reactions

Very important rule:

```text
Core consequence / required ordering
→ explicit orchestration

Secondary independent reaction
→ Observer candidate
```

## Login exercise

Steps:

1. save access token
2. fetch current user
3. route to dashboard
4. analytics
5. start WebSocket
6. refresh notification badge

Correct analysis:

Core:

- token persistence
- current user load
- authenticated WebSocket startup
- navigation, depending on flow contract

Secondary:

- analytics
- notification refresh if temporary staleness is acceptable

### Temporal coupling discovered

WebSocket may require the token.

Therefore:

```text
save token
→ then connect WebSocket
```

If both are independent subscribers, a race can occur.

### Failure semantics

Analytics failure should not fail login.

Token persistence failure may prevent login completion.

## Observer vs React data flow

A global event bus should not be introduced merely to avoid props or normal state ownership.

First consider:

- state ownership
- props
- Context
- store
- router state

An event bus can make data flow invisible.

## Lifecycle risks

Observers usually require cleanup:

```ts
useEffect(() => {
  const unsubscribe = events.subscribe(...);
  return unsubscribe;
}, []);
```

Otherwise you may get:

- duplicate listeners
- stale closures
- memory leaks
- unexpected side effects

---

# 8. Command

Mental model:

> Give an executable intent/action a first-class representation so it can be independently triggered, queued, retried, logged, undone, or bulk executed.

## Callback vs Command

This is just a callback:

```tsx
<button onClick={() => save()} />
```

Command becomes valuable when an action needs metadata or lifecycle management.

For example:

```ts
interface Command {
  id: string;
  label: string;
  canExecute(): boolean;
  execute(): Promise<void>;
}
```

Triggers:

```text
Row menu
Command palette
Keyboard shortcut
Bulk toolbar
        ↓
      Command
```

## Admin actions example

```text
Approve User
Suspend User
Delete User
Reset Password
Export User Data
```

The same intents can be invoked from several surfaces.

This meaningfully justifies Command.

## Command vs Event

```text
Command = intent/request
Event   = fact that already happened
```

Examples:

```text
SuspendUserCommand
user.suspended
```

The first means:

> Perform this action.

The second means:

> This happened.

## Permission / authorization

`canExecute()` in the frontend can be useful for capability/UX checks:

```ts
if (!command.canExecute()) {
  disableAction();
}
```

But it is not a security boundary.

The backend must still enforce real authorization.

## Confirmation distinction

Pre-execution UI confirmation:

```text
Are you sure you want to suspend this user?
```

is usually an invoker/UI concern.

Post-execution verification:

> Did the operation actually complete successfully?

is part of command/use-case completion semantics.

These two should not be conflated.

## Analytics

Cross-cutting analytics does not necessarily belong hardcoded inside every Command.

It can live in a decorator or orchestrator.

```text
Analytics wrapper
    ↓
Command.execute()
```

## Bulk execution

Command makes bulk execution possible, but the pattern does not define the execution policy.

You still need to decide:

- sequential vs parallel
- fail-fast vs continue
- partial success semantics
- retry
- rollback

## Over-engineering

For a simple local interaction:

```ts
setOpen(true)
```

creating:

```text
OpenModalCommand
CloseModalCommand
ToggleDropdownCommand
```

is probably ceremony.

---

# 9. Mediator

Mental model:

> When several peers/components participate in shared coordination rules, centralize the coordination policy instead of letting every peer talk directly to every other peer.

## Booking example

Components:

```text
OriginSelector
DestinationSelector
DatePicker
PassengerSelector
PricePreview
SearchButton
```

Problematic shape:

```text
OriginSelector knows DestinationSelector
OriginSelector knows PricePreview
OriginSelector knows SearchButton
...
```

Mediator-like boundary:

```text
Components
    ↓
Booking coordinator / shared owner
    ↓
coordination policy
```

In modern frontend code, this does not require a class.

The Mediator role can be played by:

- a custom hook
- a state machine
- a feature controller
- a provider
- a shared state owner

## Mediator vs Observer

Observer:

```text
A happened
→ B/C/D independently react
```

Mediator:

```text
A changed
→ mediator applies coordination policy
→ decides effects on B/C/D
```

If ordering or coordination rules matter, Mediator is usually a better fit.

## Dashboard resize example

Resize requires:

- layout recalculation
- neighbor resizing
- grid constraint validation
- autosave scheduling

These concerns are coordinated, so a Mediator-like boundary is appropriate.

Analytics should remain outside the mediator core if it is only a secondary observation.

## God Mediator smell

```ts
class AppMediator {
  login() {}
  checkout() {}
  search() {}
  profile() {}
  notifications() {}
}
```

This destroys cohesion.

A Mediator should remain subsystem-specific.

---

# 10. Composite

Mental model:

> Model a recursive whole/part structure so leaf nodes and grouped nodes can be treated through a common model or operation.

## Dashboard tree

```text
Dashboard
├── Row
│   ├── Chart
│   └── Table
└── Row
    └── Column
        ├── Metric
        └── Chart
```

This is a recursive whole/part structure.

## Menu example

```ts
type MenuNode =
  | {
      type: "item";
      label: string;
      href: string;
    }
  | {
      type: "group";
      label: string;
      children: MenuNode[];
    };
```

Recursive renderer:

```tsx
function MenuNodeView({ node }: { node: MenuNode }) {
  if (node.type === "item") {
    return <a href={node.href}>{node.label}</a>;
  }

  return (
    <section>
      <h4>{node.label}</h4>

      {node.children.map(child => (
        <MenuNodeView
          key={/* stable key */}
          node={child}
        />
      ))}
    </section>
  );
}
```

## Composite misuse

Having an array or nested JSX is not enough.

```text
ordinary collection
!=
Composite
```

The pattern is meaningful when recursive whole/part semantics genuinely exist.

---

# 11. Cross-pattern mental map

| Concept | Core question |
|---|---|
| Cohesion | Do the responsibilities inside this boundary genuinely belong to one purpose? |
| Coupling | What unnecessary knowledge does this boundary have about other parts? |
| GRASP | Who should own this responsibility, and why? |
| SRP | What independent reasons to change exist here? |
| DIP | Does high-level policy depend on its own contract or on the shape of a low-level dependency? |
| ISP | Is a consumer forced to depend on capabilities it does not need? |
| LSP | Does the replacement preserve the observable behavioral contract? |
| OCP | Where is the stable core and where is the real variation point? |
| Strategy | Which behavior/algorithm should perform this operation? |
| Factory | Which implementation should be created/resolved? |
| State | Given the current lifecycle state, what behavior/transition is valid now? |
| Adapter | How do I translate a foreign contract into the internal contract I want? |
| Facade | How do I simplify a cohesive complex subsystem for the consumer? |
| Observer | Which independent consumers should react to an event? |
| Command | How do I make an executable intent first-class? |
| Mediator | Where should coordination between peers be centralized? |
| Composite | How do I model a recursive whole/part structure uniformly? |

---

# 12. Common Over-engineering Traps

## 12.1 Interface around everything

```text
Every dependency
→ interface
→ adapter
→ factory
→ registry
```

That is not design discipline. It is often ceremony.

## 12.2 Speculative abstraction

> Maybe this will change later.

That alone is not enough justification.

## 12.3 Factory around a trivial constructor

```ts
function createUser() {
  return new User();
}
```

If there is no real creation or selection complexity, a Factory adds little value.

## 12.4 Registry when a startup switch is enough

If:

- the implementation set is small,
- exactly one implementation is active,
- there are no runtime plugins,

then a switch in the composition root may be the clearest design.

## 12.5 Event bus to avoid explicit dependencies

The dependency did not disappear; traceability just got worse.

## 12.6 Facade as code relocation

Moving the same complexity into a new class is not automatically an improvement.

## 12.7 Generic abstraction over a domain contract

Sometimes:

```ts
Storage.getItem/setItem
```

is worse than:

```ts
ArticleDraftRepository.save/load
```

because the generic abstraction still leaks low-level semantics.

## 12.8 Tiny interfaces for every method

ISP means consumer-focused contracts, not meaningless fragmentation.

## 12.9 Command for every click

For simple local interaction, a callback or state update is enough.

## 12.10 State machine for boolean UI

```ts
const [isOpen, setIsOpen] = useState(false);
```

does not need:

```text
ClosedState
OpenState
StateFactory
```

---

# 13. Corrections and Gaps Discovered During the Sessions

This section captures the most important points that required refinement or correction during the discussions.

## Coupling / GRASP

- `Information Expert` is not the same as the orchestrator.
- Moving code into a helper does not automatically improve responsibility assignment.
- Protected Variation should not be introduced only because something *might* change someday.
- Orchestration ownership should be explicit.

## DTO / Mapping

- Backend response data is the DTO.
- A mapper typically converts DTO -> frontend/domain/UI model.

## SRP

- Reuse is not the primary extraction criterion.
- A concern may have only one consumer and still deserve separation if it has an independent reason to change.

## DIP

- Generic abstraction does not automatically mean lower coupling.
- Domain-specific coupling is often desirable.
- Direct use of a low-level dependency is sometimes the simplest correct design.

## ISP

- Interface inheritance can accidentally reintroduce unwanted capabilities.
- Page-specific naming should not unnecessarily lock a shared semantic capability to a UI page name.

## LSP

- The `load()` incompatibility was identified independently.
- The subtler `save()` postcondition issue was initially missed.
- Promise types alone do not express failure semantics.

## OCP

- A provider string is usually the selector; the implementation family is the variation point.
- OCP does not mean zero modifications anywhere.
- Factory alone does not guarantee OCP.
- A Registry is not always a better design.

## Strategy / Factory / State

- Strategy is not defined by the existence of an interface; delegation intent matters.
- Factory owns creation/selection.
- State is about lifecycle/current-state-driven behavior.

## Adapter

- Future migration alone is not enough justification.
- Current translation and isolation can be the main value.
- An Adapter should not mirror an external API one-to-one without purpose.

## Facade

- Code relocation is not the same as a useful Facade.
- Cache invalidation inside a Facade is a trade-off because it can introduce library coupling.
- God Facade is a major risk.

## Observer

- An event bus does not eliminate coupling; semantic coupling remains.
- Core ordered workflows should not be fragmented into events merely for the appearance of decoupling.
- Ordering, failure isolation, and lifecycle/unsubscribe behavior matter.

## Command

- Frontend permission checks are not the security boundary.
- Pre-execution confirmation differs from post-execution verification.
- Bulk execution policy must be explicit.

## Mediator

- Analytics should not be folded into the mediator automatically if it is only a secondary reaction.
- A Mediator should remain subsystem-specific.

## Composite

- Nesting or arrays alone do not imply Composite.
- Recursive whole/part semantics are the important signal.

---

# 14. Current Proficiency Summary

Current overall skill assessment:

```text
Design Principles & Patterns
3 — APPLY (developing REASON)
```

Reason for not upgrading to `4 — REASON` yet:

- the first pass was strong and applied,
- transfer still needs to be demonstrated in spaced retests with fresh scenarios and no pattern-name cues,
- some corrected details still need to be reproduced independently without hints.

### Strong evidence so far

- coupling/cohesion in realistic frontend scenarios
- responsibility-boundary reasoning
- applied SRP/DIP/ISP/LSP
- OCP stable-core vs variation-point reasoning
- Strategy/Factory/State differentiation
- Adapter/Facade boundaries
- Observer vs explicit orchestration
- Command vs Event
- Mediator coordination
- Composite tree modeling

---

# 15. Spaced-Retest Checklist

Topics that should reappear later without hints:

- coupling/cohesion in a fresh feature
- GRASP Information Expert vs Controller/orchestrator
- abstraction threshold: direct dependency vs port/adapter
- SRP without using reuse as the main extraction criterion
- DIP where a generic abstraction is tempting
- ISP composition/inheritance
- LSP postconditions and error semantics
- OCP with dynamic plugin/registry requirements
- Strategy vs Factory vs State without names
- Adapter vs direct third-party use
- Adapter vs Facade
- Facade vs orchestration/service
- Observer vs store/state communication
- Observer ordering/lifecycle failures
- Command vs callback/action/event
- Command bulk failure semantics
- Mediator vs ordinary shared state ownership
- Composite vs normal collections/nested JSX

---

# 16. Concise Senior-Level Interview Answers

## Coupling vs Cohesion

> Cohesion asks whether responsibilities inside a boundary belong to the same purpose. Coupling asks how much that boundary knows about other parts of the system. I optimize for cohesive boundaries and minimal accidental coupling, not zero coupling.

## SRP

> SRP is not one function doing one tiny thing. I look for independent reasons to change at the chosen abstraction level. A feature-level orchestrator can legitimately coordinate several steps if they all belong to the same use case.

## DIP

> High-level code should depend on a contract expressed in its own vocabulary rather than on the shape of a low-level mechanism. I avoid adding generic interfaces that merely mirror `localStorage`, `fetch`, or another dependency unless that abstraction represents a real variation point.

## ISP

> I design interfaces from consumer needs. A consumer should not receive capabilities it does not use, but I also avoid mechanical one-method interfaces when a meaningful role belongs together.

## LSP

> A replacement must preserve behavioral expectations, not just TypeScript compatibility. I check preconditions, postconditions, failure semantics, side effects, and observable timing/behavior where relevant.

## OCP

> I identify a stable core and real variation points. OCP means expected extensions should not repeatedly force changes to stable business logic; it does not mean no file can ever be modified.

## Strategy

> Strategy represents interchangeable ways to perform a behavior. The consumer delegates the behavior to the selected implementation.

## Factory

> Factory localizes creation or concrete implementation selection. It may still change when a new implementation is added; its value is concentrating creation knowledge, not magically eliminating change.

## State

> State is appropriate when behavior and valid transitions depend on the object's current lifecycle state.

## Adapter

> Adapter translates a foreign or incompatible contract into the internal contract the application wants to use, localizing provider-specific shape and semantics.

## Facade

> Facade gives a simpler entry point to a cohesive complex subsystem. It is valuable when it removes subsystem knowledge from the consumer, not when it merely moves the same lines into another class.

## Observer

> Observer is useful for independent reactions to an event. I avoid using it for core workflows with required ordering or success semantics because it makes dependencies and temporal coupling harder to see.

## Command

> Command makes an executable intent first-class, which is useful for command palettes, queues, retries, undo, bulk execution, logging, or multiple invokers. I do not use it for every local click handler.

## Mediator

> Mediator centralizes coordination policy between peer components or subsystem participants so they do not all know about each other directly.

## Composite

> Composite is useful for recursive whole/part structures where leaf and group nodes can be treated through a common model or operation, such as menus, layout trees, or document nodes.

---

# Final Mental Model

Before choosing any pattern, go through this sequence:

```text
1. What is the actual responsibility?
2. What currently changes?
3. What is stable?
4. What knowledge is leaking?
5. Is the dependency/variation real or speculative?
6. What is the smallest meaningful boundary?
7. Does the abstraction improve cohesion or reduce meaningful coupling?
8. What complexity does the pattern add?
9. Is direct code actually clearer here?
10. What failure/ordering/lifecycle semantics must remain explicit?
```

The goal is not to use patterns.

The goal is:

```text
clear responsibilities
explicit contracts
understandable change boundaries
predictable behavior
appropriate extensibility
```
