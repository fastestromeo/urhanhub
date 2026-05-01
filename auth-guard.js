/**
 * auth-guard.js
 * Shared authentication utilities for UrbanHub storefront.
 * Import this module on any page that needs to check/react to auth state.
 */
import { supabase } from './supabase-config.js';

/**
 * Returns the current Supabase session (or null if logged out).
 */
export async function getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

/**
 * If the user is not logged in, redirect them to the auth page.
 * @param {string} [returnUrl] - The URL to return to after login (defaults to current page URL).
 */
export async function requireAuth(returnUrl) {
    const session = await getSession();
    if (!session) {
        const redirect = encodeURIComponent(returnUrl || (window.location.pathname.replace(/^\//, '') + window.location.search));
        window.location.href = `auth?redirect=${redirect}`;
        return null;
    }
    return session;
}

/**
 * Signs the current user out and redirects to the home page.
 */
export async function signOut() {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
}

/**
 * Initialises the navbar profile icon to reflect auth state.
 * - Logged out: clicking the icon goes to auth page
 * - Logged in: clicking the icon shows a dropdown with user email + logout
 *
 * Call this once on every page that has a navbar.
 * @param {string} [currentPageUrl] - Passed as the redirect-back URL if user isn't logged in.
 */
export async function initNavAuth(currentPageUrl) {
    const profileBtn = document.querySelector('.icon-btn[aria-label="Profile"]');
    if (!profileBtn) return;

    const session = await getSession();

    if (!session) {
        // Redirect to login when clicked, with redirect-back to current page
        profileBtn.addEventListener('click', () => {
            const redirect = encodeURIComponent(currentPageUrl || (window.location.pathname.replace(/^\//, '') + window.location.search));
            window.location.href = `auth?redirect=${redirect}`;
        });
        profileBtn.title = 'Log In';
        return;
    }

    // Logged in — show user initial in button, add dropdown
    const userEmail = session.user?.email || '';
    const userName = session.user?.user_metadata?.full_name || userEmail.split('@')[0] || 'U';
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    profileBtn.innerHTML = `<span style="
        display: inline-flex; align-items: center; justify-content: center;
        width: 28px; height: 28px; border-radius: 50%;
        background: #000; color: #fff; font-size: 0.7rem; font-weight: 700;
        letter-spacing: 0.02em;">${initials}</span>`;
    profileBtn.title = userEmail;

    // Build dropdown
    const dropdown = document.createElement('div');
    dropdown.id = 'auth-dropdown';
    dropdown.style.cssText = `
        position: absolute; top: calc(100% + 8px); right: 0;
        background: white; border: 1px solid #eee; border-radius: 4px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.08); padding: 0.5rem 0;
        min-width: 200px; z-index: 9999; display: none;
        font-family: inherit;
    `;
    dropdown.innerHTML = `
        <div style="padding: 0.75rem 1rem; font-size: 0.8rem; color: #666; border-bottom: 1px solid #f0f0f0; word-break: break-all;">${userEmail}</div>
        <button id="auth-logout-btn" style="
            display: block; width: 100%; text-align: left;
            padding: 0.75rem 1rem; background: none; border: none;
            font-family: inherit; font-size: 0.85rem; font-weight: 600;
            cursor: pointer; color: #e03131; transition: background 0.15s;">
            <i class="ph ph-sign-out" style="margin-right: 0.5rem;"></i>Sign Out
        </button>
    `;

    // Attach dropdown to the profile button's parent
    profileBtn.style.position = 'relative';
    profileBtn.parentElement.style.position = 'relative';
    profileBtn.parentElement.appendChild(dropdown);

    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
    });

    document.addEventListener('click', () => { dropdown.style.display = 'none'; });

    document.getElementById('auth-logout-btn')?.addEventListener('click', async () => {
        await signOut();
    });
}
