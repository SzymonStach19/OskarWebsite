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
});