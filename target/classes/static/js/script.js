// Mobile menu functionality
function toggleMenu() {
    const nav = document.querySelector('.nav');
    const menuBtn = document.querySelector('.menu-btn');

    nav.classList.toggle('active');

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

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Checking element visibility for animations
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // Reduced offset for better visibility
        const isVisible = (rect.top <= window.innerHeight * 0.8) && (rect.bottom >= 100);

        if (isVisible) {
            if (section.id === 'home') {
                const hero = section.querySelector('.hero');
                if (!hero.classList.contains('visible')) {
                    hero.classList.add('visible');
                }
            } else if (section.id === 'films') {
                // Check each film individually
                const films = section.querySelectorAll('.film');
                films.forEach((film, index) => {
                    const filmRect = film.getBoundingClientRect();
                    const isFilmVisible = (filmRect.top <= window.innerHeight * 0.8) && (filmRect.bottom >= 100);

                    if (isFilmVisible && !film.classList.contains('visible')) {
                        // Delayed appearance for slower animation
                        setTimeout(() => {
                            film.classList.add('visible');
                        }, 500);
                    }
                });
            } else if (section.id === 'about') {
                const about = section.querySelector('.about');
                if (!about.classList.contains('visible')) {
                    about.classList.add('visible');
                }
            }
        }
    });
});

// Function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to load Vimeo thumbnails
function loadVimeoThumbnails() {
    const videoContainers = document.querySelectorAll('.video-container[data-vimeo-id]');

    videoContainers.forEach(container => {
        const vimeoId = container.getAttribute('data-vimeo-id');
        const placeholderDiv = container.querySelector('.video-placeholder');

        if (vimeoId && placeholderDiv) {
            // Fetch the thumbnail URL from Vimeo's oEmbed API
            fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}`)
                .then(response => response.json())
                .then(data => {
                    const img = document.createElement('img');
                    img.src = data.thumbnail_url;
                    img.alt = data.title || "Video thumbnail";
                    img.loading = "lazy";
                    img.style.width = "100%";
                    img.style.height = "100%";
                    img.style.objectFit = "cover";

                    placeholderDiv.innerHTML = '';
                    placeholderDiv.appendChild(img);
                })
                .catch(error => {
                    console.error('Error fetching Vimeo thumbnail:', error);
                });
        }
    });
}

// Initial animation on main page - delayed for better effect
document.addEventListener('DOMContentLoaded', function() {
    // Setup mobile navigation
    setupMobileNav();

    const hero = document.querySelector('.hero');
    setTimeout(() => {
        hero.classList.add('visible');
    }, 800);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle window resize events
    window.addEventListener('resize', function() {
        // Reset menu on window resize
        const nav = document.querySelector('.nav');
        const menuBtn = document.querySelector('.menu-btn');

        if (window.innerWidth > 768 && nav.classList.contains('active')) {
            nav.classList.remove('active');
            if (menuBtn) {
                menuBtn.innerHTML = '&#9776;';
            }
        }
    });

    // Load Vimeo thumbnails
    loadVimeoThumbnails();

    // Setup video hover functionality for all video containers
    setupVideoHoverEffects();
});

// Function to set up video hover effects
function setupVideoHoverEffects() {
    const videoContainers = document.querySelectorAll('.video-container');

    // Add scroll event listener to check for videos in viewport
    window.addEventListener('scroll', function() {
        videoContainers.forEach(container => {
            if (isElementInViewport(container)) {
                container.setAttribute('data-in-viewport', 'true');
            } else {
                container.setAttribute('data-in-viewport', 'false');

                // If video was playing and scrolled out of view, pause it
                if (container.classList.contains('video-playing')) {
                    const videoIframe = container.querySelector('.vimeo-video');
                    if (videoIframe) {
                        videoIframe.contentWindow.postMessage(
                            JSON.stringify({
                                method: 'pause'
                            }),
                            '*'
                        );
                        container.classList.remove('video-playing');
                    }
                }
            }
        });
    });

    videoContainers.forEach(container => {
        const videoIframe = container.querySelector('.vimeo-video');
        const videoOverlay = container.querySelector('.video-overlay');

        if (videoIframe) {
            // Add data attribute to track viewport visibility
            container.setAttribute('data-in-viewport', 'false');

            // Initial check if element is in viewport
            if (isElementInViewport(container)) {
                container.setAttribute('data-in-viewport', 'true');
            }

            // Add loading class
            container.classList.add('video-loading');

            // Listen for iframe load event
            videoIframe.addEventListener('load', function() {
                container.classList.remove('video-loading');
            });

            // Mouse enter handler - only play if in viewport
            container.addEventListener('mouseenter', function() {
                if (container.getAttribute('data-in-viewport') === 'true') {
                    videoIframe.contentWindow.postMessage(
                        JSON.stringify({
                            method: 'play'
                        }),
                        '*'
                    );
                    container.classList.add('video-playing');
                }
            });

            container.addEventListener('mouseleave', function() {
                videoIframe.contentWindow.postMessage(
                    JSON.stringify({
                        method: 'pause'
                    }),
                    '*'
                );
                container.classList.remove('video-playing');
            });

            // Touch device handler
            container.addEventListener('touchstart', function(e) {
                e.preventDefault();

                // Only handle touch if in viewport
                if (container.getAttribute('data-in-viewport') === 'true') {
                    if (container.classList.contains('video-playing')) {
                        videoIframe.contentWindow.postMessage(
                            JSON.stringify({
                                method: 'pause'
                            }),
                            '*'
                        );
                        container.classList.remove('video-playing');
                    } else {
                        videoIframe.contentWindow.postMessage(
                            JSON.stringify({
                                method: 'play'
                            }),
                            '*'
                        );
                        container.classList.add('video-playing');
                    }
                }
            });
        }
    });

    // Trigger initial scroll check
    window.dispatchEvent(new Event('scroll'));
}