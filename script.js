const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const form = document.getElementById('rsvpForm');
const statusEl = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const scriptUrl = window.RSVP_SCRIPT_URL;
    if (!scriptUrl || scriptUrl.includes('PASTE_YOUR')) {
      statusEl.textContent = 'Add your Google Apps Script web app URL in index.html before testing the form.';
      statusEl.style.color = '#b03030';
      return;
    }

    const payload = Object.fromEntries(new FormData(form).entries());
    payload.submittedAt = new Date().toISOString();
    payload.userAgent = navigator.userAgent;
    payload.pageUrl = window.location.href;

    statusEl.textContent = 'Sending your RSVP...';
    statusEl.style.color = '#123f95';

    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        }
      });

      const result = await response.json().catch(() => ({ status: 'ok' }));

      if (!response.ok || result.status !== 'ok') {
        throw new Error(result.message || 'There was a problem sending your RSVP.');
      }

      statusEl.textContent = 'Thank you — your RSVP was received.';
      statusEl.style.color = '#1f6b36';
      form.reset();
    } catch (error) {
      statusEl.textContent = error.message || 'There was a problem sending your RSVP.';
      statusEl.style.color = '#b03030';
    }
  });
}
