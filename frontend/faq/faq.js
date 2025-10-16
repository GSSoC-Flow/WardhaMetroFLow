// faq.js
document.addEventListener('DOMContentLoaded', () => {
  // 1) Load navbar from components/navbar.html
  fetch('../components/navbar.html')
    .then(res => {
      if (!res.ok) throw new Error('Navbar load failed');
      return res.text();
    })
    .then(html => {
      document.getElementById('navbar-placeholder').innerHTML = html;

      // After navbar is inserted, highlight active link
      highlightActiveNav();
    })
    .catch(err => {
      console.error(err);
      // fallback: leave placeholder empty
    });

  // 2) Load footer
  fetch('../components/footer.html')
    .then(res => res.ok ? res.text() : '')
    .then(html => {
      document.getElementById('footer-placeholder').innerHTML = html;
    })
    .catch(err => {
      console.error('Footer load failed', err);
    });

  // 3) Accordion behavior (single open at a time)
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;

      // close others
      document.querySelectorAll('.accordion-item').forEach(i => {
        if (i !== item) i.classList.remove('active');
      });

      // toggle current
      item.classList.toggle('active');

      // ensure content transitions use max-height; if opening, set maxHeight to scrollHeight
      const content = item.querySelector('.accordion-content');
      if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = null;
      }
    });
  });

  // If some items are pre-opened (for accessibility), initialize their max-heights
  document.querySelectorAll('.accordion-item.active .accordion-content').forEach(c => {
    c.style.maxHeight = c.scrollHeight + 'px';
  });
});

// Highlight nav link matching current page filename
function highlightActiveNav() {
  try {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    // nav links might be relative — we search by href ending with current
    const navLinks = document.querySelectorAll('.main-nav a, nav a, .nav-link');
    navLinks.forEach(a => {
      const href = a.getAttribute('href') || '';
      const last = href.split('/').pop();
      if (last === current || (current === 'faq.html' && href.includes('faq'))) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  } catch (e) {
    console.error('Error highlighting nav:', e);
  }
}
