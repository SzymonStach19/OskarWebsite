// Force scroll to top before unload
window.onbeforeunload = function() {
    window.scrollTo(0, 0);
};

document.addEventListener('DOMContentLoaded', function() {
    // Force scroll to top initially
    window.scrollTo(0, 0);
    document.body.scrollTop = document.documentElement.scrollTop = 0;

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

    // Create skip indicator element
    const skipIndicator = document.createElement('div');

    // Flag to track if initial scroll transition is complete
    let initialScrollComplete = false;
    let initialScrollHandled = false;
    let isRefreshed = false;
    let autoScrollTimeout;

    // Detect if this is a page refresh using a more reliable method
    if (performance.navigation && performance.navigation.type === 1) {
        isRefreshed = true;
    } else if (window.performance && window.performance.getEntriesByType &&
        window.performance.getEntriesByType('navigation').length > 0) {
        // Modern browsers
        isRefreshed = window.performance.getEntriesByType('navigation')[0].type === 'reload';
    } else if (sessionStorage.getItem('pageRefreshed')) {
        isRefreshed = true;
    }

    // Always update the session storage flag
    sessionStorage.setItem('pageRefreshed', 'true');

    // Force high priority loading for video
    if (videoBackground) {
        // Set high importance for loading priority
        videoBackground.setAttribute('importance', 'high');

        // Make video visible immediately to prevent delay
        videoBackground.style.opacity = '1';

        // Listen for video ready state
        videoBackground.addEventListener('load', function() {
            this.style.opacity = '1';
            if (nameTitle) nameTitle.style.opacity = '1';

            // Add skip instruction once video is loaded
            addSkipInstruction();
        });

        // Add video error handler
        videoBackground.addEventListener('error', function(e) {
            console.error('Video loading error:', e);
            // Attempt recovery
            const videoSrc = this.src;
            this.src = '';
            setTimeout(() => {
                this.src = videoSrc;
            }, 500);
        });
    }

    // Make sure the logo appears immediately on first load
    if (nameTitle) {
        // Force logo to be visible on load regardless of refresh state
        nameTitle.style.transition = 'none'; // Temporarily disable transition
        nameTitle.style.opacity = '1';
        nameTitle.style.transform = 'translateY(0)';

        // Re-enable transition after a short delay
        setTimeout(function() {
            nameTitle.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
        }, 50);
    }

    // Function to add skip instruction to video section
    function addSkipInstruction() {
        // Create skip instruction if it doesn't exist
        if (!document.querySelector('.skip-instruction')) {
            const skipInstruction = document.createElement('div');

            // Add to video section
            if (videoSection) {
                videoSection.appendChild(skipInstruction);

                // Show instruction after a delay
                setTimeout(() => {
                    skipInstruction.style.opacity = '1';
                }, 2000);

                // Pulse animation
                let pulseInterval = setInterval(() => {
                    skipInstruction.style.opacity = '0.6';
                    setTimeout(() => {
                        skipInstruction.style.opacity = '1';
                    }, 500);
                }, 2000);

                // Clear interval when video is skipped
                videoSection.addEventListener('click', () => {
                    clearInterval(pulseInterval);
                    skipInstruction.style.opacity = '0';
                    setTimeout(() => {
                        if (skipInstruction.parentNode) {
                            skipInstruction.parentNode.removeChild(skipInstruction);
                        }
                    }, 500);
                });
            }
        }
    }

    // If page is refreshed, delay the auto-scroll animation
    if (isRefreshed) {
        // Ensure we're at the top of the page
        window.scrollTo(0, 0);
        document.body.scrollTop = document.documentElement.scrollTop = 0;

        // Force the video section to be in view
        if (videoSection) {
            videoSection.scrollIntoView({behavior: 'auto', block: 'start'});
        }

        // Reset any programmatic scrolling that might have happened
        setTimeout(function() {
            window.scrollTo(0, 0);
            initialScrollHandled = true;
        }, 50);

        // Force reload the iframe if needed
        if (videoBackground) {
            const videoSrc = videoBackground.src;
            videoBackground.src = '';

            // Force a repaint before setting the src back
            setTimeout(function() {
                // Add preload parameter to video URL if not already present
                if (!videoSrc.includes('preload=auto')) {
                    videoBackground.src = videoSrc + (videoSrc.includes('?') ? '&' : '?') + 'preload=auto';
                } else {
                    videoBackground.src = videoSrc;
                }
                videoBackground.style.opacity = '1';

                // Reset any transform that might be affecting position
                videoBackground.style.transform = 'translate(-50%, -50%)';

                // For mobile/desktop scaling, add appropriate scale based on width after ensuring positioning
                if (window.innerWidth >= 768) {
                    videoBackground.style.transform += ' scale(1.8)';
                } else if (window.innerWidth < 768 && window.innerHeight > window.innerWidth) {
                    videoBackground.style.transform += ' scale(4.2)';
                } else {
                    videoBackground.style.transform += ' scale(2.5)';
                }

                if (nameTitle) {
                    nameTitle.style.opacity = '1';
                    nameTitle.style.transform = 'translateY(0)';
                }

                // Add skip instruction after video loads
                addSkipInstruction();
            }, 100);
        }

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

            // Force scroll back to top again after a small delay
            setTimeout(function() {
                window.scrollTo(0, 0);
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            }, 200);
        }, 100);
    } else {
        // First load, add skip instruction after a short delay
        setTimeout(addSkipInstruction, 1000);
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
        // Show skipping indicator
        const tempSkipIndicator = document.createElement('div');

        document.body.appendChild(tempSkipIndicator);

        // Show indicator
        setTimeout(() => {
            tempSkipIndicator.style.opacity = '1';
        }, 50);

        // Remove the indicator after transition
        setTimeout(() => {
            tempSkipIndicator.style.opacity = '0';
            setTimeout(() => {
                if (tempSkipIndicator.parentNode) {
                    tempSkipIndicator.parentNode.removeChild(tempSkipIndicator);
                }
            }, 300);
        }, 1000);

        // Remove skip instruction if present
        const skipInstruction = document.querySelector('.skip-instruction');
        if (skipInstruction && skipInstruction.parentNode) {
            skipInstruction.style.opacity = '0';
            setTimeout(() => {
                skipInstruction.parentNode.removeChild(skipInstruction);
            }, 300);
        }

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
            }, 1000);
        }

        // Initially disable scrolling during transition
        document.body.style.overflow = 'hidden';

        // Show hamburger menu and small logo after scrolling down
        setTimeout(function() {
            if (hamburgerMenu) hamburgerMenu.style.opacity = '1';
            if (smallLogo) smallLogo.style.opacity = '1';
        }, 1000);

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
                    }, 100 * index); // Stagger each item by 100ms (faster than before)
                });
            }
        }, 1500);

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
        }, 3000);
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
        autoScrollTimeout = setTimeout(function() {
            scrollToBlack();
        }, 9000); // 9 seconds for video viewing
    }

    // Make video section clickable to trigger scroll (unified handler for both mobile and desktop)
    if (videoSection) {
        // Unified handler for both click and touch
        const skipHandler = function(e) {
            if (e.type === 'touchend') {
                e.preventDefault(); // Prevent default only for touch events
            }

            // Clear any existing timeout to prevent multiple scrolls
            clearTimeout(autoScrollTimeout);

            // Scroll to black section immediately
            scrollToBlack();
        };

        // Add both event listeners
        videoSection.addEventListener('click', skipHandler);
        videoSection.addEventListener('touchend', skipHandler);

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

    // Make small logo clickable to go to top of black section with enhanced reliability
    if (smallLogo) {
        // Universal handler for both click and touch
        const smallLogoHandler = function(e) {
            if (e.type === 'touchstart') {
                e.preventDefault(); // Prevent default only for touch events
                smallLogo.classList.add('active-logo');
            }

            // Clear any pending autoscroll timeout
            clearTimeout(autoScrollTimeout);
            window.location.href = '/';


            // If we're already in the black section, scroll to the top of it
            // Otherwise perform the intro skip transition
            if (initialScrollComplete) {
                scrollToBlackSection();
            } else {
                initialScrollComplete = true; // Mark as complete to avoid duplicate transition
                scrollToBlack();
            }
        };

        // Add both event listeners
        smallLogo.addEventListener('click', smallLogoHandler);
        smallLogo.addEventListener('touchstart', smallLogoHandler);
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

    // Fallback mechanism if video doesn't appear
    let videoVisibilityCheckTimer = setTimeout(function checkVideoVisibility() {
        if (videoBackground && videoBackground.style.opacity !== '1') {
            console.log('Video visibility fallback activated');
            videoBackground.style.opacity = '1';

            // If the video still isn't loading, we can add a black background as fallback
            const videoContainer = document.querySelector('.video-container');
            if (videoContainer) {
                videoContainer.style.backgroundColor = '#000';
            }

            // Try reloading the video with optimized parameters
            if (videoBackground.src) {
                let newSrc = videoBackground.src;
                if (!newSrc.includes('preload=auto')) {
                    newSrc += (newSrc.includes('?') ? '&' : '?') + 'preload=auto';
                }
                if (!newSrc.includes('quality=auto')) {
                    newSrc += (newSrc.includes('?') ? '&' : '?') + 'quality=auto';
                }
                videoBackground.src = newSrc;
            }

            // Make sure skip instruction is visible even if video fails
            addSkipInstruction();
        }
    }, 2000); // Check after 2 seconds instead of 3

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