/**
 * PORTFOLIO BTS SIO SLAM - Axel
 * Interactions JavaScript
 * Thème : Sport & Énigmes
 */

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser EmailJS
    try {
        if (window.emailjs && typeof emailjs.init === 'function') {
            emailjs.init("YOUR_PUBLIC_KEY"); // À remplacer par ta clé EmailJS
        } else {
            console.warn('EmailJS non disponible — initialisation ignorée.');
        }
    } catch (err) {
        console.warn('Erreur lors de l\'initialisation d\'EmailJS :', err);
    }
    
    initNavbar();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
    initEasterEgg();
    initKonamiCode();
});

// ============================================
// NAVBAR MOBILE
// ============================================

function initNavbar() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // Toggle menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Fermer le menu au clic sur un lien
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Effet de scroll sur la navbar
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

// ============================================
// SCROLL FLUIDE
// ============================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// ANIMATIONS AU SCROLL
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '-50px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll(
        '.about-card, .skill-category, .project-card, .watchtower-card, .contact-item'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Style pour l'animation
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ============================================
// FORMULAIRE DE CONTACT
// ============================================

function initContactForm() {
    const form = document.getElementById('contact-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validation simple
        if (!data.name || !data.email || !data.message) {
            showNotification('Veuillez remplir tous les champs', 'error');
            return;
        }

        if (!isValidEmail(data.email)) {
            showNotification('Veuillez entrer un email valide', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;

        try {
            // Envoyer l'email avec EmailJS
            await emailjs.send(
                "SERVICE_ID",        // À remplacer par ton Service ID EmailJS
                "TEMPLATE_ID",       // À remplacer par ton Template ID EmailJS
                {
                    from_name: data.name,
                    from_email: data.email,
                    message: data.message,
                    to_email: "axel.buiron@gmail.com"
                }
            );

            showNotification('Message envoyé avec succès ! 🎉', 'success');
            form.reset();
        } catch (error) {
            console.error('Erreur EmailJS:', error);
            showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
        }

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message, type = 'info') {
    // Supprimer les anciennes notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const styles = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 500;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;

    const colors = {
        success: 'background: #10b981; color: white;',
        error: 'background: #ef4444; color: white;',
        info: 'background: #2563eb; color: white;'
    };

    notification.style.cssText = styles + colors[type];

    document.body.appendChild(notification);

    // Animation keyframes
    if (!document.getElementById('notification-styles')) {
        const animStyles = document.createElement('style');
        animStyles.id = 'notification-styles';
        animStyles.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(animStyles);
    }

    // Disparaître après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// EASTER EGG - ÉNIGME CACHÉE
// ============================================

function initEasterEgg() {
    const easterEgg = document.getElementById('easter-egg');
    const closeBtn = document.getElementById('close-easter');

    if (!easterEgg || !closeBtn) return;

    closeBtn.addEventListener('click', () => {
        easterEgg.classList.remove('active');
    });

    // Fermer en cliquant dehors
    easterEgg.addEventListener('click', (e) => {
        if (e.target === easterEgg) {
            easterEgg.classList.remove('active');
        }
    });

    // ========================================
    // MÉCANIQUE DE L'ÉNIGME
    // ========================================
    // L'énigme se déclenche en cliquant 5 fois rapides
    // sur le titre "Axel" dans le hero, puis en tapant "SPORT"

    let clickCount = 0;
    let clickTimer = null;
    const heroTitle = document.querySelector('.hero-title');

    if (heroTitle) {
        heroTitle.style.cursor = 'pointer';
        heroTitle.title = '???';

        heroTitle.addEventListener('click', () => {
            clickCount++;

            // Reset après 2 secondes sans clic
            if (clickTimer) clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 2000);

            // Après 5 clics rapides
            if (clickCount === 5) {
                clickCount = 0;
                triggerRiddle();
            }
        });
    }

    // Indice dans la console pour les curieux
    console.log(
        '%c🧩 Tu aimes les énigmes ? ' +
        'Clique 5 fois rapidement sur mon nom en haut de page...',
        'background: #2563eb; color: white; padding: 1rem; border-radius: 0.5rem; font-size: 14px;'
    );
}

function triggerRiddle() {
    // Utiliser la modal intégrée pour éviter le blocage des `prompt()`
    const modal = document.getElementById('riddle-modal');
    const input = document.getElementById('riddle-answer');
    const submitBtn = document.getElementById('riddle-submit');
    const cancelBtn = document.getElementById('riddle-cancel');
    const feedback = document.getElementById('riddle-feedback');

    if (!modal || !input || !submitBtn || !cancelBtn) {
        // Fallback: use prompt if modal not found
        const fallback = prompt('ÉNIGME : Qui suis-je ?');
        if (!fallback) return;
        const normalized = fallback.toLowerCase().trim();
        const answers = ['la pratique', 'pratique', "l'entraînement", 'entrainement', 'entraînement', 'discipline', 'la discipline', 'régularité', 'la régularité'];
        if (answers.some(a => normalized.includes(a))) showEasterEgg();
        return;
    }

    const validAnswers = ['la pratique', 'pratique', "l'entraînement", 'entrainement', 'entraînement', 'discipline', 'la discipline', 'régularité', 'la régularité'];

    function closeModal() {
        modal.classList.remove('active');
        feedback.textContent = '';
        input.value = '';
    }

    function checkAnswer() {
        const val = input.value.toLowerCase().trim();
        if (!val) {
            feedback.textContent = 'Tape une réponse pour continuer.';
            return;
        }

        if (validAnswers.some(a => val.includes(a))) {
            closeModal();
            showEasterEgg();
        } else {
            feedback.textContent = '❌ Pas tout à fait. Indice : Quel est la différence entre un bon et un très bon codeur ?';
        }
    }

    // Ouvrir la modal
    modal.classList.add('active');
    setTimeout(() => input.focus(), 100);

    // Handlers
    submitBtn.onclick = checkAnswer;
    cancelBtn.onclick = () => closeModal();
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkAnswer();
        if (e.key === 'Escape') closeModal();
    });
}

function showEasterEgg() {
    const easterEgg = document.getElementById('easter-egg');
    if (easterEgg) {
        easterEgg.classList.add('active');

        // Petit effet de confetti
        createConfetti();
    }
}

function createConfetti() {
    const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                z-index: 2001;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation: fall ${2 + Math.random() * 2}s linear forwards;
            `;
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 4000);
        }, i * 50);
    }

    // Ajouter l'animation si elle n'existe pas
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// KONAMI CODE (Easter Egg supplémentaire)
// ============================================

function initKonamiCode() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];

    let currentPosition = 0;
    let konamiInput = [];

    document.addEventListener('keydown', (e) => {
        konamiInput.push(e.key);
        konamiInput = konamiInput.slice(-konamiCode.length);

        if (konamiInput.join('') === konamiCode.join('')) {
            currentPosition++;
            if (currentPosition === 1) {
                // Bonus pour avoir trouvé le Konami Code
                setTimeout(() => {
                    alert('🎮 KONAMI CODE ACTIVÉ ! 🎮\n\nTu es un vrai gamer !\n\n+10 points de karma pour toi.');
                    createConfetti();
                }, 100);
            }
        }
    });

    // Indice console
    console.log(
        '%c🎮 Les gamers sauront reconnaître ce code...',
        'background: #10b981; color: white; padding: 0.5rem; border-radius: 0.5rem; font-size: 12px;'
    );
}

// ============================================
// COMPTEUR DE VISITES (Optionnel)
// ============================================

function trackVisit() {
    // Simple compteur local
    let visits = localStorage.getItem('portfolio_visits') || 0;
    visits++;
    localStorage.setItem('portfolio_visits', visits);

    console.log(
        `%c👀 Visite n°${visits} sur ce portfolio !`,
        'background: #f59e0b; color: white; padding: 0.5rem; border-radius: 0.5rem; font-size: 12px;'
    );
}

// Décommenter pour activer
// trackVisit();


function typingEffect() {
    const title = document.querySelector('.hero-title');
    if (!title) return;

    const originalText = title.textContent;
    title.textContent = '';

    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < originalText.length) {
            title.textContent += originalText[i];
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 150);
}

// Décommenter pour activer (attention, peut être agaçant)
// typingEffect();
