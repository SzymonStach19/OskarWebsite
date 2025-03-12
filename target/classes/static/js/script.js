document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    mobileMenuToggle.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
    });

    // Set the home section active by default
    document.getElementById('home').classList.add('active');

    // Logo click handler - return to home
    document.getElementById('logo-link').addEventListener('click', function(e) {
        e.preventDefault();

        // Hide all sections
        const sections = document.querySelectorAll('.portfolio-section');
        sections.forEach(section => section.classList.remove('active'));

        // Show home section
        document.getElementById('home').classList.add('active');

        // Remove active class from all navigation links
        const navLinks = document.querySelectorAll('#main-nav a, #mobile-nav a');
        navLinks.forEach(link => link.classList.remove('active'));

        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Handle navigation clicks to show/hide sections
    const navLinks = document.querySelectorAll('#main-nav a, #mobile-nav a');
    const sections = document.querySelectorAll('.portfolio-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(item => item.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));

            // Show only target section
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');

            // Smooth scroll to top (zmienione z przewijania do wysokości nagłówka)
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Close mobile menu
            mobileNav.classList.remove('active');
        });
    });

    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('#mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
        });
    });

    // Subtle fade-in animation
    const fadeElements = document.querySelectorAll('.section-title, .portfolio-item, .about-content');

    function checkFade() {
        const windowHeight = window.innerHeight;
        const fadePoint = 150;

        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - fadePoint) {
                element.classList.add('visible');
            }
        });
    }

    // Add fade-in class to all elements
    fadeElements.forEach(element => {
        element.classList.add('fade-in');
    });

    window.addEventListener('scroll', checkFade);
    window.addEventListener('load', function() {
        // Initial check for elements in view
        checkFade();
    });
});