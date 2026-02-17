# CRM Lead Capture MVP (Phase 1)

Simple web-based CRM lead capture system for ad traffic.

## Features

- Landing page with:
  - Hero section
  - Short lead form
  - Trust/social proof placeholder
  - FAQ placeholder
  - Footer
- Redirects to `/thank-you` after lead submit.
- Captures attribution data:
  - UTM params (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`)
  - `fbclid`, `gclid`
  - `first_page_view_at`, `form_submit_at`
- Lead storage in reliable JSON file with atomic writes.
- Segmentation rules:
  - **HOT** if interest = `Order Now` OR notes include `urgent` (case-insensitive)
  - Otherwise **WARM**
- Dashboard at `/dashboard`:
  - List leads
  - Filter by status, segment, campaign
  - Inline edit status and segment (manual override)
  - Export HOT / WARM / filtered CSV
- Events:
  - server-side logs (`data/events.log`)
  - basic client events posted to `/api/events`

## Project Structure

- `src/server.js` - HTTP server and business logic
- `public/styles.css` - Styling
- `public/main.js` - Client tracking + dashboard interactions
- `data/leads.json` - Lead storage
- `data/events.log` - Event logs

## Requirements

- Node.js 18+

## Run locally

```bash
node src/server.js
```

Then open:

- Landing page: `http://localhost:3000/`
- Dashboard: `http://localhost:3000/dashboard`

## Optional environment variables

Create `.env` if needed (optional):

```env
PORT=3000
```

## CSV Exports

- HOT: `/export?segment=hot`
- WARM: `/export?segment=warm`
- Filtered: `/export?status=new&segment=hot&campaign=spring`

## Notes

- No external API keys required.
- Do not commit secrets to repository.
