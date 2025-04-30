let selectedLanguage = 'english';
let currentState = 'language';
let currentOrderId = null;

const menuOptions = [
    "Track my order",
    "Return/Refund",
    "Product information",
    "Payment issues",
    "Account settings",
    "Other issues",
    "Other Questions / FAQs"
];

const responses = {
    welcome: "Welcome to our E-commerce Store!",
    menu: "How can I help you today? Please select an option:",
    trackOrder: "Please provide your order ID to track your order.",
    orderFound: "Your order #ORDER_ID# is currently in transit. Expected delivery date: #DATE#",
    orderNotFound: "I couldn't find order #ORDER_ID#. Please verify the order ID or <a href='/support/tracking' class='support-link'>contact support</a>.",
    returnRefund: "For returns and refunds, please <a href='/support/returns' class='support-link'>visit our support page</a> or create a <a href='/support/ticket' class='support-link'>support ticket</a>. Our team will assist you with the process.",
    productInfo: "What product would you like to know more about?",
    paymentIssues: "For payment-related issues, please <a href='/support/payments' class='support-link'>contact our support team</a>.",
    accountSettings: "For account settings, please <a href='/account/settings' class='support-link'>visit your account page</a>.",
    otherIssues: "For other issues, please <a href='/support' class='support-link'>visit our support page</a> or create a <a href='/support/ticket' class='support-link'>support ticket</a>."
};

// Chatbot state
let isChatOpen = false;

// Greetings
const greetings = {
    patterns: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'],
    responses: [
        "Hello! How can I help you today?",
        "Hi there! How may I assist you?",
        "Hey! What can I do for you?",
        "Good day! How can I help you?",
        "Hello! I'm here to help. What do you need?"
    ]
};

// FAQ database
const faqs = {
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
            showWelcomeSequence();
        }
    });
});

// Show welcome sequence with typing indicator
function showWelcomeSequence() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    
    // Show welcome message
    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        addMessage(responses.welcome, 'bot');
        
        // Show greeting after welcome
        setTimeout(() => {
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addMessage(greetings.responses[0], 'bot');
                
                // Show main menu after greeting
                setTimeout(() => {
                    showMainMenu();
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}

// Show main menu with typing indicator
function showMainMenu() {
    const chatMessages = document.getElementById('chatMessages');
    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        addMessage(responses.menu, 'bot');
        const menuDiv = document.createElement('div');
        menuDiv.className = 'menu-options';
        menuOptions.forEach((option, index) => {
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
    const response = responses[selectedOption];
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
        addMessage('Please select a question from our FAQs:', 'bot');
        Object.entries(faqs).forEach(([key, faq]) => {
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
        const answer = faqs[key].answer;
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
    const isGreeting = greetings.patterns.some(pattern => lowerMessage.includes(pattern));
    if (isGreeting) {
        return greetings.responses[Math.floor(Math.random() * greetings.responses.length)];
    }
    
    // Handle order tracking
    if (currentState === 'trackOrder') {
        currentOrderId = message.trim();
        // Simulate order lookup
        const orderFound = Math.random() > 0.3; // 70% chance of finding the order
        if (orderFound) {
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 3);
            return responses.orderFound
                .replace('#ORDER_ID#', currentOrderId)
                .replace('#DATE#', deliveryDate.toLocaleDateString());
        } else {
            return responses.orderNotFound.replace('#ORDER_ID#', currentOrderId);
        }
    }
    
    // Check for FAQ matches
    for (const [key, faq] of Object.entries(faqs)) {
        if (lowerMessage.includes(key)) {
            return faq.answer;
        }
    }
    
    // Handle specific menu options
    if (currentState === 'returnRefund') {
        return responses.returnRefund;
    }
    
    if (currentState === 'paymentIssues') {
        return responses.paymentIssues;
    }
    
    if (currentState === 'accountSettings') {
        return responses.accountSettings;
    }
    
    if (currentState === 'otherIssues') {
        return responses.otherIssues;
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