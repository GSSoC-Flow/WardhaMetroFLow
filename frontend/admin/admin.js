document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const usernameError = document.getElementById('usernameError');
  const passwordError = document.getElementById('passwordError');

  usernameError.style.display = 'none';
  passwordError.style.display = 'none';

  let valid = true;

  if (!usernameInput.value.trim()) {
    usernameError.style.display = 'block';
    valid = false;
  }

  if (!passwordInput.value.trim()) {
    passwordError.style.display = 'block';
    valid = false;
  }

  if (valid) {
    alert('Admin login submitted');
    // Add actual login/auth logic here
  }
});
