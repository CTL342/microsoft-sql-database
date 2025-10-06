const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const errorMessage = document.getElementById('error-message');

function validateInputs() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        errorMessage.textContent = 'Please fill in all fields';
        submitBtn.disabled = true;
        return false;
    }
    if (username.length < 3) {
        errorMessage.textContent = 'Username must be at least 3 characters long';
        submitBtn.disabled = true;
        return false;
    }
    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters long';
        submitBtn.disabled = true;
        return false;
    }

    errorMessage.textContent = '';
    submitBtn.disabled = false;
    return true;
}

async function signUpUser(username, password) {
    console.log('Sending sign up request with:', { username, password });

    if (!validateInputs()) {
        return; // Exit early if validation fails
    }

    submitBtn.disabled = true;
    errorMessage.textContent = 'Signing up...';

    try {
        const response = await fetch('/api/signup', { // Changed to lowercase 'signup'
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log('Received response:', response.status, data);

        if (!response.ok) {
            throw new Error(data.message || `Signup failed with status ${response.status}`);
        }

        errorMessage.style.color = '#28a745';
        errorMessage.textContent = data.message || 'Signed up successfully!';
        setTimeout(() => {
            window.location.href = '/'; // Redirect to login page after signup
        }, 1000);
    } catch (error) {
        console.error('Signup error:', error.message);
        errorMessage.textContent = error.message;
    } finally {
        submitBtn.disabled = false;
    }
}

async function loginUser(username, password) {
    console.log('Sending login request with:', { username, password });
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log('Received response:', response.status, data);

        if (!response.ok) {
            throw new Error(data.message || `Login failed with status ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('Fetch error:', error.message);
        throw new Error(error.message || 'Unable to connect to the server. Please check if the server is running.');
    }
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateInputs()) {
        return;
    }

    submitBtn.disabled = true;
    errorMessage.textContent = 'Logging in...';

    try {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const response = await loginUser(username, password);
        console.log('API Response:', response);

        errorMessage.style.color = '#28a745';
        errorMessage.textContent = response.message;
        console.log('Login successful:', response);

        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1000);
    } catch (error) {
        console.error('Submit error:', error.message);
        errorMessage.textContent = error.message;
        submitBtn.disabled = false;
    }
});

usernameInput.addEventListener('input', validateInputs);
passwordInput.addEventListener('input', validateInputs);

validateInputs();