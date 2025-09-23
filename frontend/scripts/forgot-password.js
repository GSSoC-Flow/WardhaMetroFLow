// Forgot Password Form Validation

document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    const messageDiv = document.getElementById('forgot-password-message');
    messageDiv.textContent = '';

    if (!email) {
        messageDiv.textContent = 'Please enter your email.';
        return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        messageDiv.textContent = 'Please enter a valid email address.';
        return;
    }
    // Simulate sending reset link
    messageDiv.style.color = '#388e3c';
    messageDiv.textContent = 'If this email is registered, a reset link will be sent.';
});
