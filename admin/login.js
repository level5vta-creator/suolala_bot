document.addEventListener('DOMContentLoaded', () => {
    // ALWAYS clear session when arriving at login page to force fresh login
    sessionStorage.removeItem('isAdmin');

    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // Credentials check
        if (username === 'suolalamod' && password === 'suolalameme2932') {
            sessionStorage.setItem('isAdmin', 'true');
            window.location.replace('dashboard.html');
        } else {
            errorMessage.style.display = 'block';
            passwordInput.value = '';

            // Shake animation
            const card = document.querySelector('.login-card');
            card.style.transform = 'translateX(5px)';
            setTimeout(() => card.style.transform = 'translateX(-5px)', 50);
            setTimeout(() => card.style.transform = 'none', 100);
        }
    });
});
