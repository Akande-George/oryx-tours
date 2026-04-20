# Oryx Tours

Luxury travel UI built with Next.js App Router, Tailwind CSS, shadcn/ui, and Zustand. This project focuses on premium, production-ready frontend architecture with reusable components and realistic mock data.

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
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
- src/lib: Mock data, formatting helpers, and Supabase client scaffolding
- src/store: Zustand UI state
- src/types: Shared TypeScript models
