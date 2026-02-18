const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const querystring = require('querystring');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, '..', 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const EVENTS_FILE = path.join(DATA_DIR, 'events.log');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(LEADS_FILE)) fs.writeFileSync(LEADS_FILE, '[]', 'utf8');
  if (!fs.existsSync(EVENTS_FILE)) fs.writeFileSync(EVENTS_FILE, '', 'utf8');
}

function readLeads() {
  try {
    return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeLeads(leads) {
  const tempFile = `${LEADS_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(leads, null, 2), 'utf8');
  fs.renameSync(tempFile, LEADS_FILE);
}

function logEvent(type, payload = {}) {
  const entry = {
    type,
    timestamp: new Date().toISOString(),
    ...payload,
  };
  fs.appendFileSync(EVENTS_FILE, `${JSON.stringify(entry)}\n`, 'utf8');
}

function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) return {};
  return header.split(';').reduce((acc, item) => {
    const parts = item.split('=');
    const key = parts.shift()?.trim();
    if (!key) return acc;
    acc[key] = decodeURIComponent(parts.join('='));
    return acc;
  }, {});
}

function setCookie(res, name, value, maxAgeSeconds = 30 * 24 * 60 * 60) {
  const cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
  const existing = res.getHeader('Set-Cookie') || [];
  const cookies = Array.isArray(existing) ? existing : [existing];
  res.setHeader('Set-Cookie', [...cookies, cookie]);
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function computeSegment(interest, notes) {
  const normalizedInterest = (interest || '').trim().toLowerCase();
  const normalizedNotes = (notes || '').toLowerCase();
  if (normalizedInterest === 'order now' || normalizedNotes.includes('urgent')) {
    return 'hot';
  }
  return 'warm';
}

function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) req.destroy();
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function serveStatic(req, res, pathname) {
  const safePath = pathname.replace('/public/', '');
  const fullPath = path.join(PUBLIC_DIR, safePath);
  if (!fullPath.startsWith(PUBLIC_DIR) || !fs.existsSync(fullPath)) return false;

  const ext = path.extname(fullPath);
  const contentType = {
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  }[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  res.end(fs.readFileSync(fullPath));
  return true;
}

function pageTemplate(title, content, extraScripts = '') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="/public/styles.css" />
</head>
<body>
  ${content}
  <script src="/public/main.js"></script>
  ${extraScripts}
</body>
</html>`;
}

function landingPage() {
  return pageTemplate(
    'Lead Capture CRM - Landing',
    `<main class="container">
      <section class="hero card">
        <h1>Get Your Free Growth Playbook in 2 Minutes</h1>
        <p>Leave your details to receive instant access and personalized offers.</p>
      </section>

      <section class="card">
        <h2>Claim your benefit</h2>
        <form method="POST" action="/submit-lead" class="lead-form" id="lead-form">
          <label>Name*
            <input required type="text" name="name" maxlength="120" />
          </label>
          <label>Phone / WhatsApp*
            <input required type="text" name="phone" maxlength="40" />
          </label>
          <label>Interest*
            <select required name="interest">
              <option value="">Select one</option>
              <option>Order Now</option>
              <option>Need More Info</option>
              <option>Book a Call</option>
            </select>
          </label>
          <label>Notes (optional)
            <textarea name="notes" rows="3" maxlength="600"></textarea>
          </label>

          <input type="hidden" name="utm_source" />
          <input type="hidden" name="utm_medium" />
          <input type="hidden" name="utm_campaign" />
          <input type="hidden" name="utm_content" />
          <input type="hidden" name="utm_term" />
          <input type="hidden" name="fbclid" />
          <input type="hidden" name="gclid" />
          <input type="hidden" name="landing_page_url" />
          <input type="hidden" name="first_page_view_at" />

          <button type="submit">Get Instant Access</button>
        </form>
      </section>

      <section class="card">
        <h2>Trusted by 1,000+ customers</h2>
        <p>Social proof placeholder — add testimonials/logos here.</p>
      </section>

      <section class="card">
        <h2>FAQ</h2>
        <p>FAQ placeholder — add common questions here.</p>
      </section>
    </main>
    <footer class="footer">© ${new Date().getFullYear()} CRM MVP</footer>`,
    `<script>window.CRM_PAGE='landing';</script>`
  );
}

function thankYouPage() {
  return pageTemplate(
    'Thank You',
    `<main class="container"><section class="card">
      <h1>You're all set ✅</h1>
      <p>Your free benefit is ready.</p>
      <p><a class="button-link" href="#" onclick="return false;">Download your benefit (placeholder)</a></p>
      <p><a class="button-link secondary" href="/dashboard">Go to CRM Dashboard</a></p>
    </section></main>`,
    `<script>window.CRM_PAGE='thank-you';</script>`
  );
}

function dashboardPage(leads) {
  const rows = leads
    .map(
      (lead) => `<tr data-id="${lead.id}">
        <td>${lead.id}</td>
        <td>${escapeHtml(lead.name)}</td>
        <td>${escapeHtml(lead.phone)}</td>
        <td>${escapeHtml(lead.interest)}</td>
        <td>${escapeHtml(lead.utm_campaign || '')}</td>
        <td>
          <select data-field="status">
            ${['new', 'contacted', 'qualified', 'won', 'lost']
              .map((status) => `<option ${lead.status === status ? 'selected' : ''}>${status}</option>`)
              .join('')}
          </select>
        </td>
        <td>
          <select data-field="segment">
            ${['hot', 'warm'].map((segment) => `<option ${lead.segment === segment ? 'selected' : ''}>${segment}</option>`).join('')}
          </select>
        </td>
        <td>${escapeHtml(lead.createdAt)}</td>
      </tr>`
    )
    .join('');

  return pageTemplate(
    'CRM Dashboard',
    `<main class="container">
      <section class="card">
        <h1>CRM Dashboard</h1>
        <div class="filters">
          <label>Status
            <select id="filter-status">
              <option value="">All</option>
              <option>new</option><option>contacted</option><option>qualified</option><option>won</option><option>lost</option>
            </select>
          </label>
          <label>Segment
            <select id="filter-segment">
              <option value="">All</option>
              <option>hot</option><option>warm</option>
            </select>
          </label>
          <label>Campaign
            <input id="filter-campaign" type="text" placeholder="utm_campaign" />
          </label>
          <button id="apply-filters">Apply</button>
        </div>

        <div class="actions">
          <a class="button-link" href="/export?segment=hot">Export HOT CSV</a>
          <a class="button-link" href="/export?segment=warm">Export WARM CSV</a>
          <a class="button-link" id="export-filtered" href="/export">Export filtered CSV</a>
        </div>

        <div class="table-wrap"><table>
          <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Interest</th><th>Campaign</th><th>Status</th><th>Segment</th><th>Created At</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
      </section>
    </main>`,
    `<script>window.CRM_PAGE='dashboard';</script>`
  );
}

function toCsv(leads) {
  const headers = [
    'id', 'createdAt', 'name', 'phone', 'interest', 'notes', 'status', 'segment',
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'fbclid', 'gclid', 'landing_page_url', 'first_page_view_at', 'form_submit_at'
  ];
  const lines = [headers.join(',')];
  for (const lead of leads) {
    const row = headers.map((h) => {
      const value = lead[h] == null ? '' : String(lead[h]);
      return `"${value.replace(/"/g, '""')}"`;
    });
    lines.push(row.join(','));
  }
  return lines.join('\n');
}

function filteredLeads(urlObj, leads) {
  const status = urlObj.searchParams.get('status') || '';
  const segment = urlObj.searchParams.get('segment') || '';
  const campaign = (urlObj.searchParams.get('campaign') || '').toLowerCase();

  return leads.filter((lead) => {
    const statusOk = !status || lead.status === status;
    const segmentOk = !segment || lead.segment === segment;
    const campaignOk = !campaign || (lead.utm_campaign || '').toLowerCase().includes(campaign);
    return statusOk && segmentOk && campaignOk;
  });
}

async function handler(req, res) {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;

  if (pathname.startsWith('/public/')) {
    if (serveStatic(req, res, pathname)) return;
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const cookies = parseCookies(req);

  if (req.method === 'GET' && pathname === '/') {
    const nowIso = new Date().toISOString();
    if (!cookies.first_page_view_at) {
      setCookie(res, 'first_page_view_at', nowIso);
    }
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'].forEach((key) => {
      const value = urlObj.searchParams.get(key);
      if (value) setCookie(res, key, value);
    });

    logEvent('page_view', {
      path: pathname,
      query: Object.fromEntries(urlObj.searchParams.entries()),
      first_page_view_at: cookies.first_page_view_at || nowIso,
    });

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(landingPage());
    return;
  }

  if (req.method === 'GET' && pathname === '/thank-you') {
    logEvent('page_view', { path: pathname });
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(thankYouPage());
    return;
  }

  if (req.method === 'POST' && pathname === '/submit-lead') {
    const body = await getBody(req);
    const form = querystring.parse(body);
    const leads = readLeads();

    const lead = {
      id: leads.length + 1,
      createdAt: new Date().toISOString(),
      name: (form.name || '').toString().trim(),
      phone: (form.phone || '').toString().trim(),
      interest: (form.interest || '').toString().trim(),
      notes: (form.notes || '').toString().trim(),
      status: 'new',
      segment: computeSegment(form.interest, form.notes),
      utm_source: (form.utm_source || cookies.utm_source || '').toString(),
      utm_medium: (form.utm_medium || cookies.utm_medium || '').toString(),
      utm_campaign: (form.utm_campaign || cookies.utm_campaign || '').toString(),
      utm_content: (form.utm_content || cookies.utm_content || '').toString(),
      utm_term: (form.utm_term || cookies.utm_term || '').toString(),
      fbclid: (form.fbclid || cookies.fbclid || '').toString(),
      gclid: (form.gclid || cookies.gclid || '').toString(),
      landing_page_url: (form.landing_page_url || '').toString(),
      first_page_view_at: (form.first_page_view_at || cookies.first_page_view_at || '').toString(),
      form_submit_at: new Date().toISOString(),
    };

    if (!lead.name || !lead.phone || !lead.interest) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Missing required fields');
      return;
    }

    leads.push(lead);
    writeLeads(leads);

    logEvent('form_submit', {
      leadId: lead.id,
      utm_campaign: lead.utm_campaign,
      segment: lead.segment,
    });

    res.writeHead(302, { Location: '/thank-you' });
    res.end();
    return;
  }

  if (req.method === 'GET' && pathname === '/dashboard') {
    const leads = filteredLeads(urlObj, readLeads());
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(dashboardPage(leads));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/leads/update') {
    const body = await getBody(req);
    const payload = JSON.parse(body || '{}');
    const leads = readLeads();
    const lead = leads.find((item) => item.id === Number(payload.id));
    if (!lead) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'Lead not found' }));
      return;
    }

    if (payload.status && ['new', 'contacted', 'qualified', 'won', 'lost'].includes(payload.status)) {
      lead.status = payload.status;
    }
    if (payload.segment && ['hot', 'warm'].includes(payload.segment)) {
      lead.segment = payload.segment;
    }

    writeLeads(leads);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, lead }));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/events') {
    const body = await getBody(req);
    let payload = {};
    try { payload = JSON.parse(body || '{}'); } catch {}
    logEvent('client_event', payload);
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && pathname === '/export') {
    const leads = filteredLeads(urlObj, readLeads());
    const csv = toCsv(leads);
    const suffix = new Date().toISOString().slice(0, 10);
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${suffix}.csv"`,
    });
    res.end(csv);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
}

ensureDataFiles();

http.createServer((req, res) => {
  handler(req, res).catch((err) => {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal server error');
  });
}).listen(PORT, () => {
  console.log(`CRM MVP running at http://localhost:${PORT}`);
});
