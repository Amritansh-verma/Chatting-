const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = {}; // Key-value pairs of socket IDs and usernames

io.on('connection', (socket) => {
    // Add user to the active users list
    users[socket.id] = `User_${socket.id.substring(0, 4)}`; // Assign a default username
    io.emit('active-users', Object.values(users));

    // Handle message sending
    socket.on('message', (data) => {
        const receiverSocket = Object.keys(users).find((id) => users[id] === data.receiver);
        if (receiverSocket) {
            io.to(receiverSocket).emit('message', { sender: users[socket.id], text: data.text });
        }
    });

    // Remove user on disconnect
    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('active-users', Object.values(users));
    });
});

// Serve static files
app.use(express.static('public'));

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
