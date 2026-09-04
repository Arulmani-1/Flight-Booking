/**
 * Stackly — Hero Slideshow
 * Automatically cycles through background images in the hero section.
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const slides = document.querySelectorAll('#heroSlideshow .hero-slide');
        if (!slides.length) return;

        let currentIndex = 0;
        const slideInterval = 5000; // 5 seconds per slide

        function nextSlide() {
            // Remove active from current slide
            slides[currentIndex].classList.remove('active');
            
            // Increment index, loop back to 0 if at end
            currentIndex = (currentIndex + 1) % slides.length;
            
            // Add active to new slide
            slides[currentIndex].classList.add('active');
        }

        // Start automatic slideshow
        setInterval(nextSlide, slideInterval);
    });
})();
