document.addEventListener('DOMContentLoaded', (event) => {
    // Check if there's a flash message element
const flashMessage = document.querySelector('.flash-notifications');
if (flashMessage) {
    // Hide the flash message after 3 seconds
    setTimeout(() => {
        flashMessage.style.opacity = '0';
        setTimeout(() => flashMessage.remove(), 100); // Remove element after fade out
    }, 4700);
}
});