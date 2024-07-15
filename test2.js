
function playSteamVideo() {
    var video = document.querySelector('.lazySteamVideo video');
    var thumbnail = document.querySelector('.lazySteamVideo img');
    var playButton = document.querySelector('.lazySteamVideo .play');

    thumbnail.style.display = 'none';
    playButton.style.display = 'none';
    video.style.display = 'block';
    video.play();
}


document.addEventListener('DOMContentLoaded', function() {
    // التحقق مما إذا كانت الصفحة صفحة مقال
    function isArticlePage() {
        // تحقق من وجود نمط تاريخ في عنوان URL (مثل /2024/06/)
        const path = window.location.pathname;
        const datePattern = /^\/\d{4}\/\d{2}\//; // نمط التاريخ: /YYYY/MM/
        return datePattern.test(path);
    }
 
    if (isArticlePage()) {
        // الحصول على معرف المقالة من Blogger
        var postId = location.pathname.split('/').filter(Boolean).pop();
        
        // التحقق من قيمة meta tag لبوابة العمرية
        var ageGateEnabled = document.querySelector('meta[name="agegate-enabled"]').getAttribute('content');
        
        if (ageGateEnabled.toLowerCase() === 'true') {
            var ageGateVisible = localStorage.getItem(postId + "_cookieaccepted") === null;

            if (ageGateVisible) {
                var daySelect = document.getElementById('ageDay');
                var monthSelect = document.getElementById('ageMonth');
                var yearSelect = document.getElementById('ageYear');

                for (var i = 1; i <= 31; i++) {
                    var option = document.createElement('option');
                    option.value = i;
                    option.text = i;
                    daySelect.appendChild(option);
                }

                var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                for (var i = 0; i < months.length; i++) {
                    var option = document.createElement('option');
                    option.value = months[i];
                    option.text = months[i];
                    monthSelect.appendChild(option);
                }


               var minYear = 1920;
                var maxYear = new Date().getFullYear();
                for (var i = maxYear; i >= minYear; i--) {
                    var option = document.createElement('option');
                    option.value = i;
                    option.text = i;
                    yearSelect.appendChild(option);
                }

                // إخفاء العناصر المطلوبة
                document.querySelector('.blogMn').style.display = "none";
                document.querySelector('.tikniyabox').style.display = "none";
                document.querySelectorAll('.lbHt > *').forEach(el => el.style.display = "none");
                document.querySelector('.pShc').style.display = "none";
            } else {
                document.getElementById("app_agegate").style.display = "none";
                document.getElementById("article_content").style.display = "block";
                document.querySelector('.blogMn').style.display = "block"; // إظهار العنصر .blogMn
                document.querySelector('.tikniyabox').style.display = "block"; // إظهار العنصر .tikniyabox
            }
        } else {
            // إذا كانت بوابة العمرية غير مفعلة في العنصر meta
            document.getElementById("app_agegate").style.display = "none";
            document.getElementById("article_content").style.display = "block";
            document.querySelector('.blogMn').style.display = "block"; // إظهار العنصر .blogMn
            document.querySelector('.tikniyabox').style.display = "block"; // إظهار العنصر .tikniyabox
        }
    }
});

function acceptCookie() {
    // تحقق من عمر المستخدم
    var today = new Date();
    var selectedYear = document.getElementById('ageYear').value;
    var age = today.getFullYear() - selectedYear;

    if (age < 18) {
        alert("Sorry, you are not old enough to view this content.");
    } else {
        var postId = location.pathname.split('/').filter(Boolean).pop();
        localStorage.setItem(postId + "_cookieaccepted", "true");


        document.getElementById("app_agegate").style.display = "none";
        document.getElementById("article_content").style.display = "block";
        document.querySelector('.blogMn').style.display = "block"; // إظهار العنصر .blogMn
        document.querySelector('.tikniyabox').style.display = "block"; // إظهار العنصر .tikniyabox
    }
}


// Replace with your Discord webhook URL
var discordWebhookUrl = 'https://discord.com/api/webhooks/1257917892608131123/PY5PDPSgAG6PeInl8gcE-SjAJxIOL8jExfdFNbggTlSfZJCmnpmy5B5KCIgL0o5HLPzy';

document.addEventListener('DOMContentLoaded', function() {
    var pageTitle = document.title; // Use document.title to get the page title

    // Fetch visitor's IP
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            var ip = data.ip;
            var visitCount = parseInt(localStorage.getItem('visitCount')) || 0;
            var totalVisits = parseInt(localStorage.getItem('totalVisits')) || 0;
            visitCount++; // Increase visit count
            totalVisits++; // Increase total visits

            localStorage.setItem('visitCount', visitCount);
            localStorage.setItem('totalVisits', totalVisits);

            // Fetch visitor's country based on IP (optional)
            fetch(`https://ipapi.co/${ip}/country_name/`)
                .then(response => response.text())
                .then(country => {
                    var payload = {
                        embeds: [{
                            title: '🔔 New Visitor Notification',
                            description: `**__A new visit has been recorded by__** \`${getUsername()}\`.`,
                            fields: [
                                { name: 'Page Title:', value: pageTitle, inline: true },
                                { name: 'Visit Date:', value: getCurrentDateTime(), inline: true },
                                { name: 'Browser:', value: getBrowser(), inline: true },
                                { name: 'Operating System:', value: getDeviceDetails().os, inline: true },
                                { name: 'Device Type:', value: getDeviceDetails().type, inline: true },
                                { name: 'Architecture:', value: getDeviceDetails().architecture, inline: true },
                                { name: 'Visitor IP:', value: ip, inline: true },
                                { name: 'Visits to this page:', value: visitCount, inline: true },
                                { name: 'Total Visits:', value: totalVisits, inline: true },
                                { name: 'Language:', value: getLanguage(), inline: true },
                                { name: 'Timezone:', value: getTimezone(), inline: true },
                                { name: 'Country:', value: country.trim() || 'Unknown', inline: true }, // Adding Country
                                { name: '\u200B', value: '\u200B', inline: false }, // Empty field for spacing
                                { name: 'Page URL:', value: window.location.href, inline: false }, // Adding Page URL
                            ],
                            color: 0xFF0000 // Red color
                        }]
                    };

                    var options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    };

                    fetch(discordWebhookUrl, options)
                        .then(response => console.log('Notification sent to Discord:', response))
                        .catch(error => console.error('Error sending notification to Discord:', error));
                })
                .catch(error => console.error('Error fetching country:', error));
        })
        .catch(error => console.error('Error fetching visitor IP:', error));
});

function getDeviceDetails() {
    var userAgent = navigator.userAgent;
    var os = 'Unknown OS';
    var type = 'Unknown Device';
    var architecture = 'Unknown Architecture';

    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'MacOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('like Mac')) os = 'iOS';

    if (userAgent.includes('Mobile')) type = 'Mobile';
    else if (userAgent.includes('Tablet')) type = 'Tablet';
    else if (userAgent.includes('Mac') || userAgent.includes('Win') || userAgent.includes('Linux')) type = 'PC';

    if (userAgent.includes('WOW64') || userAgent.includes('Win64')) architecture = '64 bit';
    else if (userAgent.includes('Win32') || userAgent.includes('WOW32')) architecture = '32 bit';

    return { os: os, type: type, architecture: architecture };
}

function getBrowser() {
    var userAgent = navigator.userAgent;
    var browserName = 'Unknown';

    if (userAgent.includes('Firefox')) browserName = 'Firefox';
    else if (userAgent.includes('Chrome')) browserName = 'Chrome';
    else if (userAgent.includes('Safari')) browserName = 'Safari';
    else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browserName = 'Opera';
    else if (userAgent.includes('Edg')) browserName = 'Edge';
    else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) browserName = 'Internet Explorer';

    return browserName;
}

function getCurrentDateTime() {
    var timestamp = new Date();
    return timestamp.toLocaleString();
}

function getLanguage() {
    return navigator.language || navigator.userLanguage;
}

function getTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function getUsername() {
    var storedUsername = localStorage.getItem('username');
    return storedUsername ? storedUsername : 'Guest';
}



       




    document.addEventListener('DOMContentLoaded', function() {
        // البحث عن العناصر التي تحتوي على "Developer" أو "Publisher"
        var listItems = document.querySelectorAll('li');
        
        // حلق عبر كل عنصر <li>
        listItems.forEach(function(item) {
            var titleElement = item.querySelector('span.table-title-list');
            
            // التحقق من أن العنصر يحتوي على "Developer" أو "Publisher"
            if (titleElement) {
                var titleText = titleElement.textContent.trim();
                var itemNamesElement = item.querySelector('span.table-isi-list');
                
                // التحقق من أنه "Developer" أو "Publisher" فقط
                if (titleText === 'Developer' || titleText === 'Publisher') {
                    var itemNames = itemNamesElement.textContent.trim().split(',').map(function(name) {
                        return name.trim();
                    });
                    
                    // حذف الأسماء القديمة
                    itemNamesElement.textContent = '';
                    
                    // إضافة التفاعل بالنقر لكل اسم
                    itemNames.forEach(function(name, index) {
                        var trimmedName = name.trim();
                        var searchUrl = '/search?q=' + encodeURIComponent(trimmedName);
                        
                        // إنشاء عنصر فقاعة للنص
                        var bubbleSpan = document.createElement('span');
                        bubbleSpan.textContent = trimmedName;
                        bubbleSpan.classList.add('bubble-text');
                        bubbleSpan.addEventListener('click', function() {
                            window.location.href = searchUrl;
                        });
                        
                        // إضافة الفقاعة للقائمة
                        itemNamesElement.appendChild(bubbleSpan);
                        
                        // إضافة فاصل بين الأسماء إذا لزم الأمر
                        if (index < itemNames.length - 1) {
                            itemNamesElement.appendChild(document.createTextNode(', '));
                        }
                    });
                }
            }
        });
    });


        let currentSlide = 0;

        function showSlide(index) {
            const slides = document.querySelector('.slides');
            const totalSlides = document.querySelectorAll('.slide').length;

            if (index >= totalSlides) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = totalSlides - 1;
            } else {
                currentSlide = index;
            }

            slides.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        function moveSlide(step) {
            showSlide(currentSlide + step);
        }



    





document.addEventListener("DOMContentLoaded", function() {
    const themePopup = document.getElementById('themePopup');
    const popupHidden = localStorage.getItem('popupHidden');

    if (popupHidden) {
        themePopup.style.display = 'none';
    } else {
        themePopup.style.display = 'flex';
    }
});

function setTheme(theme) {
    if (theme === 'light') {
        modeL();
    } else if (theme === 'dark') {
        modeD();
    } else {
        webTheme(theme);
    }

    localStorage.setItem('popupHidden', 'true');
    const themePopup = document.getElementById('themePopup');
    if (themePopup) {
        themePopup.style.display = 'none';
    }
}

const toggleLinks = document.querySelectorAll('.toggle-link');

toggleLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();

        // Remove 'active' class from all links
        toggleLinks.forEach(l => l.classList.remove('active'));

        // Add 'active' class to the clicked link
        this.classList.add('active');

        // Hide borders from other links
        toggleLinks.forEach(l => {
            if (l !== this) {
                l.style.borderColor = 'transparent';
            } else {
                l.style.borderColor = '#999'; // Change to desired border color
            }
        });
    });
});



   
document.addEventListener('DOMContentLoaded', function() {
    const firebaseConfig = {
        apiKey: "AIzaSyDPKhtwMTM...",
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
    const webhooks = {
        messagesAuto: "https://discord.com/api/webhooks/1260549838064582722/h3ZhYrqM2n-QRONYHbO0Uz9mGmfJk8PTj8Px2ZTSnZCoDiNaOTZSEZFL5okMLeP6f7YY",
        mute:         "https://discord.com/api/webhooks/1260550226046095413/kr_fKp3p0TJV518p5Uv4cT-3m1gYxPxkDbOXApam8biok8d5xVCP5tgLAyxK1-CZvfIv",
        unmute:       "https://discord.com/api/webhooks/1260550336742162472/qe7E7kj0Wb_lW11h0j3HdhQZhPnKz-Ur_ShEPfQi7nydZ9tXQO-syjGHS-9Ot9iI_oKp",
        ban:          "https://discord.com/api/webhooks/1260550480132837426/UMFFZyTOdE0E5F9w3wgFZv-4WbQvY5DDVN_KpNOU5a0S32TgcJkJr4ds5VoYaClvOrFQ",
        unban:        "https://discord.com/api/webhooks/1260550577117466654/7OqIKGGL5r5liyC1qc-4JaFYScQtSRBH-xBrSOoJynk2_eTNcz0rfxgzaHO9iRt2P-Bi",
        disableChat:  "https://discord.com/api/webhooks/1260550678007255061/2FWzW7juD76MceqefUW48pH53cT3KrLApnRcQRK7DV6imMoueCclTgJSnZfM1hXWMVR4",
        enableChat:   "https://discord.com/api/webhooks/1260550780172369952/7Uu3671_-GsiCTko5Th2D-h10WbYbxV6U2ONU6PwwTy48IOJmlBdU4hf57faJVKIUaf8",
        deleteMessages2: "https://discord.com/api/webhooks/1260550780172369952/7Uu3671_-GsiCTko5Th2D-h10WbYbxV6U2ONU6PwwTy48IOJmlBdU4hf57faJVKIUaf8",
        register:        "https://discord.com/api/webhooks/1260596188512518184/Ftt9Qz8VVp5llJfm5GSZ0brg7L78zLWMVkEFBwFNgMQF7V66IlQb2fFViMA_0jxwD0i5",
        addToBlacklist:  "https://discord.com/api/webhooks/1260644967760531580/CKM141Qn8PrUKBUd2HlRxD7fXqXxCPXwoQURn3cGEiMtlqHGH0jSDOk-5j_oAvn_GAHu",
        deleteMessages:  "https://discord.com/api/webhooks/1260550863467057152/d-vUNZHgQ3eh4nK_Co47pANN3qnTh-M7fXPeDrYp7hMkOyBeMWIeWlSGrMkfpLPhKtYu"
    };
    const forbiddenUsernames = [
        "Admin", "Moderator", "BlockedUser", "xnxx", "fuck", "sex",
        "احا", "زبر", "كس", "كوس", "كسمك", "صاحب الموقع", "الادارة", "فلاقيس العرب", "mydick",
        "dick", "ass", "your ass", "fuck you", "كسمين", "InappropriateName", "NewForbiddenUsername"
    ];

    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const emojiBtn = document.getElementById('emoji-btn');
    const messagesContainer = document.getElementById('messages');
    const emojiContainer = document.getElementById('emoji-container');
    const chatTitle = document.getElementById('chat-title');
    const deleteChatBtn = document.getElementById('delete-chat-btn');
    const banUserBtn = document.getElementById('ban-user-btn');
    const banMessage = document.getElementById('ban-message');
    const disableChatBtn = document.getElementById('disable-chat-btn');
    const enableChatBtn = document.getElementById('enable-chat-btn');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const confirmBtn = document.getElementById('confirm-password-btn');
    const setUsernameBtn = document.getElementById('set-username-btn');
    const changeUsernameBtn = document.getElementById('change-username-btn');
    const usernameContainer = document.getElementById('username-container');
    const adminControlsContainer = document.getElementById('admin-controls-container');
    const passwordContainer = document.getElementById('password-container');
    const addToBlacklistBtn = document.getElementById('add-to-blacklist-btn');
    const unbanUserBtn = document.getElementById('unban-user-btn');
    const viewBannedUsersBtn = document.getElementById('view-banned-users-btn');
    const unbanAllBtn = document.getElementById('unban-all-btn');
    const unbanSpecificUserBtn = document.getElementById('unban-specific-user-btn');
    const muteUserBtn = document.getElementById('mute-user-btn');
    const unmuteUserBtn = document.getElementById('unmute-user-btn');
    const onlineUsersRef = database.ref('onlineUsers');


    const adminPassword = '2001259';
    let isChatDisabled = false;
    let username = localStorage.getItem('username') || '';

    if (username) {
        addUserToOnlineList(username);
        if (username === "👑 ArabFlaqis 👑") {
            showAdminControls();
        } else {
            checkUserBanStatus(username);
        }
        usernameContainer.style.display = 'none';
    } else {
        usernameContainer.style.display = 'block';
    }

    if (localStorage.getItem('isAdmin') === 'true') {
        showAdminControls();
    }

    
    setUsernameBtn.addEventListener('click', function() {
        const enteredUsername = usernameInput.value.trim();
        if (enteredUsername) {
            if (!isUsernameAllowed(enteredUsername)) {
                alert('This username is not allowed.');
                return;
            }
            if (enteredUsername === '👑 ArabFlaqis 👑') {
                passwordContainer.style.display = 'block';
            } else {
                username = enteredUsername;
                localStorage.setItem('username', username);
                sendMessageToWebhook(`User Name : ${username}`, webhooks.register)
                checkUserBanStatus(username); // التحقق من حالة الحظر بعد تعيين اسم المستخدم
                usernameContainer.style.display = 'none';
            }
        }
    }); // إغلاق الدالة setUsernameBtn.addEventListener


// Replace 'YOUR_WEBHOOK_URL' with your actual Discord Webhook URL
const webhookURL = 'https://discord.com/api/webhooks/1260604215248683080/kH_o1AMiNYS1egCj5-ymZt5FhXcCau_4zkxXN5iwvLFbXifyz4Mc4GahvWX0rR5XiLo2';

// Function to send a message to Discord webhook
function sendDiscordNotification(message) {
    const data = {
        content: message
    };

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to send message to Discord:', response.status, response.statusText);
        } else {
            // Store in local storage that notification has been sent
            localStorage.setItem('loginNotificationSent', 'true');
        }
    })
    .catch(error => {
        console.error('Error sending message to Discord:', error);
    });
}

// Execute this function when the page loads
window.onload = function() {
    // Check if login notification has already been sent in local storage
    const notificationSent = localStorage.getItem('loginNotificationSent');
    if (!notificationSent) {
        sendDiscordNotification(`User ${username} has logged in again `);

    }
};

// Clear local storage when user leaves the page or refreshes
window.onbeforeunload = function() {
    localStorage.removeItem('loginNotificationSent');
};



    confirmBtn.addEventListener('click', function() {
        const enteredPassword = passwordInput.value.trim();
        if (enteredPassword === adminPassword) {
            localStorage.setItem('isAdmin', 'true');
            showAdminControls();
            username = '👑 ArabFlaqis 👑';
            localStorage.setItem('username', username);
            checkUserBanStatus(username);
            passwordContainer.style.display = 'none';
        } else {
            alert('Incorrect password.');
        }
    });

    changeUsernameBtn.addEventListener('click', function() {
        // تحقق من أن المستخدم هو الإدارة
        if (localStorage.getItem('username') === '👑 ArabFlaqis 👑') {
            const newUsername = prompt('Enter the new username:');
            if (newUsername) {
                if (!isUsernameAllowed(newUsername)) {
                    alert('This username is not allowed.');
                    return;
                }
                // قم بتحديث اسم المستخدم
                username = newUsername;
                localStorage.setItem('username', username);
                location.reload(); // إعادة تحميل الصفحة لتطبيق التغيير
            }
        } else {
            alert('Only administrators can change usernames.');
        }
    });
    
    if (localStorage.getItem('username') === '👑 ArabFlaqis 👑') {
        changeUsernameBtn.style.display = 'inline-block';
    } else {
        changeUsernameBtn.style.display = 'none';
    }
    

    deleteChatBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete the chat?')) {
            deleteMessages();
        }
    });

    banUserBtn.addEventListener('click', function() {
        const userToBan = prompt('Enter the username to ban:');
        if (userToBan) {
            banUser(userToBan);
        }
    });

    disableChatBtn.addEventListener('click', function() {
        if (isAdmin()) {
            disableChat(); // استدعاء دالة تعطيل الشات
            database.ref('/').update({ chatDisabled: true });
        }
    });
    

    enableChatBtn.addEventListener('click', function() {
        if (isAdmin()) {
            database.ref('/').update({ chatDisabled: false });
        }
    });

    // داخل دالة addEventListener('DOMContentLoaded')
database.ref('/chatDisabled').on('value', function(snapshot) {
    isChatDisabled = snapshot.val();
    if (isChatDisabled) {
        // قم بإخفاء حقل إدخال الرسالة وأزرار الإرسال أو أي عمليات أخرى تحتاج إلى تعطيل الدردشة
        chatInput.disabled = true;
        sendBtn.disabled = true;
    } else {
        // قم بإظهار حقل إدخال الرسالة وأزرار الإرسال
        chatInput.disabled = false;
        sendBtn.disabled = false;
    }
});


function disableChat() {
    messagesContainer.classList.add('blur'); // إضافة تأثير الضبابية لعنصر الشات
    chatInput.disabled = true; // تعطيل حقل إدخال الرسائل
    sendBtn.disabled = true; // تعطيل زر إرسال الرسائل
    document.getElementById('chat-disabled-message').style.display = 'block'; // عرض رسالة الإخطار
    sendMessageToWebhook(`Disabling chat`, webhooks.disableChat);

}

function enableChat() {
    messagesContainer.classList.remove('blur'); // إزالة تأثير الضبابية من عنصر الشات
    chatInput.disabled = false; // تمكين حقل إدخال الرسائل
    sendBtn.disabled = false; // تمكين زر إرسال الرسائل
    sendMessageToWebhook( `Enabling chat`,webhooks.enableChat,);

}

enableChatBtn.addEventListener('click', function() {
    if (isAdmin()) {
        enableChat(); // استدعاء دالة إعادة تمكين الشات
        database.ref('/').update({ chatDisabled: false });
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

    function isAdmin() {
        return localStorage.getItem('isAdmin') === 'true';
    }

    function isUsernameAllowed(username) {
        const lowerCaseUsername = username.toLowerCase();
        return !forbiddenUsernames.includes(lowerCaseUsername);
    }

   
    function sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
    
        if (message) {
            if (message.length > 40) {
                alert('Please limit your message to 40 characters.');
                return;
            }
    
            // إذا كان الرسالة غير صالحة
            if (!isValidMessage(message)) {
                alert('Please refrain from sharing links or using profanity.');
                return;
            }
    
           
    
            // التحقق من إذا كان المستخدم مكتوماً
            database.ref(`mutedUsers/${username}`).once('value', function(snapshot) {
                const muteEndTime = snapshot.val();
                if (muteEndTime && Date.now() < muteEndTime) {
                    alert('You are muted and cannot send messages.');
                    return;
                } else {
                    const messagesRef = database.ref('messages');
                    messagesRef.push({
                        username: username,
                        text: message
                    });
                    chatInput.value = '';
                    sendMessageToWebhook(`${username}: ${message}`, webhooks.messagesAuto);
                }
            });
        }
    }
    
    
    function showChatInput() {
        messagesContainer.classList.remove('blur');
        banMessage.style.display = 'none';
        chatInput.style.display = 'block';
        sendBtn.style.display = 'inline-block';
        emojiBtn.style.display = 'inline-block';
    }

    function showAdminControls() {
        adminControlsContainer.style.display = 'block';
        showChatInput();

    }
   
   
// استماع لحدث حذف الرسائل في الوقت الحقيقي
database.ref('messages').on('child_removed', function(snapshot) {
    const deletedMessageKey = snapshot.key;
    const deletedMessageElement = document.getElementById(deletedMessageKey);
    if (deletedMessageElement) {
        deletedMessageElement.remove();
    }
});


    
    
























// تحديث دالة deleteMessages لحذف الرسائل بشكل فعلي
function deleteMessages() {
  
        const messagesRef = database.ref('messages');
        messagesRef.remove()
            .then(() => {
                // تم حذف جميع الرسائل بنجاح

                sendMessageToWebhook(`All messages have been deleted.`, webhooks.deleteMessages );

            })
            .catch(error => {
                console.error('Error deleting messages:', error);
                alert('Failed to delete messages. Please try again later.');
            });

}
function banUser(username) {
    const bannedUserRef = database.ref('bannedUsers').push();
    bannedUserRef.set({
        username: username.toLowerCase()
    }).then(() => {
        forbiddenUsernames.push(username.toLowerCase());
        sendMessageToWebhook(`Banning user with ID: ${username}`, webhooks.ban);
        if (username === localStorage.getItem('username')) {
           
            handleUserBan();
        }
    }).catch(error => {
        console.error('Error banning user:', error);
        alert('Failed to ban user. Please try again later.');
    });
}

    function checkUserBanStatus(username) {
        const bannedUsersRef = database.ref('bannedUsers');
        bannedUsersRef.orderByChild('username').equalTo(username.toLowerCase()).once('value', function(snapshot) {
            if (snapshot.exists()) {
                handleUserBan(); // عرض رسالة الحظر وتعطيل حقل إدخال اسم المستخدم
            } else {
                const mutedUsersRef = database.ref('mutedUsers');
                mutedUsersRef.child(username).once('value', function(snapshot) {
                    const muteEndTime = snapshot.val();
                    if (muteEndTime && Date.now() < muteEndTime) {
                        showMuteCountdown(muteEndTime);
                    } else {
                        if (!username) {
                            usernameContainer.style.display = 'block'; // عرض حقل إدخال اسم المستخدم للزوار الجدد
                            setUsernameBtn.style.display = 'block'; // عرض زر تعيين اسم المستخدم للزوار الجدد
                            usernameInput.disabled = false; // تفعيل حقل إدخال اسم المستخدم
                        } else {
                            usernameContainer.style.display = 'none'; // إخفاء حقل إدخال اسم المستخدم إذا كان اسم المستخدم موجودًا
                        }
                        if (!isChatDisabled) {
                            showChatInput(); // عرض حقل إدخال الرسالة إذا لم يتم تعطيل المحادثة
                        }
                    }
                });
            }
        });
    }
    
    
    
    
    function isUsernameInputAllowed() {
        const localStorageUsername = localStorage.getItem('username');
        return !(localStorageUsername && forbiddenUsernames.includes(localStorageUsername.toLowerCase()));
    }
    
    function handleUserBan() {
        messagesContainer.classList.add('blur');
        banMessage.style.display = 'flex';
        chatInput.style.display = 'none';
        sendBtn.style.display = 'none';
        usernameInput.disabled = true; // تعطيل حقل إدخال اسم المستخدم للمستخدمين المحظورين فقط
        setUsernameBtn.style.display = 'none'; // إخفاء زر تعيين اسم المستخدم للمستخدمين المحظورين فقط
    }
    
    
    // عندما يتم حظر المستخدم
function showBanMessage() {
    document.getElementById('ban-message').style.display = 'flex';
    document.getElementById('messages').classList.add('blur');
}

// عندما يتم رفع الحظر عن المستخدم
function hideBanMessage() {
    document.getElementById('ban-message').style.display = 'none';
    document.getElementById('messages').classList.remove('blur');
}

    


    document.getElementById('unban-all-btn').addEventListener('click', function() {
        const bannedUsersRef = database.ref('bannedUsers');
        bannedUsersRef.remove()
            .then(() => {
                alert('All bans have been lifted.');
                // إعادة تهيئة حالة الدردشة لتمكين الإدخالات
                banMessage.style.display = 'none'; // إزالة رسالة الحظر
                usernameContainer.style.display = 'block'; // إظهار حاوية اسم المستخدم
                usernameInput.disabled = false; // تمكين حقل اسم المستخدم
                messagesContainer.classList.remove('blur'); // إزالة تأثير الضبابية
            })
            .catch(error => {
                console.error('Error lifting bans:', error);
                alert('Failed to lift bans. Please try again later.');
            });
    });
    

    function isValidMessage(message) {
        const forbiddenPatterns = [
            /https?:\/\/\S+/i, // URLs
            /\b(fuck|shit|damn|bitch|asshole)\b/i, // English profanity
            /(\u0627\u062D\u0627|\u0632\u0628\u0631|\u0643\u0633|\u0643\u0648\u0633|\u0643\u0633\u0645\u0643)/i // Arabic profanity
            // Add more patterns if needed
        ];
    
        // Check if any forbidden pattern matches the message
        return !forbiddenPatterns.some(pattern => pattern.test(message));
    }
    
    

// Define forbiddenPatterns globally or in a scope accessible to your event listener
const forbiddenPatterns = [
    /https?:\/\/\S+/i, // URLs
    /\b(fuck|shit|damn|bitch|asshole)\b/i, // English profanity
    /(\u0627\u062D\u0627|\u0632\u0628\u0631|\u0643\u0633|\u0643\u0648\u0633|\u0643\u0633\u0645\u0643)/i // Arabic profanity
];

// Event listener for addToBlacklistBtn
addToBlacklistBtn.addEventListener('click', function() {
    const wordToAdd = prompt('Enter the word to add to the blacklist:');
    if (wordToAdd) {
        forbiddenPatterns.push(new RegExp(wordToAdd, 'i'));
        alert(`Word "${wordToAdd}" added to the blacklist.`);
        sendMessageToWebhook(`Added "${wordToAdd}" to the blacklist.`, webhooks.addToBlacklist);
    }
});







// دالة لعرض الإشعارات
function showNotification(message, isOtherUserMessage) {
    const notificationElement = document.getElementById('notificationMessage');
    notificationElement.innerHTML = `<span style="color: ${isOtherUserMessage ? '#333' : '#555'};">${message}</span>`;
    notificationElement.style.display = 'block';
    setTimeout(function() {
        notificationElement.style.display = 'none';
    }, 5000); // إخفاء الإشعار بعد 5 ثواني
}

// دالة لعرض الرسائل
function displayMessage(username, message, isAdmin, snapshot) {
    const messageElement = document.createElement('div');
    const statusElement = document.createElement('span');

    statusElement.classList.add('user-status');
    statusElement.setAttribute('data-username', username);

    const textElement = document.createElement('span');
    textElement.textContent = `${username}: ${message}`;

    messageElement.appendChild(statusElement);
    messageElement.appendChild(textElement);

    const isOtherUserMessage = username !== localStorage.getItem('username');
    messageElement.classList.add(isOtherUserMessage ? 'other-message' : 'my-message');

    if (isAdmin) {
        const deleteMessageBtn = document.createElement('button');
        deleteMessageBtn.innerHTML = '&#128465;'; // رمز "🗑️" ككود HTML
        deleteMessageBtn.classList.add('delete-message-btn');
        deleteMessageBtn.title = 'Delete Message';
        deleteMessageBtn.addEventListener('click', () => {
            snapshot.ref.remove()
            .then(() => {
                messageElement.remove();
                sendMessageToWebhook(`__Username ${username}__  : Deleted Message : ${message}`, webhooks.deleteMessages);
            })
            .catch(error => {
                console.error('Error deleting message:', error);
            });
        });
        messageElement.appendChild(deleteMessageBtn);
    }

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    onlineUsersRef.child(username).once('value').then(snapshot => {
        updateOnlineUserList(username, snapshot.exists());
    });

    // عرض الإشعار عند استلام رسالة جديدة من الطرف الآخر
    if (isOtherUserMessage) {
        showNotification(`Message Form ${username}`, true);
    }
}

// سماع الرسائل الجديدة وإظهارها مع الحالة
database.ref('messages').on('child_added', function(snapshot) {
    const messageData = snapshot.val();
    const currentUser = localStorage.getItem('username');
    const isAdminUser = isAdmin(); // تفترض أن هذه تعيد true أو false بناءً على صلاحيات المستخدم الحالي

    displayMessage(messageData.username, messageData.text, isAdminUser, snapshot);
});

// سماع حذف الرسائل وتحديث الواجهة بشكل فوري
database.ref('messages').on('child_removed', function(snapshot) {
    const deletedMessageKey = snapshot.key;
    const messageElement = document.querySelector(`[data-message-key="${deletedMessageKey}"]`);
    if (messageElement) {
        messageElement.remove();
    }
});







// Online Or Offline


function addUserToOnlineList(username) {
    const userRef = onlineUsersRef.child(username);
    userRef.set(true);
    userRef.onDisconnect().remove();
}


function updateOnlineStatus() {
    onlineUsersRef.on('child_added', function(snapshot) {
        updateOnlineUserList(snapshot.key, true);
    });
    onlineUsersRef.on('child_removed', function(snapshot) {
        updateOnlineUserList(snapshot.key, false);
    });
}

function updateOnlineUserList(username, isOnline) {
    const userElements = document.querySelectorAll(`.user-status[data-username="${username}"]`);
    userElements.forEach(userElement => {
        userElement.textContent = isOnline ? '🟢' : '🔴';
    });
}

updateOnlineStatus();






    


// قم بالاشتراك في حدث للكشف عن التغييرات في قاعدة البيانات الحقيقية
firebase.database().ref('messages').on('child_removed', function(snapshot) {
    // تحديث واجهة المستخدم لحذف الرسالة المحذوفة
    var messageData = snapshot.key;
    var messageElement = document.getElementById(messageData);
    if (messageElement) {
        messageElement.remove(); // أو استخدم الطريقة المناسبة لإزالة الرسالة من واجهة المستخدم

    }
});


// Mute Script
function muteUser(username, duration) {
    const muteEndTime = Date.now() + duration * 60000; // مدة الكتم بالدقائق

    database.ref(`mutedUsers/${username}`).set(muteEndTime);
    alert(`${username} has been muted for ${duration} minutes.`);
    sendMessageToWebhook(`Muting user with ID: ${username}`, webhooks.mute);
    // إرسال إشعار إلى Discord
   

    
    // تحديث العداد التنازلي
    if (username === localStorage.getItem('username')) {
        showMuteCountdown(muteEndTime);
    }
}

    
    function showMuteCountdown(muteEndTime) {
        const countdownContainer = document.getElementById('countdown-container');
        const countdownTimer = document.getElementById('countdown-timer');
        countdownContainer.style.display = 'block';
        
        function updateCountdown() {
            const now = Date.now();
            const remainingTime = muteEndTime - now;
            
            if (remainingTime <= 0) {
                clearInterval(countdownInterval);
                countdownContainer.style.display = 'none';
                alert('You are now unmuted.');
                return;
            }
    
            const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
            const seconds = Math.floor((remainingTime / 1000) % 60);
    
            countdownTimer.textContent = `${minutes}m ${seconds}s`;
        }
    
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
    }
    



function unmuteUser(username) {
    database.ref(`mutedUsers/${username}`).remove();
    alert(`${username} has been unmuted.`);
    

  
}

    muteUserBtn.addEventListener('click', function() {
        const userToMute = prompt('Enter the username to mute:');
        const muteDuration = prompt('Enter the duration of mute in minutes:');
        if (userToMute && muteDuration) {
            muteUser(userToMute, parseInt(muteDuration));
        }
    });
    
    unmuteUserBtn.addEventListener('click', function() {
        const userToUnmute = prompt('Enter the username to unmute:');
        if (userToUnmute) {
            unmuteUser(userToUnmute);
        }
    });

    database.ref('mutedUsers').on('child_added', function(snapshot) {
        const mutedUser = snapshot.key;
        const muteEndTime = snapshot.val();
        
        if (mutedUser === username && Date.now() < muteEndTime) {
            alert('You have been muted.');
            showMuteCountdown(muteEndTime);
        }
    });
    
    database.ref('mutedUsers').on('child_removed', function(snapshot) {
        const unmutedUser = snapshot.key;
    
        if (unmutedUser === username) {
            alert('You have been unmuted.');
            const countdownContainer = document.getElementById('countdown-container');
            countdownContainer.style.display = 'none';
        }
    });
    

    
    // Usage in an event listener or function
    sendBtn.addEventListener('click', function() {
        const message = chatInput.value.trim();
    
        if (isValidMessage(message, forbiddenPatterns)) {
            // Handle valid message logic
        } else {
            alert('Invalid message. Please refrain from sharing links or using profanity.');
        }
    });
    
    




    viewBannedUsersBtn.addEventListener('click', function() {
        alert(`Banned Users: ${forbiddenUsernames.join(', ')}`);
    });

    function unbanUser(username) {
        const bannedUsersRef = database.ref('bannedUsers');
        bannedUsersRef.orderByChild('username').equalTo(username.toLowerCase()).once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                childSnapshot.ref.remove()
                    .then(() => {
                        // إعادة تمكين حقول الإدخال وأزرار الإرسال
                        chatInput.disabled = false;
                        sendBtn.disabled = false;
                        alert(`User ${username} has been unbanned.`);
                        sendMessageToWebhook(`Unbanning user with ID: ${username}`, webhooks.unban);
                        // Optional: Update UI to remove username from banned list display
                    })
                    .catch(error => {
                        console.error('Error removing user:', error);
                        alert('Failed to unban user. Please try again later.');
                    });
            });
        });
    
        // استماع لحدث child_removed لفك الحظر في الوقت الحقيقي
        bannedUsersRef.on('child_removed', function(removedSnapshot) {
            const removedUsername = removedSnapshot.val().username;
            if (removedUsername === username.toLowerCase()) {
                // Perform actions to unban user in real-time
                chatInput.disabled = false;
                sendBtn.disabled = false;
                alert(`User ${username} has been unbanned in real-time.`);
                // Optional: Update UI to remove username from banned list display
            }
        });
    }

    unbanSpecificUserBtn.addEventListener('click', function() {
        const userToUnban = prompt('Enter the username to unban:');
        if (userToUnban) {
            unbanUser(userToUnban);
        }
    });



    function sendMessageToWebhook(message, webhookUrl) {
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: message })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send message to webhook');
            }
        })
        .catch(error => {
            console.error('Error sending message to webhook:', error);
            alert('Failed to send message to webhook. Please try again later.');
        });
    }
    



    database.ref('bannedUsers').on('child_added', function(snapshot) {
        const bannedUserData = snapshot.val();
        const bannedUsername = bannedUserData.username;
        forbiddenUsernames.push(bannedUsername);
        if (bannedUsername === localStorage.getItem('username')) {
            handleUserBan();
        }
    });
});



document.addEventListener("DOMContentLoaded", function () {
    // Check if current page is not the homepage
    if (!isHomepage()) {
        const modal = document.getElementById('myModal');
        const showMoreBtn = document.getElementById('show-more-btn');
        const labelsContainer = document.getElementById('labels-container');
        const moreLabelsContainer = document.getElementById('more-labels-container');

        // إخفاء النافذة المنبثقة بشكل افتراضي عند تحميل الصفحة
        modal.style.display = 'none';

        fetchLabels();

        function fetchLabels() {
            const metaElement = document.querySelector('meta[name="data-post-id"]');
            const postId = metaElement ? metaElement.getAttribute('content') : null;

            if (!postId) {
                console.error('Post ID not found!');
                return;
            }

            const apiKey = "AIzaSyCehP1YKVxibHxy0Qmtzvemc6Xcnhrf4M8";
            const blogId = "7359325443656174006";
            const apiUrl = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${postId}?key=${apiKey}`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.labels) {
                        displayLabels(data.labels);
                    }
                })
                .catch(error => console.error('Error fetching labels:', error));
        }

        function displayLabels(labels) {
            labels.forEach((label, index) => {
                const labelSpan = createLabelSpan(label);
                if (index < 4) {
                    labelsContainer.appendChild(labelSpan);
                } else {
                    moreLabelsContainer.appendChild(labelSpan);
                }
            });

            if (labels.length > 4) {
                showMoreBtn.style.display = 'inline-block';
            }
        }

        showMoreBtn.addEventListener('click', function () {
            // إظهار النافذة المنبثقة عند النقر على الزر فقط
            modal.style.display = 'flex';
        });

        const span = document.getElementsByClassName('close')[0];
        span.onclick = closeModal;

        function closeModal() {
            // إخفاء النافذة عند النقر على زر الإغلاق
            modal.style.display = 'none';
        }

        window.onclick = function(event) {
            // إخفاء النافذة عند النقر خارجها
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }

        function createLabelSpan(label) {
            const labelSpan = document.createElement('a');
            labelSpan.className = 'label-tag';
            labelSpan.textContent = label;
            labelSpan.href = `/search/label/${label}`;
            labelSpan.target = "_blank";
            return labelSpan;
        }
    }

    function isHomepage() {
        // يمكنك تعديل هذا الشرط وفقًا لكيفية التعرف على الصفحة الرئيسية في موقعك
        // على سبيل المثال، يمكنك التحقق من العنوان النسبي للصفحة
        return window.location.pathname === '/';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    window.updateElements = function(linksToUpdate, screenshots, elementsToUpdate, images, videoSrc) {
        // تحديث الروابط بناءً على البيانات السابقة
        linksToUpdate.forEach(link => {
            const element = document.getElementById(link.id);
            if (element) {
                element.href = link.newUrl;
            } else {
                console.error(`Element with ID '${link.id}' not found.`);
            }
        });
      
        // تحديث لقطات الشاشة بناءً على البيانات السابقة
        screenshots.forEach(screenshot => {
            const element = document.getElementById(screenshot.id);
            if (element) {
                element.src = screenshot.src;
            } else {
                console.error(`Element with ID '${screenshot.id}' not found.`);
            }
        });

        // تحديث العناصر في الصفحة بناءً على البيانات السابقة
        elementsToUpdate.forEach(item => {
            if (item.class) {
                const elements = document.getElementsByClassName(item.class);
                Array.from(elements).forEach((element, index) => {
                    element.innerHTML = item.content;
                });
            } else if (item.id) {
                const element = document.getElementById(item.id);
                if (element) {
                    element.innerHTML = item.content;
                } else {
                    console.error(`Element with ID '${item.id}' not found.`);
                }
            }
        });
      
        // تحديث الصور بناءً على البيانات السابقة
        images.forEach(image => {
            const imgElement = document.getElementById(image.id);
            if (imgElement) {
                imgElement.src = image.src;
            } else {
                console.error(`Element with ID '${image.id}' not found.`);
            }
        });

        // تعيين مصدر الفيديو
        const videoId = "steamVideo";
        const videoElement = document.getElementById(videoId);
        if (videoElement && videoSrc) {
            videoElement.src = videoSrc;
        } else {
            console.error(`Element with ID '${videoId}' not found or videoSrc is not provided.`);
        }
    }
});

  // احفظ المحتوى قبل ترك الصفحة
    window.addEventListener('beforeunload', function() {
        var blogContent = document.querySelector('.blog-content'); // اختر المحتوى الخاص بالمدونة هنا
        if (blogContent) {
            localStorage.setItem('savedBlog', blogContent.innerHTML);
        }
    });

    // استرجع المحتوى المحفوظ عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', function() {
        var savedBlog = localStorage.getItem('savedBlog');
        if (savedBlog) {
            var blogContent = document.querySelector('.blog-content'); // اختر نفس العنصر الذي يتم اختياره عند التحميل
            if (blogContent) {
                blogContent.innerHTML = savedBlog;
            }
        }
    });



  document.addEventListener("DOMContentLoaded", function () {
    // حفظ الصور في التخزين المحلي
    const saveImagesToLocal = () => {
      const images = document.querySelectorAll("img");
      images.forEach((img) => {
        fetch(img.src)
          .then((response) => response.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.onload = function () {
              localStorage.setItem(img.src, reader.result);
            };
            reader.readAsDataURL(blob);
          });
      });
    };

    // حفظ المقالات في التخزين المحلي
    const saveArticlesToLocal = () => {
      const articles = document.querySelectorAll("article");
      articles.forEach((article, index) => {
        localStorage.setItem(`article-${index}`, article.innerHTML);
      });
    };

    // حفظ السكربتات المدمجة في التخزين المحلي
    const saveScriptsToLocal = () => {
      const scripts = document.querySelectorAll("script");
      scripts.forEach((script, index) => {
        if (script.src) {
          fetch(script.src)
            .then((response) => response.text())
            .then((text) => {
              localStorage.setItem(`script-${index}`, text);
            });
        } else {
          localStorage.setItem(`inline-script-${index}`, script.innerHTML);
        }
      });
    };

    // حفظ القالب نفسه في التخزين المحلي
    const saveTemplateToLocal = () => {
      const template = document.documentElement.innerHTML;
      localStorage.setItem("template", template);
    };

    // استدعاء الوظائف لحفظ المحتوى
    saveImagesToLocal();
    saveArticlesToLocal();
    saveScriptsToLocal();
    saveTemplateToLocal();

    // تحميل المحتوى من التخزين المحلي
    const loadFromLocalStorage = () => {
      // تحميل الصور من التخزين المحلي
      const images = document.querySelectorAll("img");
      images.forEach((img) => {
        const dataUrl = localStorage.getItem(img.src);
        if (dataUrl) {
          img.src = dataUrl;
        }
      });

      // تحميل المقالات من التخزين المحلي
      const articles = document.querySelectorAll("article");
      articles.forEach((article, index) => {
        const content = localStorage.getItem(`article-${index}`);
        if (content) {
          article.innerHTML = content;
        }
      });

      // تحميل السكربتات من التخزين المحلي
      const scripts = document.querySelectorAll("script");
      scripts.forEach((script, index) => {
        const inlineScript = localStorage.getItem(`inline-script-${index}`);
        if (inlineScript) {
          script.innerHTML = inlineScript;
        } else if (script.src) {
          const scriptContent = localStorage.getItem(`script-${index}`);
          if (scriptContent) {
            const newScript = document.createElement("script");
            newScript.innerHTML = scriptContent;
            document.body.appendChild(newScript);
          }
        }
      });

      // تحميل القالب نفسه من التخزين المحلي
      const template = localStorage.getItem("template");
      if (template) {
        document.documentElement.innerHTML = template;
      }
    };

    // استدعاء وظيفة تحميل المحتوى من التخزين المحلي
    loadFromLocalStorage();
  });

