document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');
    const smallLogo = document.getElementById('smallLogo');
    const header = document.querySelector('.header');
    const companyList = document.querySelector('.company-list');
    const companyItems = document.querySelectorAll('.company-item');
    const headerItems = document.querySelectorAll('.header-item');
    const headerItemsContainer = document.querySelector('.header-items');

    // Set initial opacity to 0 for elements that will be animated
    // This ensures they're hidden even if CSS hasn't loaded yet
    if (smallLogo) smallLogo.style.opacity = '0';
    if (hamburgerMenu) hamburgerMenu.style.opacity = '0';
    if (header) header.style.opacity = '0';
    if (companyList) companyList.style.opacity = '0';

    // Trigger animations after a short delay to ensure DOM is ready
    setTimeout(() => {
        if (smallLogo) smallLogo.style.opacity = '';
        if (hamburgerMenu) hamburgerMenu.style.opacity = '';
        if (header) header.style.opacity = '';
        if (companyList) companyList.style.opacity = '';
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

    // Initialize the header items to all be white
    headerItems.forEach(item => {
        item.style.color = 'white';
    });

    // Updated header item interaction logic
    headerItems.forEach(item => {
        // Click event for selecting categories
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // If this item is already active, unclick it
            if (this.classList.contains('active')) {
                this.classList.remove('active');

                // Reset all items to white when nothing is selected
                headerItems.forEach(i => {
                    i.style.color = 'white';
                });

                // Show all companies
                resetCompanyFilter();
                return;
            }

            // Remove active class from all items
            headerItems.forEach(i => {
                i.classList.remove('active');
            });

            // Add active class to clicked item
            this.classList.add('active');

            // Set colors: active is white, others are gray
            headerItems.forEach(i => {
                if (i.classList.contains('active')) {
                    i.style.color = 'white';
                } else {
                    i.style.color = '#888';
                }
            });

            // Filter companies by this category
            filterCompanies(category);
        });

        // Mouse enter for hover effect
        item.addEventListener('mouseenter', function() {
            // Make this item white when hovered
            this.style.color = 'white';

            // Make all other items gray, regardless of whether they're active
            headerItems.forEach(otherItem => {
                if (otherItem !== this && !otherItem.classList.contains('active')) {
                    otherItem.style.color = '#888';
                }
            });
        });

        // Mouse leave to reset colors
        item.addEventListener('mouseleave', function() {
            // If this item is not active, set it back to gray if any item is active
            if (!this.classList.contains('active')) {
                const anyActive = Array.from(headerItems).some(i => i.classList.contains('active'));
                if (anyActive) {
                    this.style.color = '#888';
                } else {
                    this.style.color = 'white';
                }
            }
        });
    });

    // Header container hover effects
    headerItemsContainer.addEventListener('mouseenter', function() {
        const anyActive = Array.from(headerItems).some(i => i.classList.contains('active'));

        // If any item is active, non-active and non-hovered items should be gray
        if (anyActive) {
            headerItems.forEach(item => {
                if (!item.classList.contains('active') && !item.matches(':hover')) {
                    item.style.color = '#888';
                }
            });
        }
    });

    // Header container mouse leave effect
    headerItemsContainer.addEventListener('mouseleave', function() {
        const anyActive = Array.from(headerItems).some(i => i.classList.contains('active'));

        // If any item is active, keep active white and others gray
        if (anyActive) {
            headerItems.forEach(item => {
                if (item.classList.contains('active')) {
                    item.style.color = 'white';
                } else {
                    item.style.color = '#888';
                }
            });
        } else {
            // If no item is active, all items are white
            headerItems.forEach(item => {
                item.style.color = 'white';
            });
        }
    });

    // Add click event listeners to company items
    companyItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            companyItems.forEach(i => i.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            const companyName = this.querySelector('.company-name').textContent;
            console.log(`Navigating to ${companyName} project`);
            // You can add actual navigation code here
        });
    });

    // Add hover event listeners to company items
    companyItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            companyItems.forEach(i => {
                if (i !== this) {
                    i.style.color = '#888';
                    const subname = i.querySelector('.company-subname');
                    if (subname) subname.style.color = '#666';
                    const category = i.querySelector('.company-category');
                    if (category) category.style.color = '#666';
                }
            });
        });

        item.addEventListener('mouseleave', function() {
            companyItems.forEach(i => {
                i.style.color = '';
                const subname = i.querySelector('.company-subname');
                if (subname) subname.style.color = '';
                const category = i.querySelector('.company-category');
                if (category) category.style.color = '';
            });
        });
    });

    // Window resize event
    window.addEventListener('resize', function() {
        applyMenuPositioning();
    });

    // Filter companies based on active category
    function filterCompanies(category) {
        companyItems.forEach(item => {
            const itemCategories = item.getAttribute('data-categories').split(',');

            // Check if this item has the active category
            if (itemCategories.includes(category)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    // Reset company filter to show all companies
    function resetCompanyFilter() {
        companyItems.forEach(item => {
            item.classList.remove('hidden');
        });
    }

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