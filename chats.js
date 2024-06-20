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

    const randomUsernames = [
        "User123",
        "Anonymous123",
        "ChatUser456",
        "RandomUser789",
        "GuestUser321"
    ];

    // قائمة الأسماء الممنوعة
    const forbiddenUsernames = [
        "Admin",
        "Moderator",
        "BlockedUser",
        "InappropriateName",
        "NewForbiddenUsername"
    ];

    let username = localStorage.getItem('username') || getRandomUsername();
    let isChatDisabled = localStorage.getItem('chatDisabled') === 'true';

    if (!username) {
        username = getRandomUsername();
        localStorage.setItem('username', username);
    }

    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const emojiBtn = document.getElementById('emoji-btn');
    const messagesContainer = document.getElementById('messages');
    const emojiContainer = document.getElementById('emoji-container');
    const chatTitle = document.getElementById('chat-title');
    const disableChatBtn = document.getElementById('disable-chat-btn');
    const notificationSound = document.getElementById('notification-sound');
    const usernameInput = document.getElementById('username-input');
    const setUsernameBtn = document.getElementById('set-username-btn');
    const usernameContainer = document.getElementById('username-container');

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

    // Listen for Enter key press in chat input
    chatInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // منع السلوك الافتراضي لمفتاح Enter
            sendMessage(); // استدعاء دالة sendMessage
        }
    });

    setUsernameBtn.addEventListener('click', function() {
        const enteredUsername = usernameInput.value.trim();
        if (enteredUsername) {
            if (!isUsernameAllowed(enteredUsername)) {
                alert('This username is not allowed.');
                return;
            }
            username = enteredUsername;
            localStorage.setItem('username', username);
            usernameContainer.style.display = 'none';
            chatInput.style.display = 'block';
            sendBtn.style.display = 'block';
        }
    });

    if (!localStorage.getItem('username')) {
        usernameContainer.style.display = 'block';
        chatInput.style.display = 'none';
        sendBtn.style.display = 'none';
    } else {
        usernameContainer.style.display = 'none';
        chatInput.style.display = 'block';
        sendBtn.style.display = 'block';
    }

    function getRandomUsername() {
        const randomIndex = Math.floor(Math.random() * randomUsernames.length);
        return randomUsernames[randomIndex];
    }

    function sendMessage() {
        const message = chatInput.value.trim(); // إزالة المسافات الزائدة من البداية والنهاية
        if (message) {
            if (message.length > 40) { // التحقق مما إذا كانت الرسالة تتجاوز 40 حرفًا
                alert('Please limit your message to 40 characters.');
                return;
            }
            if (!isValidMessage(message)) {
                alert('Please refrain from sharing links or using profanity.');
                return;
            }
            if (isChatDisabled) {
                alert('Chat is currently disabled.');
                return;
            }

            const messageRef = database.ref('messages').push();
            messageRef.set({
                text: message,
                username: username,
                timestamp: Date.now()
            }).then(() => {
                console.log('Message stored successfully.');

                // إرسال الرسالة إلى ويب هوك Discord بعد تخزينها
                sendToDiscord(message, username);

                notificationSound.play(); // تشغيل صوت الإشعار
            }).catch((error) => {
                console.error('Error storing message:', error);
            });

            chatInput.value = ''; // مسح حقل الإدخال بعد إرسال الرسالة
        }
    }

    function isValidMessage(message) {
        const urlPattern = /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/gi;
        const containsURL = urlPattern.test(message);
        const containsProfanity = checkForProfanity(message);
        return !containsURL && !containsProfanity;
    }

    function checkForProfanity(message) {
        const profanityList = ["profanity1", "profanity2", "profanity3", "profanity4"];
        for (const profanity of profanityList) {
            if (message.toLowerCase().includes(profanity.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    function isUsernameAllowed(username) {
        return !forbiddenUsernames.includes(username);
    }

    // إرسال الرسالة إلى ويب هوك Discord
    function sendToDiscord(message, username) {
        const payload = {
            content: `${username}: ${message}`
        };

        fetch('https://discord.com/api/webhooks/1251647884454006845/4HjJbiL4Y-nbQVLvw-Bwin8xe3nZ6PGgXTSo1jPO-rb73L2gtj4hiK5M7zUUvVYt7qIG', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }).then(response => {
            console.log('Message sent to Discord:', message);
        }).catch(error => {
            console.error('Error sending message to Discord:', error);
        });
    }

    // عرض الرسائل من Firebase
    database.ref('messages').on('child_added', function(snapshot) {
        const messageData = snapshot.val();
        const messageElement = document.createElement('div');
        messageElement.textContent = `${messageData.username}: ${messageData.text}`;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });

    // التحقق من حالة تعطيل الدردشة عند تحميل الصفحة
    toggleChat();

    function toggleChat() {
        chatInput.disabled = isChatDisabled;
        sendBtn.disabled = isChatDisabled;
        disableChatBtn.textContent = isChatDisabled ? 'Enable Chat' : 'Disable Chat';
    }
});
