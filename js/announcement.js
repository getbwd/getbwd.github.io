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
    window.addEventListener("scroll", () => {
        if (window.innerWidth <= 900) {
            if (window.scrollY > 50) {
                bar.classList.add("hidden");
            } else {
                bar.classList.remove("hidden");
            }
        }
    });
}