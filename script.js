const socket = io();
let currentUser = null;
let currentChatUser = null;

// Login function
function login() {
    const username = document.getElementById('username').value.trim();
    if (username) {
        currentUser = username;
        socket.emit('login', username);
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('chatContainer').classList.remove('hidden');
    } else {
        alert('Please enter a username.');
    }
}

// Display online users
socket.on('online-users', (users) => {
    const userList = document.getElementById('onlineUsers');
    userList.innerHTML = '';
    users.forEach((user) => {
        if (user !== currentUser) {
            const li = document.createElement('li');
            li.textContent = user;
            li.onclick = () => selectUser(user);
            userList.appendChild(li);
        }
    });
});

// Select a user to chat
function selectUser(user) {
    currentChatUser = user;
    document.getElementById('chatWith').querySelector('span').textContent = user;
    document.getElementById('messages').innerHTML = ''; // Clear chat history
}

// Display messages
socket.on('message', (data) => {
    if (data.sender === currentChatUser || data.receiver === currentUser) {
        const messagesDiv = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.textContent = `${data.sender}: ${data.text}`;
        messagesDiv.appendChild(messageDiv);
    }
});

// Send message
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (message && currentChatUser) {
        socket.emit('message', { sender: currentUser, receiver: currentChatUser, text: message });
        input.value = '';
    }
}
