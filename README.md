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
   - Required for server lead API: `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose to browser).
4. Run SQL from `supabase/schema.sql` in the Supabase SQL editor.
5. Start app:
   ```bash
   npm run dev
   ```

## Lead capture setup (Kado Bajo landing page)

The landing page submits `name`, `email`, and `phone` to `POST /api/leads`, which stores data in `leads`.

Make sure your Supabase `leads` table includes:

- `id` (uuid primary key)
- `name` (text)
- `email` (text)
- `phone` (text)
- `tag` (text)
- `source` (text, example: `landing_page`)
- `status` (text: `new | contacted | negotiation | deal | lost`)
- `value` (numeric)
- `created_at` (timestamp with default `now()`)

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
- If you prefer stronger typed queries and cleaner error handling, you can switch lead ingestion from raw REST `fetch` to `@supabase/supabase-js` using server-only `SUPABASE_SERVICE_ROLE_KEY`.
