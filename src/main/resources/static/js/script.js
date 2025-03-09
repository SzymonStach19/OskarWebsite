// Obsługa nawigacji i efektu przewijania dla nagłówka
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Sprawdzanie widoczności elementów dla animacji
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // Zmniejszony offset dla lepszej widoczności
        const isVisible = (rect.top <= window.innerHeight * 0.8) && (rect.bottom >= 100);

        if (isVisible) {
            if (section.id === 'home') {
                const hero = section.querySelector('.hero');
                if (!hero.classList.contains('visible')) {
                    hero.classList.add('visible');
                }
            } else if (section.id === 'films') {
                // Sprawdzamy każdy film indywidualnie, a nie całą sekcję
                const films = section.querySelectorAll('.film');
                films.forEach((film, index) => {
                    // Sprawdzamy osobno widoczność każdego filmu
                    const filmRect = film.getBoundingClientRect();
                    const isFilmVisible = (filmRect.top <= window.innerHeight * 0.8) && (filmRect.bottom >= 100);

                    if (isFilmVisible && !film.classList.contains('visible')) {
                        // Opóźnienie dla wolniejszego pojawiania się
                        setTimeout(() => {
                            film.classList.add('visible');
                        }, 500); // Opóźnienie 500ms dla wolniejszej animacji
                    }
                });
            } else if (section.id === 'about') {
                const about = section.querySelector('.about');
                if (!about.classList.contains('visible')) {
                    about.classList.add('visible');
                }
            }
        }
    });
});

// Inicjalna animacja na stronie głównej - opóźniona dla lepszego efektu
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    setTimeout(() => {
        hero.classList.add('visible');
    }, 800); // Opóźnienie 800ms dla wolniejszego pojawienia się przy ładowaniu strony

    // Płynne przewijanie dla linków nawigacyjnych
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Offset zapobiega przykrywaniu contentu przez header
                    behavior: 'smooth'
                });
            }
        });
    });
});