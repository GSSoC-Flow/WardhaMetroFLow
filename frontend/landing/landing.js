// Enhanced Desktop Slideshow with Auto-play and Advanced Features
(function() {
    'use strict';

    /**
     * Desktop-Optimized Slideshow Class
     * Features: Auto-play, pause on hover, keyboard navigation, touch/mouse support
     */
    class DesktopSlideshow {
        constructor(container) {
            this.container = container;
            this.slidesWrapper = container.querySelector('.slides-wrapper');
            this.slides = container.querySelectorAll('.slide');
            this.dots = container.querySelectorAll('.dot');
            this.prevBtn = container.querySelector('.prev-btn');
            this.nextBtn = container.querySelector('.next-btn');
            this.progressBar = container.querySelector('.progress-bar');
            
            this.currentSlide = 0;
            this.totalSlides = this.slides.length;
            this.autoPlayInterval = null;
            this.autoPlayDuration = 5000; // 5 seconds
            
            // Touch/mouse support
            this.isDragging = false;
            this.startX = 0;
            this.currentX = 0;
            this.threshold = 50;
            
            this.init();
        }

        init() {
            if (this.totalSlides <= 1) {
                if(this.prevBtn) this.prevBtn.style.display = 'none';
                if(this.nextBtn) this.nextBtn.style.display = 'none';
                if(this.dots.length > 0) this.container.querySelector('.slide-dots').style.display = 'none';
                if(this.progressBar) this.container.querySelector('.slide-progress').style.display = 'none';
                return;
            };
            
            this.setupEventListeners();
            this.startAutoPlay();
            
            // Initialize first slide
            this.updateSlideshow(false);
        }

        setupEventListeners() {
            // Navigation arrows
            this.prevBtn?.addEventListener('click', () => this.prevSlide());
            this.nextBtn?.addEventListener('click', () => this.nextSlide());
            
            // Dot indicators
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });
            
            // Auto-play controls
            this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
            this.container.addEventListener('mouseleave', () => this.startAutoPlay());
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => this.handleKeyboard(e));
            
            // Touch/Mouse drag support
            this.setupDragSupport();
            
            // Visibility API for performance
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseAutoPlay();
                } else {
                    this.startAutoPlay();
                }
            });
        }

        setupDragSupport() {
            // Mouse events
            this.slidesWrapper.addEventListener('mousedown', (e) => this.handleDragStart(e));
            this.slidesWrapper.addEventListener('mousemove', (e) => this.handleDragMove(e));
            this.slidesWrapper.addEventListener('mouseup', () => this.handleDragEnd());
            this.slidesWrapper.addEventListener('mouseleave', () => this.handleDragEnd());
            
            // Touch events
            this.slidesWrapper.addEventListener('touchstart', (e) => this.handleDragStart(e), { passive: true });
            this.slidesWrapper.addEventListener('touchmove', (e) => this.handleDragMove(e), { passive: true });
            this.slidesWrapper.addEventListener('touchend', () => this.handleDragEnd());
            
            // Prevent context menu on long press
            this.slidesWrapper.addEventListener('contextmenu', (e) => {
                if (this.isDragging) e.preventDefault();
            });
        }

        handleDragStart(e) {
            this.isDragging = true;
            this.startX = this.getClientX(e);
            this.pauseAutoPlay();
            this.slidesWrapper.style.cursor = 'grabbing';
            this.slidesWrapper.style.transition = 'none'; // Disable transition during drag
        }

        handleDragMove(e) {
            if (!this.isDragging) return;
            this.currentX = this.getClientX(e);
            const deltaX = this.currentX - this.startX;
            const translateX = -this.currentSlide * this.container.offsetWidth + deltaX;
            this.slidesWrapper.style.transform = `translateX(${translateX}px)`;
        }

        handleDragEnd() {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.slidesWrapper.style.cursor = 'grab';
            
            const deltaX = this.currentX - this.startX;
            
            if (Math.abs(deltaX) > this.threshold) {
                if (deltaX > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            } else {
                // Snap back to current slide
                this.updateSlideshow(true);
            }
            
            this.startAutoPlay();
        }

        getClientX(e) {
            return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        }

        handleKeyboard(e) {
            if (!this.isInViewport()) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
            }
        }

        isInViewport() {
            const rect = this.container.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom >= 0;
        }

        nextSlide() {
            this.goToSlide((this.currentSlide + 1) % this.totalSlides, 'right');
        }

        prevSlide() {
            this.goToSlide((this.currentSlide - 1 + this.totalSlides) % this.totalSlides, 'left');
        }

        goToSlide(index, direction) {
            const prevDirection = direction || (index > this.currentSlide ? 'right' : 'left');
            this.currentSlide = index;
            this.updateSlideshow(true, prevDirection);
            this.resetAutoPlay();
        }

        updateSlideshow(animate = true, direction = 'right') {
            const translateX = -this.currentSlide * 100;
            
            this.slidesWrapper.style.transition = animate ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
            this.slidesWrapper.style.transform = `translateX(${translateX}%)`;
            
            this.dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === this.currentSlide);
            });
            
            this.updateAriaAttributes();
        }

        updateAriaAttributes() {
            this.slides.forEach((slide, index) => {
                slide.setAttribute('aria-hidden', index !== this.currentSlide);
            });
        }
        
        resetAutoPlay() {
            this.pauseAutoPlay();
            this.startAutoPlay();
        }

        startAutoPlay() {
            if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = setInterval(() => this.nextSlide(), this.autoPlayDuration);
            this.startProgressAnimation();
        }

        pauseAutoPlay() {
            clearInterval(this.autoPlayInterval);
            if (this.progressBar) {
                 const computedWidth = window.getComputedStyle(this.progressBar).width;
                 this.progressBar.style.width = computedWidth;
                 this.progressBar.style.transition = 'none';
            }
        }
        
        startProgressAnimation() {
            if (!this.progressBar) return;
            this.progressBar.style.transition = 'none';
            this.progressBar.style.width = '0%';
            // Force reflow
            this.progressBar.getBoundingClientRect(); 
            this.progressBar.style.transition = `width ${this.autoPlayDuration}ms linear`;
            this.progressBar.style.width = '100%';
        }
    }

    /**
     * Intersection Observer for fade-in elements
     */
    function setupIntersectionObserver() {
        const fadeElements = document.querySelectorAll('.fade-in');
        if (fadeElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(element => observer.observe(element));
    }

    // Initialize everything when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const slideshowContainer = document.querySelector('.slideshow-container');
        if (slideshowContainer) {
            new DesktopSlideshow(slideshowContainer);
        }
        setupIntersectionObserver();
    });

})();
