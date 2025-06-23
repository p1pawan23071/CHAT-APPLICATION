const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join-room', ({ username, room }) => {
        socket.join(room);
        socket.to(room).emit('notification', `${username} joined the room`);
    });

    socket.on('chat-message', ({ message, room }) => {
        io.to(room).emit('message', { 
            username: socket.handshake.query.username, 
            message 
        });
    });

    socket.on('typing', ({ room }) => {
        socket.to(room).emit('typing', socket.handshake.query.username);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
