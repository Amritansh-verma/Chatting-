const socket = io();
let currentChatUser = null;

// Fetch active users from the server
socket.on('active-users', (users) => {
    const userList = document.getElementById('onlineUsers');
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.textContent = user;
        li.onclick = () => selectUser(user);
        userList.appendChild(li);
    });
});

// Select a user to chat
function selectUser(user) {
    currentChatUser = user;
    document.getElementById('chatWith').querySelector('span').textContent = user;
    document.getElementById('messages').innerHTML = ''; // Clear previous chat
}

// Handle incoming messages
socket.on('message', (data) => {
    if (data.sender === currentChatUser || data.receiver === currentChatUser) {
        const messagesDiv = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.textContent = `${data.sender}: ${data.text}`;
        messagesDiv.appendChild(messageDiv);
    }
});

// Send a message
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (message && currentChatUser) {
        socket.emit('message', { text: message, receiver: currentChatUser });
        input.value = '';
    }
        }
