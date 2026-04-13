/* =============================================================
BWD Services — bwd-auth.js
Location: /js/bwd-auth.js
Handles: Firebase init, role detection, nav injection, sign-out
============================================================= */

var BWD = window.BWD || {};

BWD.FIREBASE_CONFIG = {
apiKey:‘AIzaSyBKm_3OhZkF4IshAy50xuzm0Q1uloDdgpA’,
authDomain:‘bwd-accounts.firebaseapp.com’,
projectId:‘bwd-accounts’,
storageBucket:‘bwd-accounts.firebasestorage.app’,
messagingSenderId:‘590001375282’,
appId:‘1:590001375282:web:bd1725d5a5be3f9d28542b’
};

BWD.ROLES = {
HOMEOWNER:          ‘Homeowner’,
BUSINESS:           ‘Business Account’,
FIELD_TECH:         ‘Field Tech’,
LEAD_TECH:          ‘Lead Tech’,
OPS_MANAGER:        ‘Operations Manager’,
ADMINISTRATOR:      ‘Administrator’
};

BWD.STAFF_ROLES = [‘Field Tech’,‘Lead Tech’,‘Operations Manager’,‘Administrator’];

BWD.isStaff = function(role){
return BWD.STAFF_ROLES.indexOf(role) !== -1;
};

BWD.initFirebase = function(){
if(firebase.apps.length) return firebase.app();
return firebase.initializeApp(BWD.FIREBASE_CONFIG);
};

BWD.initials = function(n){
return n ? n.trim().split(/\s+/).map(function(w){return w[0];}).join(’’).toUpperCase().slice(0,2) : ‘?’;
};

/* Build sidebar nav based on role. pathPrefix = how many ../ to root */
BWD.buildNav = function(activeSection, pathPrefix, role){
var isStaff = BWD.isStaff(role);
var p = pathPrefix; // e.g. ‘../../’ for dashboard root, ‘../../../’ for subpages

```
var customerNav = [
    {id:'overview',    href:p+'account/dashboard/',             label:'Overview',      icon:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>'},
    {id:'appointments',href:p+'account/dashboard/appointments/',label:'Appointments',  icon:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'},
    {id:'invoices',    href:p+'account/dashboard/invoices/',    label:'Invoices',      icon:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'},
    {id:'services',    href:p+'account/dashboard/services/',    label:'My Services',   icon:'<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>'},
    {id:'credits',     href:p+'account/dashboard/credits/',     label:'Credits & Deals',icon:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>'},
    {id:'account',     href:p+'account/dashboard/account/',     label:'Account',       icon:'<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>'}
];

var staffNav = [
    {id:'appointments',href:p+'account/dashboard/appointments/',label:'Appointments',  icon:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'},
    {id:'invoices',    href:p+'account/dashboard/invoices/',    label:'Invoices',      icon:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'},
    {id:'account',     href:p+'account/dashboard/account/',     label:'Account',       icon:'<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>'}
];

var items = isStaff ? staffNav : customerNav;
return items.map(function(item){
    var isActive = item.id === activeSection;
    return '<a class="nav-item'+(isActive?' active':'')+'" href="/'+item.href+'">'+
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+item.icon+'</svg>'+
        item.label+'</a>';
}).join('');
```

};

BWD.injectNav = function(activeSection, pathPrefix, role){
var nav = document.getElementById(‘sidebarNav’);
if(nav) nav.innerHTML = BWD.buildNav(activeSection, pathPrefix, role);
};

BWD.initSidebar = function(){
var sidebar = document.getElementById(‘sidebar’);
var overlay = document.getElementById(‘sidebarOverlay’);
var btn     = document.getElementById(‘mobileMenuBtn’);
if(btn)     btn.addEventListener(‘click’,function(){sidebar.classList.add(‘open’);overlay.classList.add(‘visible’);});
if(overlay) overlay.addEventListener(‘click’,function(){sidebar.classList.remove(‘open’);overlay.classList.remove(‘visible’);});
};

BWD.initSignOut = function(auth){
[‘signOutBtn’,‘signOutBtn2’].forEach(function(id){
var el = document.getElementById(id);
if(el) el.addEventListener(‘click’,function(){
auth.signOut().then(function(){window.location.href=’/account/login/’;});
});
});
};

/* Redirect staff away from customer-only pages */
BWD.guardCustomerPage = function(role, redirectPath){
if(BWD.isStaff(role)){
window.location.href = redirectPath || ‘/account/dashboard/appointments/’;
}
};