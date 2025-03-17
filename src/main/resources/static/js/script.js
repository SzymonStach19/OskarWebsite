document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');
    const smallLogo = document.getElementById('smallLogo');

    // Apply appropriate menu positioning based on device
    applyMenuPositioning();

    // Hamburger menu toggle with event handlers
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleMenu);
        hamburgerMenu.addEventListener('touchstart', function(e) {
            e.preventDefault(); // Prevent default touch behavior
            toggleMenu();
        });
    }

    // Add gallery item hover effects with JavaScript for better control
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Add focused class to this item
            this.classList.add('focused');

            // Blur all other gallery items
            galleryItems.forEach(otherItem => {
                if (otherItem !== this) {
                    otherItem.classList.add('blurred');
                }
            });
        });

        item.addEventListener('mouseleave', function() {
            // Remove focused class from this item
            this.classList.remove('focused');

            // Remove blur from all gallery items
            galleryItems.forEach(otherItem => {
                otherItem.classList.remove('blurred');
            });
        });

        // Add click functionality to gallery items (optional)
        item.addEventListener('click', function() {
            console.log('Gallery item clicked');
            // You could add functionality to open a lightbox or navigate to a project page
        });
    });

    // Window resize event
    window.addEventListener('resize', function() {
        applyMenuPositioning();
    });

    // Helper functions
    function applyMenuPositioning() {
        const hamburgerMenu = document.getElementById('hamburgerMenu');

        if (!hamburgerMenu) return;

        if (window.innerWidth <= 767) {
            hamburgerMenu.style.top = '20px';
            hamburgerMenu.style.right = '20px';
            hamburgerMenu.style.left = 'auto';
            hamburgerMenu.style.bottom = 'auto';
            hamburgerMenu.style.padding = '0';
            hamburgerMenu.style.margin = '0';
        } else {
            hamburgerMenu.style.bottom = '40px';
            hamburgerMenu.style.left = '40px';
            hamburgerMenu.style.top = 'auto';
            hamburgerMenu.style.right = 'auto';
            hamburgerMenu.style.padding = '15px';
            hamburgerMenu.style.margin = '-15px';
        }
    }

    function toggleMenu() {
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const navMenu = document.getElementById('navMenu');
        const smallLogo = document.getElementById('smallLogo');

        if (!hamburgerMenu || !navMenu) return;

        hamburgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Toggle the logo color when menu is active
        if (smallLogo) {
            smallLogo.classList.toggle('active-logo', navMenu.classList.contains('active'));
        }
    }
});