document.documentElement.classList.add('js');

// Cookie Banner Functionality
document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.querySelector('.cookie-banner');
    const cookieAccept = document.querySelector('.cookie-accept');
    const cookieClose = document.querySelector('.cookie-close');

    // Check if user has already accepted cookies
    if (localStorage.getItem('cookiesAccepted')) {
        cookieBanner.setAttribute('hidden', '');
        document.documentElement.classList.add('cookies-accepted');
    }

    // Accept cookies
    if (cookieAccept) {
        cookieAccept.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.setAttribute('hidden', '');
            document.documentElement.classList.add('cookies-accepted');
        });
    }

    // Close banner
    if (cookieClose) {
        cookieClose.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.setAttribute('hidden', '');
            document.documentElement.classList.add('cookies-accepted');
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
        // On desktop (> 900px), menu should be visible (CSS handles this)
        // On mobile (<= 900px), ensure menu is closed
        if (window.innerWidth <= 900) {
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

    // Initialize: ensure menu is closed on mobile on page load
    if (window.innerWidth <= 900) {
        closeMenu();
    }
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
    const containers = document.querySelectorAll('[data-movie-carousel]');
    if (!containers.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    containers.forEach(container => {
        const viewport = container.querySelector('.movie-carousel__viewport');
        const track = container.querySelector('.movie-carousel__track');
        const isLooping = container.dataset.carouselLoop === 'true';
        const originalSlides = track ? Array.from(track.children) : [];

        if (!viewport || !track || !originalSlides.length) return;

        let gapValue = 0;
        let slideWidth = 0;
        let scrollAmount = 0;
        let totalOriginalWidth = 0;
        let loopScrollOffset = 0;
        let isAdjustingLoop = false;
        let autoScrollInterval = null;

        const recalcMeasurements = () => {
            // Batch all layout reads together to minimize forced reflows
            const computedStyles = getComputedStyle(track);
            const visibleSlide = track.querySelector('.movie-slide');
            
            // Read all layout properties in one batch
            const gap = computedStyles.gap || computedStyles.columnGap || '0';
            const slideRect = visibleSlide ? visibleSlide.getBoundingClientRect() : null;
            const viewportWidth = viewport.clientWidth;
            
            // Calculate values after all reads are complete
            gapValue = parseFloat(gap) || 0;
            slideWidth = slideRect ? slideRect.width : viewportWidth;

            scrollAmount = slideWidth + gapValue;
            totalOriginalWidth = (slideWidth * originalSlides.length) + gapValue * Math.max(0, originalSlides.length - 1);
            loopScrollOffset = isLooping ? totalOriginalWidth : 0;
        };

        const cloneForLooping = () => {
            if (!isLooping || track.dataset.loopCloned === 'true') return;

            const prependFragment = document.createDocumentFragment();
            const appendFragment = document.createDocumentFragment();

            originalSlides.forEach(slide => {
                const prependClone = slide.cloneNode(true);
                prependClone.setAttribute('aria-hidden', 'true');
                prependFragment.appendChild(prependClone);

                const appendClone = slide.cloneNode(true);
                appendClone.setAttribute('aria-hidden', 'true');
                appendFragment.appendChild(appendClone);
            });

            track.insertBefore(prependFragment, track.firstChild);
            track.appendChild(appendFragment);
            track.dataset.loopCloned = 'true';

            // Defer measurements to avoid forced reflow after DOM writes
            requestAnimationFrame(() => {
                recalcMeasurements();
                viewport.scrollLeft = loopScrollOffset;
            });
        };

        const calculateScrollAmount = () => {
            if (!scrollAmount) {
                recalcMeasurements();
            }
            return scrollAmount;
        };

        const ensureLoopContinuity = () => {
            if (!isLooping || !totalOriginalWidth || isAdjustingLoop) return;

            const tolerance = Math.max(scrollAmount / 2, 1);
            const lowerBound = loopScrollOffset - tolerance;
            const upperBound = loopScrollOffset + totalOriginalWidth + tolerance;

            if (viewport.scrollLeft <= lowerBound) {
                isAdjustingLoop = true;
                viewport.scrollLeft += loopScrollOffset;
                requestAnimationFrame(() => { isAdjustingLoop = false; });
            } else if (viewport.scrollLeft >= upperBound) {
                isAdjustingLoop = true;
                viewport.scrollLeft -= loopScrollOffset;
                requestAnimationFrame(() => { isAdjustingLoop = false; });
            }
        };

        const scrollCarousel = direction => {
            const amount = calculateScrollAmount();
            viewport.scrollBy({
                left: direction * amount,
                behavior: 'smooth'
            });
        };

        const handleScroll = () => {
            if (isLooping) {
                ensureLoopContinuity();
            }
        };

        viewport.addEventListener('scroll', handleScroll, { passive: true });

        // Debounce resize handler to prevent excessive forced reflows
        let resizeTimeout = null;
        const handleResize = () => {
            // Clear any pending resize handler
            if (resizeTimeout) {
                cancelAnimationFrame(resizeTimeout);
            }
            
            // Defer measurements to avoid forced reflow
            resizeTimeout = requestAnimationFrame(() => {
                recalcMeasurements();
                if (isLooping) {
                    isAdjustingLoop = true;
                    const remainder = viewport.scrollLeft % totalOriginalWidth;
                    viewport.scrollLeft = loopScrollOffset + (Number.isFinite(remainder) ? remainder : 0);
                    requestAnimationFrame(() => { isAdjustingLoop = false; });
                }
                resizeTimeout = null;
            });
        };

        window.addEventListener('resize', handleResize, { passive: true });
        window.addEventListener('orientationchange', handleResize, { passive: true });

        recalcMeasurements();
        cloneForLooping();

        const stopAutoScroll = () => {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        };

        const startAutoScroll = () => {
            if (!isLooping || prefersReducedMotion) return;
            stopAutoScroll();
            autoScrollInterval = setInterval(() => scrollCarousel(1), 2200);
        };

        if (isLooping) {
            startAutoScroll();
            viewport.addEventListener('mouseenter', stopAutoScroll);
            viewport.addEventListener('mouseleave', startAutoScroll);
            viewport.addEventListener('pointerdown', stopAutoScroll);
            viewport.addEventListener('pointerup', startAutoScroll);
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    stopAutoScroll();
                } else {
                    startAutoScroll();
                }
            });
        }
    });
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
        const toggleContainer = document.querySelector('.pricing-toggle');
        
        if (!toggleContainer) return;
        
        toggleButtons.forEach(button => {
            const isActive = button.dataset.tier === tier;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        // Set data attribute on container for CSS styling (remove old, add new)
        toggleContainer.removeAttribute('data-active-tier');
        toggleContainer.setAttribute('data-active-tier', tier);

        planGroups.forEach(group => {
            const matches = group.dataset.tierGroup === tier;
            group.classList.toggle('is-hidden', !matches);
            group.setAttribute('aria-hidden', matches ? 'false' : 'true');
        });
    };

    const toggleContainer = document.querySelector('.pricing-toggle');
    
    // Function to toggle between standard and premium
    const toggleTier = () => {
        if (!toggleContainer) return;
        const currentTier = toggleContainer.getAttribute('data-active-tier') || 'standard';
        const newTier = currentTier === 'standard' ? 'premium' : 'standard';
        setActiveTier(newTier);
    };
    
    // Handle button clicks (text labels) - these set specific tier
    toggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const tier = button.dataset.tier;
            setActiveTier(tier);
        }, true); // Use capture phase
    });

    // Handle toggle switch click (mobile) - clicking the track area toggles between tiers
    if (toggleContainer) {
        // Create a clickable overlay for the toggle track on mobile
        const createToggleOverlay = () => {
            if (window.innerWidth > 767) {
                // Remove overlay if it exists and we're not on mobile
                const existingOverlay = toggleContainer.querySelector('.toggle-track-overlay');
                if (existingOverlay) {
                    existingOverlay.remove();
                }
                return;
            }
            
            // Check if overlay already exists
            if (toggleContainer.querySelector('.toggle-track-overlay')) {
                return;
            }
            
            // Create clickable overlay for the track area
            const overlay = document.createElement('div');
            overlay.className = 'toggle-track-overlay';
            overlay.setAttribute('aria-label', 'Toggle between Standard and Premium plans');
            overlay.setAttribute('role', 'button');
            overlay.setAttribute('tabindex', '0');
            
            // Insert overlay after the first button (before premium button, in the middle)
            const standardButton = toggleContainer.querySelector('[data-tier="standard"]');
            if (standardButton && standardButton.nextSibling) {
                toggleContainer.insertBefore(overlay, standardButton.nextSibling);
            } else {
                toggleContainer.appendChild(overlay);
            }
            
            // Add click handler to overlay
            overlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleTier();
            });
            
            // Add keyboard support
            overlay.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTier();
                }
            });
        };
        
        // Create overlay on load and resize
        createToggleOverlay();
        window.addEventListener('resize', createToggleOverlay);
        
        // Also handle clicks on container that aren't on buttons (fallback)
        toggleContainer.addEventListener('click', (e) => {
            if (window.innerWidth > 767) return;
            
            // If click is on overlay or track area (not buttons), toggle
            if (e.target.classList.contains('toggle-track-overlay')) {
                return; // Overlay handler will deal with it
            }
            
            // Check if click is on a button
            if (e.target.closest('.pricing-toggle__option')) {
                return; // Button handler will deal with it
            }
            
            // Fallback: if clicking on container itself, toggle
            if (e.target === toggleContainer) {
                e.preventDefault();
                toggleTier();
            }
        });
    }

    // Initialize with default tier
    const defaultTier = document.querySelector('.pricing-toggle__option.is-active')?.dataset.tier || toggleButtons[0]?.dataset.tier || 'standard';
    if (defaultTier) {
        setActiveTier(defaultTier);
    }
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

