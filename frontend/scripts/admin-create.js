// Admin Create Account Form Validation

document.getElementById('adminCreateForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const fullname = document.getElementById('admin-fullname').value.trim();
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;
    const confirmPassword = document.getElementById('admin-confirm-password').value;
    const errorDiv = document.getElementById('admin-create-error');
    errorDiv.textContent = '';

    if (!fullname || !email || !password || !confirmPassword) {
        errorDiv.textContent = 'Please fill in all fields.';
        return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        errorDiv.textContent = 'Please enter a valid email address.';
        return;
    }
    // Strong password: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
        errorDiv.textContent = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';
        return;
    }
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match.';
        return;
    }
    // Add more validation as needed
    errorDiv.textContent = 'Account created successfully (demo only).';
});
