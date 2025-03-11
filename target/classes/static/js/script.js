// Dodaj to do istniejącego pliku script.js

// Animacja ujawniania się strony po załadowaniu
document.addEventListener('DOMContentLoaded', function() {
    // Krótkie opóźnienie, aby zapewnić płynną animację
    setTimeout(function() {
        document.body.classList.add('animate-in');
    }, 100);
});

// Istniejący kod do animacji przy przewijaniu
document.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight - 100) {
            element.classList.add('visible');
        }
    });
});