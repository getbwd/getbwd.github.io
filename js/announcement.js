document.addEventListener("DOMContentLoaded", () => {
    const bannerHTML = `
    <div class="announcement-bar" id="announcement-bar">
        Save time and unlock exclusive online pricing by creating an account.
    </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", bannerHTML);
});

function initAnnouncementBar() {
    const bar = document.getElementById("announcement-bar");
    if (!bar) return;

    function updateBar() {
        if (window.innerWidth > 900) {
            bar.classList.remove("hidden"); // always show on desktop
        } else {
            if (window.scrollY > 50) {
                bar.classList.add("hidden");
            } else {
                bar.classList.remove("hidden");
            }
        }
    }

    window.addEventListener("scroll", updateBar);
    window.addEventListener("resize", updateBar);
    updateBar(); // run once on load
}