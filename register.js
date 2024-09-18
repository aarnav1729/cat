document.addEventListener('DOMContentLoaded', () => {
    const registerTab = document.getElementById('registerTab');
    const loginTab = document.getElementById('loginTab');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    // Show Register and hide Login by default
    registerTab.addEventListener('click', () => {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    // Show Login and hide Register
    loginTab.addEventListener('click', () => {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // Registration Process (OTP handling will be added here)
    document.getElementById('registerBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const password = document.getElementById('password').value;
        const source = document.getElementById('source').value;

        // Send data to the server (Google OAuth and OTP logic will go here)
        console.log('Registering:', { fullName, email, phoneNumber, password, source });

        // Call backend API to send OTP and register the user
        // Example: await fetch('/register', { method: 'POST', body: JSON.stringify({...}) });

        // After sending OTP, prompt user to enter OTP (OTP handling will be here)
    });

    // Login Process
    document.getElementById('loginBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        const phoneNumber = document.getElementById('loginPhone').value;
        const password = document.getElementById('loginPassword').value;

        // Validate login credentials with backend
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber, password })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Login successful:', result);
            // Redirect to dashboard or show the user's data
        } else {
            console.error('Login failed');
            alert('Invalid credentials');
        }
    });
});