document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('admin-login-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real app we'd verify credentials here
            window.location.href = 'index.html';
        });
    }
});
