
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// In‑memory user storage
// socket.id => { username, room }
const users = new Map();

// Helper: get users in a room
const getUsersInRoom = (room) =>
    Array.from(users.values())
        .filter(u => u.room === room)
        .map(u => u.username);

io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    socket.on('join', ({ username, room }) => {
        users.set(socket.id, { username, room });
        socket.join(room);
        // Welcome message to current user
        socket.emit('message', { user: 'System', text: `Welcome to ${room}, ${username}!` });
        // Broadcast to others
        socket.broadcast.to(room).emit('message', { user: 'System', text: `${username} has joined the chat.` });
        // Update user list
        io.in(room).emit('users', getUsersInRoom(room));
    });

    socket.on('sendMessage', (text, callback) => {
        const user = users.get(socket.id);
        if (!user) return;
        io.in(user.room).emit('message', { user: user.username, text });
        callback && callback();
    });

    socket.on('privateMessage', ({ to, text }, callback) => {
        const sender = users.get(socket.id);
        if (!sender) return;
        // find recipient socket id
        const recipientId = Array.from(users.entries())
            .find(([id, u]) => u.username === to && u.room === sender.room)?.[0];
        if (recipientId) {
            io.to(recipientId).emit('privateMessage', { from: sender.username, text });
            // echo back to sender
            socket.emit('privateMessage', { from: sender.username, to, text });
            callback && callback(true);
        } else {
            socket.emit('message', { user: 'System', text: `User ${to} not found in room.` });
            callback && callback(false);
        }
    });

    socket.on('disconnect', () => {
        const user = users.get(socket.id);
        if (user) {
            users.delete(socket.id);
            io.in(user.room).emit('message', { user: 'System', text: `${user.username} has left.` });
            io.in(user.room).emit('users', getUsersInRoom(user.room));
        }
    });
});

app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
