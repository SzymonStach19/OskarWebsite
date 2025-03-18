document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');
    const smallLogo = document.getElementById('smallLogo');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleries = document.querySelectorAll('.gallery');

    // Set initial opacity to 0 for elements that will be animated
    // This ensures they're hidden even if CSS hasn't loaded yet
    if (smallLogo) smallLogo.style.opacity = '0';
    if (hamburgerMenu) hamburgerMenu.style.opacity = '0';
    galleries.forEach(gallery => {
        gallery.style.opacity = '0';
    });

    // Trigger animations after a short delay to ensure DOM is ready
    setTimeout(() => {
        if (smallLogo) smallLogo.style.opacity = '';
        if (hamburgerMenu) hamburgerMenu.style.opacity = '';
        galleries.forEach(gallery => {
            gallery.style.opacity = '';
        });
    }, 100);

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

    // Scroll effect for mobile
    initScrollEffect();

    // Window resize event
    window.addEventListener('resize', function() {
        applyMenuPositioning();
        initScrollEffect(); // Re-initialize scroll effect when window is resized
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

    function initScrollEffect() {
        // Clear any existing classes first
        galleryItems.forEach(item => {
            item.classList.remove('blurred');
            item.classList.remove('focused');
            item.classList.remove('in-view');
        });

        // Only initialize on mobile devices
        if (window.innerWidth <= 767) {
            // Remove previous scroll listener if any
            window.removeEventListener('scroll', handleScroll);

            // Add new scroll listener
            window.addEventListener('scroll', handleScroll);

            // Initialize focus on the first visible item
            setTimeout(function() {
                handleScroll();
            }, 100);
        } else {
            // For desktop, we already have hover effect
            window.removeEventListener('scroll', handleScroll);
        }
    }

    function handleScroll() {
        // First, get all elements that are currently in viewport
        const visibleItems = [];
        let maxVisibility = 0;
        let mostVisibleItem = null;

        galleryItems.forEach(item => {
            const visibility = getVisibilityPercentage(item);

            if (visibility > 0) {
                visibleItems.push({item, visibility});

                if (visibility > maxVisibility) {
                    maxVisibility = visibility;
                    mostVisibleItem = item;
                }
            }
        });

        // If we found a most visible item
        if (mostVisibleItem) {
            // Reset all items first
            galleryItems.forEach(item => {
                item.classList.remove('focused');
                item.classList.add('blurred');
                item.classList.remove('in-view');
            });

            // Then focus the most visible one
            mostVisibleItem.classList.add('focused');
            mostVisibleItem.classList.remove('blurred');
            mostVisibleItem.classList.add('in-view');
        }
    }

    function getVisibilityPercentage(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowCenter = windowHeight / 2;

        // Calculate how much of the element is visible
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(windowHeight, rect.bottom);

        if (visibleBottom <= visibleTop) {
            return 0; // Not visible at all
        }

        const visibleHeight = visibleBottom - visibleTop;
        const elementHeight = rect.bottom - rect.top;
        const visibilityPercent = (visibleHeight / elementHeight) * 100;

        // Calculate the element's center point
        const elementCenter = (rect.top + rect.bottom) / 2;

        // Calculate how close the element center is to viewport center (as a percentage)
        // The closer to center, the higher the score
        const distanceFromCenter = Math.abs(elementCenter - windowCenter);
        const maxDistance = windowHeight / 2;
        const centerFactor = 1 - (distanceFromCenter / maxDistance);

        // Weigh the visibility by how centered the element is
        // This boosts score for elements closer to the center
        return visibilityPercent * Math.pow(centerFactor, 2);
    }
});