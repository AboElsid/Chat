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

if (!username) {
    username = getRandomUsername();
    localStorage.setItem('username', username);
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
const chatTitle = document.getElementById('chat-title');

const profanityList = ["profanity1", "profanity2", "profanity3", "profanity4"];

sendBtn.addEventListener('click', () => {
    sendMessage();
});

emojiBtn.addEventListener('click', () => {
    emojiContainer.style.display = emojiContainer.style.display === 'flex' ? 'none' : 'flex';
});

document.querySelectorAll('.emoji').forEach(emoji => {
    emoji.addEventListener('click', () => {
        chatInput.value += emoji.textContent;
        emojiContainer.style.display = 'none';
    });
});

function sendMessage() {
    const message = chatInput.value.trim(); // Remove extra spaces from the beginning and end
    if (message) {
        if (message.length > 40) { // Check if the message exceeds 40 characters
            alert('Please limit your message to 40 characters.');
            return;
        }
        if (!isValidMessage(message)) {
            alert('Please refrain from sharing links or using profanity.');
            return;
        }
        
        const messageRef = database.ref('messages').push();
        messageRef.set({
            text: message,
            username: username,
            timestamp: Date.now()
        }).then(() => {
            console.log('Message stored successfully.');
        }).catch((error) => {
            console.error('Error storing message:', error);
        });
        chatInput.value = '';
    }
}

function isValidMessage(message) {
    const urlPattern = /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/gi;
    const containsURL = urlPattern.test(message);
    const containsProfanity = checkForProfanity(message);
    return !containsURL &#38;&#38; !containsProfanity;
}

function checkForProfanity(message) {
    for (const profanity of profanityList) {
        if (message.includes(profanity)) {
            return true;
        }
    }
    return false;
}

database.ref('messages').on('child_added', (snapshot) => {
    const messageData = snapshot.val();
    const messageElement = document.createElement('div');
    messageElement.textContent = `${messageData.username}: ${messageData.text}`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

function deleteAllMessages() {
    if (confirm("Are you sure you want to delete all messages?")) {
        database.ref('messages').remove().then(() => {
            console.log('All messages deleted successfully.');
            messagesContainer.innerHTML = ''; 
        }).catch((error) => {
            console.error('Error deleting all messages:', error);
        });
    }
}

function changeUsername() {
    alert("You are using a random username. To change it, edit the 'randomUsernames' array.");
}

