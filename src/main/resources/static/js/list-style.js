document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');
    const companyItems = document.querySelectorAll('.company-item');
    const headerItems = document.querySelectorAll('.header-item');
    const headerItemsContainer = document.querySelector('.header-items');

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

    // Add hover effect to header items container
    headerItemsContainer.addEventListener('mouseenter', function() {
        // Make all items not being hovered or active gray
        headerItems.forEach(item => {
            if (!item.classList.contains('active')) {
                item.style.color = '#888';
            }
        });
    });

    headerItemsContainer.addEventListener('mouseleave', function() {
        // Reset all items to white when not hovering the container
        headerItems.forEach(item => {
            if (!item.classList.contains('active')) {
                item.style.color = 'white';
            }
        });
    });

    // Add hover effect to individual header items
    headerItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // This item becomes white when hovered
            this.style.color = 'white';

            // Other non-active items become gray
            headerItems.forEach(otherItem => {
                if (otherItem !== this && !otherItem.classList.contains('active')) {
                    otherItem.style.color = '#888';
                }
            });
        });

        item.addEventListener('mouseleave', function() {
            // Return to appropriate color based on container hover state
            if (!this.classList.contains('active')) {
                if (headerItemsContainer.matches(':hover')) {
                    this.style.color = '#888';
                } else {
                    this.style.color = 'white';
                }
            }
        });
    });

    // Add click event listeners to header items for filtering
    headerItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Toggle active state for this category
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                // Show all companies when no category is selected
                filterCompanies(null);
            } else {
                // Remove active class from any other item
                headerItems.forEach(i => i.classList.remove('active'));

                // Add active class to this item and ensure it stays white
                this.classList.add('active');
                this.style.color = 'white';

                // Filter companies by this category
                filterCompanies(category);
            }
        });
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

            // If no category is active, show all items
            if (!category) {
                item.classList.remove('hidden');
                return;
            }

            // Check if this item has the active category
            if (itemCategories.includes(category)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
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
        }
    }

    function toggleMenu() {
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const navMenu = document.getElementById('navMenu');

        if (!hamburgerMenu || !navMenu) return;

        hamburgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
});