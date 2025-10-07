// Enhanced Feedback Form with Validation and Submission
(function() {
    'use strict';

    /**
     * Feedback Form Class
     * Handles form validation, submission, and user interaction
     */
    class FeedbackForm {
        constructor() {
            this.form = document.getElementById('feedbackForm');
            this.successModal = document.getElementById('successModal');
            this.closeModalBtn = document.getElementById('closeSuccessModal');
            this.modalCloseBtn = document.getElementById('modalCloseBtn');
            this.referenceIdElement = document.getElementById('referenceId');
            
            this.init();
        }

        init() {
            this.setupEventListeners();
            this.setupFormValidation();
        }

        setupEventListeners() {
            // Form submission
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Modal close buttons
            this.closeModalBtn.addEventListener('click', () => this.closeSuccessModal());
            this.modalCloseBtn.addEventListener('click', () => this.closeSuccessModal());
            
            // Close modal when clicking outside
            this.successModal.addEventListener('click', (e) => {
                if (e.target === this.successModal) {
                    this.closeSuccessModal();
                }
            });
            
            // Close modal with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.successModal.classList.contains('active')) {
                    this.closeSuccessModal();
                }
            });
            
            // Real-time validation for inputs
            this.setupRealTimeValidation();
        }

        setupFormValidation() {
            // Add custom validation for email
            const emailInput = document.getElementById('email');
            emailInput.addEventListener('input', () => {
                if (emailInput.validity.typeMismatch) {
                    emailInput.setCustomValidity('Please enter a valid email address');
                } else {
                    emailInput.setCustomValidity('');
                }
            });
            
            // Add custom validation for mobile number
            const mobileInput = document.getElementById('mobile');
            mobileInput.addEventListener('input', () => {
                const mobileRegex = /^[0-9]{10}$/;
                if (mobileInput.value && !mobileRegex.test(mobileInput.value)) {
                    mobileInput.setCustomValidity('Please enter a valid 10-digit mobile number');
                } else {
                    mobileInput.setCustomValidity('');
                }
            });
        }

        setupRealTimeValidation() {
            const inputs = this.form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                // Clear validation on focus
                input.addEventListener('focus', () => {
                    this.clearFieldError(input);
                });
            });
        }

        validateField(field) {
            this.clearFieldError(field);
            
            if (!field.validity.valid) {
                this.showFieldError(field, this.getErrorMessage(field));
                return false;
            }
            
            // Custom validation for specific fields
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    this.showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
            }
            
            if (field.id === 'mobile' && field.value) {
                const mobileRegex = /^[0-9]{10}$/;
                if (!mobileRegex.test(field.value)) {
                    this.showFieldError(field, 'Please enter a valid 10-digit mobile number');
                    return false;
                }
            }
            
            return true;
        }

        getErrorMessage(field) {
            if (field.validity.valueMissing) {
                return 'This field is required';
            }
            
            if (field.validity.typeMismatch) {
                if (field.type === 'email') {
                    return 'Please enter a valid email address';
                }
            }
            
            if (field.validity.tooShort) {
                return `Please enter at least ${field.minLength} characters`;
            }
            
            if (field.validity.tooLong) {
                return `Please enter no more than ${field.maxLength} characters`;
            }
            
            return 'Please check this field';
        }

        showFieldError(field, message) {
            field.classList.add('error');
            
            // Create or update error message
            let errorElement = field.parentNode.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                field.parentNode.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
            errorElement.style.color = '#dc2626';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
        }

        clearFieldError(field) {
            field.classList.remove('error');
            
            const errorElement = field.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        }

        validateForm() {
            let isValid = true;
            const requiredFields = this.form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });
            
            return isValid;
        }

        async handleSubmit(e) {
            e.preventDefault();
            
            if (!this.validateForm()) {
                this.showNotification('Please fix the errors in the form before submitting.', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = this.form.querySelector('.btn-submit-feedback');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            try {
                // Simulate API call
                await this.submitFormData();
                
                // Show success modal
                this.showSuccessModal();
                
                // Reset form
                this.form.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                this.showNotification('There was an error submitting your feedback. Please try again.', 'error');
            } finally {
                // Restore button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        }

        submitFormData() {
            // In a real application, this would be an API call
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Generate a reference ID
                    const referenceId = 'WM-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
                    this.referenceIdElement.textContent = referenceId;
                    resolve();
                }, 1500);
            });
        }

        showSuccessModal() {
            this.successModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }

        closeSuccessModal() {
            this.successModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }

        showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            
            // Style the notification
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.right = '20px';
            notification.style.padding = '1rem 1.5rem';
            notification.style.borderRadius = 'var(--border-radius-small)';
            notification.style.color = 'white';
            notification.style.fontWeight = '500';
            notification.style.zIndex = '1001';
            notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            notification.style.maxWidth = '400px';
            notification.style.transform = 'translateX(100%)';
            notification.style.transition = 'transform 0.3s ease';
            
            // Set background color based on type
            if (type === 'error') {
                notification.style.backgroundColor = '#dc2626';
            } else {
                notification.style.backgroundColor = '#10b981';
            }
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 10);
            
            // Remove after 5 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 5000);
        }
    }

    /**
     * Initialize everything when DOM is ready
     */
    document.addEventListener('DOMContentLoaded', () => {
        new FeedbackForm();
        
        // Add CSS for error states
        const style = document.createElement('style');
        style.textContent = `
            .form-group input.error,
            .form-group select.error,
            .form-group textarea.error {
                border-color: #dc2626;
                box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
            }
        `;
        document.head.appendChild(style);
    });

})();