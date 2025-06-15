
const socket = io();

const username = sessionStorage.getItem('username');
const room = sessionStorage.getItem('room') || 'General';
if (!username) {
    window.location = 'index.html';
}

const roomNameEl = document.getElementById('room-name');
const usersEl = document.getElementById('users');
const messagesEl = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

roomNameEl.textContent = room;

// Join server
socket.emit('join', { username, room });

// Handle incoming room messages
socket.on('message', (msg) => {
    outputMessage(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
});

// Handle private messages
socket.on('privateMessage', ({ from, to, text }) => {
    outputMessage({ user: from + ' (private)', text }, true);
    messagesEl.scrollTop = messagesEl.scrollHeight;
});

// Update users list
socket.on('users', (usernames) => {
    usersEl.innerHTML = usernames.map(u => `<li>${u}</li>`).join('');
});

// Sending messages
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;
    if (text.startsWith('@')) {
        const sep = text.indexOf(' ');
        if (sep !== -1) {
            const to = text.slice(1, sep);
            const body = text.slice(sep + 1);
            socket.emit('privateMessage', { to, text: body }, (ok) => {
                if (!ok) alert('User not found or message failed.');
            });
            outputMessage({ user: 'You (private to ' + to + ')', text: body }, true);
        }
    } else {
        socket.emit('sendMessage', text, () => {});
    }
    messageInput.value = '';
    messageInput.focus();
});

function outputMessage({ user, text }, isPrivate = false) {
    const div = document.createElement('div');
    div.classList.add('msg');
    if (isPrivate) div.classList.add('private');
    div.innerHTML = `
        <p class="meta">${user}</p>
        <p class="text">${text}</p>
    `;
    messagesEl.appendChild(div);
}
