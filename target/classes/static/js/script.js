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
    const portfolioFilter = document.querySelector('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Flag to track if initial scroll transition is complete
    let initialScrollComplete = false;
    let isRefreshed = false;

    // Detect if this is a page refresh using sessionStorage
    if (sessionStorage.getItem('pageRefreshed')) {
        isRefreshed = true;
    } else {
        sessionStorage.setItem('pageRefreshed', 'true');
    }

    // If page is refreshed, delay the auto-scroll animation
    if (isRefreshed) {
        // Immediately show the logo and video
        if (nameTitle) {
            nameTitle.style.opacity = '1';
            nameTitle.style.transform = 'translateY(0)';
        }

        if (videoBackground) {
            videoBackground.style.opacity = '1';
        }

        // Force the nameTitle and videoBackground to be visible
        // Use a forced timeout to ensure this happens after the browser has had time to render
        setTimeout(function() {
            if (nameTitle) {
                nameTitle.style.opacity = '1';
                nameTitle.style.transform = 'translateY(0)';
            }

            if (videoBackground) {
                videoBackground.style.opacity = '1';
            }

            // Cancel any ongoing animations or transitions
            document.body.style.transition = 'none';
            if (nameTitle) nameTitle.style.transition = 'none';
            if (videoBackground) videoBackground.style.transition = 'none';

            // Force a repaint
            document.body.offsetHeight;

            // Restore transitions
            setTimeout(function() {
                document.body.style.transition = '';
                if (nameTitle) nameTitle.style.transition = '';
                if (videoBackground) videoBackground.style.transition = '';
            }, 100);
        }, 100);
    }

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

    // Apply appropriate menu positioning based on device
    applyMenuPositioning();

    // Create a function for the scroll transition
    function scrollToBlack() {
        // Scroll to bottom section with smooth behavior
        const bottomSection = document.getElementById('bottom-section');
        if (bottomSection) {
            bottomSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        if (mobileNavBackground && window.innerWidth <= 767) {
            setTimeout(function() {
                mobileNavBackground.style.opacity = '1';
            }, 1500);
        }

        // Initially disable scrolling during transition
        document.body.style.overflow = 'hidden';

        // Show hamburger menu and small logo after scrolling down
        setTimeout(function() {
            if (hamburgerMenu) hamburgerMenu.style.opacity = '1';
            if (smallLogo) smallLogo.style.opacity = '1';
        }, 1500);

        // Animate portfolio elements
        setTimeout(function() {
            if (portfolioFilter) {
                portfolioFilter.classList.add('appear');
            }

            // Stagger the appearance of portfolio items
            if (portfolioItems.length > 0) {
                portfolioItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('appear');
                    }, 200 * index); // Stagger each item by 200ms
                });
            }
        }, 2000);

        // Ensure we stay on the black section after transition
        setTimeout(function() {
            if (bottomSection) {
                window.scrollTo({
                    top: bottomSection.offsetTop,
                    behavior: 'auto'
                });
            }

            // Enable scrolling after the transition is complete
            document.body.style.overflow = 'auto';

            // Set flag to indicate scroll transition is complete
            initialScrollComplete = true;

            // Remove the scroll prevention event listeners
            document.removeEventListener('wheel', preventInitialScroll, { passive: false });
            document.removeEventListener('touchmove', preventInitialScroll, { passive: false });
            document.removeEventListener('gesturestart', preventInitialScroll, { passive: false });
            document.removeEventListener('gesturechange', preventInitialScroll, { passive: false });
            document.removeEventListener('gestureend', preventInitialScroll, { passive: false });
        }, 4000);
    }

    // Ensure everything is visible before auto-scrolling
    if (isRefreshed) {
        // On refresh, add a forced delay before starting the auto-scroll
        // This gives the browser time to stabilize and show elements
        setTimeout(function() {
            // Auto-scroll timeout with a longer delay on refresh
            autoScrollTimeout = setTimeout(function() {
                scrollToBlack();
            }, 9000);
        }, 1000); // Delay starting the auto-scroll timeout
    } else {
        // For normal page loads, proceed with normal timing
        let autoScrollTimeout = setTimeout(function() {
            scrollToBlack();
        }, 9000); // 9 seconds for video viewing
    }

    // For both desktop and mobile: Make video section clickable to trigger scroll
    // Add specific tap/click handlers for mobile
    if ("ontouchstart" in document.documentElement) {
        // For mobile - use touch events
        if (videoSection) {
            videoSection.addEventListener('touchend', function(e) {
                // Prevent default behavior
                e.preventDefault();

                // Clear any existing timeout to prevent multiple scrolls
                clearTimeout(autoScrollTimeout);

                // Scroll to black section
                scrollToBlack();
            });
        }
    }

    // Keep click event for non-touch devices
    if (videoSection) {
        videoSection.addEventListener('click', function() {
            clearTimeout(autoScrollTimeout);
            scrollToBlack();
        });

        // Add visual cue that video is tappable
        videoSection.style.cursor = 'pointer';
    }

    // Hamburger menu toggle with event handlers
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleMenu);
        hamburgerMenu.addEventListener('touchstart', function(e) {
            e.preventDefault(); // Prevent default touch behavior
            toggleMenu();
        });
    }

    // Prevent scrolling back to video section once transitioned to black section
    window.addEventListener('scroll', function() {
        // Only apply this after initial transition is complete
        if (initialScrollComplete) {
            const blackSectionTop = document.getElementById('bottom-section').offsetTop;

            // If user scrolls above the black section
            if (window.scrollY < blackSectionTop) {
                // Force scroll back to black section
                window.scrollTo({
                    top: blackSectionTop,
                    behavior: 'auto' // Use 'auto' for immediate repositioning
                });
            }
        }
    });

    // Make small logo clickable to go to top of black section
    if (smallLogo) {
        smallLogo.addEventListener('click', function() {
            scrollToBlackSection();
        });
        smallLogo.addEventListener('touchstart', function(e) {
            smallLogo.classList.add('active-logo');
            e.preventDefault();
            scrollToBlackSection();
        });
        smallLogo.style.cursor = 'pointer'; // Add pointer cursor to indicate it's clickable
    }

    const indexLink = document.getElementById('indexLink');
    if (indexLink) {
        indexLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '#'; // Navigate to index page
            if (navMenu) navMenu.classList.remove('active');
            if (hamburgerMenu) hamburgerMenu.classList.remove('active');
        });
    }

    const infoLink = document.getElementById('infoLink');
    if (infoLink) {
        infoLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'info'; // Navigate to info page
            if (navMenu) navMenu.classList.remove('active');
            if (hamburgerMenu) hamburgerMenu.classList.remove('active');
        });
    }

    // Portfolio filtering functionality
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(innerBtn => {
                    innerBtn.classList.remove('active');
                });

                // Add active class to clicked button
                this.classList.add('active');

                // Get filter value
                const filterValue = this.getAttribute('data-filter');

                // Filter items
                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        // Re-trigger animation
                        item.classList.remove('appear');
                        setTimeout(() => {
                            item.classList.add('appear');
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Function to prevent initial scroll
    function preventInitialScroll(e) {
        // Only prevent scroll if we're still in the initial transition
        if (!initialScrollComplete) {
            // Allow interaction with menu elements
            if (!e.target.closest('#hamburgerMenu') && !e.target.closest('#navMenu') && !e.target.closest('#smallLogo')) {
                e.preventDefault();
            }
        }
    }

    // Set up scroll prevention only for initial transition
    document.addEventListener('wheel', preventInitialScroll, { passive: false });
    document.addEventListener('touchmove', preventInitialScroll, { passive: false });
    document.addEventListener('gesturestart', preventInitialScroll, { passive: false });
    document.addEventListener('gesturechange', preventInitialScroll, { passive: false });
    document.addEventListener('gestureend', preventInitialScroll, { passive: false });
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
    }
}

function toggleMenu() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');

    if (!hamburgerMenu || !navMenu) return;

    hamburgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Function to scroll to the black section
function scrollToBlackSection() {
    const bottomSection = document.getElementById('bottom-section');
    if (bottomSection) {
        bottomSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function setupScrollPrevention() {
    // Allow scrolling within the black section after initial transition
    const preventInitialScroll = function(e) {
        // Check if the click/touch is on the hamburger menu or small logo
        if (!e.target.closest('#hamburgerMenu') && !e.target.closest('#navMenu') && !e.target.closest('#smallLogo') && !e.target.closest('.portfolio-filter') && !e.target.closest('.portfolio-grid')) {
            e.preventDefault();
        }
    };

    // Add passive: false to ensure preventDefault works on mobile
    document.addEventListener('wheel', preventInitialScroll, { passive: false });
    document.addEventListener('touchmove', preventInitialScroll, { passive: false });

    // Modified to allow hamburger and logo interaction
    document.addEventListener('touchstart', function(e) {
        if (!e.target.closest('#hamburgerMenu') && !e.target.closest('#navMenu') && !e.target.closest('#smallLogo')) {
            // Don't prevent default here to allow for video tapping
        }
    }, { passive: true });

    // Make small logo clickable to go to home page on mobile, or scroll to black section on desktop
    const smallLogo = document.getElementById('smallLogo');
    if (smallLogo) {
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
    }


    // For iOS devices which might handle events differently
    document.addEventListener('gesturestart', preventInitialScroll, { passive: false });
    document.addEventListener('gesturechange', preventInitialScroll, { passive: false });
    document.addEventListener('gestureend', preventInitialScroll, { passive: false });
}