/**
 * Stackly — Page Loader
 * Shows a spinning logo overlay for exactly 2 seconds, then fades out.
 */
(function () {
    'use strict';

    var loader = document.getElementById('page-loader');
    if (!loader) return;

    // Ensure body doesn't scroll while loader is visible
    document.body.style.overflow = 'hidden';

    // Hide loader after 2 seconds
    setTimeout(function () {
        loader.classList.add('loader-hidden');

        // Re-enable scroll and remove from DOM after fade completes
        setTimeout(function () {
            document.body.style.overflow = '';
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 520); // matches the CSS transition duration (0.5s + buffer)
    }, 2000);
})();
