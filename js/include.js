async function loadComponent(id, file) {
    try {
        const res = await fetch(file);
        const data = await res.text();
        document.getElementById(id).innerHTML = data;
    } catch (err) {
        console.error("Component failed to load:", file, err);
    }
}

function initNavbar() {
    const hamburger = document.getElementById("hamburger");
    const nav = document.querySelector(".main-nav");
    const servicesBtn = document.querySelector(".mobile-services");
    const megaMenu = document.querySelector(".mega-menu");
    const backBtn = document.querySelector(".mobile-back");
    const xBtn = document.querySelector(".hamburger-x");
    const header = document.querySelector("header");

    if (!hamburger || !nav || !header) return;

    function closeAll() {
        nav.classList.remove("active");
        megaMenu?.classList.remove("active");
        document.body.classList.remove("no-scroll");
        header.classList.remove("menu-open");
    }

    hamburger.addEventListener("click", () => {
        console.log("CLICKED"); // 👈 add this
        nav.classList.add("active");
        document.body.classList.add("no-scroll");
        header.classList.add("menu-open");
    });

    // ✅ SAFE checks (this is the fix)
    if (xBtn) {
        xBtn.addEventListener("click", closeAll);
    }

    if (servicesBtn && megaMenu) {
        servicesBtn.addEventListener("click", (e) => {
            if (window.innerWidth <= 1200) {
                e.preventDefault();
                megaMenu.classList.add("active");
            }
        });
    }

    if (backBtn && megaMenu) {
        backBtn.addEventListener("click", () => {
            megaMenu.classList.remove("active");
        });
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent("navbar", "/components/navbar.html");
    await loadComponent("footer", "/components/footer.html");

    initNavbar(); // 🔥 THIS IS THE FIX
});