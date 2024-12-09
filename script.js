const socket = io();

const userList = document.getElementById('onlineUsers');
const chatWindow = document.getElementById('chatWindow');
const messageInput = document.getElementById('messageInput');
const sendMessage = document.getElementById('sendMessage');
const chatUser = document.getElementById('chatUser');

let selectedUser = null;

// Update active users list
socket.on('active-users', (users) => {
    userList.innerHTML = ''; // Clear the list
    users.forEach((user) => {
        const li = document.createElement('li');
        li.textContent = user;
        li.onclick = () => selectUser(user);
        userList.appendChild(li);
    });
});

// Select user to chat
function selectUser(user) {
    selectedUser = user;
    chatUser.textContent = `Chatting with ${user}`;
    chatWindow.innerHTML = ''; // Clear chat window
}

// Send message
sendMessage.addEventListener('click', () => {
    if (selectedUser && messageInput.value) {
        socket.emit('send-message', { to: selectedUser, message: messageInput.value });
        displayMessage(`You: ${messageInput.value}`);
        messageInput.value = ''; // Clear input
    }
});

// Display received message
socket.on('receive-message', ({ from, message }) => {
    displayMessage(`${from}: ${message}`);
});

// Display message in chat window
function displayMessage(message) {
    const p = document.createElement('p');
    p.textContent = message;
    chatWindow.appendChild(p);
}
