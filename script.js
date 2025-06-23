const socket = io();
let username = '';
let room = '';

function joinRoom() {
  username = document.getElementById('username').value;
  room = document.getElementById('room').value;

  if (!username || !room) return alert("Please enter username and room.");

  document.getElementById('login').style.display = 'none';
  document.getElementById('chat').style.display = 'block';

  socket.emit('join-room', { username, room });

  document.getElementById('msg').addEventListener('input', () => {
    socket.emit('typing');
  });
}

function sendMessage() {
  const msg = document.getElementById('msg').value;
  if (msg.trim()) {
    socket.emit('chat-message', msg);
    document.getElementById('msg').value = '';
  }
}

socket.on('message', message => {
  const msgDiv = document.createElement('div');
  msgDiv.textContent = message;
  document.getElementById('messages').appendChild(msgDiv);
});

socket.on('typing', message => {
  const typingDiv = document.getElementById('typing');
  typingDiv.textContent = message;
  setTimeout(() => typingDiv.textContent = '', 1000);
});
