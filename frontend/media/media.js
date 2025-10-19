// ==========================================================================
// Media Page JavaScript - Wardha Metro Flow
// ==========================================================================

// ==========================================================================
// DEBUG UTILITY
// ==========================================================================

// Debug logging utility that only logs when DEBUG flag is enabled
// To enable debug mode, either:
// 1. Set window.__DEBUG__ = true in browser console
// 2. Run localStorage.setItem('DEBUG', 'true') in browser console
// To disable: localStorage.removeItem('DEBUG') or set window.__DEBUG__ = false
let localStorageDebug = false;
try {
    localStorageDebug = localStorage.getItem('DEBUG') === 'true';
} catch (e) {
    // localStorage access can throw SecurityError in private/strict modes
    // Fall back to false
}
const DEBUG = window.__DEBUG__ === true || localStorageDebug;

function debugLog(...args) {
    if (DEBUG) {
        console.log(...args);
    }
}

// ==========================================================================
// 1. HERO STATS COUNTER ANIMATION
// ==========================================================================

function animateCounter(element) {
    // Read the data-target attribute
    const targetAttr = element.getAttribute('data-target');
    
    // Check for null/empty and abort if missing
    if (!targetAttr || targetAttr.trim() === '') {
        console.error('Missing or empty data-target attribute on element:', element);
        return;
    }
    
    // Parse with radix 10
    const target = parseInt(targetAttr, 10);
    
    // Validate the result is a finite number
    if (!Number.isFinite(target) || isNaN(target)) {
        console.error('Invalid data-target value:', targetAttr, 'on element:', element);
        return;
    }
    
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// Initialize counters when page loads
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.stat-number');
    
    // Use Intersection Observer for animation trigger
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
});

// ==========================================================================
// 2. SPOTLIGHT CAROUSEL
// ==========================================================================

class SpotlightCarousel {
    constructor() {
        this.belt = document.getElementById('spotlight-belt');
        if (!this.belt) {
            throw new Error('SpotlightCarousel: Required element with id "spotlight-belt" not found in DOM');
        }
        
        this.cards = document.querySelectorAll('.carousel-card');
        if (!this.cards || this.cards.length === 0) {
            throw new Error('SpotlightCarousel: No elements with class "carousel-card" found in DOM');
        }
        
        this.dots = document.querySelectorAll('.carousel-indicators .dot');
        if (!this.dots || this.dots.length === 0) {
            throw new Error('SpotlightCarousel: No elements matching selector ".carousel-indicators .dot" found in DOM');
        }
        
        
        this.currentIndex = 0;
        this.totalCards = 8; // Only count original cards, not duplicates
        this.isPaused = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        // Bind keyboard handler once for proper cleanup
        this.handleKeyboardBound = this.handleKeyboard.bind(this);
        
        this.init();
    }


    init() {
        // Set initial active state
        this.updateActiveCard();
        
        // Make carousel cards keyboard accessible
        this.cards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `View spotlight image ${index + 1}`);
        });
        
        // Dots navigation (accessibility attributes are set in HTML)
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToSlide(index);
                }
            });
        });
        
        // Card click navigation - PAUSE ON CLICK
        this.cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                // Always pause when clicking any image
                this.pauseAutoScroll();
                // Open in lightbox
                this.openLightbox(index);
            });
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.pauseAutoScroll();
                    this.openLightbox(index);
                }
            });
        });
        
        // Touch/swipe support
        this.belt.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.belt.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboardBound);
        
        // Continuous tracking of center image during animation
        this.startCenterTracking();
        
        // Start automatic scrolling
        this.startAutoScroll();
    }

    updateActiveCard() {
        // Calculate which card should be active based on current position
        const containerRect = this.belt.parentElement.getBoundingClientRect();
        const containerCenter = containerRect.left + (containerRect.width / 2);
        
        let closestIndex = 0;
        let minDistance = Infinity;
        
        this.cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + (cardRect.width / 2);
            const distance = Math.abs(cardCenter - containerCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });
        
        // Map duplicate cards to original cards for dot indicators
        const originalIndex = closestIndex % this.totalCards;
        
        // Only update if the center card has changed
        if (originalIndex !== this.currentIndex) {
            this.currentIndex = originalIndex;
            
            // Update active states with smooth transition
            this.cards.forEach((card, index) => {
                if (index === closestIndex) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
            
            // Update dots based on original index
            this.dots.forEach((dot, index) => {
                if (index === this.currentIndex) {
                    dot.classList.add('active');
                    dot.setAttribute('aria-selected', 'true');
                    dot.setAttribute('tabindex', '0');
                } else {
                    dot.classList.remove('active');
                    dot.setAttribute('aria-selected', 'false');
                    dot.setAttribute('tabindex', '-1');
                }
            });
        }
    }

    startCenterTracking() {
        // Guard against starting multiple tracking loops
        if (this._centerTrackId) {
            return;
        }
        
        // Use requestAnimationFrame for smooth, continuous tracking
        const trackCenter = () => {
            if (!this.isPaused) {
                this.updateActiveCard();
                this.checkForSeamlessReset();
            }
            this._centerTrackId = requestAnimationFrame(trackCenter);
        };
        
        // Start tracking and store the rAF ID
        this._centerTrackId = requestAnimationFrame(trackCenter);
    }

    stopCenterTracking() {
        // Cancel the animation frame and clear the ID
        if (this._centerTrackId) {
            cancelAnimationFrame(this._centerTrackId);
            this._centerTrackId = null;
        }
    }

    checkForSeamlessReset() {
        // Check if we've reached the end of the first set (8 images)
        const currentTransform = this.getCurrentTransform();
        const maxScroll = -620 * 8; // 8 images * (600px + 20px gap)
        
        // If we've scrolled past the first set, reset to beginning
        if (currentTransform <= maxScroll) {
            this.resetToBeginning();
        }
    }

    getCurrentTransform() {
        const style = window.getComputedStyle(this.belt);
        const transform = style.transform;
        
        debugLog('Current transform:', transform);
        
        if (transform === 'none') return 0;
        
        // Handle both matrix and matrix3d
        const matrixMatch = transform.match(/matrix(?:3d)?\((.+)\)/);
        if (matrixMatch) {
            const values = matrixMatch[1].split(',');
            // For matrix: [a, b, c, d, tx, ty]
            // For matrix3d: [a, b, c, d, e, f, g, h, i, j, k, l, tx, ty, tz, tw]
            const tx = parseFloat(values[4]) || 0;
            debugLog('Extracted tx value:', tx);
            return tx;
        }
        
        debugLog('No matrix found, returning 0');
        return 0;
    }

    resetToBeginning() {
        // Temporarily disable transition for instant reset
        this.belt.style.transition = 'none';
        this.belt.style.transform = 'translateX(0)';
        
        // Force reflow
        this.belt.offsetHeight;
        
        // Re-enable transition
        setTimeout(() => {
            this.belt.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 10);
    }


    goToSlide(index) {
        debugLog('Going to slide:', index);
        this.currentIndex = index;
        this.pauseAutoScroll();
        
        // Calculate the target position based on current scroll position
        const currentTransform = this.getCurrentTransform();
        const cardWidth = 620; // 600px + 20px gap
        const targetPosition = currentTransform - (index * cardWidth);
        
        debugLog('Current position:', currentTransform);
        debugLog('Target position:', targetPosition);
        
        // Smoothly animate to the target position
        this.belt.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        this.belt.style.transform = `translateX(${targetPosition}px)`;
        
        // Update active states
        setTimeout(() => {
            this.updateActiveCard();
        }, 100);
        
        // Resume auto-scroll after a delay
        setTimeout(() => {
            this.resumeAutoScroll();
        }, 2000);
    }


    pauseAutoScroll() {
        this.isPaused = true;
        this.belt.classList.add('carousel-paused');
        debugLog('Auto-scroll paused');
    }

    resumeAutoScroll() {
        this.isPaused = false;
        this.belt.classList.remove('carousel-paused');
        debugLog('Auto-scroll resumed');
    }

    startAutoScroll() {
        // The CSS animation handles the automatic scrolling
        this.belt.classList.remove('carousel-paused');
        debugLog('Auto-scroll started');
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
        this.pauseAutoScroll();
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
        // Resume after a short delay
        setTimeout(() => {
            if (!this.isPaused) {
                this.resumeAutoScroll();
            }
        }, 1000);
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                this.nextSlide();
            } else {
                // Swipe right - previous slide
                this.prevSlide();
            }
        }
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalCards;
        this.updateActiveCard();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
        this.updateActiveCard();
    }

    handleKeyboard(e) {
        if (e.key === 'ArrowLeft') {
            this.prevSlide();
        } else if (e.key === 'ArrowRight') {
            this.nextSlide();
        }
    }

    destroy() {
        // Stop center tracking animation to prevent memory leaks
        this.stopCenterTracking();
        
        // Remove global event listener to prevent memory leaks
        if (this.handleKeyboardBound) {
            document.removeEventListener('keydown', this.handleKeyboardBound);
            this.handleKeyboardBound = null;
        }
    }

    openLightbox(index) {
        const card = this.cards[index];
        
        // Defensive check: ensure card exists
        if (!card) {
            console.warn(`Cannot open lightbox: Card at index ${index} does not exist.`);
            return;
        }
        
        // Defensive checks: ensure all required DOM elements exist
        const img = card.querySelector('img');
        const titleEl = card.querySelector('.card-title');
        const dateEl = card.querySelector('.card-date');
        
        if (!img) {
            console.warn(`Cannot open lightbox: Image element missing in card at index ${index}.`);
            return;
        }
        
        if (!titleEl) {
            console.warn(`Cannot open lightbox: Title element missing in card at index ${index}.`);
            return;
        }
        
        if (!dateEl) {
            console.warn(`Cannot open lightbox: Date element missing in card at index ${index}.`);
            return;
        }
        
        // Extract text content with safe fallbacks
        const title = titleEl.textContent || '';
        const date = dateEl.textContent || '';
        
        // Use the global shared lightbox instance
        if (!window.lightbox) {
            console.warn('Cannot open lightbox: Global lightbox not initialized yet.');
            return;
        }
        
        // Check if lightbox initialized successfully
        if (!window.lightbox.initialized) {
            console.warn('Cannot open lightbox: Lightbox failed to initialize.');
            return;
        }
        
        // Use the global lightbox instance with validated values
        window.lightbox.open(img.src, title, date);
        
        // Set/overwrite the onClose handler to prevent accumulating closures
        window.lightbox.onClose = () => {
            this.resumeAutoScroll();
        };
    }
}

// Initialize carousel
let carousel;
document.addEventListener('DOMContentLoaded', () => {
    carousel = new SpotlightCarousel();
});

// ==========================================================================
// 3. FILTER TABS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const mediaSections = document.querySelectorAll('.media-section');

    filterTabs.forEach(tab => {
        // Make filter tabs keyboard accessible
        tab.setAttribute('role', 'button');
        tab.setAttribute('tabindex', '0');
        const filterName = tab.textContent.trim();
        tab.setAttribute('aria-label', `Filter by ${filterName}`);
        
        const handleFilter = () => {
            const filter = tab.getAttribute('data-filter');
            
            // Update active tab and ARIA states
            filterTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-pressed', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-pressed', 'true');
            
            // Show/hide sections
            if (filter === 'all') {
                mediaSections.forEach(section => section.classList.add('active'));
            } else {
                mediaSections.forEach(section => {
                    if (section.getAttribute('data-category') === filter) {
                        section.classList.add('active');
                    } else {
                        section.classList.remove('active');
                    }
                });
            }
            
            // Smooth scroll to first section
            if (mediaSections.length > 0) {
                const firstActiveSection = filter === 'all' 
                    ? mediaSections[0] 
                    : document.querySelector(`.media-section[data-category="${filter}"]`);
                
                if (firstActiveSection) {
                    firstActiveSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        };
        
        tab.addEventListener('click', handleFilter);
        
        // Enable keyboard activation
        tab.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleFilter();
            }
        });
    });

    // Show all sections by default and set initial ARIA state
    mediaSections.forEach(section => section.classList.add('active'));
    if (filterTabs.length > 0) {
        filterTabs[0].setAttribute('aria-pressed', 'true');
    }
});

// ==========================================================================
// 4. PHOTO GALLERY VIEW TOGGLE
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const viewBtns = document.querySelectorAll('.view-btn');
    const photoGrid = document.querySelector('.photo-grid');
    
    // Exit early if photo grid element doesn't exist
    if (!photoGrid) {
        return;
    }

    viewBtns.forEach(btn => {
        // Make view buttons keyboard accessible
        btn.setAttribute('tabindex', '0');
        const view = btn.getAttribute('data-view');
        btn.setAttribute('aria-label', `Switch to ${view} view`);
        
        const handleViewChange = () => {
            const viewType = btn.getAttribute('data-view');
            
            // Update active button and ARIA states
            viewBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            
            // Update grid view
            if (viewType === 'masonry') {
                photoGrid.classList.add('masonry-view');
            } else {
                photoGrid.classList.remove('masonry-view');
            }
        };
        
        btn.addEventListener('click', handleViewChange);
        
        // Enable keyboard activation
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleViewChange();
            }
        });
    });
    
    // Set initial ARIA state
    if (viewBtns.length > 0) {
        const activeBtn = Array.from(viewBtns).find(b => b.classList.contains('active'));
        if (activeBtn) {
            activeBtn.setAttribute('aria-pressed', 'true');
        } else {
            viewBtns[0].setAttribute('aria-pressed', 'true');
        }
    }
});

// ==========================================================================
// 5. LIGHTBOX MODAL
// ==========================================================================

class Lightbox {
    constructor() {
        this.modal = document.getElementById('lightboxModal');
        this.image = document.getElementById('lightboxImage');
        this.title = document.getElementById('lightboxTitle');
        this.date = document.getElementById('lightboxDate');
        
        // Defensive null checks for required DOM elements
        const missingElements = [];
        if (!this.modal) missingElements.push('#lightboxModal');
        if (!this.image) missingElements.push('#lightboxImage');
        if (!this.title) missingElements.push('#lightboxTitle');
        if (!this.date) missingElements.push('#lightboxDate');
        
        if (missingElements.length > 0) {
            console.error(`Lightbox initialization failed: Missing required elements: ${missingElements.join(', ')}`);
            // Set a flag to indicate lightbox is not initialized
            this.initialized = false;
            return;
        }
        
        this.closeBtn = this.modal.querySelector('.lightbox-close');
        this.prevBtn = this.modal.querySelector('.lightbox-nav.prev');
        this.nextBtn = this.modal.querySelector('.lightbox-nav.next');
        
        // Check for required child elements
        if (!this.closeBtn) missingElements.push('.lightbox-close');
        if (!this.prevBtn) missingElements.push('.lightbox-nav.prev');
        if (!this.nextBtn) missingElements.push('.lightbox-nav.next');
        
        if (missingElements.length > 0) {
            console.error(`Lightbox initialization failed: Missing required elements: ${missingElements.join(', ')}`);
            this.initialized = false;
            return;
        }
        
        this.initialized = true;
        this.currentImages = [];
        this.currentIndex = 0;
        this.onClose = null; // Callback for when lightbox is closed
        this.lastFocusedElement = null; // Store element that opened the lightbox
        this.focusableElements = []; // Store focusable elements in modal
        
        // Create bound handler references to enable proper cleanup
        this.closeBound = () => this.close();
        this.modalClickBound = (e) => {
            if (!this.initialized || !this.modal) return;
            if (e.target === this.modal) this.close();
        };
        this.prevBound = () => this.showPrev();
        this.nextBound = () => this.showNext();
        this.keydownBound = (e) => {
            if (!this.initialized || !this.modal) return;
            if (this.modal.classList.contains('active')) {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    this.close();
                }
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.showPrev();
                }
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.showNext();
                }
                // Handle Tab key for focus trap
                if (e.key === 'Tab') {
                    this.handleTabKey(e);
                }
            }
        };
        
        this.initEventListeners();
    }

    initEventListeners() {
        if (!this.initialized) return;
        
        this.closeBtn.addEventListener('click', this.closeBound);
        this.modal.addEventListener('click', this.modalClickBound);
        this.prevBtn.addEventListener('click', this.prevBound);
        this.nextBtn.addEventListener('click', this.nextBound);
        
        // Keyboard navigation and escape handling
        document.addEventListener('keydown', this.keydownBound);
    }
    
    destroy() {
        // Remove all event listeners using stored bound references
        if (this.closeBtn) {
            this.closeBtn.removeEventListener('click', this.closeBound);
        }
        if (this.modal) {
            this.modal.removeEventListener('click', this.modalClickBound);
        }
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', this.prevBound);
        }
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', this.nextBound);
        }
        document.removeEventListener('keydown', this.keydownBound);
        
        // Clear references
        this.closeBound = null;
        this.modalClickBound = null;
        this.prevBound = null;
        this.nextBound = null;
        this.keydownBound = null;
    }

    open(src, title, date) {
        if (!this.initialized) {
            console.warn('Lightbox.open() called but lightbox is not initialized');
            return;
        }
        
        // Store the currently focused element to restore later
        this.lastFocusedElement = document.activeElement;
        
        this.image.src = src;
        this.title.textContent = title;
        this.date.textContent = date;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Set up focus trap
        this.setupFocusTrap();
        
        // Focus the close button when lightbox opens
        setTimeout(() => {
            this.closeBtn.focus();
        }, 100);
    }

    close() {
        if (!this.initialized) return;
        
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Restore focus to the element that opened the lightbox
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
            this.lastFocusedElement = null;
        }
        
        // Call the onClose callback if it exists
        if (this.onClose) {
            this.onClose();
        }
    }

    showPrev() {
        // Functionality for navigating through gallery
        // Can be extended to work with photo gallery
    }

    showNext() {
        // Functionality for navigating through gallery
        // Can be extended to work with photo gallery
    }
    
    setupFocusTrap() {
        if (!this.initialized) return;
        
        // Get all focusable elements within the lightbox
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ];
        
        this.focusableElements = Array.from(
            this.modal.querySelectorAll(focusableSelectors.join(','))
        ).filter(el => {
            // Filter out hidden elements
            return el.offsetParent !== null;
        });
    }
    
    handleTabKey(e) {
        if (this.focusableElements.length === 0) return;
        
        const firstElement = this.focusableElements[0];
        const lastElement = this.focusableElements[this.focusableElements.length - 1];
        
        // If shift + tab on first element, go to last
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
        // If tab on last element, go to first
        else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

// Initialize global shared lightbox instance
// This must be initialized before carousel or any other code tries to use it
let lightbox;
document.addEventListener('DOMContentLoaded', () => {
    // Clean up existing instance before creating a new one
    if (lightbox) {
        lightbox.destroy();
    }
    lightbox = new Lightbox();
    
    // Make lightbox globally accessible for other components (carousel, etc.)
    window.lightbox = lightbox;
    
    // Only set up photo handlers if lightbox initialized successfully
    if (!lightbox.initialized) {
        console.warn('Lightbox failed to initialize. Photo lightbox functionality will be disabled.');
        return;
    }
    
    // Add click handlers to photo items
    const photoItems = document.querySelectorAll('.photo-item');
    photoItems.forEach(item => {
        // Make photo items keyboard accessible
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', 'Open photo in lightbox');
        
        const actionBtn = item.querySelector('.photo-action-btn');
        if (actionBtn) {
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Query and validate all required elements
                const img = item.querySelector('img');
                const titleElement = item.querySelector('.photo-overlay h3');
                const dateElement = item.querySelector('.photo-overlay p');
                
                // Verify all elements exist before accessing properties
                if (!img || !img.src) {
                    console.warn('Photo item missing image element or src');
                    return;
                }
                
                // Use safe fallbacks for optional text content
                const title = titleElement ? titleElement.textContent : '';
                const date = dateElement ? dateElement.textContent : '';
                
                lightbox.open(img.src, title, date);
            });
        }
        
        const openPhoto = () => {
            // Query and validate all required elements
            const img = item.querySelector('img');
            const titleElement = item.querySelector('.photo-overlay h3');
            const dateElement = item.querySelector('.photo-overlay p');
            
            // Verify all elements exist before accessing properties
            if (!img || !img.src) {
                console.warn('Photo item missing image element or src');
                return;
            }
            
            // Use safe fallbacks for optional text content
            const title = titleElement ? titleElement.textContent : '';
            const date = dateElement ? dateElement.textContent : '';
            
            lightbox.open(img.src, title, date);
        };
        
        // Only attach event listeners if required elements exist
        const img = item.querySelector('img');
        if (img && img.src) {
            // Open on card click
            item.addEventListener('click', openPhoto);
            
            // Open on Enter or Space key
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openPhoto();
                }
            });
        } else {
            console.warn('Photo item missing required image element, skipping event listeners');
        }
    });
});

// ==========================================================================
// 6. VIDEO ITEMS - PLAY FUNCTIONALITY
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const videoItems = document.querySelectorAll('.video-item');
    
    videoItems.forEach(item => {
        // Make video items keyboard accessible
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', 'Play video');
        
        const playVideo = () => {
            // In a real implementation, this would open a video player modal
            // For now, we'll show an alert
            const titleElement = item.querySelector('.video-info h3');
            const videoTitle = titleElement ? titleElement.textContent : 'Untitled Video';
            alert(`Opening video: ${videoTitle}\n\nIn production, this would open a video player modal with YouTube/Vimeo embed.`);
        };
        
        item.addEventListener('click', playVideo);
        
        // Enable keyboard activation
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playVideo();
            }
        });
    });
});

// ==========================================================================
// 7. PRESS RELEASES SEARCH
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('pressSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const pressItems = document.querySelectorAll('.press-item');
            
            pressItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const content = item.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
});

// ==========================================================================
// 8. LOAD MORE FUNCTIONALITY
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const loadMoreBtn = document.querySelector('.btn-load-more');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // In a real implementation, this would load more photos from the server
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            setTimeout(() => {
                loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Photos';
                alert('In production, this would load more photos from the server.');
            }, 1000);
        });
    }
});

// ==========================================================================
// 9. SCROLL ANIMATIONS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.media-section, .kit-item, .news-card, .video-item, .photo-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    };

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        animateOnScroll();
    }
});

// ==========================================================================
// 10. SMOOTH SCROLL FOR SCROLL INDICATOR
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        // Make scroll indicator keyboard accessible
        scrollIndicator.setAttribute('tabindex', '0');
        scrollIndicator.setAttribute('role', 'button');
        scrollIndicator.setAttribute('aria-label', 'Scroll to carousel section');
        
        const scrollToCarousel = () => {
            const carouselSection = document.querySelector('.spotlight-carousel-section');
            if (carouselSection) {
                carouselSection.scrollIntoView({ behavior: 'smooth' });
            }
        };
        
        scrollIndicator.addEventListener('click', scrollToCarousel);
        
        // Enable keyboard activation
        scrollIndicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToCarousel();
            }
        });
    }
});

// ==========================================================================
// 11. BACK TO TOP BUTTON (Optional Enhancement)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Create back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top-btn';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    
    // Style the button
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top-btn {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-orange);
            color: white;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(234, 88, 12, 0.3);
            z-index: 1000;
        }
        
        .back-to-top-btn.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top-btn:hover {
            background: var(--primary-dark);
            transform: translateY(-5px);
        }
        
        .back-to-top-btn:focus-visible {
            outline: 3px solid var(--primary-orange);
            outline-offset: 2px;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ==========================================================================
// 12. DOWNLOAD FUNCTIONALITY FOR MEDIA KIT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const downloadBtns = document.querySelectorAll('.btn-download');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const kitItem = btn.closest('.kit-item');
            const titleElement = kitItem.querySelector('h3');
            
            // Check if title element exists, use fallback if missing
            if (!titleElement) {
                console.warn('Title element not found for media kit item');
                return; // Skip download flow if title is missing
            }
            
            const title = titleElement.textContent;
            
            // In production, this would trigger actual file downloads
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
                
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-download"></i> Download';
                }, 2000);
            }, 1000);
        });
    });
});

// ==========================================================================
// 13. INITIALIZATION LOGGING
// ==========================================================================

debugLog('%c🚇 Wardha Metro Flow - Media Page Loaded', 'color: #ea580c; font-size: 16px; font-weight: bold;');
debugLog('%cAll interactive features initialized successfully!', 'color: #16a34a; font-size: 12px;');

