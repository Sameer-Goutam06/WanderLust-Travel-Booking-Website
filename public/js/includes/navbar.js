document.addEventListener('DOMContentLoaded', () => {
    const toggler = document.getElementById('navbar-toggler');
    const collapse = document.getElementById('navbar-collapse');

    toggler.addEventListener('click', () => {
        collapse.classList.toggle('show');
    });
});
