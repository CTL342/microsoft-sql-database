document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const usernameInput = document.getElementById('new-username');
    const passwordInput = document.getElementById('new-password');
    const emailInput = document.getElementById('new-email');
    const firstNameInput = document.getElementById('new-first-name');
    const lastNameInput = document.getElementById('new-last-name');
    const ageInput = document.getElementById('new-age');
    const termsCheckbox = document.getElementById('terms-checkbox');
    const signupBtn = document.getElementById('signup-btn');
    const signupError = document.getElementById('signup-error');

    function validateInputs() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const email = emailInput.value.trim();
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const age = parseInt(ageInput.value.trim(), 10) || 0;

        if (!username || !password || !email || !firstName || !lastName || !ageInput.value) {
            signupError.textContent = 'Please fill in all fields';
            signupBtn.disabled = true;
            return false;
        }
        if (username.length < 3) {
            signupError.textContent = 'Username must be at least 3 characters long';
            signupBtn.disabled = true;
            return false;
        }
        if (password.length < 6) {
            signupError.textContent = 'Password must be at least 6 characters long';
            signupBtn.disabled = true;
            return false;
        }
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)) {
            signupError.textContent = 'Please enter a valid email address';
            signupBtn.disabled = true;
            return false;
        }
        if (age < 18) {
            signupError.textContent = 'You must be an adult to register';
            signupBtn.disabled = true;
            return false;
        }
        if (!termsCheckbox.checked) {
            signupError.textContent = 'You must agree to the Terms and Conditions';
            signupBtn.disabled = true;
            return false;
        }

        signupError.textContent = '';
        signupBtn.disabled = false;
        return true;
    }

    async function signUpUser(username, password, email, firstName, lastName, age) {
        console.log('Sending sign up request with:', { username, password, email, firstName, lastName, age });

        if (!validateInputs()) {
            return;
        }

        signupBtn.disabled = true;
        signupError.textContent = 'Signing up...';

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email, firstName, lastName, age: age.toString() }),
            });

            const data = await response.json();
            console.log('Received response:', response.status, data);

            if (!response.ok) {
                throw new Error(data.message || `Signup failed with status ${response.status}`);
            }

            signupError.style.color = '#28a745';
            signupError.textContent = data.message || 'Signed up successfully!';
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } catch (error) {
            console.error('Signup error:', error.message);
            signupError.textContent = error.message;
        } finally {
            signupBtn.disabled = false;
        }
    }

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        await signUpUser(
            usernameInput.value.trim(),
            passwordInput.value.trim(),
            emailInput.value.trim(),
            firstNameInput.value.trim(),
            lastNameInput.value.trim(),
            parseInt(ageInput.value.trim(), 10) || 0
        );
    });

    [usernameInput, passwordInput, emailInput, firstNameInput, lastNameInput, ageInput, termsCheckbox].forEach(element => {
        element.addEventListener('input', validateInputs);
    });

    validateInputs();
});