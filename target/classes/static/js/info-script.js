document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');
    const smallLogo = document.getElementById('smallLogo');

    // Make navigation elements visible immediately
    smallLogo.style.opacity = '1';
    hamburgerMenu.style.opacity = '1';

    // Enable scrolling
    document.body.style.overflow = 'auto';

    // Apply appropriate menu positioning based on device
    applyMenuPositioning();

    // Hamburger menu toggle with event handlers
    hamburgerMenu.addEventListener('click', toggleMenu);
    hamburgerMenu.addEventListener('touchstart', function(e) {
        e.preventDefault(); // Prevent default touch behavior
        toggleMenu();
    });

    // Navigation link handling
    document.getElementById('indexLink').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'index.html#bottom-section'; // Navigate to index page bottom section
        navMenu.classList.remove('active');
        hamburgerMenu.classList.remove('active');
    });

    document.getElementById('infoLink').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'info'; // Navigate to info page
        navMenu.classList.remove('active');
        hamburgerMenu.classList.remove('active');
    });
});

// Helper functions
function applyMenuPositioning() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');

    if (window.innerWidth <= 767) {
        hamburgerMenu.style.top = '20px';
        hamburgerMenu.style.right = '20px';
        hamburgerMenu.style.left = 'auto';
        hamburgerMenu.style.bottom = 'auto';
    } else {
        hamburgerMenu.style.bottom = '40px';
        hamburgerMenu.style.left = '40px';
        hamburgerMenu.style.top = 'auto';
        hamburgerMenu.style.right = 'auto';
    }
}

function toggleMenu() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');

    hamburgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
}