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
        // Auto-load video if cookies already accepted
        loadVimeoVideo();
    }

    // Accept cookies
    if (cookieAccept) {
        cookieAccept.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.setAttribute('hidden', '');
            document.documentElement.classList.add('cookies-accepted');
            // Auto-load video after accepting cookies
            loadVimeoVideo();
        });
    }

    // Close banner
    if (cookieClose) {
        cookieClose.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.setAttribute('hidden', '');
            document.documentElement.classList.add('cookies-accepted');
            // Auto-load video after accepting cookies
            loadVimeoVideo();
        });
    }
});

// Vimeo Video Lazy Loading
function loadVimeoVideo() {
    const placeholder = document.getElementById('vimeo-placeholder');
    const loadButton = document.getElementById('vimeo-load-button');
    const iframe = document.querySelector('.vimeo-iframe');
    
    if (!iframe) return;
    
    // If iframe already loaded, do nothing
    if (iframe.src) return;
    
    // Get the src from data-src attribute
    const videoSrc = iframe.getAttribute('data-src');
    if (!videoSrc) return;
    
    // Set the src to load the iframe
    iframe.src = videoSrc;
    iframe.style.display = 'block';
    
    // Hide placeholder
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    
    // Remove button if exists
    if (loadButton) {
        loadButton.style.display = 'none';
    }
}

// Manual video load button handler
document.addEventListener('DOMContentLoaded', function() {
    const loadButton = document.getElementById('vimeo-load-button');
    
    if (loadButton) {
        loadButton.addEventListener('click', function() {
            // Set cookies as accepted when user manually loads video
            localStorage.setItem('cookiesAccepted', 'true');
            document.documentElement.classList.add('cookies-accepted');
            loadVimeoVideo();
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

// Free trial form handling with Web3Forms
(function initTrialForm() {
    const form = document.getElementById('trial-request-form');
    if (!form) return;

    const messageEl = document.getElementById('trial-form-message');
    const submitButton = form.querySelector('.trial-submit');
    const originalLabel = submitButton?.textContent || 'Submit';
    const messageField = document.getElementById('trial-message');

    // Check if form was submitted successfully (from URL parameter)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        if (messageEl) {
            messageEl.classList.add('trial-form__message--success');
            messageEl.textContent = 'Thanks! Our AEST support team will reach out shortly with your trial credentials.';
        }
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    form.addEventListener('submit', async event => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity?.();
            return;
        }

        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            contactMethod: formData.get('contactMethod'),
            device: formData.get('device'),
            player: formData.get('player') || 'Not specified',
            notes: formData.get('notes') || 'None'
        };

        // Format the message with all form data for Web3Forms
        const messageText = 
            `🆕 New Free Trial Request\n\n` +
            `📋 Contact Details:\n` +
            `   • Name: ${data.name}\n` +
            `   • Email: ${data.email}\n` +
            `   • Phone: ${data.phone}\n` +
            `   • Preferred Contact: ${data.contactMethod}\n\n` +
            `📺 Streaming Preferences:\n` +
            `   • Primary Device: ${data.device}\n` +
            `   • Player/App: ${data.player}\n` +
            `   • Additional Notes: ${data.notes}\n\n` +
            `---\n` +
            `This request was submitted via the Luna Streams free trial form.`;

        // Set the message field value before submitting
        if (messageField) {
            messageField.value = messageText;
        }

        // Show loading state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        if (messageEl) {
            messageEl.classList.remove('trial-form__message--success', 'trial-form__message--error');
            messageEl.textContent = 'Submitting your request…';
        }

        // Create new FormData with updated message field
        const submitFormData = new FormData(form);
        // Ensure message is included (in case the hidden field wasn't updated)
        submitFormData.set('message', messageText);

        // Submit form to Web3Forms
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: submitFormData
            });

            const result = await response.json();

            if (result.success) {
                // Success - Web3Forms received the submission
                if (messageEl) {
                    messageEl.classList.add('trial-form__message--success');
                    messageEl.textContent = 'Thanks! Your request has been submitted. Our AEST support team will reach out shortly with your trial credentials.';
                }

                // Reset form
                form.reset();

                // Redirect to success page (Web3Forms redirect should handle this)
                // But we'll also handle it client-side as a backup
        setTimeout(() => {
                    window.location.href = 'https://lunastreams.net/free-trial.html?success=true';
                }, 1500);
            } else {
                throw new Error(result.message || 'Form submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Show error message
            if (messageEl) {
                messageEl.classList.add('trial-form__message--error');
                messageEl.textContent = 'Sorry, there was an error submitting your request. Please try again or contact us directly.';
            }

            // Re-enable submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalLabel;
            }
        }
    });
})();

// Contact form handling with Web3Forms
(function initContactForm() {
    const form = document.getElementById('contact-form-submit');
    if (!form) return;

    const messageEl = document.getElementById('contact-form-status');
    const submitButton = document.getElementById('contact-submit-btn');
    const originalLabel = submitButton?.textContent || 'Submit';

    // Check if form was submitted successfully (from URL parameter)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        if (messageEl) {
            messageEl.classList.add('contact-form__status--success');
            messageEl.textContent = 'Thanks! Your message has been sent. We\'ll respond within 4 hours during AEST hours.';
        }
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    form.addEventListener('submit', async event => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity?.();
            return;
        }

        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            topic: formData.get('topic'),
            message: formData.get('message'),
            resellerRequest: formData.get('reseller-panel-request') === 'on' ? 'Yes' : 'No',
            subscribeUpdates: formData.get('subscribe-updates') === 'on' ? 'Yes' : 'No'
        };

        // Format the message with all form data for Web3Forms
        const topicLabels = {
            'customer-support': 'Customer Support',
            'billing': 'Billing or Renewals',
            'reseller': 'Reseller Enquiry',
            'technical': 'Technical Issue',
            'other': 'Other'
        };

        // Format the complete message with all form data
        const messageText = 
            `📧 New Contact Request\n\n` +
            `👤 Contact Details:\n` +
            `   • Name: ${data.name}\n` +
            `   • Email: ${data.email}\n` +
            `   • Topic: ${topicLabels[data.topic] || data.topic}\n\n` +
            `💬 Message:\n${data.message}\n\n` +
            `📋 Additional Options:\n` +
            `   • Reseller Panel Request: ${data.resellerRequest}\n` +
            `   • Subscribe to Updates: ${data.subscribeUpdates}\n\n` +
            `---\n` +
            `This message was submitted via the Luna Streams contact form.`;

        // Show loading state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        if (messageEl) {
            messageEl.classList.remove('contact-form__status--success', 'contact-form__status--error');
            messageEl.textContent = 'Sending your message…';
        }

        // Create new FormData and update message field with formatted content
        const submitFormData = new FormData(form);
        // Replace message field with formatted version that includes all details
        submitFormData.set('message', messageText);

        // Submit form to Web3Forms
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: submitFormData
            });

            const result = await response.json();

            if (result.success) {
                // Success - Web3Forms received the submission
                if (messageEl) {
                    messageEl.classList.add('contact-form__status--success');
                    messageEl.textContent = 'Thanks! Your message has been sent. We\'ll respond within 4 hours during AEST hours.';
                }

                // Reset form
                form.reset();

                // Redirect to success page
                setTimeout(() => {
                    window.location.href = 'https://lunastreams.net/contact.html?success=true';
                }, 1500);
            } else {
                throw new Error(result.message || 'Form submission failed');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            
            // Show error message
            if (messageEl) {
                messageEl.classList.add('contact-form__status--error');
                messageEl.textContent = 'Sorry, there was an error sending your message. Please try again or email us directly at lunastreamsau@gmail.com';
            }

            // Re-enable submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalLabel;
            }
        }
    });
})();


// WhatsApp Widget
(function initWhatsAppWidget() {
    // Create WhatsApp button
    const whatsappWidget = document.createElement('div');
    whatsappWidget.className = 'whatsapp-widget';
    whatsappWidget.innerHTML = `
        <a href="https://wa.me/15027055693" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="whatsapp-button" 
           aria-label="Contact us on WhatsApp">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
        </a>
    `;
    
    // Append to body
    document.body.appendChild(whatsappWidget);
})();

