document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    let valid = true;

    // Clear previous errors
    clearErrors();

    // Validate username
    const usernameRegex = /^[a-zA-Z0-9_-]{1,15}$/;
    if (!usernameRegex.test(username.value.trim())) {
        showError(username, 'Username must be 1 to 15 characters long, can contain letters, numbers, hyphens, and underscores, and must not have spaces or other special characters.');
        valid = false;
    }

    // Validate email
    if (email.value.trim() === '') {
        showError(email, 'Email is required.');
        valid = false;
    }

    // Validate password
    if (password.value.length < 8 || password.value.length > 12 || /\s/.test(password.value)) {
        showError(password, 'Password must be 8 to 12 characters long with no spaces.');
        valid = false;
    }

    // Validate confirm password
    if (password.value !== confirmPassword.value) {
        showError(confirmPassword, 'Passwords do not match.');
        valid = false;
    }

    if (valid) {
        this.submit();
    }
});

function showError(input, message) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.invalid-feedback');
    errorElements.forEach(element => {
        element.style.display = 'none';
    });
}
