# Oryx Tours — Working Memory

Living notes about the codebase + a running log of changes/progress. Update this as we work.

---

## 1. Project Snapshot

- **Product**: Oryx Tours — a luxury travel/booking marketing + dashboard UI.
- **Stack**: Next.js **16.2.3** (App Router) · React **19.2.4** · TypeScript · Tailwind **v4** · shadcn/ui (style `base-nova`) on `@base-ui/react` primitives · Zustand · Framer Motion · Supabase SSR (scaffolded).
- **Path alias**: `@/* → src/*`.
- **Scripts**: `npm run dev | build | start | lint`.
- **Deploy target**: Netlify (`netlify.toml` present).

### ⚠ Critical convention (from `AGENTS.md`)
> "This is NOT the Next.js you know" — APIs in v16 differ from training data. **Read the relevant guide in `node_modules/next/dist/docs/` before writing any Next.js code.**

Notable v16 things already in this repo:
- `params` and `searchParams` are **Promises** — must be `await`ed (see [`src/app/(site)/tours/[slug]/page.tsx`](src/app/(site)/tours/[slug]/page.tsx#L10-L18)).
- AI hint in `node_modules/next/dist/docs/index.md`: to make client-side navigations instant, **export `unstable_instant` from the route in addition to using Suspense** (see `docs/01-app/02-guides/instant-navigation.md`).

---

## 2. Directory Map

```
src/
├── app/
│   ├── layout.tsx                 Root layout · Inter + Inter Tight fonts · AuthProvider
│   ├── globals.css                Theme tokens (OKLCH + brand hex), font vars, base layer
│   ├── (site)/                    Public marketing routes (Navbar + Footer)
│   │   ├── layout.tsx
│   │   ├── page.tsx               Home
│   │   ├── sign-in/, sign-up/
│   │   ├── tours/, tours/[slug]/
│   │   ├── transfers/, booking/, checkout/
│   │   └── personalized/
│   └── (dashboard)/               Auth-gated routes (Navbar + DashboardSidebar + RouteGuard)
│       ├── layout.tsx
│       ├── dashboard/             customer home
│       │   ├── saved/, bookings/
│       ├── admin/                 role: admin
│       └── partner/               role: partner
├── components/
│   ├── ui/                        shadcn primitives (Button, Card, Sheet, Dropdown, etc.)
│   ├── atoms/                     Re-exports + ActionButton wrapper
│   ├── molecules/                 TourCard, DestinationCard, CategoryCard, SearchBar, BookingCard, ReviewCard, RatingStars, VehicleCard
│   ├── organisms/                 Navbar, Footer, HeroSection, FeaturedTours, FiltersPanel, BookingFlow, BookingSidebar, BookingDetailsDialog, DashboardSidebar, OperatorCard, PaymentMethods, ProgressSteps, TourDetailsTabs, BookingsManager
│   ├── layout/                    Container, SectionHeading, GlassCard
│   └── providers/                 AuthProvider (localStorage), RouteGuard
├── lib/
│   ├── utils.ts                   `cn()` = twMerge(clsx)
│   ├── format.ts                  formatPrice, formatDate, formatCompactDate
│   ├── auth.ts                    localStorage-backed seed accounts, roleHomePath
│   ├── mock-data.ts               mockTours, mockDestinations, mockOperators, mockVehicles, mockBookings, mockReviews
│   └── supabase/                  client.ts + server.ts (scaffolded, not wired)
├── store/                         Zustand stores: search-store, saved-store, booking-store
└── types/index.ts                 Tour, Destination, Operator, Vehicle, Booking, Review
```

---

## 3. Design System

### Fonts
- `--font-sans` / `--font-mono`: **Inter**
- `--font-heading`: **Inter Tight** (applied to `h1–h6` in `globals.css` `@layer base`)
- Loaded via `next/font/google` in [`src/app/layout.tsx`](src/app/layout.tsx).

### Color tokens (light mode)
| Token | Value | Use |
|---|---|---|
| `--background` | oklch(0.985 0.01 85) — warm off-white | page bg |
| `--foreground` | oklch(0.2 0.02 80) — deep warm ink | text |
| `--primary` | `#3a8b5c` (oryx green) | CTAs, brand accents |
| `--primary-foreground` | `#f4fff8` | text on primary |
| `--secondary` | `#6b0f2a` (deep burgundy) | secondary accents |
| `--accent` | `#cfe8da` (mint) | soft highlights |
| `--muted` / `--muted-foreground` | warm neutrals | subdued surfaces |
| `--destructive` | oklch(0.59 0.22 27) | errors |
| `--radius` | `0.8rem` | base radius (sm/md/lg/xl/2xl/3xl/4xl derived) |

Dark mode mirrors the palette with deeper warm bases and a brighter `#5fb487` primary.

### Recurring visual motifs
- **Glassmorphism**: `border border-white/60 bg-white/70 backdrop-blur` + `shadow-[0_18px_40px_-24px_rgba(92,70,39,0.45)]` — see Navbar, Footer, [`GlassCard`](src/components/layout/GlassCard.tsx).
- **Warm sand gradients** as hero/category/booking backgrounds:
  - Page bg: `from-[#f8e6c8] via-[#f7f1e4] to-[#f1d1aa]`
  - Card gradients live on each `Tour`/`Destination`/`Vehicle`/`Booking` record in `mock-data.ts` (e.g. `from-[#f8e2bd] via-[#f6d2a3] to-[#e8b98b]`).
- **Radial overlays**: `bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_70%)]` for soft top-light.
- **Pill CTAs**: most buttons use `className: "rounded-full"` via `buttonVariants(...)`.
- **Uppercase eyebrows**: `text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground` (used in `SectionHeading`).
- **Lift on hover**: `transition-all duration-300 hover:-translate-y-1` + deeper shadow.

### Component conventions
- **shadcn primitives** are based on `@base-ui/react` (not Radix). E.g. `Button` wraps `@base-ui/react/button`, `DropdownMenuTrigger` uses `render={<Button …/>}` prop instead of `asChild`. See [`src/components/organisms/Navbar.tsx`](src/components/organisms/Navbar.tsx#L94-L107).
- **Icons**: `lucide-react`.
- **Layout primitive**: `<Container>` = `mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8`.
- **Heading primitive**: `<SectionHeading title subtitle align>` — always renders the "Oryx Signature" eyebrow.
- **Buttons**: prefer `buttonVariants({ variant, className: "rounded-full" })` for `<Link>` CTAs; prefer the `<Button>` component for actual buttons.
- **Naming**: atoms / molecules / organisms / layout / providers split is enforced — keep new components in the right bucket.

---

## 4. State, Data, Auth

### Zustand stores (`src/store/`)
- **`useSearchStore`** — filters (query, category, priceRange, duration, rating, sort) + setters + `reset`.
- **`useSavedStore`** — `savedSlugs[]` toggleSaved/isSaved (not persisted).
- **`useBookingStore`** — multi-step form: `step`, `travelDate`, `guests`, `notes`, `promoCode` + `nextStep`/`previousStep` clamped to 1–3.

### Mock data (`src/lib/mock-data.ts`)
6 tours, 5 destinations, 3 operators, 3 vehicles, 3 bookings, 3 reviews. Each tour carries its own Tailwind `gradient` string used by cards.

### Auth (`src/lib/auth.ts` + [`AuthProvider`](src/components/providers/AuthProvider.tsx))
- **localStorage-only** — no backend yet. Keys: `oryx-auth-user`, `oryx-auth-accounts`.
- Three seed accounts (passwords are demo-only):
  - `traveler@oryx.test / oryx123` → role `customer` → `/dashboard`
  - `admin@oryx.test / admin123` → role `admin` → `/admin`
  - `partner@oryx.test / partner123` → role `partner` → `/partner`
- `roleHomePath` maps role → landing path.
- `RouteGuard` redirects unauthenticated users to `/sign-in?next=…` and unauthorized roles to `/dashboard`.

### Supabase
`src/lib/supabase/{client,server}.ts` exist as scaffolding but are not yet wired to the UI.

---

## 5. Routes

| Path | Group | Notes |
|---|---|---|
| `/` | (site) | Hero · FeaturedTours · Categories · Destinations · Signature collection · Personalized CTA |
| `/tours` | (site) | List + FiltersPanel + Select sort |
| `/tours/[slug]` | (site) | async page, awaits `params`/`searchParams`; falls back to `mockTours[0]` |
| `/transfers` | (site) | Vehicle cards |
| `/booking` | (site) | Multi-step BookingFlow |
| `/checkout` | (site) | PaymentMethods |
| `/personalized` | (site) | Concierge form |
| `/sign-in`, `/sign-up` | (site) | Demo auth |
| `/dashboard` | (dashboard) | Customer home — RouteGuard |
| `/dashboard/saved` | (dashboard) | Saved tours |
| `/dashboard/bookings` | (dashboard) | BookingsManager |
| `/admin` | (dashboard) | Admin role only |
| `/partner` | (dashboard) | Partner role only |

---

## 6. Things to be careful about

- **Don't import Radix** — primitives come from `@base-ui/react`. Use `render={<Element/>}` instead of `asChild`.
- **Always `await` `params` / `searchParams`** in route components.
- **Tailwind v4** — config lives in `globals.css` `@theme inline`, not `tailwind.config.*`. Use CSS variable tokens (`bg-background`, `text-muted-foreground`, etc.) rather than ad-hoc colors when extending.
- **`unstable_instant`** — if a route feels slow on client-side nav, consider exporting it (see Next 16 docs) before adding more Suspense boundaries.
- **`window.localStorage`** access must be guarded by `typeof window !== "undefined"` (pattern already used in `lib/auth.ts`).
- **Image domains**: only `/public` assets are used right now (`logo.png`). Add to `next.config.ts` `images.remotePatterns` before referencing external images.
- **No comments / no premature abstractions** when editing — match the existing terse style.

---

## 7. Change log

> Append newest at top. Format: `YYYY-MM-DD — <summary>` then 1–3 bullets.

### 2026-05-21 — Auth pages revamp + dashboard layout fix
**Sign-in [/sign-in](src/app/(site)/sign-in/page.tsx)**
- Adapted the 21st.dev SignInBlock visual: centered "Welcome back" card, Mail icon inside the email input, Lock icon + Eye/EyeOff toggle inside the password input, "Forgot password?" link beside the password label, Remember-me checkbox bound to a localStorage flag.
- Kept all the real wiring intact: `useAuth().signIn`, `?next=` query param honoured, role-based redirect via `roleHomePath[user.role]`. Kept the right-hand Demo credentials column (Customer / Admin / Partner one-click autofill).
- Did NOT swap in the pasted source's custom `<Input>` / `<Button>` / `<Checkbox>` (they import `@radix-ui/react-slot` and `motion/react`, conflict with this project's base-ui primitives). Got the same look with icon overlays + the project's primitives.

**Sign-up [/sign-up](src/app/(site)/sign-up/page.tsx)**
- Adapted the SignUpBlock visual: split "Full name" → First name + Last name (2-col), Mail/Lock/User icons inside fields, Eye toggles on password + confirm, terms checkbox.
- Stronger client-side validation per the pasted source: 8+ chars, mixed case + a digit, passwords match, terms required. Errors render under each field.
- Concatenates `${firstName} ${lastName}` → `name` before calling `useAuth().signUp({ name, email, password, role: "customer" })`. After success, redirects to `roleHomePath[user.role]` (no email-verification card — the demo auth signs the user in immediately).

**Dashboard layout fix**
- Real layout bug found during the audit: [`Sidebar`](src/components/ui/modern-side-bar.tsx) had `top-0` on both mobile and desktop, overlapping the global `Navbar` (which is `sticky top-0 z-40` and `h-16`). On desktop the sidebar's brand block was hidden behind the navbar.
- Fix: sidebar now uses `top-16 h-[calc(100vh-4rem)]` consistently (mobile fixed + desktop sticky), sitting cleanly below the Navbar. Mobile hamburger position (`top-20 left-4 z-30`) already correct.
- Other dashboard pages (customer overview / /dashboard/bookings / /dashboard/saved / /admin / /partner) audited and judged consistent — same warm-glass card style, same shadow tokens, same SectionHeading pattern, same `flex / space-y-8` outer rhythm. No further drift to fix.

**Verified**: `npx tsc --noEmit` clean, `npm run lint` clean.

### 2026-05-21 — Client-feedback rollout: three booking flows, future-only dates, 6 categories, video, content
**Data model**
- [`Tour`](src/types/index.ts) gains `description: string` (1-2 sentence experiential blurb) and `videoUrl?: string`.
- `TourCategory` tightened to exactly: **Luxury / Adventure / Culture / Wellness / Sports / Medical** (dropped Desert / City / Wildlife).
- New types: `FleetCategory = "Economy" | "Premium" | "VIP"`, `ServiceType = "tour" | "airport" | "local"`, `DurationMode = "half-day" | "full-day" | "extra-hour"`.
- [`Vehicle`](src/types/index.ts) gains `fleetCategory`, `halfDayPrice`, `fullDayPrice`, `extraHourPrice`, `transferPrice`.

**Mock data** ([`src/lib/mock-data.ts`](src/lib/mock-data.ts))
- Every existing tour now has a `description` + a (placeholder) `videoUrl` (single CC YouTube embed for now — client will swap per tour).
- `Wildlife Safari Reserve` re-categorised `Wildlife` → `Adventure`.
- Added **tour-007 Pearl Coast Padel Retreat** (Sports, 3 days, $1,180) and **tour-008 Al Maha Recovery Sanctuary** (Medical, 7 days, $2,980) so each new category has content.
- `mockVehicles` expanded from 3 → **6 entries across 3 fleet categories** (Economy/Premium/VIP), each with half/full-day + extra-hour + transfer pricing.

**Date enforcement**
- New helper [`todayISO()`](src/lib/format.ts) returns today's `YYYY-MM-DD` for `<input type="date" min={...}>`.
- Applied to every date input: [`BookingFlow`](src/components/organisms/BookingFlow.tsx), [`SearchBar`](src/components/molecules/SearchBar.tsx), [`/transfers`](src/app/(site)/transfers/page.tsx), [`/personalized`](src/app/(site)/personalized/page.tsx), `AirportTransferFlow`, `LocalTransportFlow`.

**Numeric guest entry everywhere**
- `/transfers` passenger `<Select>` → `<Input type="number" min={1}>`. SearchBar Guests → numeric. Personalized "Travel party size" → numeric. Booking flow already numeric.

**Booking architecture — three flows under one page**
- Booking store ([src/store/booking-store.ts](src/store/booking-store.ts)) extended with `serviceType`, `pickup`, `dropoff`, `vehicleId`, `durationMode`, `extraHours` + setters and a `reset()`.
- [`/booking/page.tsx`](src/app/(site)/booking/page.tsx) now reads `?type=tour|airport|local` (defaults to `tour`) and `?tour=<slug>`, passes both to a new client component.
- [`BookingHub`](src/components/organisms/BookingHub.tsx) — segmented control (Tabs) for **Tours | Airport transfer | Local transport**, syncs active tab to URL via `useSearchParams + router.replace`, shows the "Selected tour" summary card on the Tour tab when a slug was passed.
- [`BookingFlow`](src/components/organisms/BookingFlow.tsx) (tours) — added **Pick-up + Drop-off** to step 2. Date input enforces `min={todayISO()}`. Step 1's Continue is disabled until date is future + guests ≥ 1; Step 2's Continue disabled until pickup + dropoff filled. Step 3 summary shows `formatDate(travelDate)` and the pick-up / drop-off (replaces the `"TBD"` placeholder).
- [`AirportTransferFlow`](src/components/organisms/AirportTransferFlow.tsx) (new) — pickup, drop-off, future date, numeric passengers, route-preview card, **vehicle picker grouped by fleet category** (Economy/Premium/VIP), and an "Estimated fare" panel that updates **instantly** when a vehicle is selected.
- [`LocalTransportFlow`](src/components/organisms/LocalTransportFlow.tsx) (new) — same fields plus a **Half-day / Full-day / +Extra hours** segmented control; the "Live total" panel recomputes on every change using `halfDayPrice` / `fullDayPrice` / `fullDayPrice + extraHours * extraHourPrice`.

**Tour content surface**
- [`TourCard`](src/components/molecules/TourCard.tsx) — `description` now comes from `tour.description` (was `tour.highlights[0]`).
- [`TourDetailsTabs`](src/components/organisms/TourDetailsTabs.tsx) — Overview tab now leads with the description paragraph then a bulleted highlights list (replaces `highlights.join(" ")`). Takes a new `description` prop.
- [`/tours/[slug]/page.tsx`](src/app/(site)/tours/[slug]/page.tsx) — shows the description above the gallery, embeds a **16:9 YouTube iframe** when `tour.videoUrl` is set, and now calls `notFound()` for unknown slugs (was rendering an amber "Showing a sample tour while this page is configured" banner — removed).
- [`FiltersPanel`](src/components/organisms/FiltersPanel.tsx) categories → 6 (All + the client's 6).
- Home [`categories`](src/app/(site)/page.tsx) array → 6 with Sports + Medical descriptions.

**Rate card**
- [`/transfers`](src/app/(site)/transfers/page.tsx) — added a **Fleet pricing** table at the bottom: Vehicle / Category / Half day / Full day / Extra hour / Airport transfer columns, grouped by fleet category. Replaced the "Map preview placeholder" dashed box with a styled route-preview card. Updated [`VehicleCard`](src/components/molecules/VehicleCard.tsx) to show the fleet category as a pill and surface half-day + transfer pricing.

**Verified**: `npx tsc --noEmit` clean, `npm run lint` clean.

**Deferred** (per the plan's out-of-scope): brand ID document, mission/vision copy, real payment integration, per-tour real video assets, renaming `Booking.status`.

### 2026-05-21 — Dashboard overhaul: customer overview + functional admin + functional partner
- **[/dashboard](src/app/(dashboard)/dashboard/page.tsx)** is now a real customer **overview**, not another BookingsManager. Welcome line uses `useAuth().user.name`. Three computed stat cards (Upcoming trips count, Saved tours count via `useSavedStore`, Lifetime spend = sum of Completed booking prices). "Next journey" hero card pulls the first Upcoming booking and shows its real date + reference. Three quick-action cards link to `/dashboard/bookings`, `/dashboard/saved`, `/personalized`. Closes with a 3-up "Recommended for you" grid of `<TourCard>`s.
- **[/dashboard/bookings](src/app/(dashboard)/dashboard/bookings/page.tsx)** is now the only place that renders `<BookingsManager>` (was duplicated with `/dashboard`).
- **[/admin](src/app/(dashboard)/admin/page.tsx)** — switched to client. Stats are computed: revenue = sum of non-Cancelled booking prices, pending approvals = derived from `useState<Record<tourId, ApprovalState>>`, active bookings = count of Upcoming. **Approve/Reject** buttons per row update local approval state and the badge color (`Awaiting` amber, `Approved` emerald, `Rejected` rose). Operator column now resolves `operatorId` → `mockOperators.find(...).name` (was hardcoded `"Pending review"` literal — that was the bug).
- **[/partner](src/app/(dashboard)/partner/page.tsx)** — switched to client and **scoped to a single operator** (`mockOperators[0]`). Stats compute from that operator's tours + bookings: earnings, upcoming count, avg rating. Manage-tours table has real **Publish/Unpublish + Delete** actions and a working search filter. The Add-tour form is fully wired with `useState`: validates required fields + numeric duration/price, prepends new entries to the list as "Draft", shows inline success/error feedback, then resets. Added a "Recent bookings on your tours" section.
- **[BookingDetailsDialog](src/components/organisms/BookingDetailsDialog.tsx)** is now **controlled** (`booking | open | onOpenChange` props) and renders the real booking's data (was hardcoded "Royal Dune Retreat / ORYX-1024").
- **[BookingCard](src/components/molecules/BookingCard.tsx)** accepts optional `onClick` — becomes a `<button>` with hover lift when clickable.
- **[BookingsManager](src/components/organisms/BookingsManager.tsx)** is now a client component, tracks `selectedBooking`, renders **one shared** dialog opened from any card click. Empty-state copy per tab.
- **Form-event types in React 19**: both `FormEvent` and `FormEventHandler` re-exports are deprecated. Pattern used: inline the `onSubmit` arrow in JSX, call `event.preventDefault()` there, then call a no-arg `handleSubmit()`. No React event types imported.
- **No new files / no new pages** created — all dashboard routes already existed; the sidebar's links are clean. `tsc --noEmit` + `npm run lint` clean.

### 2026-05-21 — Modern Sidebar replaces DashboardSidebar in (dashboard) layout
- **Added** [`src/components/ui/modern-side-bar.tsx`](src/components/ui/modern-side-bar.tsx) — 21st.dev-inspired sidebar with: brand block (Oryx logo + Travel lounge eyebrow), collapsible desktop rail (toggle expands `w-72` ⇄ `w-24`), mobile drawer with overlay + hamburger (positioned `top-20 left-4 z-30` so it sits below the global Navbar), tooltip on hover for collapsed icons, glass profile pill at the bottom, Sign-out button styled `text-destructive`.
- Wired to the project: `useAuth()` for user + role + signOut, `usePathname` for active state, `<Link>` for navigation, `next/image` for the logo. Auto-closes the mobile drawer on link click.
- Role-filtered nav (kept from old `DashboardSidebar`): customer → Overview / Bookings / Saved tours; partner → Partner workspace; admin → Partner workspace + Admin command center. Icons: Home / Calendar / Heart / Users / Shield.
- **Dropped from the pasted source**: the in-component search input (no impl) and the trailing example "Main Content Area" div. Re-skinned all slate/blue tokens to warm-glass equivalents.
- **Refactored** [`(dashboard)/layout.tsx`](src/app/(dashboard)/layout.tsx) — replaced the `Container grid-cols-[240px_1fr]` split with a `flex` layout. Kept the global `Navbar` above.
- **Deleted** `src/components/organisms/DashboardSidebar.tsx`.

### 2026-05-21 — DestinationCard wrapper + horizontal filter bar on /tours
- **Extended** [`Destination`](src/types/index.ts) with `images: string[]`, `priceFrom: number`, `rating: number`, `tags: string[]`. Populated all 5 destinations in [`src/lib/mock-data.ts`](src/lib/mock-data.ts) with 3 Unsplash URLs each (reusing the `unsplash(id)` helper), plus synthetic rating / starting price / 2 tags chosen to match the destination's theme.
- **Refactored** [`DestinationCard`](src/components/molecules/DestinationCard.tsx) to a thin wrapper that maps `Destination` → `PlaceCard` props (toursCount becomes the meta line "12 curated tours"; country becomes hostType; isTopRated when `rating >= 4.85`). Home "Popular destinations" picks up the new card visual automatically.
- **Refactored** [`FiltersPanel`](src/components/organisms/FiltersPanel.tsx) from sidebar layout to a **horizontal full-width bar**: top row has the search input (flex-1) + Duration/Rating selects + Reset; bottom row has the category pill chips. Rating filter switched from a pill set to a Select (cleaner on a horizontal bar). Category list expanded to also include Desert + Wildlife.
- **Refactored** [`/tours` page](src/app/(site)/tours/page.tsx) — removed the `grid-cols-[240px_1fr]` sidebar split. FiltersPanel now sits full-width above the meta row, and the tour grid is full-width `sm:grid-cols-2 lg:grid-cols-3`.

### 2026-05-21 — TourCard is now a thin wrapper over PlaceCard (unifies all tour-card slots)
- **Refactored** [`src/components/molecules/TourCard.tsx`](src/components/molecules/TourCard.tsx) — it is now a 17-line wrapper that maps `Tour` → `PlaceCard` props (`category + first tag` for the top pill, `${durationDays}-day journey · region` for the meta line, `rating >= 4.85 || tags includes "Top rated"` for the badge). All existing `<TourCard tour={tour} />` call sites get the new visual for free.
- **Removed** the previous `featured` prop on TourCard — was unused at all call sites (grep-verified). No back-compat shim per project style.
- **Reverted** [`FeaturedTours.tsx`](src/components/organisms/FeaturedTours.tsx) and [`/tours/page.tsx`](src/app/(site)/tours/page.tsx) to use `TourCard` again — single mapping lives inside TourCard now, call sites stay clean.
- **Shifted** the home "Signature collection" slice from `slice(0, 3)` → `slice(3, 6)` in [`src/app/(site)/page.tsx`](src/app/(site)/page.tsx) so it shows different tours from Featured (avoids the duplicated 3 cards × 2 sections look).
- `/dashboard/saved` and home "Signature collection" automatically pick up the new card visual via TourCard.

### 2026-05-21 — PlaceCard (card-22) replaces TourCard on Featured + /tours
- **Added** [`src/components/ui/card-22.tsx`](src/components/ui/card-22.tsx) — `PlaceCard` adapted from a 21st.dev source: framer-motion image carousel (chevrons appear on hover, pagination dots, swipe animation), in-view stagger animation, glass top badges (category + tag pill, star rating), `Top rated` outline badge, "From $X" price, and a "View details" CTA. Adapted to project conventions: base-ui `Button`/`Badge` (not Radix), `render={<Link/>}` for the CTA, `useRouter` to make the whole card clickable, `e.stopPropagation()` on the chevrons + dots, warm Oryx shadow.
- **Renamed** the source prop `pricePerNight` → `priceFrom` and added an `href` prop — tours aren't priced per night, and the card now navigates to `/tours/[slug]`.
- **Extended** [`src/types/index.ts`](src/types/index.ts) — added `images: string[]` to `Tour`. Populated each of the 6 tours in [`src/lib/mock-data.ts`](src/lib/mock-data.ts) with 3 stable Unsplash photo URLs via a tiny `unsplash(id)` helper.
- **Refactored** [`src/components/organisms/FeaturedTours.tsx`](src/components/organisms/FeaturedTours.tsx) — dropped the horizontal scroll (`flex overflow-x-auto`) for a `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`. Maps each `Tour` → `PlaceCard` props via a local `toPlaceCardProps` helper. Home page now passes `mockTours.slice(0, 3)` (was 4) so it fills exactly one row.
- **Refactored** [`src/app/(site)/tours/page.tsx`](src/app/(site)/tours/page.tsx) — swapped `TourCard` for `PlaceCard`, bumped grid from `md:grid-cols-2` to `sm:grid-cols-2 xl:grid-cols-3` (gives 3 cols when the FiltersPanel sidebar has room).
- `TourCard` is **not deleted** — still used in the home "Signature collection" and `/dashboard/saved`.

### 2026-05-21 — Hero swap: Hero2 (21st.dev-inspired) replaces HeroSection
- **Added** [`src/components/ui/hero-2-1.tsx`](src/components/ui/hero-2-1.tsx) — reskinned Hero2: warm-sand bg, three blurred orbs (amber / burgundy / sage), glass-pill badge, big centered headline, dual `rounded-full` CTAs (→ `/personalized`, `/tours`), and `<SearchBar />` embedded in the bottom slot (replaces the original component's hero image).
- **Stripped** the pasted component's internal `<nav>` + mobile sheet — `Navbar` already renders in `(site)/layout.tsx`.
- **Motion**: imported from `framer-motion` (already in deps), not the new `motion` package. A single `motion.div` fades + slides the headline cluster in on mount.
- **Edited** [`src/app/(site)/page.tsx`](src/app/(site)/page.tsx#L9) to import `Hero2` and render it in place of `HeroSection`.
- **Deleted** `src/components/organisms/HeroSection.tsx` (no other importers).
- Dropped the original's `bg-noise` / `bg-grainy` — undefined utilities in this project.

### 2026-05-21 — Initial codebase audit
- Mapped routes, components, design tokens, stores, auth, and Next 16 conventions.
- Created this `memory.md` as the running notebook for the upcoming 21st.dev prompts.
- No code changes yet.

---

## 8. Open questions / TODO parking lot

- [ ] Wire Supabase client into AuthProvider (replace localStorage seed accounts).
- [ ] Decide whether tour images stay as gradient placeholders or move to real `next/image` assets — affects `next.config.ts` `images` config.
- [ ] Persist `useSavedStore` to localStorage so saved tours survive reloads.
- [ ] Consider `unstable_instant` on `/tours` and `/dashboard` for snappier nav.
