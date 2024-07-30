(function () {
    'use strict';

    var forms = document.querySelectorAll('.needs-validation');

    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                var title = form.querySelector('#title');
                var price = form.querySelector('#price');

                if (title.value.length > 50) {
                    title.setCustomValidity('Title must be less than 50 characters.');
                } else {
                    title.setCustomValidity('');
                }

                if (price.value <= 500) {
                    price.setCustomValidity('Price must be greater than 500.');
                } else {
                    price.setCustomValidity('');
                }

                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add('was-validated');
            }, false);
        });
})();
