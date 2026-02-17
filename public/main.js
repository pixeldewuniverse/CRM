(function () {
  const params = new URLSearchParams(window.location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];

  const firstPageKey = 'crm_first_page_view_at';
  if (!localStorage.getItem(firstPageKey)) {
    localStorage.setItem(firstPageKey, new Date().toISOString());
  }

  keys.forEach((key) => {
    const value = params.get(key);
    if (value) localStorage.setItem(key, value);
  });

  const form = document.getElementById('lead-form');
  if (form) {
    keys.forEach((key) => {
      const input = form.querySelector(`input[name="${key}"]`);
      if (input) input.value = localStorage.getItem(key) || '';
    });
    form.querySelector('input[name="landing_page_url"]').value = window.location.href;
    form.querySelector('input[name="first_page_view_at"]').value = localStorage.getItem(firstPageKey) || '';
  }

  const pageEvent = {
    event: 'page_view',
    page: window.CRM_PAGE || 'unknown',
    url: window.location.href,
    timestamp: new Date().toISOString(),
  };
  fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pageEvent),
  }).catch(() => {});

  if (window.CRM_PAGE === 'dashboard') {
    const tbody = document.querySelector('tbody');
    if (tbody) {
      tbody.addEventListener('change', async (event) => {
        const select = event.target;
        if (!(select instanceof HTMLSelectElement)) return;
        const row = select.closest('tr');
        if (!row) return;
        const id = Number(row.getAttribute('data-id'));
        const status = row.querySelector('select[data-field="status"]').value;
        const segment = row.querySelector('select[data-field="segment"]').value;
        await fetch('/api/leads/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status, segment }),
        });
      });
    }

    const applyBtn = document.getElementById('apply-filters');
    const exportBtn = document.getElementById('export-filtered');
    const statusInput = document.getElementById('filter-status');
    const segmentInput = document.getElementById('filter-segment');
    const campaignInput = document.getElementById('filter-campaign');

    const applyFilters = () => {
      const qs = new URLSearchParams();
      if (statusInput.value) qs.set('status', statusInput.value);
      if (segmentInput.value) qs.set('segment', segmentInput.value);
      if (campaignInput.value) qs.set('campaign', campaignInput.value);
      const query = qs.toString();
      window.location.href = `/dashboard${query ? `?${query}` : ''}`;
    };

    applyBtn?.addEventListener('click', applyFilters);

    const currentQs = new URLSearchParams(window.location.search);
    statusInput.value = currentQs.get('status') || '';
    segmentInput.value = currentQs.get('segment') || '';
    campaignInput.value = currentQs.get('campaign') || '';
    exportBtn.href = `/export?${currentQs.toString()}`;
  }
})();
