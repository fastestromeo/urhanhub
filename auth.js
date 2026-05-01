import { supabase } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const errorBox = document.getElementById('error-box');
    const successState = document.getElementById('success-state');
    const formContainer = document.getElementById('auth-form-container');
    const authForm = document.getElementById('auth-form');
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const nameGroup = document.getElementById('name-group');
    const regName = document.getElementById('reg-name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('btn-submit');
    const subtitleText = document.getElementById('auth-subtitle-text');
    const footerText = document.getElementById('footer-text');

    // ── Redirect destination (supports ?redirect= param) ───────────────────
    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get('redirect') || 'index.html';

    // ── If already logged in, skip straight to destination ─────────────────
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        window.location.href = redirectTo;
        return;
    }

    // ── Tab state ───────────────────────────────────────────────────────────
    let isSignUp = false;

    const showError = (msg) => {
        errorBox.textContent = msg;
        errorBox.style.display = 'block';
    };
    const clearError = () => {
        errorBox.style.display = 'none';
        errorBox.textContent = '';
    };

    const switchToLogin = () => {
        isSignUp = false;
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        nameGroup.style.display = 'none';
        submitBtn.textContent = 'LOG IN';
        subtitleText.textContent = 'Welcome back. Sign in to your account.';
        footerText.innerHTML = `Don't have an account? <a href="#" id="switch-link">Create one</a>`;
        document.getElementById('switch-link').addEventListener('click', (e) => { e.preventDefault(); switchToSignUp(); });
        clearError();
    };

    const switchToSignUp = () => {
        isSignUp = true;
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        nameGroup.style.display = 'block';
        submitBtn.textContent = 'CREATE ACCOUNT';
        subtitleText.textContent = 'Join a community of modern architectural enthusiasts.';
        footerText.innerHTML = `Already have an account? <a href="#" id="switch-link">Log in</a>`;
        document.getElementById('switch-link').addEventListener('click', (e) => { e.preventDefault(); switchToLogin(); });
        clearError();
    };

    tabLogin.addEventListener('click', switchToLogin);
    tabSignup.addEventListener('click', switchToSignUp);
    // Also wire up the initial footer link
    document.getElementById('switch-to-signup')?.addEventListener('click', (e) => { e.preventDefault(); switchToSignUp(); });

    // ── Form submission ─────────────────────────────────────────────────────
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearError();
        submitBtn.disabled = true;
        submitBtn.textContent = 'PLEASE WAIT...';

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        try {
            if (isSignUp) {
                const fullName = regName.value.trim();
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: fullName } }
                });
                if (error) throw error;

                // Show success — Supabase may need email confirmation
                formContainer.style.display = 'none';
                successState.style.display = 'block';
                successState.querySelector('h2').textContent = 'Account Created!';
                successState.querySelector('p').textContent = 'Check your email to confirm your account, then log in.';
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;

                formContainer.style.display = 'none';
                successState.style.display = 'block';
                successState.querySelector('h2').textContent = 'Welcome Back!';
                successState.querySelector('p').textContent = 'Authentication successful. Redirecting...';

                setTimeout(() => { window.location.href = redirectTo; }, 900);
            }
        } catch (err) {
            showError(err.message || 'Something went wrong. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = isSignUp ? 'CREATE ACCOUNT' : 'LOG IN';
        }
    });
});
