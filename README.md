# Oryx Tours

Luxury travel UI built with Next.js App Router, Tailwind CSS, shadcn/ui, and Zustand. This project focuses on premium, production-ready frontend architecture with reusable components.

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

## Supabase Setup

The app now reads live content from Supabase. Set these environment variables in `.env.local` before running the app:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The current read paths expect these tables to exist in Supabase:

- `profiles`
- `tours`
- `destinations`
- `operators`
- `vehicles`
- `bookings`
- `reviews`

The repo also includes a starter migration at `supabase/migrations/20260614_0001_initial.sql` that creates the tables, row-level security policies, and the auth trigger used by the app.

This migration creates schema and auth plumbing only; it does not insert default customer/catalog rows.

For login to work, create Supabase Auth users for any customer, partner, or admin accounts you want to test. The `profiles` table is populated automatically from auth metadata on sign-up.

### First User Bootstrap (No Demo Accounts)

If your project currently has no users/profiles:

1. Apply `supabase/migrations/20260614_0001_initial.sql` in Supabase SQL Editor.
2. Add redirect URLs in Supabase Auth settings:
   - `http://localhost:3000/auth/callback`
   - your production callback URL
3. Create your first real account from the app at `/sign-up`.
4. Promote that account to admin:

```sql
update public.profiles
set "role" = 'admin', "status" = 'active'
where "email" = 'admin@your-domain.com';
```

5. Sign out and sign in again. You should now land on `/admin`.

## Supabase Auth Setup

The app now uses:

- `src/proxy.ts` for server-side session refresh and route protection
- `src/app/auth/callback/route.ts` for email confirmation callbacks

In your Supabase project settings, add this redirect URL:

- `http://localhost:3000/auth/callback`

If you deploy, also add your production callback URL:

- `https://your-domain.com/auth/callback`

To promote an existing user to admin, run this in Supabase SQL Editor:

```sql
update public.profiles
set "role" = 'admin', "status" = 'active'
where "email" = 'admin@your-domain.com';
```

## Core Routes

- Home: /
- Tours & Experiences: /tours
- Tour Details: /tours/[slug]
- Transfers: /transfers
- Booking Flow: /booking
- Checkout & Payments: /checkout
- Booking Management: /dashboard
- Partner Operator Dashboard: /partner
- Personalized Tour: /personalized

## Project Structure

- src/app: App Router pages and layouts
- src/components: Atoms, molecules, organisms, and layout primitives
- src/lib: Formatting helpers and Supabase client/data access helpers
- src/store: Zustand UI state
- src/types: Shared TypeScript models
