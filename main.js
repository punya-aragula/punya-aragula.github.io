(() => {
  const root = document.documentElement;

  // ---- light / dark mode (dark is the default) ----
  const modeBtn = document.getElementById('mode');
  const modeText = modeBtn?.querySelector('.mode-text');
  const syncMode = () => {
    const isLight = root.classList.contains('light');
    const next = isLight ? 'dark' : 'light';
    if (modeText) modeText.textContent = isLight ? 'Dark mode' : 'Light mode';
    modeBtn?.setAttribute('aria-label', `Switch to ${next} mode`);
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', isLight ? '#F6F7F9' : '#161B22');
  };
  syncMode();
  modeBtn?.addEventListener('click', () => {
    const isLight = root.classList.toggle('light');
    try { localStorage.setItem('pa-theme', isLight ? 'light' : 'dark'); } catch (e) {}
    syncMode();
  });

  // ---- highlight the current section in the sidebar ----
  const links = [...document.querySelectorAll('.toc a')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => {
          const on = a.getAttribute('href') === '#' + e.target.id;
          a.classList.toggle('on', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => io.observe(s));
  }

  // ---- photo viewer ----
  const viewer = document.getElementById('viewer');
  if (viewer && typeof viewer.showModal === 'function') {
    const img = viewer.querySelector('img');
    const cap = viewer.querySelector('figcaption');
    document.querySelectorAll('.snap').forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      img.src = a.getAttribute('href');
      img.alt = a.querySelector('img')?.alt || '';
      cap.textContent = a.dataset.cap || '';
      viewer.showModal();
    }));
    viewer.querySelector('.viewer-x')?.addEventListener('click', () => viewer.close());
    viewer.addEventListener('click', e => { if (e.target === viewer) viewer.close(); });
    viewer.addEventListener('close', () => { img.src = ''; });
  }

  // ---- footer year ----
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
