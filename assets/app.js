// AICIA — Common app JS

/* ========= Language toggle ========= */
(function () {
  const saved = localStorage.getItem('aicia_lang') || 'kr';
  if (saved === 'en') document.body.classList.add('lang-en');
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-set-lang]');
    if (!b) return;
    const l = b.getAttribute('data-set-lang');
    if (l === 'en') document.body.classList.add('lang-en');
    else document.body.classList.remove('lang-en');
    localStorage.setItem('aicia_lang', l);
    syncLangUI();
  });
  function syncLangUI() {
    const l = document.body.classList.contains('lang-en') ? 'en' : 'kr';
    document.querySelectorAll('[data-set-lang]').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-set-lang') === l);
    });
  }
  document.addEventListener('DOMContentLoaded', syncLangUI);
})();

/* ========= Nav scroll state ========= */
(function () {
  const nav = () => document.querySelector('.nav');
  const onScroll = () => {
    const n = nav();
    if (!n) return;
    n.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('DOMContentLoaded', onScroll);
})();

/* ========= Reveal on scroll ========= */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  });
})();

/* ========= Tweaks (Edit Mode) ========= */
(function () {
  const PALETTES = {
    blue:    { accent: '#2563eb', accent2: '#1d4ed8', accentSoft: '#eff4ff', accentInk: '#0b3ea8' },
    indigo:  { accent: '#4f46e5', accent2: '#4338ca', accentSoft: '#eef0ff', accentInk: '#2a2599' },
    teal:    { accent: '#0d9488', accent2: '#0f766e', accentSoft: '#e6fbf7', accentInk: '#065f57' },
    graphite:{ accent: '#334155', accent2: '#1e293b', accentSoft: '#f1f5f9', accentInk: '#0f172a' },
  };
  const FONTS = {
    pretendard: { display: '"Pretendard", "Inter", system-ui, sans-serif', sans: '"Pretendard", "Inter", system-ui, sans-serif' },
    ibm:        { display: '"IBM Plex Sans KR", "IBM Plex Sans", system-ui, sans-serif', sans: '"IBM Plex Sans KR", "IBM Plex Sans", system-ui, sans-serif' },
    serif:      { display: '"Noto Serif KR", "Instrument Serif", serif', sans: '"Pretendard", "Inter", system-ui, sans-serif' },
  };

  const DEFAULTS = window.__TWEAK_DEFAULTS__ || { palette: 'blue', font: 'pretendard' };
  let state = { ...DEFAULTS };

  function applyPalette(name) {
    const p = PALETTES[name] || PALETTES.blue;
    const r = document.documentElement.style;
    r.setProperty('--accent', p.accent);
    r.setProperty('--accent-2', p.accent2);
    r.setProperty('--accent-soft', p.accentSoft);
    r.setProperty('--accent-ink', p.accentInk);
  }
  function applyFont(name) {
    const f = FONTS[name] || FONTS.pretendard;
    const r = document.documentElement.style;
    r.setProperty('--font-display', f.display);
    r.setProperty('--font-sans', f.sans);
  }
  function apply() {
    applyPalette(state.palette);
    applyFont(state.font);
    syncUI();
  }
  function syncUI() {
    document.querySelectorAll('[data-tweak-palette]').forEach((el) => {
      el.classList.toggle('active', el.getAttribute('data-tweak-palette') === state.palette);
    });
    document.querySelectorAll('[data-tweak-font]').forEach((el) => {
      el.classList.toggle('active', el.getAttribute('data-tweak-font') === state.font);
    });
  }
  function persist(patch) {
    Object.assign(state, patch);
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
    } catch (e) {}
    apply();
  }

  document.addEventListener('DOMContentLoaded', apply);
  document.addEventListener('click', (e) => {
    const p = e.target.closest('[data-tweak-palette]');
    if (p) return persist({ palette: p.getAttribute('data-tweak-palette') });
    const f = e.target.closest('[data-tweak-font]');
    if (f) return persist({ font: f.getAttribute('data-tweak-font') });
    if (e.target.closest('.tweaks-btn')) {
      document.querySelector('.tweaks-panel')?.classList.toggle('open');
    }
    if (e.target.closest('.tweaks-panel .close')) {
      document.querySelector('.tweaks-panel')?.classList.remove('open');
    }
  });

  // Edit mode protocol
  window.addEventListener('message', (e) => {
    const d = e.data || {};
    if (d.type === '__activate_edit_mode') document.body.classList.add('tweaks-on');
    if (d.type === '__deactivate_edit_mode') {
      document.body.classList.remove('tweaks-on');
      document.querySelector('.tweaks-panel')?.classList.remove('open');
    }
  });
  try {
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  } catch (e) {}
})();

/* ========= Marquee: duplicate contents for seamless loop ========= */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.marquee').forEach((m) => {
    m.innerHTML = m.innerHTML + m.innerHTML;
  });
});
