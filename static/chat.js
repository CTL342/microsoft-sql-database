document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const closeButtons = document.querySelectorAll('.close');
    const chatMain = document.getElementById('chat-main');
    const welcomeScreen = document.getElementById('welcome-screen');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const messages = document.getElementById('messages');
    const welcomeUser = document.getElementById('welcome-user');
    const userInfo = document.getElementById('user-info');
    const authButtons = document.getElementById('auth-buttons');
    const loginError = document.getElementById('login-error');
    const termsCheckbox = document.getElementById('terms-checkbox');

    let isLoggedIn = !!localStorage.getItem('username');

    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            clearForms();
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
            clearForms();
        }
    });

    function clearForms() {
        loginForm.reset();
        loginError.textContent = '';
        termsCheckbox.checked = false;
    }

    function validateLogin() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        if (!username || !password) {
            loginError.textContent = 'Please fill in all fields';
            return false;
        }
        loginError.textContent = '';
        return true;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateLogin()) return;

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('username', data.user.username);
                isLoggedIn = true;
                loginModal.style.display = 'none';
                updateUI();
                addMessage('system', 'Welcome! You are now logged in. Ask me anything about nuclear reactor cooling systems.');
            } else {
                loginError.textContent = data.message;
            }
        } catch (error) {
            loginError.textContent = 'Login error: ' + error.message;
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('username');
        isLoggedIn = false;
        messages.innerHTML = '';
        updateUI();
        welcomeScreen.style.display = 'block';
        chatMain.classList.add('hidden');
    });

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && isLoggedIn) {
            sendMessage();
        }
    });

    async function sendMessage() {
        const query = userInput.value.trim();
        if (!query || !isLoggedIn) return;

        addMessage('user', query);
        userInput.value = '';
        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending...';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            const data = await response.json();
            if (response.ok) {
                addMessage('assistant', data.response);
            } else {
                addMessage('system', 'Error: ' + (data.message || 'Failed to get response.'));
            }
        } catch (error) {
            addMessage('system', 'Error: ' + error.message);
        } finally {
            sendBtn.disabled = false;
            sendBtn.textContent = 'Send';
            userInput.focus();
        }
    }

    function addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', role);
        messageDiv.textContent = content;
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    function updateUI() {
        const username = localStorage.getItem('username');
        if (isLoggedIn && username) {
            welcomeUser.textContent = `Welcome, ${username}!`;
            userInfo.classList.remove('hidden');
            authButtons.classList.add('hidden');
            welcomeScreen.style.display = 'none';
            chatMain.classList.remove('hidden');
            sendBtn.classList.remove('hidden');
            userInput.disabled = false;
        } else {
            userInfo.classList.add('hidden');
            authButtons.classList.remove('hidden');
            welcomeScreen.style.display = 'block';
            chatMain.classList.add('hidden');
            sendBtn.classList.add('hidden');
            userInput.disabled = true;
        }
    }

    updateUI();
});