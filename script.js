// DOM Elements
const loginSection = document.getElementById('login-section');
const chatSection = document.getElementById('chat-section');
const usernameInput = document.getElementById('username-input');
const roomInput = document.getElementById('room-input');
const joinButton = document.getElementById('join-button');
const messagesContainer = document.getElementById('messages-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.getElementById('typing-indicator');

// Socket.io connection
const socket = io();

let currentUsername = '';
let currentRoom = '';

// Join chat room
joinButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const room = roomInput.value.trim();
    
    if (username && room) {
        currentUsername = username;
        currentRoom = room;
        
        socket.emit('join-room', { username, room });
        
        loginSection.style.display = 'none';
        chatSection.style.display = 'block';
        
        addNotification(`You joined room: ${room}`);
    } else {
        alert('Please enter both username and room name');
    }
});

// Send message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('chat-message', { 
            message,
            room: currentRoom
        });
        
        // Add message to UI
        addMessage(currentUsername, message, true);
        messageInput.value = '';
    }
}

sendButton.addEventListener('click', sendMessage);

// Send message on Enter key
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Typing indicator
messageInput.addEventListener('input', () => {
    socket.emit('typing', { room: currentRoom });
});

// Socket event listeners
socket.on('message', (data) => {
    if (data.username !== currentUsername) {
        addMessage(data.username, data.message, false);
    }
});

socket.on('notification', (text) => {
    addNotification(text);
});

socket.on('typing', (username) => {
    if (username !== currentUsername) {
        typingIndicator.textContent = `${username} is typing...`;
        typingIndicator.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            typingIndicator.style.display = 'none';
        }, 3000);
    }
});

// UI helper functions
function addMessage(username, message, isCurrentUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isCurrentUser ? 'user-message' : 'other-message');
    messageElement.textContent = message;
    
    const usernameElement = document.createElement('div');
    usernameElement.style.fontSize = '0.8em';
    usernameElement.style.marginBottom = '5px';
    usernameElement.textContent = username;
    
    const container = document.createElement('div');
    container.appendChild(usernameElement);
    container.appendChild(messageElement);
    
    messagesContainer.appendChild(container);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addNotification(text) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = text;
    messagesContainer.appendChild(notification);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
