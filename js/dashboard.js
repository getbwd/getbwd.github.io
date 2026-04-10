/* =============================================================
   BWD Services — dashboard.js
   Location: /js/dashboard.js
   ============================================================= */

const CSV = {
    INVOICES: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSWX3vado-d6wVWtj4HT_rq9xLYMG-HqYC2wEOLVIefdWjflDEe6XoC3uClWCqWUXqSvYe4Z35HN3TM/pub?gid=0&single=true&output=csv',
    SERVICES: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRty-4hQ_sZ8nI55zoNkbnjZwOGi5-NgKgDGlvsjP3x0aOmeYWxIZKJRpKIXGFgdkEvr4xmXThjbuRB/pub?gid=0&single=true&output=csv',
    JOBS:     'https://docs.google.com/spreadsheets/d/e/2PACX-1vSHSfVRR2EnvXGH5nZBOesVJdoTl2p3bHun-oFYYSZrg7fEvGXyIDxPkycWTtCjWstt8ccFgpa8wlkg/pub?gid=0&single=true&output=csv',
};

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
    return rows;
}

async function fetchCSV(url) {
    const res  = await fetch(url);
    const text = await res.text();
    const rows = parseCSV(text);
    return rows.slice(1); // skip header
}

function parsePipe(str) {
    if (!str) return [];
    return str.split('|').map(s => s.trim()).filter(Boolean);
}

// "Name, Qty, UnitPrice | ..."
function parseLineItems(str) {
    return parsePipe(str).map(seg => {
        const p = seg.split(',').map(s => s.trim());
        const name = p[0] || '—';
        const qty  = parseFloat(p[1]) || 1;
        const unit = parseFloat(p[2]) || 0;
        return { name, qty, unitPrice: unit, lineTotal: qty * unit };
    });
}

// "date, type, amount | ..."
function parsePayments(str) {
    return parsePipe(str).map(seg => {
        const p = seg.split(',').map(s => s.trim());
        return { date: p[0]||'—', type: p[1]||'—', amount: parseFloat(p[2])||0 };
    });
}

// "name, frequency, price, description | ..."
function parseServices(str) {
    return parsePipe(str).map(seg => {
        const p = seg.split(',').map(s => s.trim());
        return { name: p[0]||'—', frequency: p[1]||'—', price: parseFloat(p[2])||0, description: p[3]||'' };
    });
}

function fmtMoney(n) { return '$' + Number(n).toFixed(2); }
function initials(n) { return n ? n.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0,2) : '?'; }

function badge(status) {
    const s = (status || '').toLowerCase().trim();
    const map = {
        scheduled: 'bdg-scheduled', completed: 'bdg-completed', cancelled: 'bdg-cancelled',
        paid: 'bdg-paid', unpaid: 'bdg-unpaid', overdue: 'bdg-overdue',
        active: 'bdg-active', paused: 'bdg-paused',
        'in progress': 'bdg-scheduled', pending: 'bdg-paused', partial: 'bdg-paused',
    };
    return `<span class="bdg ${map[s] || 'bdg-default'}">${status || '—'}</span>`;
}

function empty(msg) { return `<p class="empty-state">${msg}</p>`; }

function initFirebase() {
    if (firebase.apps.length) return;
    firebase.initializeApp({
        apiKey:            'AIzaSyBKm_3OhZkF4IshAy50xuzm0Q1uloDdgpA',
        authDomain:        'bwd-accounts.firebaseapp.com',
        projectId:         'bwd-accounts',
        storageBucket:     'bwd-accounts.firebasestorage.app',
        messagingSenderId: '590001375282',
        appId:             '1:590001375282:web:bd1725d5a5be3f9d28542b',
    });
}

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const btn     = document.getElementById('mobileMenuBtn');
    if (btn)     btn.addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.add('visible'); });
    if (overlay) overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('visible'); });
}

function initSignOut(auth, ...ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => auth.signOut().then(() => window.location.replace('/account/login/')));
    });
}/* =============================================================
   BWD Services — dashboard.js
   Location: /js/dashboard.js
   ============================================================= */

const CSV = {
    INVOICES: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSWX3vado-d6wVWtj4HT_rq9xLYMG-HqYC2wEOLVIefdWjflDEe6XoC3uClWCqWUXqSvYe4Z35HN3TM/pub?gid=0&single=true&output=csv',
    SERVICES: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRty-4hQ_sZ8nI55zoNkbnjZwOGi5-NgKgDGlvsjP3x0aOmeYWxIZKJRpKIXGFgdkEvr4xmXThjbuRB/pub?gid=0&single=true&output=csv',
    JOBS:     'https://docs.google.com/spreadsheets/d/e/2PACX-1vSHSfVRR2EnvXGH5nZBOesVJdoTl2p3bHun-oFYYSZrg7fEvGXyIDxPkycWTtCjWstt8ccFgpa8wlkg/pub?gid=0&single=true&output=csv',
};

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
    return rows;
}

async function fetchCSV(url) {
    const res  = await fetch(url);
    const text = await res.text();
    const rows = parseCSV(text);
    return rows.slice(1); // skip header
}

function parsePipe(str) {
    if (!str) return [];
    return str.split('|').map(s => s.trim()).filter(Boolean);
}

// "Name, Qty, UnitPrice | ..."
function parseLineItems(str) {
    return parsePipe(str).map(seg => {
        const p = seg.split(',').map(s => s.trim());
        const name = p[0] || '—';
        const qty  = parseFloat(p[1]) || 1;
        const unit = parseFloat(p[2]) || 0;
        return { name, qty, unitPrice: unit, lineTotal: qty * unit };
    });
}

// "date, type, amount | ..."
function parsePayments(str) {
    return parsePipe(str).map(seg => {
        const p = seg.split(',').map(s => s.trim());
        return { date: p[0]||'—', type: p[1]||'—', amount: parseFloat(p[2])||0 };
    });
}

// "name, frequency, price, description | ..."
function parseServices(str) {
    return parsePipe(str).map(seg => {
        const p = seg.split(',').map(s => s.trim());
        return { name: p[0]||'—', frequency: p[1]||'—', price: parseFloat(p[2])||0, description: p[3]||'' };
    });
}

function fmtMoney(n) { return '$' + Number(n).toFixed(2); }
function initials(n) { return n ? n.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0,2) : '?'; }

function badge(status) {
    const s = (status || '').toLowerCase().trim();
    const map = {
        scheduled: 'bdg-scheduled', completed: 'bdg-completed', cancelled: 'bdg-cancelled',
        paid: 'bdg-paid', unpaid: 'bdg-unpaid', overdue: 'bdg-overdue',
        active: 'bdg-active', paused: 'bdg-paused',
        'in progress': 'bdg-scheduled', pending: 'bdg-paused', partial: 'bdg-paused',
    };
    return `<span class="bdg ${map[s] || 'bdg-default'}">${status || '—'}</span>`;
}

function empty(msg) { return `<p class="empty-state">${msg}</p>`; }

function initFirebase() {
    if (firebase.apps.length) return;
    firebase.initializeApp({
        apiKey:            'AIzaSyBKm_3OhZkF4IshAy50xuzm0Q1uloDdgpA',
        authDomain:        'bwd-accounts.firebaseapp.com',
        projectId:         'bwd-accounts',
        storageBucket:     'bwd-accounts.firebasestorage.app',
        messagingSenderId: '590001375282',
        appId:             '1:590001375282:web:bd1725d5a5be3f9d28542b',
    });
}

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const btn     = document.getElementById('mobileMenuBtn');
    if (btn)     btn.addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.add('visible'); });
    if (overlay) overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('visible'); });
}

function initSignOut(auth, ...ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => auth.signOut().then(() => window.location.replace('/account/login/')));
    });
}