
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const room = document.getElementById('room').value.trim() || 'General';
    if (!username) return;
    // Store in sessionStorage
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('room', room);
    window.location = 'chat.html';
});
