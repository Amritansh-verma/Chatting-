const socket = io();
let currentUser = null;

// Login function
function login() {
    const username = document.getElementById('username').value;
    const profilePic = document.getElementById('profilePic').files[0];
    if (username && profilePic) {
        const reader = new FileReader();
        reader.onload = () => {
            currentUser = { username, profilePic: reader.result };
            socket.emit('login', currentUser);
            document.getElementById('loginPage').classList.add('hidden');
            document.getElementById('chatContainer').classList.remove('hidden');
        };
        reader.readAsDataURL(profilePic);
    } else {
        alert('Please enter a username and upload a profile picture.');
    }
}

// Display online users
socket.on('online-users', (users) => {
    const userList = document.getElementById('onlineUsers');
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.textContent = user.username;
        userList.appendChild(li);
    });
});

// Display messages
socket.on('message', (data) => {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.innerHTML = `
        <img src="${data.sender.profilePic}" alt="${data.sender.username}">
        <div>
            <p><strong>${data.sender.username}</strong>: ${data.text}</p>
            <p style="font-size: 12px; color: grey;">${data.timestamp}</p>
        </div>
    `;
    messagesDiv.appendChild(messageDiv);
});

// Send messages
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value;
    if (message) {
        const timestamp = new Date().toLocaleTimeString();
        socket.emit('message', { sender: currentUser, text: message, timestamp });
        input.value = '';
    }
}
