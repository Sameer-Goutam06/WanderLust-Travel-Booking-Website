(function () {
    'use strict';

    var forms = document.querySelectorAll('.needs-validation');

    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                var title = form.querySelector('#title');
                var price = form.querySelector('#price');
                var description=form.querySelector('#description')

                if (title.value.length > 50) {
                    title.setCustomValidity('Title must be less than 50 characters.');
                } else {
                    title.setCustomValidity('');
                }

                if (500<= price.value <= 50000) {
                    price.setCustomValidity('Price must be in the range of 500 to 50000');
                } else {
                    price.setCustomValidity('');
                }

                if(!(50<=newListing.description.length<=500))
                {
                    description.setCustomValidity("Description length should be in the range of 50-500 characters");
                }
                else {
                    description.setCustomValidity('');
                }

                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
})();