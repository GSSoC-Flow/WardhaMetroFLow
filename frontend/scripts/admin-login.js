// Admin Login Form Validation

document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();
    const errorDiv = document.getElementById('admin-login-error');
    errorDiv.textContent = '';

    if (!username || !password) {
        errorDiv.textContent = 'Please fill in all fields.';
        return;
    }
    // Email format check if input looks like an email
    if (username.includes('@') && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(username)) {
        errorDiv.textContent = 'Please enter a valid email address.';
        return;
    }
    if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters.';
        return;
    }
    // Simulate login success (replace with real logic)
    errorDiv.style.color = '#388e3c';
    errorDiv.textContent = 'Login successful (demo only). Redirecting...';
    // If in iframe, notify parent to redirect
    if (window.parent !== window) {
        window.parent.postMessage('admin-login-success', '*');
    } else {
        setTimeout(function() {
            window.location.href = 'Admin.html';
        }, 1000);
    }
});
