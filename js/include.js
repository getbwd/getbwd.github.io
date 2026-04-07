/* =============================================================
BWD Services — include.js
Loads shared components, initialises navbar + announcement bar.

## ACTIVE PAGE USAGE

On each page’s <html> tag, add a data-page attribute:

```
 <html lang="en" data-page="home">
 <html lang="en" data-page="about">
 <html lang="en" data-page="faq">
 <html lang="en" data-page="support">
 <html lang="en" data-page="services">          ← highlights Services link
 <html lang="en" data-page="services/mowing-trimming"> ← also highlights Services
```

The script auto-detects the current path as a fallback even
without data-page — so it works on every page automatically.
============================================================= */

/* –– Parallel component loader –– */
async function loadComponent(id, file) {
const el = document.getElementById(id);
if (!el) return;
try {
const res = await fetch(file);
if (!res.ok) throw new Error(res.status);
el.innerHTML = await res.text();
} catch (err) {
console.warn(`BWD: failed to load component "${file}"`, err);
}
}

/* –– Navbar –– */
function initNavbar() {
const header     = document.querySelector(’#site-header’);
const hamburger  = document.getElementById(‘hamburger’);
const navClose   = document.getElementById(‘nav-close’);
const nav        = document.getElementById(‘main-nav’);
const overlay    = document.getElementById(‘nav-overlay’);
const servicesLink = document.querySelector(’.services-link’);
const megaMenu   = document.getElementById(‘mega-menu’);
const mobileBack = document.getElementById(‘mobile-back’);

```
if (!header || !hamburger || !nav) return;

/* -- Open / close helpers -- */
function openNav() {
    nav.classList.add('is-open');
    overlay?.classList.add('is-visible');
    document.body.classList.add('no-scroll');
    hamburger.setAttribute('aria-expanded', 'true');
}

function closeNav() {
    nav.classList.remove('is-open');
    overlay?.classList.remove('is-visible');
    document.body.classList.remove('no-scroll');
    hamburger.setAttribute('aria-expanded', 'false');
    closeMegaMobile();
}

function openMegaMobile() {
    megaMenu?.classList.add('is-open');
}

function closeMegaMobile() {
    megaMenu?.classList.remove('is-open');
}

function isMobile() {
    return window.innerWidth <= 960;
}

/* -- Event listeners -- */
hamburger.addEventListener('click', openNav);
navClose?.addEventListener('click', closeNav);
overlay?.addEventListener('click', closeNav);

// Services link — on mobile opens the sliding mega panel
servicesLink?.addEventListener('click', (e) => {
    if (isMobile()) {
        e.preventDefault();
        openMegaMobile();
    }
    // Desktop: CSS hover handles it
});

mobileBack?.addEventListener('click', closeMegaMobile);

// Close nav on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (megaMenu?.classList.contains('is-open')) {
            closeMegaMobile();
        } else {
            closeNav();
        }
    }
});

// Close mobile nav if window resizes to desktop
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (!isMobile()) closeNav();
    }, 150);
});

/* -- Active link highlighting -- */
highlightActiveLink();
```

}

/* –– Active link detection –– */
function highlightActiveLink() {
// 1. Try data-page on <html> first (explicit, reliable)
const declared = document.documentElement.getAttribute(‘data-page’);

```
// 2. Fall back to current pathname
const rawPath = declared
    ? '/' + declared.replace(/^\//, '').replace(/\/?$/, '/') // normalise
    : window.location.pathname;

// Normalise: lowercase, ensure leading slash, strip trailing slash
const currentPath = rawPath.toLowerCase().replace(/\/$/, '') || '/';

document.querySelectorAll('.nav-link[data-navkey]').forEach(link => {
    link.classList.remove('is-active', 'is-active-parent');
});

// Map navkeys to their paths
const navMap = {
    home:     '/',
    about:    '/about',
    services: '/services',
    faq:      '/faq',
    support:  '/support',
};

document.querySelectorAll('.nav-link[data-navkey]').forEach(link => {
    const key  = link.getAttribute('data-navkey');
    const path = (navMap[key] || '/' + key).toLowerCase();

    if (key === 'home') {
        if (currentPath === '' || currentPath === '/') {
            link.classList.add('is-active');
        }
    } else if (key === 'services') {
        // Highlight services for any /services/* URL
        if (currentPath === path || currentPath.startsWith(path + '/')) {
            link.classList.add('is-active-parent');
        }
    } else {
        if (currentPath === path || currentPath.startsWith(path + '/')) {
            link.classList.add('is-active');
        }
    }
});
```

}

/* –– Announcement bar –– */
function initAnnouncementBar() {
const bar = document.getElementById(‘announcement-bar’);
if (!bar) return;

```
// Only hide on scroll for mobile — always show on desktop
if (window.innerWidth <= 960) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                bar.classList.toggle('hidden', window.scrollY > 60);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}
```

}

/* –– Boot –– */
document.addEventListener(‘DOMContentLoaded’, async () => {
// Load all three components in parallel
await Promise.all([
loadComponent(‘announcement’, ‘/components/announcement.html’),
loadComponent(‘navbar’,       ‘/components/navbar.html’),
loadComponent(‘footer’,       ‘/components/footer.html’),
]);

```
initNavbar();
initAnnouncementBar();
```

});