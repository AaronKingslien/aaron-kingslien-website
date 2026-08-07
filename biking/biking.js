/* =========================================================
   AARON KINGSLIEN — BIKING PAGE
   Gallery Carousel
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const carousels = document.querySelectorAll("[data-bike-carousel]");

    carousels.forEach((carousel) => {
        const slides = Array.from(
            carousel.querySelectorAll(".bike-carousel__slide")
        );

        const previousButton = carousel.querySelector(
            "[data-bike-previous]"
        );

        const nextButton = carousel.querySelector(
            "[data-bike-next]"
        );

        const dotsContainer = carousel.querySelector(
            "[data-bike-dots]"
        );

        if (slides.length === 0) return;

        let activeIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;


        /* =====================================================
           CREATE DOTS
           ===================================================== */

        const dots = [];

        if (dotsContainer) {
            dotsContainer.innerHTML = "";

            slides.forEach((slide, index) => {
                const dot = document.createElement("button");

                dot.type = "button";
                dot.className = "bike-carousel__dot";

                dot.setAttribute(
                    "aria-label",
                    `Show gallery image ${index + 1} of ${slides.length}`
                );

                dot.addEventListener("click", () => {
                    activeIndex = index;
                    updateCarousel();
                });

                dotsContainer.appendChild(dot);
                dots.push(dot);
            });
        }


        /* =====================================================
           INDEX HANDLING
           ===================================================== */

        function normalizeIndex(index) {
            if (index < 0) {
                return slides.length - 1;
            }

            if (index >= slides.length) {
                return 0;
            }

            return index;
        }


        /* =====================================================
           UPDATE CAROUSEL
           ===================================================== */

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
                } else if (index === previousIndex) {
                    slide.classList.add("is-previous");
                    slide.setAttribute("aria-hidden", "true");
                } else if (index === nextIndex) {
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


        /* =====================================================
           PREVIOUS / NEXT
           ===================================================== */

        function showPreviousSlide() {
            activeIndex = normalizeIndex(activeIndex - 1);
            updateCarousel();
        }

        function showNextSlide() {
            activeIndex = normalizeIndex(activeIndex + 1);
            updateCarousel();
        }


        /* =====================================================
           BUTTON CONTROLS
           ===================================================== */

        if (previousButton) {
            previousButton.addEventListener(
                "click",
                showPreviousSlide
            );
        }

        if (nextButton) {
            nextButton.addEventListener(
                "click",
                showNextSlide
            );
        }


        /* =====================================================
           KEYBOARD CONTROLS
           ===================================================== */

        carousel.setAttribute("tabindex", "0");

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


        /* =====================================================
           MOBILE SWIPE CONTROLS
           ===================================================== */

        carousel.addEventListener(
            "touchstart",
            (event) => {
                touchStartX =
                    event.changedTouches[0].clientX;
            },
            {
                passive: true
            }
        );

        carousel.addEventListener(
            "touchend",
            (event) => {
                touchEndX =
                    event.changedTouches[0].clientX;

                const swipeDistance =
                    touchEndX - touchStartX;

                if (Math.abs(swipeDistance) < 45) {
                    return;
                }

                if (swipeDistance > 0) {
                    showPreviousSlide();
                } else {
                    showNextSlide();
                }
            },
            {
                passive: true
            }
        );


        /* =====================================================
           SINGLE IMAGE HANDLING
           ===================================================== */

        if (slides.length === 1) {
            if (previousButton) {
                previousButton.style.display = "none";
            }

            if (nextButton) {
                nextButton.style.display = "none";
            }

            if (dotsContainer) {
                dotsContainer.style.display = "none";
            }
        }


        /* =====================================================
           INITIALIZE
           ===================================================== */

        updateCarousel();
    });
});