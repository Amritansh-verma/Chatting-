const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = [];

io.on('connection', (socket) => {
    socket.on('login', (username) => {
        users.push({ id: socket.id, username });
        io.emit('online-users', users.map((user) => user.username));
    });

    socket.on('message', (data) => {
        const receiver = users.find((user) => user.username === data.receiver);
        if (receiver) {
            io.to(receiver.id).emit('message', data);
        }
        io.to(socket.id).emit('message', data);
    });

    socket.on('disconnect', () => {
        users = users.filter((user) => user.id !== socket.id);
        io.emit('online-users', users.map((user) => user.username));
    });
});

app.use(express.static('public'));

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
