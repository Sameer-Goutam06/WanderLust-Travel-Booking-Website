document.addEventListener('DOMContentLoaded', () => {
    // Scroll icons
    const filters = document.getElementById('filters');
    const leftIcon = document.querySelector('.scroll-icon.left');
    const rightIcon = document.querySelector('.scroll-icon.right');

    if (leftIcon) {
        leftIcon.addEventListener('click', () => {
            filters.scrollBy({ left: -200, behavior: 'smooth' });
        });
    }

    if (rightIcon) {
        rightIcon.addEventListener('click', () => {
            filters.scrollBy({ left: 200, behavior: 'smooth' });
        });
    }
});
