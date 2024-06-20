   <audio id="notification-sound" src="https://assets.mixkit.co/active_storage/sfx/2573/2573.wav" preload="auto"></audio>

    <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-database.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const firebaseConfig = {
                apiKey: "AIzaSyDPKhtwMTmAors7T2UuY7dnLFRPq4UZrfs",
                authDomain: "arabflaqiss.firebaseapp.com",
                databaseURL: "https://arabflaqiss-default-rtdb.firebaseio.com",
                projectId: "arabflaqiss",
                storageBucket: "arabflaqiss.appspot.com",
                messagingSenderId: "114538014171",
                appId: "1:114538014171:web:c711613c6db99a2a38f3fe",
                measurementId: "G-KZ7LDKF6BW"
            };

            firebase.initializeApp(firebaseConfig);
            const database = firebase.database();

            const randomUsernames = [
                "User123",
                "Anonymous123",
                "ChatUser456",
                "RandomUser789",
                "GuestUser321"
            ];

            let username = localStorage.getItem('username') || getRandomUsername();
            let isChatDisabled = localStorage.getItem('chatDisabled') === 'true';

            if (username) {
                document.getElementById('login-page').style.display = 'none';
                document.getElementById('chat-container').style.display = 'flex';
            } else {
                document.getElementById('login-page').style.display = 'flex';
                document.getElementById('chat-container').style.display = 'none';
            }

            function login() {
                const usernameInput = document.getElementById('username').value.trim();
                if (usernameInput) {
                    localStorage.setItem('username', usernameInput);
                    username = usernameInput;
                    document.getElementById('login-page').style.display = 'none';
                    document.getElementById('chat-container').style.display = 'flex';
                } else {
                    alert('Please enter a valid name.');
                }
            }

            function getRandomUsername() {
                const randomIndex = Math.floor(Math.random() * randomUsernames.length);
                return randomUsernames[randomIndex];
            }

            const chatInput = document.getElementById('chat-input');
            const sendBtn = document.getElementById('send-btn');
            const emojiBtn = document.getElementById('emoji-btn');
            const messagesContainer = document.getElementById('messages');
            const emojiContainer = document.getElementById('emoji-container');
            const notificationSound = document.getElementById('notification-sound');

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

            chatInput.addEventListener('keyup', function(event) {
                if (event.key === 'Enter') {
                    sendMessage();
                }
            });

            function sendMessage() {
                const message = chatInput.value.trim();
                if (message.length === 0 || message.length > 40 || message.includes("<") || message.includes(">") || message.includes("/") || message.includes("script")) {
                    return;
                }

                const messageData = {
                    username,
                    message,
                    timestamp: new Date().toISOString()
                };

                database.ref('messages').push(messageData);
                chatInput.value = '';
            }

            database.ref('messages').on('child_added', function(snapshot) {
                const messageData = snapshot.val();
                const messageElement = document.createElement('div');
                messageElement.textContent = `${messageData.username}: ${messageData.message}`;
                messagesContainer.appendChild(messageElement);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;

                if (messageData.username !== username && !document.hidden) {
                    notificationSound.play();
                }

                if (messageData.message.includes("!disableChat") && messageData.username === "admin") {
                    isChatDisabled = true;
                    localStorage.setItem('chatDisabled', 'true');
                    sendBtn.disabled = true;
                    chatInput.disabled = true;
                }

                if (messageData.message.includes("!enableChat") && messageData.username === "admin") {
                    isChatDisabled = false;
                    localStorage.setItem('chatDisabled', 'false');
                    sendBtn.disabled = false;
                    chatInput.disabled = false;
                }

                if (messageData.message.includes("!drK") && messageData.username === "admin") {
                    document.body.classList.add('drK');
                }

                if (messageData.message.includes("!nL") && messageData.username === "admin") {
                    document.body.classList.remove('drK');
                }
            });

            if (isChatDisabled) {
                sendBtn.disabled = true;
                chatInput.disabled = true;
            }
        });
    </script>
