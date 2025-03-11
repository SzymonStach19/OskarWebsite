// Page reveal animation on load
document.addEventListener('DOMContentLoaded', function() {
    // Short delay to ensure smooth animation
    setTimeout(function() {
        document.body.classList.add('animate-in');
    }, 100);

    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (menuToggle && mobileNav) {
        // Upewnij się, że menu mobilne jest w DOM ale ukryte
        mobileNav.style.display = 'none';

        menuToggle.addEventListener('click', function() {
            // Przełącz widoczność mobilnego menu
            if (mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                // Po zakończeniu animacji, ukryj element całkowicie
                setTimeout(() => {
                    mobileNav.style.display = 'none';
                }, 500); // Ten czas powinien być równy czasowi trwania animacji
            } else {
                // Pokaż element przed dodaniem klasy active
                mobileNav.style.display = 'block';
                // Używamy setTimeout, aby upewnić się, że element jest już widoczny zanim dodamy klasę
                setTimeout(() => {
                    mobileNav.classList.add('active');
                }, 10);
            }
            menuToggle.classList.toggle('active');
        });
    }

    // Add active class to current link
    const navLinks = document.querySelectorAll('nav a, #mobile-nav a');

    // Update active link on page load
    updateActiveLink();

    // Update active link when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Close mobile menu if it's open
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                // Reset the toggle
                menuToggle.classList.remove('active');
            }

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Update active link when scrolling
    document.addEventListener('scroll', function() {
        updateActiveLink();
    });

    function updateActiveLink() {
        // Get all sections
        const sections = [];
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                const section = document.querySelector(href);
                if (section) {
                    sections.push({
                        id: href,
                        element: section,
                        position: section.getBoundingClientRect().top
                    });
                }
            }
        });

        // Find the section closest to the top of the viewport
        let closest = null;
        let minDistance = Infinity;

        sections.forEach(section => {
            const distance = Math.abs(section.position);
            if (distance < minDistance) {
                minDistance = distance;
                closest = section.id;
            }
        });

        // Update active class
        if (closest) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === closest) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }

    // Add class to video section to trigger animation
    const videoSection = document.querySelector('.video-section');
    if (videoSection) {
        videoSection.classList.add('animate-video');
    }
});

// Scroll animation
document.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight - 100) {
            element.classList.add('visible');
        }
    });
});