let selectedLanguage = null;
let currentState = 'language';
let currentOrderId = null;

const menuOptions = {
    english: [
        "Track my order",
        "Return/Refund",
        "Product information",
        "Payment issues",
        "Account settings",
        "Other issues",
        "Other Questions / FAQs"
    ],
    hindi: [
        "मेरा ऑर्डर ट्रैक करें",
        "वापसी/धनवापसी",
        "उत्पाद की जानकारी",
        "भुगतान संबंधी समस्याएं",
        "खाता सेटिंग्स",
        "अन्य समस्याएं",
        "अन्य प्रश्न / सामान्य प्रश्न"
    ]
};

const responses = {
    english: {
        welcome: "Welcome to our E-commerce Store! Please select your preferred language:",
        menu: "How can I help you today? Please select an option:",
        trackOrder: "Please provide your order ID to track your order.",
        orderFound: "Your order #ORDER_ID# is currently in transit. Expected delivery date: #DATE#",
        orderNotFound: "I couldn't find order #ORDER_ID#. Please verify the order ID or <a href='/support/tracking' class='support-link'>contact support</a>.",
        returnRefund: "For returns and refunds, please <a href='/support/returns' class='support-link'>visit our support page</a> or create a <a href='/support/ticket' class='support-link'>support ticket</a>. Our team will assist you with the process.",
        productInfo: "What product would you like to know more about?",
        paymentIssues: "For payment-related issues, please <a href='/support/payments' class='support-link'>contact our support team</a>.",
        accountSettings: "For account settings, please <a href='/account/settings' class='support-link'>visit your account page</a>.",
        otherIssues: "For other issues, please <a href='/support' class='support-link'>visit our support page</a> or create a <a href='/support/ticket' class='support-link'>support ticket</a>."
    },
    hindi: {
        welcome: "हमारे ई-कॉमर्स स्टोर में आपका स्वागत है! कृपया अपनी पसंदीदा भाषा चुनें:",
        menu: "मैं आपकी कैसे मदद कर सकता हूं? कृपया एक विकल्प चुनें:",
        trackOrder: "कृपया अपना ऑर्डर आईडी प्रदान करें।",
        orderFound: "आपका ऑर्डर #ORDER_ID# वर्तमान में ट्रांजिट में है। अपेक्षित डिलीवरी तिथि: #DATE#",
        orderNotFound: "मुझे ऑर्डर #ORDER_ID# नहीं मिला। कृपया ऑर्डर आईडी सत्यापित करें या <a href='/support/tracking' class='support-link'>सपोर्ट से संपर्क करें</a>।",
        returnRefund: "वापसी और धनवापसी के लिए, कृपया <a href='/support/returns' class='support-link'>हमारे सपोर्ट पेज पर जाएं</a> या <a href='/support/ticket' class='support-link'>सपोर्ट टिकट बनाएं</a>। हमारी टीम आपकी सहायता करेगी।",
        productInfo: "आप किस उत्पाद के बारे में अधिक जानना चाहते हैं?",
        paymentIssues: "भुगतान संबंधी समस्याओं के लिए, कृपया <a href='/support/payments' class='support-link'>हमारी सपोर्ट टीम से संपर्क करें</a>।",
        accountSettings: "खाता सेटिंग्स के लिए, कृपया <a href='/account/settings' class='support-link'>अपने खाता पेज पर जाएं</a>।",
        otherIssues: "अन्य समस्याओं के लिए, कृपया <a href='/support' class='support-link'>हमारे सपोर्ट पेज पर जाएं</a> या <a href='/support/ticket' class='support-link'>सपोर्ट टिकट बनाएं</a>।"
    }
};

// Chatbot state
let isChatOpen = false;

// Language options
const languages = {
    'english': 'English',
    'hindi': 'हिंदी'
};

// Greetings in different languages
const greetings = {
    english: {
        patterns: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'],
        responses: [
            "Hello! How can I help you today?",
            "Hi there! How may I assist you?",
            "Hey! What can I do for you?",
            "Good day! How can I help you?",
            "Hello! I'm here to help. What do you need?"
        ]
    },
    hindi: {
        patterns: ['नमस्ते', 'नमस्कार', 'हैलो', 'हाय', 'शुभ प्रभात', 'शुभ दोपहर', 'शुभ संध्या'],
        responses: [
            "नमस्ते! मैं आपकी कैसे मदद कर सकता हूं?",
            "हैलो! मैं आपकी क्या सहायता कर सकता हूं?",
            "नमस्कार! मैं आपके लिए क्या कर सकता हूं?",
            "शुभ दिन! मैं आपकी कैसे मदद कर सकता हूं?",
            "नमस्ते! मैं आपकी सहायता के लिए यहां हूं। आपको क्या चाहिए?"
        ]
    }
};

// FAQ database
const faqs = {
    english: {
        'shipping': {
            question: 'What are your shipping options?',
            answer: 'We offer standard shipping (3-5 business days) and express shipping (1-2 business days).'
        },
        'returns': {
            question: 'What is your return policy?',
            answer: 'You can return items within 30 days of purchase. Items must be unused and in original packaging. For return assistance, please <a href="/support/returns" class="support-link">click here</a>.'
        },
        'payment': {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards, PayPal, and bank transfers.'
        },
        'tracking': {
            question: 'How can I track my order?',
            answer: 'Once your order is shipped, you will receive a tracking number via email. You can also track your order using the order ID.'
        },
        'warranty': {
            question: 'What is your warranty policy?',
            answer: 'All products come with a 1-year manufacturer warranty. For warranty claims, please <a href="/support/warranty" class="support-link">contact our support team</a>.'
        },
        'refund': {
            question: 'How long does it take to process a refund?',
            answer: 'Refunds are typically processed within 5-7 business days after we receive the returned item. For refund status, please <a href="/support/refunds" class="support-link">check here</a>.'
        }
    },
    hindi: {
        'shipping': {
            question: 'आपके शिपिंग विकल्प क्या हैं?',
            answer: 'हम स्टैंडर्ड शिपिंग (3-5 व्यावसायिक दिन) और एक्सप्रेस शिपिंग (1-2 व्यावसायिक दिन) प्रदान करते हैं।'
        },
        'returns': {
            question: 'आपकी वापसी नीति क्या है?',
            answer: 'आप खरीद के 30 दिनों के भीतर आइटम वापस कर सकते हैं। आइटम अप्रयुक्त और मूल पैकेजिंग में होने चाहिए। वापसी सहायता के लिए, कृपया <a href="/support/returns" class="support-link">यहां क्लिक करें</a>।'
        },
        'payment': {
            question: 'आप कौन से भुगतान तरीके स्वीकार करते हैं?',
            answer: 'हम सभी प्रमुख क्रेडिट कार्ड, पेपैल और बैंक ट्रांसफर स्वीकार करते हैं।'
        },
        'tracking': {
            question: 'मैं अपना ऑर्डर कैसे ट्रैक कर सकता हूं?',
            answer: 'एक बार जब आपका ऑर्डर शिप हो जाता है, तो आपको ईमेल के माध्यम से ट्रैकिंग नंबर प्राप्त होगा। आप ऑर्डर आईडी का उपयोग करके भी अपना ऑर्डर ट्रैक कर सकते हैं।'
        },
        'warranty': {
            question: 'आपकी वारंटी नीति क्या है?',
            answer: 'सभी उत्पादों पर 1 वर्ष की निर्माता वारंटी आती है। वारंटी दावों के लिए, कृपया <a href="/support/warranty" class="support-link">हमारी सपोर्ट टीम से संपर्क करें</a>।'
        },
        'refund': {
            question: 'रिफंड प्रोसेस करने में कितना समय लगता है?',
            answer: 'रिफंड आमतौर पर हमें वापस किए गए आइटम प्राप्त होने के 5-7 व्यावसायिक दिनों के भीतर प्रोसेस किया जाता है। रिफंड स्थिति के लिए, कृपया <a href="/support/refunds" class="support-link">यहां जांचें</a>।'
        }
    }
};

// Initialize chat
document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chatContainer');
    const floatingIcon = document.getElementById('floatingChatIcon');
    
    // Hide chat by default
    chatContainer.classList.remove('active');
    
    // Toggle chat on icon click
    floatingIcon.addEventListener('click', () => {
        isChatOpen = !isChatOpen;
        chatContainer.classList.toggle('active', isChatOpen);
        if (isChatOpen) {
            showLanguageMenu();
        }
    });
});

// Show language selection menu with typing indicator
function showLanguageMenu() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        addMessage(responses.english.welcome, 'bot');
        const languageMenu = document.createElement('div');
        languageMenu.className = 'menu-options';
        for (const [code, name] of Object.entries(languages)) {
            const option = document.createElement('div');
            option.className = 'menu-option';
            option.textContent = name;
            option.onclick = () => selectLanguage(code);
            languageMenu.appendChild(option);
        }
        chatMessages.appendChild(languageMenu);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// Select language and show main menu with typing indicator
function selectLanguage(lang) {
    selectedLanguage = lang;
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        addMessage(responses[lang].menu, 'bot');
        showMainMenu();
    }, 1000);
}

// Show main menu with typing indicator
function showMainMenu() {
    const chatMessages = document.getElementById('chatMessages');
    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        const menuDiv = document.createElement('div');
        menuDiv.className = 'menu-options';
        menuOptions[selectedLanguage].forEach((option, index) => {
            const menuOption = document.createElement('div');
            menuOption.className = 'menu-option';
            menuOption.textContent = option;
            menuOption.onclick = () => handleMenuSelection(index);
            menuDiv.appendChild(menuOption);
        });
        chatMessages.appendChild(menuDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// Handle menu selection
function handleMenuSelection(index) {
    const options = [
        'trackOrder',
        'returnRefund',
        'productInfo',
        'paymentIssues',
        'accountSettings',
        'otherIssues',
        'faqs'
    ];
    
    const selectedOption = options[index];
    if (selectedOption === 'faqs') {
        showFaqMenu();
        return;
    }
    const response = responses[selectedLanguage][selectedOption];
    addMessage(response, 'bot');
    currentState = selectedOption;
}

// Show FAQ menu with typing indicator
function showFaqMenu() {
    const chatMessages = document.getElementById('chatMessages');
    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        const menuDiv = document.createElement('div');
        menuDiv.className = 'menu-options';
        const faqIntro = selectedLanguage === 'english'
            ? 'Please select a question from our FAQs:'
            : 'कृपया हमारे सामान्य प्रश्नों में से एक चुनें:';
        addMessage(faqIntro, 'bot');
        Object.entries(faqs[selectedLanguage]).forEach(([key, faq]) => {
            const menuOption = document.createElement('div');
            menuOption.className = 'menu-option';
            menuOption.textContent = faq.question;
            menuOption.onclick = () => handleFaqSelection(key);
            menuDiv.appendChild(menuOption);
        });
        chatMessages.appendChild(menuDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        currentState = 'faqs';
    }, 1000);
}

// Handle FAQ selection with typing indicator
function handleFaqSelection(key) {
    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        const answer = faqs[selectedLanguage][key].answer;
        addMessage(answer, 'bot');
        setTimeout(() => {
            showMainMenu();
        }, 1500);
    }, 1000);
}

// Close chat
function closeChat() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.classList.remove('active');
    isChatOpen = false;
    selectedLanguage = null;
    currentState = 'language';
}

// Show typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        typingDiv.appendChild(dot);
    }
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Send message
function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (message) {
        // Add user message
        addMessage(message, 'user');
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process message and get response
        setTimeout(() => {
            removeTypingIndicator();
            const response = processMessage(message);
            addMessage(response, 'bot');
        }, 1500);
        
        // Clear input
        input.value = '';
    }
}

// Add message to chat
function addMessage(content, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = content;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Process user message and generate response
function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Handle greetings
    if (selectedLanguage && greetings[selectedLanguage]) {
        const greetingPatterns = greetings[selectedLanguage].patterns;
        const isGreeting = greetingPatterns.some(pattern => lowerMessage.includes(pattern));
        if (isGreeting) {
            const responses = greetings[selectedLanguage].responses;
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
    
    // Handle order tracking
    if (currentState === 'trackOrder') {
        currentOrderId = message.trim();
        // Simulate order lookup
        const orderFound = Math.random() > 0.3; // 70% chance of finding the order
        if (orderFound) {
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 3);
            return responses[selectedLanguage].orderFound
                .replace('#ORDER_ID#', currentOrderId)
                .replace('#DATE#', deliveryDate.toLocaleDateString());
        } else {
            return responses[selectedLanguage].orderNotFound.replace('#ORDER_ID#', currentOrderId);
        }
    }
    
    // Check for FAQ matches
    for (const [key, faq] of Object.entries(faqs[selectedLanguage])) {
        if (lowerMessage.includes(key)) {
            return faq.answer;
        }
    }
    
    // Handle specific menu options
    if (currentState === 'returnRefund') {
        return responses[selectedLanguage].returnRefund;
    }
    
    if (currentState === 'paymentIssues') {
        return responses[selectedLanguage].paymentIssues;
    }
    
    if (currentState === 'accountSettings') {
        return responses[selectedLanguage].accountSettings;
    }
    
    if (currentState === 'otherIssues') {
        return responses[selectedLanguage].otherIssues;
    }
    
    // Default response
    return "I'm not sure I understand. Could you please rephrase your question? If you need help, you can visit our support page or create a support ticket.<a href='/support' class='support-link'>visit our support page</a> or create a <a href='/support/ticket' class='support-link'>support ticket</a>.";
}

// Handle Enter key press
document.getElementById('userInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
}); 