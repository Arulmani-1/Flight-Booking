/**
 * Stackly Flight Booking
 * Main JavaScript File (Refined)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Page Transition (Fade In) ---
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition-overlay';
    document.body.appendChild(transitionOverlay);
    
    gsap.to(transitionOverlay, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
            transitionOverlay.style.display = 'none';
        }
    });

    // Intercept internal links for exit transition
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            // Ignore if it's the current page or a hash link
            if (target === window.location.pathname.split('/').pop() || target.startsWith('#')) return;
            
            e.preventDefault();
            transitionOverlay.style.display = 'block';
            gsap.to(transitionOverlay, {
                opacity: 1,
                duration: 0.4,
                ease: 'power2.inOut',
                onComplete: () => {
                    window.location = target;
                }
            });
        });
    });

    // Fix for browser Back button (BFCache). Hide transition overlay if page is restored from cache.
    window.addEventListener('pageshow', (event) => {
        if (event.persisted && transitionOverlay) {
            transitionOverlay.style.display = 'none';
            gsap.set(transitionOverlay, { opacity: 0 });
        }
    });

    // --- Mobile Menu Scroll Lock ---
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse) {
        navbarCollapse.addEventListener('show.bs.collapse', () => {
            document.body.style.overflow = 'hidden';
        });
        navbarCollapse.addEventListener('hide.bs.collapse', () => {
            document.body.style.overflow = '';
        });
    }

    // --- 2. Initialize AOS ---
    AOS.init({
        duration: 900,
        once: true,
        offset: 50,
        easing: 'ease-out-cubic'
    });

    // --- 3. Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('navbar-dark');
            navbar.classList.add('navbar-light');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.add('navbar-dark');
            navbar.classList.remove('navbar-light');
        }
    });

    // --- 4. GSAP Initialization & Parallax ---
    gsap.registerPlugin(ScrollTrigger);

    // Parallax Backgrounds
    const parallaxImages = document.querySelectorAll('.hero');
    parallaxImages.forEach(section => {
        gsap.to(section, {
            backgroundPosition: `50% ${innerHeight / 2}px`,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top top", 
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Hero Entrance Animation
    if (document.querySelector('.hero-title')) {
        gsap.from('.hero-title', { y: 60, opacity: 0, duration: 1.2, delay: 0.2, ease: 'power3.out' });
        gsap.from('.hero-subtitle', { y: 40, opacity: 0, duration: 1.2, delay: 0.4, ease: 'power3.out' });
        if(document.querySelector('.search-panel')) {
            gsap.from('.search-panel', { y: 80, opacity: 0, duration: 1.2, delay: 0.8, ease: 'power3.out' });
        }
    }

    // --- 5. Advanced Airplane Scroll Animation ---
    const airplane = document.querySelector('.scroll-airplane');
    const flightPath = document.querySelector('#flightPath path');
    const routeNodes = document.querySelectorAll('.route-node');

    if (airplane && flightPath && window.innerWidth > 768) {
        
        // Wait for GSAP MotionPathPlugin (ensure it's loaded in HTML if we want true SVG path tracking, 
        // else fallback to vertical progress mapping for simplicity without external plugin overhead).
        
        // Fallback smooth vertical mapping that mimics a flight path
        const bodyHeight = document.body.scrollHeight - window.innerHeight;
        
        gsap.to(airplane, {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5,
                onUpdate: (self) => {
                    // Slight sway effect based on velocity
                    const sway = self.direction === 1 ? 5 : -5;
                    const rotate = 180 + (self.getVelocity() / 300); // Base pointing down (180deg) + sway
                    gsap.to(airplane, { rotation: rotate, duration: 0.5 });
                    
                    // Activate nodes as plane passes
                    routeNodes.forEach(node => {
                        const nodeTop = node.getBoundingClientRect().top + window.scrollY;
                        const planeTop = airplane.getBoundingClientRect().top + window.scrollY;
                        if (planeTop >= nodeTop - 50) {
                            node.classList.add('active');
                        } else {
                            node.classList.remove('active');
                        }
                    });
                }
            },
            top: '90%', 
            ease: 'power1.inOut'
        });
        
        // Draw the path SVG (dasharray stroke)
        if (flightPath) {
            const length = flightPath.getTotalLength();
            gsap.set(flightPath, { strokeDasharray: length, strokeDashoffset: length });
            gsap.to(flightPath, {
                strokeDashoffset: 0,
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1.5
                },
                ease: 'none'
            });
        }
    }

    // --- 6. Counters Animation ---
    const counters = document.querySelectorAll('.counter-value');
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const speed = 100; // Fast premium counting

            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target;
            }
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCount();
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });

    // Old interactive flight search mock has been moved and upgraded in dashboard.js }

});


    // 3D Airplane Scroll Animation
    const airplane = document.querySelector('.scroll-airplane');
    if(airplane && window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        
        // Initial 3D state
        gsap.set(airplane, { 
            rotationZ: 160, 
            rotationX: 45, 
            rotationY: -20,
            xPercent: -50,
            yPercent: -50
        });

        gsap.to(airplane, {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1
            },
            y: window.innerHeight + 300, // Move past bottom of screen
            rotationZ: 190, // Slight turn
            rotationX: 20,
            ease: 'none'
        });
    }


document.addEventListener('DOMContentLoaded', () => {

    // --- Newsletter Subscription Logic ---
    const footerForms = document.querySelectorAll('.footer form');
    footerForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                const msg = form.parentElement.querySelector('.newsletter-msg');
                if (msg) {
                    msg.style.display = 'block';
                }
                setTimeout(() => {
                    window.location.href = '404.html';
                }, 1500); // Wait 1.5 seconds before redirecting
            }
        });
    });

});
