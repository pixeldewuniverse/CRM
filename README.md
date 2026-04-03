# Next.js + Supabase CRM

A fullstack CRM web application built with **Next.js App Router**, **Tailwind CSS**, and **Supabase (PostgreSQL + Auth)**.

## Features

- Email/password authentication (Supabase Auth)
- Role support (`admin`, `staff`) via `profiles.role`
- Dashboard metrics: total customers, total deals, revenue, recent activities
- Customer module: create/list/detail (+ search & tag filter)
- Sales pipeline: Kanban board with status updates
- Activity tasks: call/follow-up/meeting, assign to user, due date
- Communication log: WhatsApp/email simulation with history
- Simple analytics chart for deal statuses

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env:
   ```bash
   cp .env.example .env.local
   ```
3. Fill in Supabase keys from your project.
   - Optional: set `NEXT_PUBLIC_WHATSAPP_NUMBER` (default `6281234567890`) for post-submit automation.
4. Run SQL from `supabase/schema.sql` in the Supabase SQL editor.
5. Start app:
   ```bash
   npm run dev
   ```

## Lead capture setup (Kado Bajo landing page)

The landing page submits `name`, `email`, and `phone` to `POST /api/leads`, which stores data in `customers`.

Make sure your Supabase `customers` table includes:

- `id` (uuid or serial primary key)
- `name` (text)
- `email` (text)
- `phone` (text)
- `created_at` (timestamp with default `now()`)

Example SQL if `email` is missing:

```sql
alter table public.customers
add column if not exists email text;
```

## Project structure

- `app/(auth)/login` — login UI
- `app/(crm)` — protected CRM pages
- `app/api/*` — route handlers for auth + CRUD actions
- `components/crm/*` — reusable UI modules (sidebar, kanban, chart)
- `lib/supabase/*` — browser/server/middleware clients
- `supabase/schema.sql` — database schema + RLS policies

## Notes

- `Send WhatsApp` is mock logging for now (stored in `messages` table).
- For production, tighten RLS by role/ownership instead of broad authenticated policies.
