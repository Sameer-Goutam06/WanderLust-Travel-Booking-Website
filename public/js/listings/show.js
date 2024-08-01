document.getElementById('reviewForm').addEventListener('submit', function(event) {
    const rating = parseFloat(document.getElementById('rating').value);
    const comment = document.getElementById('comment').value.trim();
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';

    let valid = true;

    if (rating < 0.5 || rating > 5) {
        valid = false;
        errorMessage.textContent += 'Rating must be between 0.5 and 5.\n';
    }

    if (comment.length < 5 || comment.length > 500) {
        valid = false;
        errorMessage.textContent += 'Comment must be between 5 and 500 characters.\n';
    }

    if (!valid) {
        errorMessage.style.display = 'block';
        event.preventDefault();
    }
});