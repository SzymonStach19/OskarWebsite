document.addEventListener('DOMContentLoaded', function() {
    // Force scroll to top initially
    window.scrollTo(0, 0);

    // Get DOM elements
    const nameTitle = document.getElementById('nameTitle');
    const videoBackground = document.getElementById('videoBackground');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');
    const smallLogo = document.getElementById('smallLogo');
    const videoSection = document.getElementById('top-section');
    const mobileNavBackground = document.getElementById('mobileNavBackground');

    // Handle orientation changes
    window.addEventListener('resize', function() {
        // Force reload on orientation change to ensure proper scaling
        if (window.innerWidth <= 767) {
            window.location.reload();
        }
    });

    if (mobileNavBackground) {
        mobileNavBackground.style.opacity = '0';
    }

    // First animate the name
    setTimeout(function() {
        nameTitle.style.opacity = '1';
        nameTitle.style.transform = 'translateY(0)'; // Move to final position
    }, 500); // Delay before name appears

    // Then fade in the video after the name has appeared
    setTimeout(function() {
        videoBackground.style.opacity = '1';
    }, 2000); // Start video fade-in after 2 seconds

    // Apply appropriate menu positioning based on device
    applyMenuPositioning();

    // Create a function for the scroll transition
    function scrollToBlack() {
        // Scroll to bottom section with smooth behavior
        document.getElementById('bottom-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        if (mobileNavBackground && window.innerWidth <= 767) {
            setTimeout(function() {
                mobileNavBackground.style.opacity = '1';
            }, 1500);
        }

        // Completely disable scrolling
        document.body.style.overflow = 'hidden';

        // Show hamburger menu and small logo after scrolling down
        setTimeout(function() {
            hamburgerMenu.style.opacity = '1';
            smallLogo.style.opacity = '1';
        }, 1500);

        // Ensure we stay on the black section after transition
        setTimeout(function() {
            window.scrollTo({
                top: document.getElementById('bottom-section').offsetTop,
                behavior: 'auto'
            });
        }, 4000);
    }

    // For desktop: Play video for 9 seconds then scroll down
    let autoScrollTimeout = setTimeout(function() {
        scrollToBlack();
    }, 9000); // 9 seconds for video viewing

    // For both desktop and mobile: Make video section clickable to trigger scroll
    // Add specific tap/click handlers for mobile
    if ("ontouchstart" in document.documentElement) {
        // Clear the auto scroll timeout on mobile to prevent duplicate scrolling
        clearTimeout(autoScrollTimeout);

        // For mobile - use touch events
        videoSection.addEventListener('touchend', function(e) {
            // Prevent default behavior
            e.preventDefault();

            // Clear any existing timeout to prevent multiple scrolls
            clearTimeout(autoScrollTimeout);

            // Scroll to black section
            scrollToBlack();
        });
    }

    // Keep click event for non-touch devices
    videoSection.addEventListener('click', function() {
        clearTimeout(autoScrollTimeout);
        scrollToBlack();
    });

    // Add visual cue that video is tappable
    videoSection.style.cursor = 'pointer';

    // Hamburger menu toggle with event handlers
    hamburgerMenu.addEventListener('click', toggleMenu);
    hamburgerMenu.addEventListener('touchstart', function(e) {
        e.preventDefault(); // Prevent default touch behavior
        toggleMenu();
    });

    // Make small logo clickable to go to top of black section
    smallLogo.addEventListener('click', function() {
        scrollToBlackSection();
    });
    smallLogo.addEventListener('touchstart', function(e) {
        smallLogo.classList.add('active-logo');
        e.preventDefault();
        scrollToBlackSection();
    });
    smallLogo.style.cursor = 'pointer'; // Add pointer cursor to indicate it's clickable

    document.getElementById('indexLink').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '#'; // Navigate to index page
        navMenu.classList.remove('active');
        hamburgerMenu.classList.remove('active');
    });

    document.getElementById('infoLink').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'info'; // Navigate to info page
        navMenu.classList.remove('active');
        hamburgerMenu.classList.remove('active');
    });

    // Set up scroll prevention
    setupScrollPrevention();
});

// Helper functions
function applyMenuPositioning() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');

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
    }
}

function toggleMenu() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');

    hamburgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Function to scroll to the black section
function scrollToBlackSection() {
    document.getElementById('bottom-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function setupScrollPrevention() {
    // Prevent any manual scrolling during video play but allow for hamburger menu interaction
    const preventScroll = function(e) {
        // Check if the click/touch is on the hamburger menu or small logo
        if (!e.target.closest('#hamburgerMenu') && !e.target.closest('#navMenu') && !e.target.closest('#smallLogo')) {
            e.preventDefault();
        }
    };

    // Add passive: false to ensure preventDefault works on mobile
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });

    // Modified to allow hamburger and logo interaction
    document.addEventListener('touchstart', function(e) {
        if (!e.target.closest('#hamburgerMenu') && !e.target.closest('#navMenu') && !e.target.closest('#smallLogo')) {
            // Don't prevent default here to allow for video tapping
        }
    }, { passive: true });

    // Make small logo clickable to go to home page on mobile, or scroll to black section on desktop
    smallLogo.addEventListener('click', function() {
        if (window.innerWidth <= 767) {
            // On mobile, navigate to home page
            window.location.href = '/';
        } else {
            // On desktop, scroll to black section
            scrollToBlackSection();
        }
    });

    smallLogo.addEventListener('touchstart', function(e) {
        e.preventDefault();
        // On mobile, navigate to home page
        window.location.href = '/';
    });


    // For iOS devices which might handle events differently
    document.addEventListener('gesturestart', preventScroll, { passive: false });
    document.addEventListener('gesturechange', preventScroll, { passive: false });
    document.addEventListener('gestureend', preventScroll, { passive: false });
}