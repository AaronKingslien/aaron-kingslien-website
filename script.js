const siteHeader = document.querySelector("#site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const currentYear = document.querySelector("#current-year");
const revealElements = document.querySelectorAll(".reveal");
const carousels = document.querySelectorAll("[data-carousel]");


/* =========================================================
   HEADER
   ========================================================= */

function setHeaderState() {
    if (!siteHeader) return;

    siteHeader.classList.toggle("scrolled", window.scrollY > 20);
}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function setMenuState(isOpen) {
    if (!menuToggle || !navMenu) return;

    menuToggle.classList.toggle("open", isOpen);
    navMenu.classList.toggle("open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );
}

function toggleMenu() {
    if (!menuToggle) return;

    const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

    setMenuState(!isOpen);
}

function closeMenu() {
    setMenuState(false);
}

function handleWindowResize() {
    if (window.innerWidth > 980) {
        closeMenu();
    }
}


/* =========================================================
   ONE-TIME REVEAL ANIMATIONS
   ========================================================= */

function initializeRevealAnimations() {
    if (!revealElements.length) return;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });

        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -10% 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}


/* =========================================================
   INFINITE PROJECT CAROUSELS
   ========================================================= */

function initializeCarousels() {
    carousels.forEach((carousel) => {
        const slides = Array.from(
            carousel.querySelectorAll(".carousel-slide")
        );

        const previousButton = carousel.querySelector(
            "[data-carousel-previous]"
        );

        const nextButton = carousel.querySelector(
            "[data-carousel-next]"
        );

        const dotsContainer = carousel.querySelector(
            "[data-carousel-dots]"
        );

        if (!slides.length) return;

        let activeIndex = 0;
        let touchStartX = null;
        let touchEndX = null;

        const dots = slides.map((slide, index) => {
            const dot = document.createElement("button");

            dot.type = "button";
            dot.className = "carousel-dot";
            dot.setAttribute(
                "aria-label",
                `Show image ${index + 1} of ${slides.length}`
            );

            dot.addEventListener("click", () => {
                activeIndex = index;
                updateCarousel();
            });

            dotsContainer?.appendChild(dot);

            return dot;
        });

        function normalizeIndex(index) {
            return (index + slides.length) % slides.length;
        }

        function updateCarousel() {
            const previousIndex = normalizeIndex(activeIndex - 1);
            const nextIndex = normalizeIndex(activeIndex + 1);

            slides.forEach((slide, index) => {
                slide.classList.remove(
                    "is-active",
                    "is-previous",
                    "is-next",
                    "is-hidden"
                );

                if (index === activeIndex) {
                    slide.classList.add("is-active");
                    slide.setAttribute("aria-hidden", "false");
                } else if (
                    slides.length > 1 &&
                    index === previousIndex
                ) {
                    slide.classList.add("is-previous");
                    slide.setAttribute("aria-hidden", "true");
                } else if (
                    slides.length > 2 &&
                    index === nextIndex
                ) {
                    slide.classList.add("is-next");
                    slide.setAttribute("aria-hidden", "true");
                } else {
                    slide.classList.add("is-hidden");
                    slide.setAttribute("aria-hidden", "true");
                }
            });

            dots.forEach((dot, index) => {
                const isActive = index === activeIndex;

                dot.classList.toggle("is-active", isActive);

                dot.setAttribute(
                    "aria-current",
                    isActive ? "true" : "false"
                );
            });
        }

        function showPreviousSlide() {
            activeIndex = normalizeIndex(activeIndex - 1);
            updateCarousel();
        }

        function showNextSlide() {
            activeIndex = normalizeIndex(activeIndex + 1);
            updateCarousel();
        }

        previousButton?.addEventListener(
            "click",
            showPreviousSlide
        );

        nextButton?.addEventListener(
            "click",
            showNextSlide
        );

        carousel.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                showPreviousSlide();
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                showNextSlide();
            }
        });

        carousel.addEventListener(
            "touchstart",
            (event) => {
                touchStartX = event.changedTouches[0].clientX;
            },
            {
                passive: true
            }
        );

        carousel.addEventListener(
            "touchend",
            (event) => {
                touchEndX = event.changedTouches[0].clientX;

                if (
                    touchStartX === null ||
                    touchEndX === null
                ) {
                    return;
                }

                const swipeDistance =
                    touchEndX - touchStartX;

                if (Math.abs(swipeDistance) > 45) {
                    if (swipeDistance > 0) {
                        showPreviousSlide();
                    } else {
                        showNextSlide();
                    }
                }

                touchStartX = null;
                touchEndX = null;
            },
            {
                passive: true
            }
        );

        carousel.setAttribute("tabindex", "0");

        if (slides.length <= 1) {
            previousButton?.setAttribute("hidden", "");
            nextButton?.setAttribute("hidden", "");
            dotsContainer?.setAttribute("hidden", "");
        }

        updateCarousel();
    });
}


/* =========================================================
   CURRENT YEAR
   ========================================================= */

function initializeCurrentYear() {
    if (!currentYear) return;

    currentYear.textContent =
        new Date().getFullYear();
}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
}

navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

document.addEventListener("click", (event) => {
    if (!navMenu || !menuToggle) return;

    const isOpen = navMenu.classList.contains("open");
    const clickedInsideMenu =
        navMenu.contains(event.target);
    const clickedMenuButton =
        menuToggle.contains(event.target);

    if (
        isOpen &&
        !clickedInsideMenu &&
        !clickedMenuButton
    ) {
        closeMenu();
    }
});

window.addEventListener(
    "scroll",
    setHeaderState,
    {
        passive: true
    }
);

window.addEventListener(
    "resize",
    handleWindowResize
);


/* =========================================================
   INITIALIZE
   ========================================================= */

setHeaderState();
initializeRevealAnimations();
initializeCarousels();
initializeCurrentYear();