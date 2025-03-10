// Mobile menu functionality
function toggleMenu() {
    const nav = document.querySelector('.nav');
    const menuBtn = document.querySelector('.menu-btn');
    const body = document.body;

    nav.classList.toggle('active');
    body.classList.toggle('menu-open');

    // Change button text based on menu state
    if (nav.classList.contains('active')) {
        menuBtn.innerHTML = '&times;'; // × symbol
    } else {
        menuBtn.innerHTML = '&#9776;'; // ≡ symbol
    }
}

// Close menu when clicking a nav link
function setupMobileNav() {
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });
}

// Enhanced header scroll effect with throttling
let lastScrollPosition = 0;
let ticking = false;

function handleScroll() {
    lastScrollPosition = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateHeaderAndSections(lastScrollPosition);
            ticking = false;
        });

        ticking = true;
    }
}

function updateHeaderAndSections(scrollPos) {
    const header = document.querySelector('.header');
    if (scrollPos > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Check element visibility for animations with improved performance
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // Adjusted threshold for better triggering
        const isVisible = (rect.top <= window.innerHeight * 0.85) && (rect.bottom >= 50);

        if (isVisible) {
            if (section.id === 'home') {
                const hero = section.querySelector('.hero');
                if (hero && !hero.classList.contains('visible')) {
                    hero.classList.add('visible');
                }
            } else if (section.id === 'films') {
                // Check each film individually with staggered animation
                const films = section.querySelectorAll('.film');
                films.forEach((film, index) => {
                    const filmRect = film.getBoundingClientRect();
                    const isFilmVisible = (filmRect.top <= window.innerHeight * 0.85) && (filmRect.bottom >= 50);

                    if (isFilmVisible && !film.classList.contains('visible')) {
                        // Staggered appearance for slower animation
                        setTimeout(() => {
                            film.classList.add('visible');
                        }, 200 * index); // Increased delay between elements
                    }
                });
            } else if (section.id === 'about') {
                const about = section.querySelector('.about');
                if (about && !about.classList.contains('visible')) {
                    about.classList.add('visible');
                }
            }
        }
    });
}

// Improved function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    // More precise calculation with threshold
    const verticalThreshold = windowHeight * 0.2; // 20% threshold
    const horizontalThreshold = 0;

    return (
        rect.top >= -verticalThreshold &&
        rect.left >= -horizontalThreshold &&
        rect.bottom <= (windowHeight + verticalThreshold) &&
        rect.right <= (windowWidth + horizontalThreshold)
    );
}

// Enhanced setup for Vimeo videos with hover-to-play functionality
function setupVideos() {
    const videoContainers = document.querySelectorAll('.video-container');

    videoContainers.forEach(container => {
        const vimeoId = container.getAttribute('data-vimeo-id');
        const videoPlaceholder = container.querySelector('.video-placeholder');
        const vimeoIframe = container.querySelector('.vimeo-video');

        if (!vimeoId) return;

        // Pre-load and cache thumbnails
        const thumbnailUrl = `https://vumbnail.com/${vimeoId}.jpg`;

        // Create and load the thumbnail image
        const thumbnailImage = new Image();
        thumbnailImage.onload = function() {
            // Set background image once loaded
            videoPlaceholder.style.backgroundImage = `url(${thumbnailUrl})`;
            container.classList.remove('video-loading');
        };

        thumbnailImage.onerror = function() {
            // Fallback for thumbnail loading errors
            console.error('Failed to load thumbnail:', vimeoId);
            videoPlaceholder.style.backgroundColor = '#111111';
            container.classList.remove('video-loading');
        };

        // Start loading the thumbnail
        container.classList.add('video-loading');
        thumbnailImage.src = thumbnailUrl;

        // Hover to play and pause functionality
        container.addEventListener('mouseenter', function() {
            container.classList.add('video-hover');

            // Get the Vimeo player
            if (vimeoIframe && vimeoIframe.contentWindow) {
                vimeoIframe.contentWindow.postMessage('{"method":"play"}', '*');
            }
        });

        container.addEventListener('mouseleave', function() {
            container.classList.remove('video-hover');

            // Pause the video when cursor leaves
            if (vimeoIframe && vimeoIframe.contentWindow) {
                vimeoIframe.contentWindow.postMessage('{"method":"pause"}', '*');
            }
        });

        // Handle click to open video details
        container.addEventListener('click', function(e) {
            const watchBtn = container.closest('.film').querySelector('.watch-btn');
            if (watchBtn && watchBtn.getAttribute('href')) {
                e.preventDefault();
                window.open(watchBtn.getAttribute('href'), '_blank');
            }
        });
    });
}

// Smooth scrolling for internal links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Add page transition effect
                const pageTransition = document.createElement('div');
                pageTransition.classList.add('page-transition');
                document.body.appendChild(pageTransition);

                // Trigger transition animation
                setTimeout(() => {
                    pageTransition.classList.add('active');
                }, 50);

                // After transition, scroll to element
                setTimeout(() => {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });

                    // Remove transition overlay
                    setTimeout(() => {
                        pageTransition.classList.remove('active');
                        setTimeout(() => {
                            pageTransition.remove();
                        }, 800);
                    }, 600);
                }, 600);
            }
        });
    });
}

// Page loading animation
function setupPageLoad() {
    // Create and add page transition element
    const pageLoadTransition = document.createElement('div');
    pageLoadTransition.classList.add('page-transition', 'active');
    document.body.appendChild(pageLoadTransition);

    // Remove transition after page is loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            pageLoadTransition.classList.remove('active');
            setTimeout(() => {
                pageLoadTransition.remove();
                // Trigger hero animation on page load
                const hero = document.querySelector('.hero');
                if (hero) {
                    hero.classList.add('visible');
                }
            }, 800);
        }, 500);
    });
}

// Initialize all functionality
function init() {
    setupMobileNav();
    setupVideos();
    setupSmoothScrolling();
    setupPageLoad();

    // Add scroll event listener with passive flag for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check for visible elements
    updateHeaderAndSections(window.scrollY);

    // Handle resize events for responsive adjustments
    window.addEventListener('resize', function() {
        // Debounce resize handler
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(function() {
            updateHeaderAndSections(window.scrollY);
        }, 200);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);