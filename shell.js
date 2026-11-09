/* ==========================================================================
   BWD Services — shell.js
   Injects the site navigation (topbar, header, mega menu, mobile nav) and
   the footer into their placeholder containers, then wires up the
   interactive behavior that depends on that markup existing in the DOM.
   ========================================================================== */

(function(){

  var headerHTML = `
<div class="topbar"><div class="wrap">
  <div class="left">Serving Flint, Burton, Grand Blanc &amp; Mid-Michigan</div>
  <div class="right">Residential &amp; Commercial<span class="sep">|</span>Mon&ndash;Fri 7am&ndash;8pm, Sat&ndash;Sun 7am&ndash;9pm</div>
</div></div>

<header>
  <div class="wrap"><nav>
    <a href="/"><img src="https://getbwd.com/images/branding/logo.png" alt="BWD Services" width="160" height="48"></a>
    <div class="nav-links">
      <button id="servicesBtn" aria-expanded="false">Services <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg></button><a href="/service-area/">Service Area</a><a href="/commercial/">Commercial</a><a href="/about/">About Us</a><a href="/contact/">Contact</a>
    </div>
    <div class="mega" id="megaServices"><div class="wrap"><div class="mega-grid"><div class="mega-col"><h4>Spring Cleanup</h4><a href="/services/spring-cleanup/"><div class="t">Spring Cleanup</div><div class="d">Beds, lawns, and borders refreshed after a long Michigan winter.</div></a><a href="/services/detaching/"><div class="t">Dethatching &amp; Power Raking</div><div class="d">Clear out dead thatch so your lawn can breathe and green up faster.</div></a><a href="/services/mulch/"><div class="t">Mulch Installation</div><div class="d">Fresh mulch for beds and borders, with a cleaner look and better moisture control.</div></a><a href="/services/waste-removal/"><div class="t">Debris &amp; Waste Removal</div><div class="d">Branches, brush, and winter debris hauled off your property.</div></a></div><div class="mega-col"><h4>Lawn Care</h4><a href="/services/mowing/"><div class="t">Mowing &amp; Weed Whacking</div><div class="d">Routine mowing, edging, and trimming to keep your lawn crisp every week.</div></a><a href="/services/aeration/"><div class="t">Aeration</div><div class="d">Core aeration that relieves soil compaction so roots grow deeper.</div></a><a href="/services/overseeding/"><div class="t">Overseeding</div><div class="d">Thicken thin or patchy turf with seed timed to the season.</div></a><a href="/services/fertilization/"><div class="t">Fertilization</div><div class="d">Balanced feeding programs for a greener, more resilient lawn.</div></a><a href="/services/weed-control/"><div class="t">Weed Control</div><div class="d">Targeted treatments that knock back weeds without the damage.</div></a></div><div class="mega-col"><h4>Landscape &amp; Cleanup</h4><a href="/services/garden/"><div class="t">Garden Bed Care</div><div class="d">Weeding, edging, and mulching that keep beds looking intentional.</div></a><a href="/services/leaf-removal/"><div class="t">Leaf Removal</div><div class="d">Full-yard leaf pickup before they smother your lawn.</div></a><a href="/services/seasonal-cleanup/"><div class="t">Seasonal Cleanup</div><div class="d">End-of-season tidy-ups that get your property ready for what's next.</div></a><a href="/services/gutters/"><div class="t">Gutter Cleanup</div><div class="d">Clogged gutters cleared out to keep water moving away from your home.</div></a><a href="/services/shrubs/"><div class="t">Shrub Trimming</div><div class="d">Clean, healthy shrub lines shaped to keep your property looking sharp.</div></a><a href="/services/power-washing/"><div class="t">Power Washing</div><div class="d">Driveways, walkways, and siding blasted clean of dirt and grime.</div></a></div><div class="mega-col"><h4>Winter Services</h4><a href="/services/snow-removal/"><div class="t">Snow Removal</div><div class="d">Reliable plowing for driveways, lots, and private roads all winter.</div></a><a href="/services/ice/"><div class="t">Salting &amp; Ice Management</div><div class="d">De-icing treatments that keep walkways and lots safe after every storm.</div></a><a href="/services/walkway-clearing/"><div class="t">Sidewalk &amp; Walkway Clearing</div><div class="d">Hand-cleared walkways and entries so they stay safe and accessible.</div></a></div><div class="mega-promo">
      <div><svg width="26" height="26"><use href="#i-building"/></svg></div>
      <h4>Residential &amp; Commercial</h4>
      <p>Same crew, same reliability for homeowners and businesses across mid-Michigan.</p>
      <a href="/commercial/" class="btn btn-primary">Commercial Services</a>
      <a href="/services/" class="btn btn-outline-light" style="border-color:rgba(255,255,255,.3)">View All Services</a>
    </div></div></div></div>
    <div class="nav-right">
      <a href="https://getbwd.com/portal" target="_blank" rel="noopener" class="btn btn-outline portal-btn"><svg width="15" height="15"><use href="#i-user"/></svg><span>Customer Portal</span></a>
      <a href="/quote/" class="btn btn-primary" style="padding:12px 22px">Free Quote</a>
    </div>
    <button class="burger" id="burgerBtn" aria-label="Open menu"><svg width="20" height="20"><use href="#i-menu"/></svg></button>
  </nav></div>
</header>

<div class="overlay" id="overlay"></div>
<div class="mobile-nav" id="mobileNav">
  <div class="mobile-close" id="mobileClose"><svg width="16" height="16"><use href="#i-close"/></svg></div>
  <div>
      <button class="m-acc-btn" id="mAccBtn">Services <svg width="14" height="14"><use href="#i-menu"/></svg></button>
      <div class="m-acc-panel" id="mAccPanel">
        <div class="m-acc-cat">Spring Cleanup</div><a href="/services/spring-cleanup/">Spring Cleanup</a><a href="/services/detaching/">Dethatching &amp; Power Raking</a><a href="/services/mulch/">Mulch Installation</a><a href="/services/waste-removal/">Debris &amp; Waste Removal</a><div class="m-acc-cat">Lawn Care</div><a href="/services/mowing/">Mowing &amp; Weed Whacking</a><a href="/services/aeration/">Aeration</a><a href="/services/overseeding/">Overseeding</a><a href="/services/fertilization/">Fertilization</a><a href="/services/weed-control/">Weed Control</a><div class="m-acc-cat">Landscape &amp; Cleanup</div><a href="/services/garden/">Garden Bed Care</a><a href="/services/leaf-removal/">Leaf Removal</a><a href="/services/seasonal-cleanup/">Seasonal Cleanup</a><a href="/services/gutters/">Gutter Cleanup</a><a href="/services/shrubs/">Shrub Trimming</a><a href="/services/power-washing/">Power Washing</a><div class="m-acc-cat">Winter Services</div><a href="/services/snow-removal/">Snow Removal</a><a href="/services/ice/">Salting &amp; Ice Management</a><a href="/services/walkway-clearing/">Sidewalk &amp; Walkway Clearing</a>
        <a href="/services/" style="font-weight:700;color:var(--orange-dk);padding:9px 0 9px 14px">View All Services &gt;</a>
      </div>
    </div><a href="/service-area/">Service Area</a><a href="/commercial/">Commercial</a><a href="/about/">About Us</a><a href="/contact/">Contact</a>
  <a href="https://getbwd.com/portal" target="_blank" rel="noopener" class="btn btn-outline btn-block"><svg width="16" height="16"><use href="#i-user"/></svg>Customer Portal</a>
  <a href="/quote/" class="btn btn-primary btn-block">Free Quote</a>
</div>`;

  var footerHTML = `
<footer>
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="https://getbwd.com/images/branding/logo.png" alt="BWD Services" width="140" height="42" loading="lazy">
        <p>Spring cleanup, lawn care, and landscaping for residential and commercial properties in Flint, MI and the surrounding communities.</p>
      </div>
      <div class="footer-cols">
        <div class="footer-col">
          <h4>Services</h4>
          <a href="/services/spring-cleanup/">Spring Cleanup</a><a href="/services/mowing/">Mowing &amp; Weed Whacking</a><a href="/services/mulch/">Mulch Installation</a><a href="/services/snow-removal/">Snow Removal</a><a href="/services/ice/">Salting &amp; Ice Management</a><a href="/services/shrubs/">Shrub Trimming</a><a href="/services/power-washing/">Power Washing</a>
          <a href="/services/">View All</a>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <a href="/about/">About Us</a>
          <a href="/service-area/">Service Area</a>
          <a href="/commercial/">Commercial</a>
          <a href="/contact/">Contact</a>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <a href="tel:+19203709852">(920) 370-9852</a>
          <a href="mailto:getbwd@gmail.com">getbwd@gmail.com</a>
          <a href="https://getbwd.com/portal" target="_blank" rel="noopener">Customer Portal</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span class="y"></span> BWD Services. All rights reserved.</span>
      <span>Flint, Michigan</span>
    </div>
  </div>
</footer>`;

  var headerMount = document.getElementById('site-header');
  var footerMount = document.getElementById('site-footer');
  if(headerMount) headerMount.innerHTML = headerHTML;
  if(footerMount) footerMount.innerHTML = footerHTML;

  document.querySelectorAll('.y').forEach(function(el){ el.textContent = new Date().getFullYear(); });

  var burger = document.getElementById('burgerBtn');
  var mobileNav = document.getElementById('mobileNav');
  var overlay = document.getElementById('overlay');
  var mobileClose = document.getElementById('mobileClose');
  function openNav(){ mobileNav.classList.add('open'); overlay.classList.add('open'); }
  function closeNav(){ mobileNav.classList.remove('open'); overlay.classList.remove('open'); }
  if(burger){
    burger.addEventListener('click', openNav);
    overlay.addEventListener('click', closeNav);
    mobileClose.addEventListener('click', closeNav);
    mobileNav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeNav); });
  }

  var mAccBtn = document.getElementById('mAccBtn');
  var mAccPanel = document.getElementById('mAccPanel');
  if(mAccBtn){
    mAccBtn.addEventListener('click', function(){
      mAccBtn.classList.toggle('open');
      mAccPanel.classList.toggle('open');
    });
  }

  var servicesBtn = document.getElementById('servicesBtn');
  var mega = document.getElementById('megaServices');
  if(servicesBtn){
    servicesBtn.addEventListener('click', function(e){
      e.stopPropagation();
      var isOpen = mega.classList.toggle('open');
      servicesBtn.classList.toggle('open', isOpen);
      servicesBtn.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', function(e){
      if(!mega.contains(e.target) && e.target !== servicesBtn){
        mega.classList.remove('open');
        servicesBtn.classList.remove('open');
        servicesBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

})();
