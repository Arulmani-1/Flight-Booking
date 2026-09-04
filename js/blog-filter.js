/**
 * Stackly — Blog Filter
 * Filters blog cards by category with smooth fade animation.
 * Categories: all | travel-tips | destinations | news
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        var filterBtns = document.querySelectorAll('#blogFilterBtns [data-filter]');
        var blogCards  = document.querySelectorAll('.blog-card');

        if (!filterBtns.length || !blogCards.length) return;

        /* ── Initial state: show ALL cards immediately (no animation) ── */
        blogCards.forEach(function (card) {
            card.style.display   = '';
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
            card.style.transition = '';
        });

        /* ── Active button styles ─────────────────────────────────────── */
        function setActiveBtn(activeBtn) {
            filterBtns.forEach(function (btn) {
                btn.classList.remove('btn-primary', 'text-white', 'active');
                btn.classList.add('bg-white', 'text-muted');
            });
            activeBtn.classList.remove('bg-white', 'text-muted');
            activeBtn.classList.add('btn-primary', 'text-white', 'active');
        }

        /* ── Filter with animation (only on user click) ───────────────── */
        function filterCards(category) {
            blogCards.forEach(function (card) {
                var cardCat = card.getAttribute('data-category');
                var match   = (category === 'all') || (cardCat === category);

                if (match) {
                    /* Show — fade in */
                    card.style.display    = '';
                    card.style.transition = 'none';
                    card.style.opacity    = '0';
                    card.style.transform  = 'translateY(16px)';

                    requestAnimationFrame(function () {
                        requestAnimationFrame(function () {
                            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                            card.style.opacity    = '1';
                            card.style.transform  = 'translateY(0)';
                        });
                    });
                } else {
                    /* Hide — fade out then display:none */
                    card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                    card.style.opacity    = '0';
                    card.style.transform  = 'translateY(12px)';
                    setTimeout(function () {
                        card.style.display = 'none';
                    }, 270);
                }
            });
        }

        /* ── Click handler ─────────────────────────────────────────────── */
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var filter = btn.getAttribute('data-filter');
                setActiveBtn(btn);
                filterCards(filter);
            });
        });

    });
})();
