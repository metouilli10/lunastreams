document.documentElement.classList.add('js');

// Cookie Banner Functionality
document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.querySelector('.cookie-banner');
    const cookieAccept = document.querySelector('.cookie-accept');
    const cookieClose = document.querySelector('.cookie-close');

    // Check if user has already accepted cookies
    if (localStorage.getItem('cookiesAccepted')) {
        cookieBanner.style.display = 'none';
    }

    // Accept cookies
    if (cookieAccept) {
        cookieAccept.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // Close banner
    if (cookieClose) {
        cookieClose.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }
});

(function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const navGroups = document.querySelector('.nav-groups');

    if (!toggle || !navGroups) return;

    const openMenu = () => {
        toggle.classList.add('is-active');
        toggle.setAttribute('aria-expanded', 'true');
        navGroups.classList.add('is-open');
    };

    const closeMenu = (options = {}) => {
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        navGroups.classList.remove('is-open');

        if (options.focusToggle) {
            toggle.focus();
        }
    };

    const handleToggle = () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    toggle.addEventListener('click', handleToggle);

    navGroups.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => closeMenu());
    });

    const handleResize = () => {
        if (window.innerWidth > 900) {
            closeMenu();
        }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            closeMenu({ focusToggle: true });
        }
    });

    document.addEventListener('click', event => {
        if (toggle.getAttribute('aria-expanded') !== 'true') return;

        const target = event.target;
        if (!navGroups.contains(target) && !toggle.contains(target)) {
            closeMenu();
        }
    });

    handleResize();
})();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Accordion functionality for Why Us section
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function() {
        const accordionItem = this.closest('.accordion-item');
        const accordionContent = accordionItem.querySelector('.accordion-content');
        const accordionArrow = this.querySelector('.accordion-arrow');
        const isActive = accordionItem.classList.contains('active');
        
        // Close all accordion items
        document.querySelectorAll('.accordion-item').forEach(item => {
            item.classList.remove('active');
            const content = item.querySelector('.accordion-content');
            const arrow = item.querySelector('.accordion-arrow');
            if (content) content.style.display = 'none';
            if (arrow) arrow.textContent = '▼';
        });
        
        // Toggle current item
        if (!isActive) {
            accordionItem.classList.add('active');
            if (accordionContent) accordionContent.style.display = 'block';
            if (accordionArrow) accordionArrow.textContent = '▲';
        }
    });
});

// FAQ Accordion functionality
(function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    const closeAll = () => {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!question || !answer) return;

            question.setAttribute('aria-expanded', 'false');
            item.classList.remove('is-open');
            answer.setAttribute('hidden', '');
        });
    };

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!question || !answer) return;

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            closeAll();

            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                item.classList.add('is-open');
                answer.removeAttribute('hidden');
            }
        });
    });
})();

// Featured movie carousel controls
(function initMovieCarousel() {
    const container = document.querySelector('[data-movie-carousel]');
    if (!container) return;

    const viewport = container.querySelector('.movie-carousel__viewport');
    const track = container.querySelector('.movie-carousel__track');
    const cards = track ? Array.from(track.children) : [];
    const prevButton = container.querySelector('[data-movie-carousel-prev]');
    const nextButton = container.querySelector('[data-movie-carousel-next]');

    if (!viewport || !track || !cards.length) return;

    const calculateScrollAmount = () => {
        const firstCard = cards[0];
        const computedStyles = getComputedStyle(track);
        const gapValue = parseFloat(computedStyles.gap || computedStyles.columnGap || '0') || 0;
        const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : viewport.clientWidth;
        return cardWidth * 2 + gapValue;
    };

    const updateControls = () => {
        const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth - 1;
        if (prevButton) {
            prevButton.disabled = viewport.scrollLeft <= 8;
        }
        if (nextButton) {
            nextButton.disabled = viewport.scrollLeft >= maxScrollLeft;
        }
    };

    const scrollCarousel = direction => {
        const amount = calculateScrollAmount();
        viewport.scrollBy({
            left: direction * amount,
            behavior: 'smooth'
        });
    };

    prevButton?.addEventListener('click', () => scrollCarousel(-1));
    nextButton?.addEventListener('click', () => scrollCarousel(1));

    viewport.addEventListener('scroll', () => requestAnimationFrame(updateControls), { passive: true });
    window.addEventListener('resize', updateControls);

    updateControls();
})();

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.main-header');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Pricing toggle functionality
(function initPricingToggle() {
    const toggleButtons = document.querySelectorAll('.pricing-toggle__option');
    const planGroups = document.querySelectorAll('[data-tier-group]');

    if (!toggleButtons.length || !planGroups.length) return;

    const setActiveTier = (tier) => {
        toggleButtons.forEach(button => {
            const isActive = button.dataset.tier === tier;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        planGroups.forEach(group => {
            const matches = group.dataset.tierGroup === tier;
            group.classList.toggle('is-hidden', !matches);
            group.setAttribute('aria-hidden', matches ? 'false' : 'true');
        });
    };

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => setActiveTier(button.dataset.tier));
    });

    const defaultTier = document.querySelector('.pricing-toggle__option.is-active')?.dataset.tier || toggleButtons[0].dataset.tier;
    setActiveTier(defaultTier);
})();

// Free trial form handling
(function initTrialForm() {
    const form = document.getElementById('trial-request-form');
    if (!form) return;

    const messageEl = document.getElementById('trial-form-message');
    const submitButton = form.querySelector('.trial-submit');
    const originalLabel = submitButton?.textContent || 'Submit';

    form.addEventListener('submit', event => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity?.();
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        if (messageEl) {
            messageEl.classList.remove('trial-form__message--success', 'trial-form__message--error');
            messageEl.textContent = 'Submitting your request…';
        }

        setTimeout(() => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalLabel;
            }

            if (messageEl) {
                messageEl.classList.add('trial-form__message--success');
                messageEl.textContent = 'Thanks! Our AEST support team will reach out shortly with your trial credentials.';
            }

            form.reset();
        }, 1200);
    });
})();

