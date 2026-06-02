document.addEventListener("DOMContentLoaded", () => {
    // Menu mobile toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const navMenu = document.getElementById("nav-menu");

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener("click", () => {
            mobileMenuBtn.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
    }

    // Gestion de l'état actif sur les liens de navigation
    const currentUrl = window.location.pathname;
    const navLinks = document.querySelectorAll("header nav ul li a");

    navLinks.forEach(link => {
        // Enlève le slash final pour comparer si nécessaire
        const href = link.getAttribute("href");
        if (currentUrl === href || (href !== '/' && currentUrl.startsWith(href))) {
            link.classList.add("active");
        }
    });
});