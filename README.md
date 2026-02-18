# CRM Phase 1 MVP (Next.js + Prisma + PostgreSQL)

Vercel-ready MVP CRM lead capture system using **Next.js App Router**, **Tailwind CSS**, and **PostgreSQL via Prisma**.

## Features

- Landing page at `/`
  - Captures URL attribution params: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `gclid`
  - Records `page_view` on load and stores `first_page_view_at`
  - Lead form fields: name, phone/whatsapp, interest, notes
  - Submits to API and redirects to `/thank-you`
- Thank-you page at `/thank-you`
  - Benefit download placeholder link
- Dashboard login placeholder at `/dashboard/login`
- Dashboard at `/dashboard`
  - Modern Kanban board by status (`new`, `contacted`, `qualified`, `won`, `lost`)
  - Card move dropdown to update lead status
  - Filters by segment, name/phone search, and campaign
  - CSV exports: all, HOT, WARM, by status, and filtered
- Segmentation rules
  - HOT if `interest === "Order Now"` OR notes contain `urgent` (case-insensitive)
  - Else WARM

## API Routes

- `POST /api/lead` -> create lead
- `PATCH /api/lead/:id` -> update status/segment
- `PATCH /api/lead` (with `id`) -> update status/segment
- `GET /api/export?segment=hot|warm&status=&utm_campaign=` -> CSV download
- `POST /api/page-view` -> logs page_view event
- `GET /api/health` -> quick deployment health check

## Data Model

- Prisma schema: `prisma/schema.prisma`
- Initial migration SQL: `prisma/migrations/20260217162000_init/migration.sql`

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Set `DATABASE_URL` in `.env` to your PostgreSQL database.
4. Run migration:
   ```bash
   npx prisma migrate deploy
   ```
5. Generate Prisma client (if needed):
   ```bash
   npx prisma generate
   ```
6. Start dev server:
   ```bash
   npm run dev
   ```

## Production / Vercel Deployment

1. Push this repo to GitHub.
2. In Vercel, import the GitHub repo.
3. Set environment variable:
   - `DATABASE_URL` = your production PostgreSQL connection string.
4. Set build command (optional; default works with package scripts):
   - `npm run build`
5. Add post-deploy migration step in your workflow/CI (or run manually):
   - `npx prisma migrate deploy`
6. Every PR gets a Preview Deployment in Vercel automatically when connected to GitHub.

## Notes

- No SQLite is used.
- `npm run build` runs `next build`.
