(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const copyrightYear = document.getElementById('copyright-year');

  // ---- light / dark theme (dark is the default) ----
  const updateThemeLabel = () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    themeToggle?.setAttribute('aria-label', `Switch to ${next} theme`);
  };
  updateThemeLabel();
  themeToggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    updateThemeLabel();
  });

  // ---- mobile menu ----
  const closeMenu = () => {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    mobileNav.hidden = true;
  };
  menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    if (mobileNav) mobileNav.hidden = expanded;
  });
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 960) closeMenu(); });

  // ---- gentle fade-in as sections scroll into view ----
  const revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    revealables.forEach(el => io.observe(el));
  } else {
    revealables.forEach(el => el.classList.add('is-visible'));
  }

  // ---- photo lightbox ----
  const lb = document.getElementById('lightbox');
  if (lb) {
    const lbImg = lb.querySelector('img');
    const lbCap = lb.querySelector('figcaption');
    const close = () => { lb.hidden = true; lbImg.src = ''; };
    document.querySelectorAll('.gallery .zoom').forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      lbImg.src = a.getAttribute('href');
      lbImg.alt = a.querySelector('img')?.alt || '';
      lbCap.innerHTML = a.dataset.caption || '';
      lb.hidden = false;
      lb.querySelector('.lightbox-close').focus();
    }));
    lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.lightbox-close')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) close(); });
  }

  if (copyrightYear) copyrightYear.textContent = String(new Date().getFullYear());
})();
