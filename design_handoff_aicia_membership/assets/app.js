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

/* =====================================================================
 * AICIA membership — client-side auth (localStorage-backed demo)
 * ===================================================================== */
window.AICIA = (function () {
  const STORAGE_MEMBERS = 'aicia_members';       // Array<Member>
  const STORAGE_SESSION = 'aicia_session';       // { applicationNo }
  const BASE_COUNT = 312;                        // shown in Hero as "312+"

  function readMembers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_MEMBERS) || '[]');
    } catch (_) {
      return [];
    }
  }
  function writeMembers(list) {
    localStorage.setItem(STORAGE_MEMBERS, JSON.stringify(list));
  }
  function currentSession() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_SESSION) || 'null');
    } catch (_) {
      return null;
    }
  }
  function currentMember() {
    const s = currentSession();
    if (!s) return null;
    return readMembers().find((m) => m.applicationNo === s.applicationNo) || null;
  }
  function memberCount() {
    return BASE_COUNT + readMembers().length;
  }
  function generateApplicationNo() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `AICIA-${y}${m}${d}-${rand}`;
  }
  function register(payload) {
    // payload: { company, bizNo, contactName, role, email, phone, tier, area, intro }
    const list = readMembers();
    // dedupe by (email, company) — treat as re-application
    const exists = list.find(
      (m) => m.email.toLowerCase() === payload.email.toLowerCase() &&
             m.company.trim() === payload.company.trim()
    );
    if (exists) {
      const err = new Error('duplicate');
      err.code = 'duplicate';
      err.applicationNo = exists.applicationNo;
      throw err;
    }
    const record = {
      ...payload,
      applicationNo: generateApplicationNo(),
      status: 'received',                        // received → review → approved
      submittedAt: new Date().toISOString(),
    };
    list.push(record);
    writeMembers(list);
    localStorage.setItem(STORAGE_SESSION, JSON.stringify({ applicationNo: record.applicationNo }));
    return record;
  }
  function signOut() {
    localStorage.removeItem(STORAGE_SESSION);
  }

  return {
    readMembers, currentMember, currentSession, memberCount,
    register, signOut,
  };
})();

/* ========= Nav auth chip =========
 * If a session exists, replace the "회원가입 / Join" nav CTA with
 * a compact profile chip showing the company name + a dropdown to sign out.
 */
(function () {
  function render() {
    const container = document.querySelector('.nav .nav-actions');
    if (!container) return;
    const existing = container.querySelector('[data-auth-chip]');
    if (existing) existing.remove();

    const m = window.AICIA.currentMember();
    // Find join CTA link (nav's primary CTA)
    const joinBtn = container.querySelector('a[href$="join.html"]');
    if (m) {
      // Signed in → hide join CTA, show profile chip
      if (joinBtn) joinBtn.style.display = 'none';
      const chip = document.createElement('div');
      chip.className = 'auth-chip';
      chip.setAttribute('data-auth-chip', '');
      chip.innerHTML = `
        <button class="auth-chip-btn" type="button">
          <span class="auth-avatar">${escapeHtml(initials(m.company))}</span>
          <span class="auth-name">${escapeHtml(truncate(m.company, 16))}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="auth-menu" hidden>
          <div class="auth-menu-head">
            <div class="auth-menu-company">${escapeHtml(m.company)}</div>
            <div class="auth-menu-meta">${escapeHtml(m.applicationNo)}</div>
            <div class="auth-menu-status">
              <span class="status-dot"></span>
              <span data-lang="kr">${statusLabelKr(m.status)}</span>
              <span data-lang="en">${statusLabelEn(m.status)}</span>
            </div>
          </div>
          <a class="auth-menu-item" href="join_complete.html">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="4"/></svg>
            <span data-lang="kr">신청 현황 보기</span><span data-lang="en">View application</span>
          </a>
          <button class="auth-menu-item" data-auth-signout type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            <span data-lang="kr">로그아웃</span><span data-lang="en">Sign out</span>
          </button>
        </div>
      `;
      container.appendChild(chip);
    } else {
      if (joinBtn) joinBtn.style.display = '';
    }
  }
  function initials(s) {
    const t = (s || '').trim();
    if (!t) return '·';
    // Prefer first two visible chars (Korean composes to single glyph)
    return t.slice(0, 2).toUpperCase();
  }
  function truncate(s, n) {
    const t = s || '';
    return t.length > n ? t.slice(0, n - 1) + '…' : t;
  }
  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }
  function statusLabelKr(s) {
    return ({ received: '접수됨 · 사무국 확인 중', review: '심사 중', approved: '승인 완료' })[s] || s;
  }
  function statusLabelEn(s) {
    return ({ received: 'Received · under review', review: 'In review', approved: 'Approved' })[s] || s;
  }

  document.addEventListener('DOMContentLoaded', render);
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.auth-chip-btn');
    if (trigger) {
      const menu = trigger.parentElement.querySelector('.auth-menu');
      const open = !menu.hasAttribute('hidden');
      // close others
      document.querySelectorAll('.auth-menu').forEach((m) => m.setAttribute('hidden', ''));
      if (!open) menu.removeAttribute('hidden');
      return;
    }
    if (e.target.closest('[data-auth-signout]')) {
      window.AICIA.signOut();
      render();
      return;
    }
    // click outside → close
    if (!e.target.closest('.auth-chip')) {
      document.querySelectorAll('.auth-menu').forEach((m) => m.setAttribute('hidden', ''));
    }
  });
})();

/* ========= Hero live counter (reflects new sign-ups) ========= */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const el = document.querySelector('[data-live-count="members"]');
    if (!el) return;
    el.textContent = String(window.AICIA.memberCount());
  });
})();
