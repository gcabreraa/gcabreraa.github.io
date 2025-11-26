// js/router.js

// ---------- Config (use RELATIVE paths if deploying to a subfolder) ----------
const routes = {
  '#home'      : 'templates/home.html',
  '#about'     : 'templates/about.html',
  '#education' : 'templates/education.html',
  '#projects'  : 'templates/projects.html',
  '#experience': 'templates/experience.html',
  '#contact'   : 'templates/contact.html'
};

// ---------- DOM refs ----------
const appContent    = document.getElementById('app-content');
const appTitle      = document.getElementById('app-title');
const taskItem      = document.querySelector('.task-items .task');
const appWindow     = document.getElementById('app-window');
const minimizeBtn   = document.querySelector('.win-btn.minimize');
const maximizeBtn   = document.querySelector('.win-btn.maximize');
const closeBtn      = document.querySelector('.win-btn.close');
const titleBar      = document.querySelector('.titlebar');
const themeToggle   = document.getElementById('a11y-toggle');
const THEME_DEFAULT = 'theme-pixel';
const THEME_ACCESS  = 'theme-accessible';

// ---------- Small utils: year + clock ----------
(function initClockAndYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const clockEl = document.getElementById('clock');
  function tick() {
    if (!clockEl) return;
    const d = new Date();
    const hh = String(d.getHours()).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    clockEl.textContent = `${hh}:${mm}`;
  }
  tick();
  setInterval(tick, 10000);
})();

// ---------- Template cache ----------
const tplCache = new Map();
async function fetchTemplate(url) {
  if (tplCache.has(url)) return tplCache.get(url);
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${url}`);
  const html = await res.text();
  const wrap = document.createElement('div');
  wrap.innerHTML = html;

  const content = wrap.querySelector('.content');
  const meta    = wrap.querySelector('.meta');
  const payload = {
    html: content ? content.innerHTML : html,
    title: meta?.dataset?.title || 'window'
  };
  tplCache.set(url, payload);
  return payload;
}

// ---------- Render ----------
async function render(hash) {
  const route = routes[hash] || routes['#home'];
  try {
    const { html, title } = await fetchTemplate(route);
    appContent.innerHTML = html;                 // insert only the inner .content
    appTitle.textContent = title;                // update window title
    if (taskItem) taskItem.textContent = title;  // update taskbar
    document.title = `Giuliana Cabrera — ${title.replace(/ — /g, ' · ')}`;
    setActiveSideIcon(hash);
    appContent.scrollTop = 0;                    // reset scroll inside window
  } catch (err) {
    appContent.innerHTML = `<div class="content"><p>Failed to load: <code>${route}</code></p><pre class="terminal">${String(err)}</pre></div>`;
    appTitle.textContent = 'error — load failed';
    appContent.style.webkitOverflowScrolling = 'touch';
    if (taskItem) taskItem.textContent = appTitle.textContent;
  }
}

// ---------- Navigation helpers ----------
function navigate(hash) {
  if (!hash) hash = '#home';
  reopenWindow();
  history.replaceState(null, '', hash);
  return render(hash);
}

window.addEventListener('hashchange', () => render(location.hash));

// Intercept internal # links globally (works for injected content too)
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  navigate(a.getAttribute('href'));
});

// Keyboard shortcuts: g + (h/a/p/e/c)
const keyMap = { h:'#home', a:'#about', p:'#projects', e:'#experience', c:'#contact' };
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    navigate('#home');
    return;
  }
  if (e.key.toLowerCase() === 'g') {
    window.__gPressed = true;
    setTimeout(() => (window.__gPressed = false), 800);
    return;
  }
  if (window.__gPressed && keyMap[e.key.toLowerCase()]) {
    navigate(keyMap[e.key.toLowerCase()]);
    window.__gPressed = false;
  }
});

// Highlight active sidebar icon
function setActiveSideIcon(hash) {
  document.querySelectorAll('.side-icon').forEach(a => a.classList.remove('active'));
  const active = document.querySelector(`.side-icon[href="${hash}"]`);
  if (active) active.classList.add('active');
}

// ---------- Theme toggle ----------
function updateThemeToggleState(theme) {
  if (!themeToggle) return;
  const isAccessible = theme === THEME_ACCESS;
  themeToggle.setAttribute('aria-pressed', String(isAccessible));
  themeToggle.textContent = isAccessible ? 'Lights On' : 'Lights Off';
}

function applyThemeClass(theme) {
  if (!document.body) return;
  document.body.classList.remove(THEME_DEFAULT, THEME_ACCESS);
  document.body.classList.add(theme);
  localStorage.setItem('preferredTheme', theme);
  updateThemeToggleState(theme);
}

function initThemeToggle() {
  if (!document.body) return;
  const saved = localStorage.getItem('preferredTheme');
  const initial = saved === THEME_ACCESS ? THEME_ACCESS : THEME_DEFAULT;
  applyThemeClass(initial);
  themeToggle?.addEventListener('click', () => {
    const next = document.body.classList.contains(THEME_ACCESS) ? THEME_DEFAULT : THEME_ACCESS;
    applyThemeClass(next);
  });
}

// ---------- Window controls ----------
function setTaskVisibility(isVisible) {
  if (!taskItem) return;
  taskItem.classList.toggle('hidden', !isVisible);
}

function setTaskMinimizedState(isMinimized) {
  if (!taskItem) return;
  taskItem.classList.toggle('minimized', isMinimized);
}

function updateWindowAria() {
  if (!appWindow) return;
  const hidden = appWindow.classList.contains('closed') || appWindow.classList.contains('minimized');
  appWindow.setAttribute('aria-hidden', hidden ? 'true' : 'false');
}

function reopenWindow() {
  if (!appWindow) return;
  appWindow.classList.remove('closed', 'minimized');
  updateWindowAria();
  setTaskVisibility(true);
  setTaskMinimizedState(false);
}

function toggleMinimize() {
  if (!appWindow) return;
  const willMinimize = !appWindow.classList.contains('minimized');
  appWindow.classList.toggle('minimized');
  if (willMinimize) {
    appWindow.classList.remove('maximized');
  }
  setTaskMinimizedState(appWindow.classList.contains('minimized'));
  updateWindowAria();
}

function toggleMaximize() {
  if (!appWindow) return;
  const isMax = appWindow.classList.toggle('maximized');
  if (isMax) {
    appWindow.classList.remove('minimized', 'closed');
  }
  setTaskMinimizedState(false);
  updateWindowAria();
}

function closeWindow() {
  if (!appWindow) return;
  appWindow.classList.add('closed');
  appWindow.classList.remove('minimized', 'maximized');
  updateWindowAria();
  setTaskVisibility(false);
  setTaskMinimizedState(false);
}

function wireWindowControls() {
  minimizeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMinimize();
  });
  maximizeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMaximize();
  });
  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeWindow();
  });
  titleBar?.addEventListener('dblclick', (e) => {
    if (e.target.closest('.win-controls')) return;
    toggleMaximize();
  });
  taskItem?.addEventListener('click', () => {
    if (!appWindow || taskItem.classList.contains('hidden')) return;
    if (appWindow.classList.contains('minimized') || appWindow.classList.contains('closed')) {
      reopenWindow();
    } else {
      toggleMinimize();
    }
  });
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  wireWindowControls();
  navigate(location.hash || '#home');
  initThemeToggle();
});
