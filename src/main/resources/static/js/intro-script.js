document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('mainContainer');
    const vimeoPlayer = document.getElementById('vimeoPlayer');
    const playButton = document.getElementById('playButton');
    const creatorText = document.getElementById('creatorText');
    const transitionPanel = document.getElementById('transitionPanel');
    const videoContainer = document.getElementById('videoContainer');
    const nameText = document.getElementById('nameText');

    // Initialize swipe variables
    let touchStartY = 0;
    let touchEndY = 0;
    const swipeThreshold = 100; // Minimum distance for swipe to register

    // Trigger name text animation after a short delay
    setTimeout(function() {
        nameText.style.opacity = '1';
        nameText.style.transform = 'translateY(0)';
    }, 800);

    // Load Vimeo Player API
    let vimeoPlayerAPI;
    const script = document.createElement('script');
    script.src = "https://player.vimeo.com/api/player.js";
    document.body.appendChild(script);

    script.onload = function() {
        // Initialize Vimeo player
        vimeoPlayerAPI = new Vimeo.Player(vimeoPlayer);

        // Hide play button initially since video will autoplay
        playButton.style.display = 'none';

        // Listen for video end
        vimeoPlayerAPI.on('ended', function() {
            skipToAnimation();
        });
    };

    // Fix for iOS Safari 100vh issue - IMPROVED VERSION
    function setVHHeight() {
        // Get the actual viewport height
        let vh = window.innerHeight * 0.01;
        // Set the value in the --vh custom property
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        // Force exact height on containers
        videoContainer.style.height = `${window.innerHeight}px`;
        transitionPanel.style.height = `${window.innerHeight}px`;

        // Update container height to match exactly two screen heights
        container.style.height = `${window.innerHeight * 2}px`;
    }

    // Run the function on initial load
    setVHHeight();

    // Re-run the function on resize or orientation change
    window.addEventListener('resize', setVHHeight);
    window.addEventListener('orientationchange', setVHHeight);

    // Additional trigger for iOS
    window.addEventListener('orientationchange', function() {
        // Small delay to ensure dimensions are updated after rotation
        setTimeout(setVHHeight, 100);
    });

    // Function to redirect to the preview page
    function redirectToPreview() {
        window.location.href = '/preview';
    }

    // Function to handle skipping to animation
    function skipToAnimation() {
        // Pause the Vimeo video if API is loaded
        if (vimeoPlayerAPI) {
            vimeoPlayerAPI.pause();
        }

        // Scroll to the transition panel - using smooth scrolling
        transitionPanel.scrollIntoView({ behavior: 'smooth' });

        // Fade out the text after a longer delay (3.5 seconds)
        setTimeout(function() {
            creatorText.style.opacity = '0';

            // Wait for fade-out to complete before redirecting
            setTimeout(function() {
                redirectToPreview();
            }, 2500);
        }, 2500);
    }

    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        // For mobile devices, use swipe instead of tap
        videoContainer.addEventListener('touchstart', function(e) {
            touchStartY = e.changedTouches[0].screenY;
        }, false);

        videoContainer.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, false);

        // Handle the swipe gesture
        function handleSwipe() {
            if (touchStartY - touchEndY > swipeThreshold) {
                // Swipe up detected, skip to animation
                skipToAnimation();
            }
        }
    } else {
        // For desktop, keep click behavior
        videoContainer.addEventListener('click', function(e) {
            // Prevent click on play button from triggering skip
            if (e.target !== playButton) {
                skipToAnimation();
            }
        });
    }

    // Play button click handler (kept for backup)
    playButton.addEventListener('click', function(e) {
        // Try to unmute Vimeo video if API is loaded
        if (vimeoPlayerAPI) {
            vimeoPlayerAPI.setVolume(1); // Unmute
            vimeoPlayerAPI.play(); // Ensure it's playing

            // Hide play button
            playButton.style.display = 'none';
        }

        // Stop event propagation to prevent the container click from firing
        e.stopPropagation();
    });

    // Detect if device is iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isIOS) {
        // Additional fix specific to iOS devices
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';

        // Call setVHHeight again after a slight delay to ensure proper sizing
        setTimeout(setVHHeight, 300);

        // Add additional listener for iOS scroll/bounce issues
        document.body.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
    }
});