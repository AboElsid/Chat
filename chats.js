document.addEventListener('DOMContentLoaded', function() {
    const firebaseConfig = {
        apiKey: "AIzaSyDPKhtwMTmAors7T2UuY7dnLFRPq4UZrfs",
        authDomain: "arabflaqiss.firebaseapp.com",
        databaseURL: "https://arabflaqiss-default-rtdb.firebaseio.com",
        projectId: "arabflaqiss",
        storageBucket: "arabflaqiss.appspot.com",
        messagingSenderId: "114538014171",
        appId: "1:114538014171:web",
        measurementId: "G-KZ7LDKF6BW"
    };

    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    let username = localStorage.getItem('username') || '';

    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const emojiBtn = document.getElementById('emoji-btn');
    const messagesContainer = document.getElementById('messages');
    const emojiContainer = document.getElementById('emoji-container');
    const notificationSound = document.getElementById('notification-sound');
    const usernameInput = document.getElementById('username-input');
    const setUsernameBtn = document.getElementById('set-username-btn');
    const usernameContainer = document.getElementById('username-container');
    const messageContainer = document.getElementById('message-container');

    setUsernameBtn.addEventListener('click', () => {
        const enteredUsername = usernameInput.value.trim();
        if (enteredUsername) {
            username = enteredUsername;
            localStorage.setItem('username', username);
            usernameContainer.style.display = 'none';
            messageContainer.style.display = 'flex';
        }
    });

    sendBtn.addEventListener('click', sendMessage);

    emojiBtn.addEventListener('click', () => {
        emojiContainer.style.display = emojiContainer.style.display === 'flex' ? 'none' : 'flex';
    });

    document.querySelectorAll('.emoji').forEach(emoji => {
        emoji.addEventListener('click', () => {
            chatInput.value += emoji.textContent;
            emojiContainer.style.display = 'none';
        });
    });

    chatInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            if (message.length > 40) {
                alert('Please limit your message to 40 characters.');
                return;
            }

            const messageRef = database.ref('messages').push();
            messageRef.set({
                text: message,
                username: username,
                timestamp: Date.now()
            }).then(() => {
                notificationSound.play();
            }).catch((error) => {
                console.error('Error storing message:', error);
            });

            chatInput.value = '';
        }
    }

    database.ref('messages').on('child_added', function(snapshot) {
        const messageData = snapshot.val();
        const messageElement = document.createElement('div');
        messageElement.textContent = `${messageData.username}: ${messageData.text}`;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });

    if (username) {
        usernameContainer.style.display = 'none';
        messageContainer.style.display = 'flex';
    }
});
