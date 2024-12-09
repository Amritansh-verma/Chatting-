const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = [];

io.on('connection', (socket) => {
    socket.on('login', (user) => {
        users.push(user);
        socket.user = user;
        io.emit('online-users', users);
    });

    socket.on('message', (message) => {
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        users = users.filter((user) => user !== socket.user);
        io.emit('online-users', users);
    });
});

app.use(express.static('public'));

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
