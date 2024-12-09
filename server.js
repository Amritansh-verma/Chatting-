const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const users = {}; // Store active users

// Serve static files
app.use(express.static('public'));

// Handle Socket.io connection
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    users[socket.id] = `User_${socket.id.substring(0, 4)}`; // Generate username

    // Emit updated active users list
    io.emit('active-users', Object.values(users));

    // Handle chat messages
    socket.on('send-message', ({ to, message }) => {
        io.to(to).emit('receive-message', { from: users[socket.id], message });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        delete users[socket.id];
        io.emit('active-users', Object.values(users)); // Update active users
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
