document.addEventListener('DOMContentLoaded', function () {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    startDateInput.min = tomorrow.toISOString().split('T')[0];

    document.getElementById('bookingForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const nameInput = document.getElementById('name');
        const countInput = document.getElementById('count');
        const bookedByRegex = /^[A-Za-z\s]+$/;
        let valid = true;

        // Clear previous errors
        clearErrors();

        // Validate name
        if (!bookedByRegex.test(nameInput.value.trim())) {
            showError(nameInput, 'Name must contain only alphabets and spaces.');
            valid = false;
        }

        // Validate count
        if (countInput.value < 1 ||countInput.value>20) {
            showError(countInput, 'Please enter a valid number of rooms (minimum 1) (maximum 20)');
            valid = false;
        }

        // Validate start date and end date
        if (new Date(startDateInput.value) < tomorrow) {
            showError(startDateInput, 'Please select a valid start date.');
            valid = false;
        }

        if (new Date(endDateInput.value) <= new Date(startDateInput.value)) {
            showError(endDateInput, 'End date must be after the start date.');
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
});