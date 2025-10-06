document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const usernameInput = document.getElementById('new-username');
    const passwordInput = document.getElementById('new-password');
    const signupBtn = document.getElementById('signup-btn');
    const signupError = document.getElementById('signup-error');

    function validateInputs() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
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

        signupError.textContent = '';
        signupBtn.disabled = false;
        return true;
    }

    async function signUpUser(username, password) {
        console.log('Sending sign up request with:', { username, password });

        if (!validateInputs()) {
            return;
        }

        signupBtn.disabled = true;
        signupError.textContent = 'Signing up...';

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
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
        await signUpUser(usernameInput.value.trim(), passwordInput.value.trim());
    });

    usernameInput.addEventListener('input', validateInputs);
    passwordInput.addEventListener('input', validateInputs);

    validateInputs();
});