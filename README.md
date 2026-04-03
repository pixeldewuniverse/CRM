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
4. Run SQL from `supabase/schema.sql` in the Supabase SQL editor.
5. Start app:
   ```bash
   npm run dev
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
