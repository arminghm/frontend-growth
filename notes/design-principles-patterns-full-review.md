# Design Principles & Patterns — Full Review Notes

> مرور کامل block مربوط به Design Principles & Patterns برای Senior Frontend interview prep.
>
> هدف این فایل مرور ذهنی، مرور قبل از مصاحبه، و تثبیت تفاوت بین principleها، patternها، responsibilityها، trade-offها و failure modeهاست.

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

`Cohesion` یعنی responsibilityهای داخل یک boundary چقدر به یک هدف یا concept مشترک تعلق دارند.

سؤال تشخیصی:

> چند reason مستقل برای change کردن این boundary وجود دارد؟

اگر یک component همزمان:

- form state را نگه دارد،
- validation انجام دهد،
- token را از `localStorage` بخواند،
- HTTP request بزند،
- backend DTO را بشناسد،
- global store را sync کند،
- analytics بفرستد،
- toast نشان دهد،

احتمالاً cohesion پایین آمده است.

### Coupling

`Coupling` یعنی یک boundary چه مقدار knowledge یا dependency نسبت به boundaryهای دیگر دارد.

سؤال تشخیصی:

> این بخش چه چیزهایی را می‌داند که ideally لازم نیست بداند؟

Coupling فقط import نیست. می‌تواند شامل این‌ها باشد:

- API shape
- backend DTO
- store shape
- `localStorage` key convention
- external provider API
- temporal ordering
- component contract
- event name
- runtime protocol

## هدف واقعی

هدف:

```text
High cohesion
+
Appropriate / low accidental coupling
```

هدف **zero coupling** نیست.

یک boundary باید به چیزهایی که واقعاً برای responsibility خودش نیاز دارد coupled باشد.

## ProfileForm example

نسخه‌ی مسئله‌دار:

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

مشکل اصلی این نیست که function طولانی است؛ مشکل این است که responsibilityهای مستقل زیادی در یک boundary جمع شده‌اند.

یک design بهتر:

```ts
type ProfileFormProps = {
  initialValues: ProfileValues;
  onSubmit(values: ProfileValues): Promise<void>;
};
```

`ProfileForm` می‌تواند مسئول این‌ها بماند:

- local form state
- dirty state
- field validation
- submit UX
- loading / disable state

ولی نباید لزوماً بداند:

- endpoint چیست،
- auth token کجاست،
- DTO backend چگونه است،
- analytics provider چیست.

## Important correction

فقط move کردن code از component به `utils.ts` coupling/responsibility را حل نمی‌کند.

```text
Move code != improve design
```

Boundary جدید باید responsibility معناداری داشته باشد.

---

# 2. GRASP & Responsibility Assignment

GRASP را به‌عنوان collectionی از heuristicهای responsibility assignment دیدیم، نه مجموعه‌ی تعریف‌های حفظی.

## 2.1 Information Expert

Responsibility را به جایی بده که information لازم برای انجام آن را دارد.

مثال:

- API adapter expert برای HTTP/DTO concerns است.
- feature orchestrator expert برای sequence/use-case flow است.

این دو را نباید یکی فرض کرد.

### Common gap discovered

در ابتدا tendency وجود داشت که `Information Expert` و orchestrator یکی دیده شوند.

Correction:

```text
Knowing data/transport details
!=
Owning workflow coordination
```

## 2.2 Controller

در frontend، Controller را به معنای MVC controller محدود نکردیم.

Mental model:

> Boundaryای که system event / user intent را می‌گیرد و flow را coordinate می‌کند.

مثلاً:

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

اگر hook خودش flow را انجام می‌دهد:

```text
Page detects/delegates intent
Hook/feature action orchestrates
```

## 2.3 Low Coupling / High Cohesion

این دو نتیجه‌ی مطلوب responsibility assignment هستند، نه ruleهای مکانیکی برای شکستن همه‌چیز به fileهای کوچک.

## 2.4 Indirection

گاهی یک intermediary dependency اضافه می‌کنیم تا دو boundary مستقیماً به هم coupled نباشند.

اما indirection هزینه دارد:

- more files
- more interfaces
- more navigation
- testing overhead
- cognitive overhead

پس سؤال:

> آیا variation واقعی و meaningful است یا فقط speculative است؟

## 2.5 Protected Variations

یک variation point واقعی را پشت boundary قرار می‌دهیم تا تغییر آن به stable core leak نکند.

مثال‌های معتبر:

- third-party analytics provider
- Mapbox/MapLibre provider
- payment provider
- upload provider

### Important gap discovered

در چند پاسخ اولیه tendency وجود داشت که dependencyای که «شاید یک روز تغییر کند» فوراً abstraction بگیرد.

Correction:

Variation باید حداقل یکی از این ویژگی‌ها را داشته باشد:

- currently different semantic/shape
- likely/probable variation
- reused across implementations
- expensive to change
- third-party contract leakage
- meaningful domain boundary

صرف احتمال آینده کافی نیست.

## ProductSearch GRASP example

مسئله:

- search input/state
- HTTP fetch
- backend mapping
- analytics
- storage
- rendering

Responsibility split قابل دفاع:

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

Backend response data = DTO.

Mapping معمولاً:

```text
DTO -> frontend/domain/UI model
```

خود UI model را نباید صرفاً DTO نامید.

---

# 3. SOLID in Frontend

---

# 3.1 SRP — Single Responsibility Principle

تعریف ضعیف:

> هر function فقط یک کار انجام دهد.

Mental model بهتر:

> یک boundary باید reasonهای تغییر closely related داشته باشد، نه policy/actorهای مستقل متعدد.

## Responsibility depends on abstraction level

یک page می‌تواند چند step را orchestrate کند و هنوز cohesive باشد، چون responsibility سطح بالاتر آن:

```text
Handle checkout submission
```

است.

## OrderHistory example

مسئله:

- read user
- fetch orders
- map backend fields
- filter status
- export CSV
- render

تحلیل:

`status filtering` می‌تواند presentation policy مرتبط با OrderHistory باشد و local بماند.

ولی:

```text
HTTP/endpoint/DTO mapping
```

reason مستقلی برای change دارد.

CSV هم باید با معیار reuse تصمیم‌گیری نشود.

### Important correction

```text
Reuse != primary SRP criterion
```

حتی چیزی که فقط یک‌جا استفاده می‌شود ممکن است policy مستقل داشته باشد و separation ارزشمند باشد.

مثلاً CSV export format ممکن است مستقل از page تغییر کند.

---

# 3.2 DIP — Dependency Inversion Principle

Mental model:

> High-level policy باید contract مورد نیاز خودش را تعریف کند، نه اینکه shape یک low-level dependency را copy کند.

## Article draft example

Implementation مستقیم:

```ts
function saveDraft(articleId: string, draft: ArticleDraft) {
  localStorage.setItem(
    `article:${articleId}:draft`,
    JSON.stringify(draft)
  );
}
```

Generic abstraction وسوسه‌کننده:

```ts
interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
```

این abstraction هنوز caller را به این semantics coupled می‌کند:

- key-value storage
- strings
- key naming
- serialization

Contract feature-owned بهتر:

```ts
interface ArticleDraftRepository {
  save(articleId: string, draft: ArticleDraft): void;
  load(articleId: string): ArticleDraft | null;
}
```

حالا high-level code به language خودش وابسته است.

## Two-layer abstraction

اگر واقعاً چند key-value backend داریم:

```text
useDraftArticle
    ↓
ArticleDraftRepository
    ↓
KeyValueStorage
    ↓
LocalStorageAdapter / IndexedDBAdapter
```

ممکن است منطقی باشد.

اما فقط وقتی هر variation point واقعاً value داشته باشد.

## Important corrections

- domain-specific coupling بد نیست؛ اغلب desirable است.
- generic abstraction لزوماً coupling را کاهش نمی‌دهد.
- direct `localStorage` برای feature کوچک و stable می‌تواند کاملاً acceptable باشد.
- Cookie همیشه drop-in replacement برای key-value storage نیست؛ semantics متفاوت دارد.

---

# 3.3 ISP — Interface Segregation Principle

Mental model:

> Consumer نباید به capabilityهایی وابسته باشد که نیاز ندارد.

مسئله:

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

یک interface بزرگ consumerها را unnecessarily coupled می‌کند.

ممکن است split کنیم:

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

و composition:

```ts
type ProductDetailsDependencies =
  ProductReader & ProductStockSource;

type AdminProductEditorDependencies =
  ProductReader & ProductEditor;
```

## Important correction

این design:

```ts
interface AdminDataSource
  extends ProductDetailsDataSource {}
```

اگر ProductDetails شامل `subscribeToStock` باشد، دوباره ISP را نقض می‌کند.

## Another correction

دو extreme بد:

```text
One giant interface
```

و

```text
One generic interface per method:
Readable / Writable / Searchable / Subscribable
```

هدف:

> smallest meaningful consumer contract

نه smallest possible type.

---

# 3.4 LSP — Liskov Substitution Principle

Mental model:

> Type compatibility کافی نیست؛ replacement باید observable behavioral contract را حفظ کند.

```text
Type-compatible
!=
Behaviorally substitutable
```

Frontend contexts:

- components
- adapters
- repositories
- hooks
- strategies
- mocks
- platform implementations

## Preconditions

Replacement نباید precondition قوی‌تری بخواهد.

اگر contract می‌گوید:

```ts
search(query: string): Promise<Result>
```

و implementation جدید بدون declaration روی query کوتاه‌تر از 3 throw کند، precondition را strengthen کرده است.

## Postconditions

Replacement نباید guarantee ضعیف‌تری بدهد.

## UserPreferencesStore example

Contract:

```ts
interface UserPreferencesStore {
  load(): Promise<UserPreferences>;
  save(preferences: UserPreferences): Promise<void>;
}
```

Local:

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

Remote مشکل‌دار:

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

Local روی missing data:

```text
returns defaults
```

Remote:

```text
throws
```

Consumer-visible semantics متفاوت است.

### `save()` subtle problem

Remote روی failure فقط log می‌کند و resolve می‌شود.

Caller:

```ts
await store.save(preferences);
```

از resolve شدن معمولاً success برداشت می‌کند.

پس postcondition ضعیف شده است.

## Better explicit contract

مثلاً:

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

یا rejection semantics را واضح تعریف کنیم.

### Important TypeScript correction

`Promise<UserPreferences>` خودش guarantee نمی‌کند Promise reject نمی‌شود.

مسئله‌ی اصلی semantic contract است، نه صرفاً type signature.

### Gap discovered

Violation مربوط به `load()` مستقل تشخیص داده شد، اما `save()` postcondition ابتدا miss شد و نیاز به correction داشت.

---

# 3.5 OCP — Open/Closed Principle

تعریف slogan:

> Open for extension, closed for modification.

Mental model بهتر:

> برای variationهای واقعی و expected، stable core را طوری طراحی کن که برای اضافه کردن capability جدید مجبور نباشیم بارها core logic را تغییر دهیم.

کلیدها:

```text
Stable core
+
Meaningful variation point
```

## OCP does not mean zero modification

Registry/config/composition root ممکن است تغییر کند.

هدف این است که stable behavior تغییر نکند.

## Analytics example

Initial:

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
- app code must not know provider
- one provider per deployment
- provider selected at startup/config

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

Application:

```ts
analytics.track(event);
```

## Factory / Registry decision

در این scenario:

- Strategy-like provider implementation مناسب است.
- startup switch کافی است.
- Factory class لزوماً value اضافه نمی‌کند.
- Registry احتمالاً over-engineering است اگر فقط یک provider active داریم و set کوچک است.

### Important correction

`provider` string خودش variation point نیست؛ بیشتر selector/discriminator است.

Variation point واقعی:

```text
family of Analytics implementations
```

### Runtime config correction

در frontend، `import.meta.env` معمولاً build-time substitution است.

True runtime selection نیاز به mechanismهایی مثل:

- server-injected global
- runtime config file
- config endpoint

دارد.

## OCP and extension point trade-off

Extension point هزینه دارد:

- interface
- wiring
- registration
- testing
- indirection
- conceptual overhead

پس:

```text
possible variation
!=
automatic extension point
```

---

# 4. Strategy / Factory / State

این سه به‌راحتی قاطی می‌شوند.

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

مثال:

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

نکته:

فقط وجود interface و چند implementation Strategy نمی‌سازد.

Strategy زمانی meaningful است که consumer **behavior را delegate** کند به selected implementation.

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

Factory switch را magically حذف نمی‌کند.

فقط concrete-selection knowledge را localize می‌کند.

Factory به‌تنهایی OCP را guarantee نمی‌کند.

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

Behavior بر اساس current lifecycle state تغییر می‌کند.

مثلاً `SUBMIT` در `idle/editing` ممکن است valid باشد ولی در `submitting` ignored شود.

Mental shortcut:

```text
Strategy = How?
State = What can I do now?
```

## Three together

```text
Factory
→ selects S3Uploader

Strategy
→ uploader performs upload behavior

State
→ upload workflow owns lifecycle/transitions
```

این patternها جایگزین هم نیستند.

---

# 5. Adapter

Mental model:

> یک foreign/external contract را به contract داخلی مورد انتظار سیستم translate کن.

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

Mapbox-specific tuples:

```ts
mapboxDirections.getRoute({
  coordinates: [
    [origin.lng, origin.lat],
    [destination.lng, destination.lat],
  ],
});
```

Mapping باید داخل Adapter بماند.

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

حتی بدون migration قطعی به MapLibre، Adapter می‌تواند ارزش داشته باشد چون **امروز** foreign shape/semantics را isolate می‌کند.

Future change فقط دلیل تقویتی است.

## Adapter misuse

اگر فقط mirror کنیم:

```ts
class FetchAdapter {
  get(url: string) {
    return fetch(url);
  }
}
```

ولی semantic isolation یا translation نداریم، abstraction احتمالاً ceremony است.

### Important rule

Contract را از نیاز feature بساز، نه از لیست methodهای provider.

بد:

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

اگر فقط Mapbox API را copy کرده‌ایم.

---

# 6. Facade

Mental model:

> یک subsystem پیچیده را پشت API ساده‌تر و intent-level پنهان کن.

Facade با Adapter فرق دارد:

```text
Adapter = translate interface/contract
Facade  = simplify subsystem knowledge
```

## Checkout example

بدون Facade:

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

Consumer فقط intent را می‌داند.

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

می‌تواند در component بماند.

Upload subsystem:

```text
create upload session
→ PUT binary
→ confirm upload
```

می‌تواند پشت:

```ts
interface AvatarUploader {
  upload(file: Blob): Promise<UploadedAvatar>;
}
```

برود.

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

اگر فقط همان lines را از function A به class B ببریم:

```text
No knowledge removed
No smaller contract
No cohesive boundary
```

فقط code moved شده است.

Facade وقتی value دارد که consumer دیگر subsystem details را نداند.

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

مشکل:

- unrelated reasons to change
- huge dependency surface
- low cohesion

Shared noun مثل `User` دلیل کافی برای یک boundary مشترک نیست.

## Query cache trade-off

`queryClient.invalidateQueries()` می‌تواند داخل application-level facade باشد اگر cache consistency بخشی از use case completion باشد.

اما این facade را به TanStack Query coupled می‌کند.

اگر independence مهم باشد:

```ts
interface CurrentUserCache {
  refresh(): Promise<void>;
}
```

اما این abstraction فقط وقتی ارزش دارد که cost آن justify شود.

---

# 7. Observer

Mental model:

> وقتی یک event/change رخ داده و چند consumer مستقل باید مطلع شوند، بدون اینکه publisher تک‌تک آن‌ها را بشناسد.

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

Coupling تبدیل می‌شود به:

```text
publisher
→ event contract
← subscriber
```

یعنی semantic coupling هنوز وجود دارد.

## Hidden coupling problem

اگر core flow را event bus کنیم:

```text
order.created
→ payment observer
payment.completed
→ confirmation observer
order.confirmed
→ clear cart observer
```

flow سخت‌تر trace می‌شود.

## Core vs Secondary reactions

قانون بسیار مهم:

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
3. route dashboard
4. analytics
5. start WebSocket
6. refresh notification badge

تحلیل درست:

Core:

- token persistence
- current user load
- authenticated WebSocket startup
- navigation (بسته به contract flow)

Secondary:

- analytics
- notification refresh اگر stale بودن موقت acceptable باشد

### Temporal coupling discovered

WebSocket ممکن است token لازم داشته باشد.

پس:

```text
save token
→ then connect WebSocket
```

اگر هر دو independent subscriber باشند، race ایجاد می‌شود.

### Failure semantics

Analytics failure نباید login را fail کند.

اما token persistence failure ممکن است login completion را fail کند.

## Observer vs React data flow

برای sibling/component communication فقط برای فرار از props نباید global event bus ساخت.

اول بررسی کن:

- state ownership
- props
- Context
- store
- router state

Event bus می‌تواند data flow را invisible کند.

## Lifecycle risks

Observer نیاز به cleanup دارد:

```ts
useEffect(() => {
  const unsubscribe = events.subscribe(...);
  return unsubscribe;
}, []);
```

وگرنه:

- duplicate listeners
- stale closures
- memory leaks
- unexpected side effects

---

# 8. Command

Mental model:

> یک executable intent/action را first-class representation بده تا بتواند independently trigger, queue, retry, log, undo یا bulk execute شود.

## Callback vs Command

این فقط callback است:

```tsx
<button onClick={() => save()} />
```

Command زمانی value دارد که action metadata/lifecycle نیاز دارد.

مثلاً:

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

همان intentها از چند surface اجرا می‌شوند.

این scenario Command را justify می‌کند.

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

اولی می‌گوید:

> این کار را انجام بده.

دومی می‌گوید:

> این اتفاق افتاد.

## Permission / authorization

`canExecute()` در frontend می‌تواند capability/UX check باشد:

```ts
if (!command.canExecute()) {
  disableAction();
}
```

اما security boundary نیست.

Backend باید authorization واقعی را enforce کند.

## Confirmation distinction

Pre-execution UI confirmation:

```text
Are you sure you want to suspend this user?
```

معمولاً invoker/UI concern است.

Post-execution verification:

> آیا operation واقعاً کامل شد؟

بخشی از command/use-case completion semantics است.

این دو نباید conflated شوند.

## Analytics

Cross-cutting analytics بهتر است لزوماً داخل هر Command hardcode نشود.

می‌تواند decorator/orchestrator باشد.

```text
Analytics wrapper
    ↓
Command.execute()
```

## Bulk execution

Command pattern bulk را ممکن می‌کند، اما policy را تعیین نمی‌کند.

باید explicit شود:

- sequential vs parallel
- fail-fast vs continue
- partial success
- retry
- rollback

## Over-engineering

برای interaction ساده:

```ts
setOpen(true)
```

ساختن:

```text
OpenModalCommand
CloseModalCommand
ToggleDropdownCommand
```

احتمالاً ceremony است.

---

# 9. Mediator

Mental model:

> وقتی چند peer/component برای یک interaction مشترک coordination policy دارند، direct communication را در یک central coordination boundary جمع کن.

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

بد:

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

در frontend modern لازم نیست class بنویسیم.

Mediator role ممکن است باشد:

- custom hook
- state machine
- feature controller
- provider
- shared state owner

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

اگر ordering/coordination rule مهم است، Mediator مناسب‌تر است.

## Dashboard resize example

Resize requires:

- layout recalculation
- neighbor resize
- grid constraints
- autosave scheduling

این‌ها coordinated هستند و Mediator-like boundary مناسب است.

Analytics اگر secondary observation باشد بهتر است از mediator core جدا بماند.

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

این cohesion را از بین می‌برد.

Mediator باید subsystem-specific باشد.

---

# 10. Composite

Mental model:

> وقتی leaf و group/tree از همان concept را با interface/operation تقریباً یکسان می‌خواهیم مدل کنیم.

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

این recursive whole/part structure است.

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

وجود array یا nested JSX کافی نیست.

```text
ordinary collection
!=
Composite
```

Pattern زمانی meaningful است که recursive whole/part semantics وجود داشته باشد.

---

# 11. Cross-pattern mental map

| Concept | سؤال اصلی |
|---|---|
| Cohesion | آیا responsibilityهای این boundary واقعاً به یک هدف تعلق دارند؟ |
| Coupling | این boundary چه knowledge غیرضروری‌ای از بقیه دارد؟ |
| GRASP | responsibility را به چه کسی بدهیم و چرا؟ |
| SRP | چه reasonهای مستقلی برای change داریم؟ |
| DIP | high-level policy به contract خودش وابسته است یا shape low-level dependency؟ |
| ISP | آیا consumer به capabilityهای اضافی وابسته شده؟ |
| LSP | آیا replacement observable contract را حفظ می‌کند؟ |
| OCP | stable core کجاست و variation واقعی کجاست؟ |
| Strategy | behavior را با چه algorithm/implementation انجام بدهم؟ |
| Factory | کدام implementation را create/resolve کنم؟ |
| State | با توجه به current lifecycle state چه behavior/transition مجاز است؟ |
| Adapter | foreign contract را چطور به internal contract translate کنم؟ |
| Facade | subsystem پیچیده را چطور برای consumer ساده کنم؟ |
| Observer | چه consumerهای مستقلی باید از event مطلع شوند؟ |
| Command | چگونه intent اجرایی را first-class کنم؟ |
| Mediator | coordination بین peerها را کجا centralize کنم؟ |
| Composite | whole/part recursive structure را چطور uniform model کنم؟ |

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

این design principle نیست؛ ceremony است.

## 12.2 Speculative abstraction

> شاید بعداً عوض شود.

به‌تنهایی دلیل کافی نیست.

## 12.3 Factory around a trivial constructor

```ts
function createUser() {
  return new User();
}
```

اگر creation/selection complexity واقعی نداریم، Factory value کمی دارد.

## 12.4 Registry when startup switch is enough

اگر:

- implementation set کوچک است،
- فقط یک implementation active است،
- runtime plugins نداریم،

یک switch در composition root ممکن است بهترین design باشد.

## 12.5 Event bus to avoid explicit dependencies

Dependency disappear نشده؛ فقط traceability کم شده است.

## 12.6 Facade as code relocation

کپی کردن همان complexity به یک class جدید improvement نیست.

## 12.7 Generic abstraction over domain contract

گاهی:

```ts
Storage.getItem/setItem
```

بدتر از:

```ts
ArticleDraftRepository.save/load
```

است، چون generic abstraction هنوز low-level semantics را leak می‌کند.

## 12.8 Tiny interfaces for every method

ISP یعنی consumer-focused contract، نه fragmentation بی‌هدف.

## 12.9 Command for every click

برای local interaction ساده callback/state update کافی است.

## 12.10 State machine for boolean UI

```ts
const [isOpen, setIsOpen] = useState(false);
```

به `ClosedState`, `OpenState`, `StateFactory` نیاز ندارد.

---

# 13. Corrections and Gaps Discovered During the Sessions

این بخش مهم‌ترین چیزهایی است که در پاسخ‌ها نیاز به refinement یا correction داشت.

## Coupling / GRASP

- `Information Expert` با orchestrator یکی نیست.
- moving code به helper به‌تنهایی responsibility assignment را اصلاح نمی‌کند.
- Protected Variation نباید صرفاً بر اساس «شاید تغییر کند» ایجاد شود.
- orchestration ownership باید explicit باشد.

## DTO / Mapping

- response backend = DTO.
- mapper معمولاً DTO را به frontend/domain/UI model تبدیل می‌کند.

## SRP

- reuse criterion اصلی extraction نیست.
- یک concern ممکن است فقط یک consumer داشته باشد ولی reason مستقل برای change داشته باشد.

## DIP

- generic abstraction لزوماً coupling کمتر ندارد.
- domain-specific coupling اغلب desirable است.
- direct low-level dependency گاهی ساده‌ترین design صحیح است.

## ISP

- interface inheritance می‌تواند capability ناخواسته را دوباره وارد consumer کند.
- page-specific naming نباید shared semantic capability را unnecessarily به UI name قفل کند.

## LSP

- `load()` incompatibility مستقل تشخیص داده شد.
- subtle `save()` postcondition ابتدا miss شد.
- Promise type به‌تنهایی error semantics را بیان نمی‌کند.

## OCP

- provider string بیشتر selector است؛ implementation family variation point است.
- OCP به معنی zero modification نیست.
- Factory به‌تنهایی OCP را تضمین نمی‌کند.
- registry همیشه بهتر نیست.

## Strategy / Factory / State

- Strategy با وجود interface تعریف نمی‌شود؛ delegation intent مهم است.
- Factory مسئول creation/selection است.
- State مربوط به lifecycle/current-state-driven behavior است.

## Adapter

- future migration به‌تنهایی justification کافی نیست.
- value اصلی می‌تواند translation و isolation فعلی باشد.
- Adapter نباید external API را یک‌به‌یک mirror کند.

## Facade

- code relocation != useful Facade.
- cache invalidation داخل Facade یک trade-off است؛ ممکن است library coupling ایجاد کند.
- God Facade خطر مهم است.

## Observer

- event bus coupling را حذف نمی‌کند؛ semantic coupling باقی می‌ماند.
- core ordered workflow نباید صرفاً برای decoupling به events شکسته شود.
- ordering، failure isolation و lifecycle/unsubscribe مهم‌اند.

## Command

- frontend permission check security boundary نیست.
- pre-execution confirmation با post-execution verification فرق دارد.
- bulk execution policy باید explicit باشد.

## Mediator

- analytics اگر secondary باشد نباید بی‌دلیل mediator cohesion را خراب کند.
- Mediator باید subsystem-specific بماند.

## Composite

- nesting/array به‌تنهایی Composite نیست.
- recursive whole/part semantics مهم است.

---

# 14. Current Proficiency Summary

Current overall skill assessment:

```text
Design Principles & Patterns
3 — APPLY (developing REASON)
```

Reason for not upgrading to `4 — REASON` yet:

- first pass قوی و applied بوده،
- ولی transfer باید در spaced retestهای جدید و بدون pattern-name cue دوباره ثابت شود،
- بعضی corrected details هنوز باید بدون hint بازتولید شوند.

### Strong evidence so far

- coupling/cohesion در scenarios واقعی frontend
- responsibility boundary reasoning
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

- coupling/cohesion under a fresh feature
- GRASP Information Expert vs Controller/orchestrator
- abstraction threshold: direct dependency vs port/adapter
- SRP without using reuse as extraction criterion
- DIP where generic abstraction is tempting
- ISP composition/inheritance
- LSP postconditions/error semantics
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
- Composite vs normal collection/nested JSX

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

قبل از انتخاب هر pattern، این sequence را طی کن:

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

هدف pattern استفاده کردن نیست.

هدف:

```text
clear responsibilities
explicit contracts
understandable change boundaries
predictable behavior
appropriate extensibility
```

است.
