const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', socket => {
    console.log('A user connected');

    socket.on('join-room', ({ username, room }) => {
        socket.join(room);
        socket.to(room).emit('message', `${username} joined the room`);

        socket.on('chat-message', msg => {
            io.to(room).emit('message', `${username}: ${msg}`);
        });

        socket.on('typing', () => {
            socket.to(room).emit('typing', `${username} is typing...`);
        });

        socket.on('disconnect', () => {
            io.to(room).emit('message', `${username} left the chat`);
        });
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
