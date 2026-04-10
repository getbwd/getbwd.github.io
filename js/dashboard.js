/* =============================================================
   BWD Services — dashboard.js
   Shared utilities: CSV fetch/parse, renderers, Firebase auth
   ============================================================= */

const CSV = {
    INVOICES: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSWX3vado-d6wVWtj4HT_rq9xLYMG-HqYC2wEOLVIefdWjflDEe6XoC3uClWCqWUXqSvYe4Z35HN3TM/pub?gid=0&single=true&output=csv',
    SERVICES: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRty-4hQ_sZ8nI55zoNkbnjZwOGi5-NgKgDGlvsjP3x0aOmeYWxIZKJRpKIXGFgdkEvr4xmXThjbuRB/pub?gid=0&single=true&output=csv',
    JOBS:     'https://docs.google.com/spreadsheets/d/e/2PACX-1vSHSfVRR2EnvXGH5nZBOesVJdoTl2p3bHun-oFYYSZrg7fEvGXyIDxPkycWTtCjWstt8ccFgpa8wlkg/pub?gid=0&single=true&output=csv',
};

/* ── CSV parser (handles quoted fields) ── */
function parseCSV(text) {
    const rows = [];
    const lines = text.trim().split('\n');
    for (const line of lines) {
        const cols = [];
        let cur = '', inQ = false;
        for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (c === '"') { inQ = !inQ; }
            else if (c === ',' && !inQ) { cols.push(cur.trim()); cur = ''; }
            else { cur += c; }
        }
        cols.push(cur.trim());
        rows.push(cols);
    }
    return rows; // row[0] is header
}

async function fetchCSV(url) {
    const res = await fetch(url);
    const text = await res.text();
    const rows = parseCSV(text);
    return rows.slice(1); // skip header row
}

/* ── Pipe-delimited field parser ── */
function parsePipe(str) {
    if (!str) return [];
    return str.split('|').map(s => s.trim()).filter(Boolean);
}

/* ── Itemized invoice/job services parser ──
   Format: "Name, Amount, PriceEach | ..."
   Returns array of { name, qty, unitPrice, lineTotal }          */
function parseLineItems(str) {
    return parsePipe(str).map(seg => {
        const parts = seg.split(',').map(s => s.trim());
        const name      = parts[0] || '—';
        const qty       = parseFloat(parts[1]) || 1;
        const unitPrice = parseFloat(parts[2]) || 0;
        return { name, qty, unitPrice, lineTotal: qty * unitPrice };
    });
}

/* ── Payment history parser ──
   Format: "date, type, amount | ..."
   Returns array of { date, type, amount }                       */
function parsePayments(str) {
    return parsePipe(str).map(seg => {
        const parts = seg.split(',').map(s => s.trim());
        return { date: parts[0]||'—', type: parts[1]||'—', amount: parseFloat(parts[2])||0 };
    });
}

/* ── Services parser ──
   Format: "name, frequency, price, description | ..."           */
function parseServices(str) {
    return parsePipe(str).map(seg => {
        const parts = seg.split(',').map(s => s.trim());
        return { name: parts[0]||'—', frequency: parts[1]||'—', price: parseFloat(parts[2])||0, description: parts[3]||'' };
    });
}

/* ── Helpers ── */
function fmtMoney(n) { return '$' + Number(n).toFixed(2); }
function initials(n) { return n ? n.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0,2) : '?'; }

function badge(status) {
    const s = (status || '').toLowerCase().trim();
    const map = {
        scheduled: 'bdg-scheduled', completed: 'bdg-completed', cancelled: 'bdg-cancelled',
        paid: 'bdg-paid', unpaid: 'bdg-unpaid', overdue: 'bdg-overdue',
        active: 'bdg-active', paused: 'bdg-paused', 'in progress': 'bdg-scheduled',
        pending: 'bdg-paused', partial: 'bdg-paused',
    };
    return `<span class="bdg ${map[s] || 'bdg-default'}">${status || '—'}</span>`;
}

function empty(msg) { return `<p class="empty-state">${msg}</p>`; }

/* ── Firebase init (call once per page) ── */
function initFirebase() {
    if (firebase.apps.length) return firebase.app();
    return firebase.initializeApp({
        apiKey:            'AIzaSyBKm_3OhZkF4IshAy50xuzm0Q1uloDdgpA',
        authDomain:        'bwd-accounts.firebaseapp.com',
        projectId:         'bwd-accounts',
        storageBucket:     'bwd-accounts.firebasestorage.app',
        messagingSenderId: '590001375282',
        appId:             '1:590001375282:web:bd1725d5a5be3f9d28542b',
    });
}

/* ── Mobile sidebar wiring ── */
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const btn     = document.getElementById('mobileMenuBtn');
    if (btn)     btn.addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.add('visible'); });
    if (overlay) overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('visible'); });
}

/* ── Sign-out wiring (pass one or more button IDs) ── */
function initSignOut(auth, ...ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => auth.signOut().then(() => window.location.replace('/account/login/')));
    });
}