// Global Variables
let totalScore = 0;
let currentGame = null;
let currentQuestionIndex = 0;
let currentGameQuestions = [];

// DOM Elements
const totalScoreElement = document.getElementById('totalScore');
const gameModal = document.getElementById('gameModal');
const storyModal = document.getElementById('storyModal');

// ============ TAB SWITCHING ============
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(tabName).classList.add('active');
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// ============ GAMES SECTION ============
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
        const gameType = card.getAttribute('data-game');
        startGame(gameType);
    });
});

function startGame(gameType) {
    currentQuestionIndex = 0;
    
    if (gameType === 'alphabet') {
        currentGameQuestions = [
            { q: "Which letter is 'A'?", correct: "A", options: ["A", "B", "C", "D"] },
            { q: "Which letter is 'B'?", correct: "B", options: ["A", "B", "C", "D"] },
            { q: "Which letter is 'C'?", correct: "C", options: ["A", "B", "C", "D"] },
            { q: "Which letter is 'D'?", correct: "D", options: ["A", "B", "C", "D"] },
            { q: "Which letter starts 'Apple'?", correct: "A", options: ["A", "B", "C", "D"] }
        ];
    } else if (gameType === 'word') {
        currentGameQuestions = [
            { q: "C + A + T = ?", correct: "CAT", options: ["DOG", "CAT", "RAT", "BAT"] },
            { q: "D + O + G = ?", correct: "DOG", options: ["CAT", "DOG", "FOG", "LOG"] },
            { q: "S + U + N = ?", correct: "SUN", options: ["FUN", "RUN", "SUN", "GUN"] },
            { q: "B + A + T = ?", correct: "BAT", options: ["CAT", "BAT", "HAT", "MAT"] }
        ];
    } else if (gameType === 'vocabulary') {
        currentGameQuestions = [
            { q: "🐕 Dog", correct: "DOG", options: ["CAT", "DOG", "COW", "PIG"] },
            { q: "🐈 Cat", correct: "CAT", options: ["DOG", "RAT", "CAT", "BAT"] },
            { q: "🐄 Cow", correct: "COW", options: ["COW", "HOW", "NOW", "BOW"] },
            { q: "☀️ Sun", correct: "SUN", options: ["RUN", "FUN", "SUN", "GUN"] }
        ];
    } else if (gameType === 'sentence') {
        currentGameQuestions = [
            { q: "Arrange: I / love / you", correct: "I love you", options: ["You love I", "I you love", "I love you", "Love I you"] },
            { q: "Arrange: is / a / cat / This", correct: "This is a cat", options: ["Cat a is this", "This is a cat", "A cat is this", "Is this a cat"] },
            { q: "Arrange: are / friends / We", correct: "We are friends", options: ["Friends we are", "We are friends", "Are we friends", "We friends are"] }
        ];
    }
    
    showGameQuestion();
    gameModal.style.display = 'flex';
}

function showGameQuestion() {
    if (currentQuestionIndex >= currentGameQuestions.length) {
        document.getElementById('gameContent').innerHTML = `
            <h2>🎉 Game Complete! 🎉</h2>
            <p style="font-size: 1.2rem; margin: 20px 0;">You did a great job learning!</p>
            <p>🏆 Keep playing and learning English! 🏆</p>
            <button class="check-btn" onclick="closeModal()">Close</button>
        `;
        return;
    }
    
    const q = currentGameQuestions[currentQuestionIndex];
    let optionsHtml = '';
    q.options.forEach(opt => {
        optionsHtml += `<div class="game-option" onclick="checkGameAnswer('${opt}')">${opt}</div>`;
    });
    
    document.getElementById('gameContent').innerHTML = `
        <h2>📚 Question ${currentQuestionIndex + 1}</h2>
        <div class="game-question">${q.q}</div>
        <div class="game-options">${optionsHtml}</div>
        <div id="gameFeedback" style="margin-top: 15px;"></div>
    `;
}

function checkGameAnswer(selected) {
    const correct = currentGameQuestions[currentQuestionIndex].correct;
    const feedback = document.getElementById('gameFeedback');
    
    if (selected.toUpperCase() === correct.toUpperCase()) {
        totalScore += 10;
        updateScore();
        feedback.innerHTML = '✅ Correct! +10 points! 🌟';
        feedback.style.color = 'green';
    } else {
        feedback.innerHTML = `❌ Oops! Correct answer is ${correct}. Keep trying! 💪`;
        feedback.style.color = 'red';
    }
    
    setTimeout(() => {
        currentQuestionIndex++;
        showGameQuestion();
    }, 1500);
}

// ============ SPEAKING SECTION ============
const words = ['Apple', 'Ball', 'Cat', 'Dog', 'Sun', 'Moon', 'Star', 'Bird', 'Fish', 'Car'];

function loadWords() {
    const wordsList = document.getElementById('wordsList');
    wordsList.innerHTML = '';
    words.forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word-item';
        wordDiv.textContent = word;
        wordDiv.onclick = () => speakWord(word);
        wordsList.appendChild(wordDiv);
    });
}

function speakWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
}

// Speech Recognition
const recordBtn = document.getElementById('recordBtn');
const speechResult = document.getElementById('speechResult');

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recordBtn.addEventListener('click', () => {
        speechResult.innerHTML = '🎤 Listening... Speak now!';
        recognition.start();
    });
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        speechResult.innerHTML = `You said: "${transcript}"<br>Great job speaking English! 🎉`;
        
        // Add points for speaking
        totalScore += 5;
        updateScore();
    };
    
    recognition.onerror = () => {
        speechResult.innerHTML = 'Please try again. Click and speak clearly!';
    };
} else {
    recordBtn.style.display = 'none';
    speechResult.innerHTML = 'Speech recognition not supported in this browser. Try Chrome!';
}

// Conversations
const conversations = [
    { eng: "Hello! How are you?", hin: "नमस्ते! आप कैसे हैं?" },
    { eng: "My name is ___", hin: "मेरा नाम ___ है" },
    { eng: "I am fine, thank you!", hin: "मैं ठीक हूँ, धन्यवाद!" },
    { eng: "What is your name?", hin: "आपका नाम क्या है?" }
];

function loadConversations() {
    const convList = document.getElementById('conversationList');
    convList.innerHTML = '';
    conversations.forEach(conv => {
        const convDiv = document.createElement('div');
        convDiv.className = 'conversation-item';
        convDiv.innerHTML = `<strong>${conv.eng}</strong><br><small>${conv.hin}</small>`;
        convDiv.onclick = () => speakWord(conv.eng);
        convList.appendChild(convDiv);
    });
}

// ============ STORIES SECTION ============
const stories = {
    cat: {
        title: "🐱 The Clever Cat",
        text: "Once there was a clever cat. The cat saw a mouse. The mouse was eating cheese. The cat said, 'Hello little mouse!' The mouse ran away. The cat laughed and said, 'I was just playing!' The mouse came back. They became good friends. The cat learned: kindness is better than chasing. 🐱❤️🐭",
        words: ["clever", "mouse", "cheese", "kindness", "friends"]
    },
    sun: {
        title: "☀️ The Happy Sun",
        text: "Every morning, the sun wakes up. The sun says, 'Good morning world!' The flowers smile. The birds sing. The children play outside. The sun shines bright and warm. Everyone is happy. The sun teaches us: always smile and spread happiness! 🌞",
        words: ["morning", "smile", "bright", "warm", "happy"]
    },
    friends: {
        title: "👫 Best Friends",
        text: "Tom and Jerry are best friends. They play together every day. They share their toys. When Tom is sad, Jerry makes him laugh. When Jerry needs help, Tom helps him. Best friends always care for each other. Be a good friend to everyone! 🤝",
        words: ["friends", "together", "share", "help", "care"]
    },
    rainbow: {
        title: "🌈 The Rainbow Colors",
        text: "After rain comes a beautiful rainbow. Red, orange, yellow, green, blue, indigo, violet. Seven colors in the sky! The rainbow makes everyone smile. Colors are everywhere. Look around and see all the beautiful colors! 🎨",
        words: ["red", "blue", "yellow", "green", "colors"]
    }
};

document.querySelectorAll('.story-card').forEach(card => {
    card.addEventListener('click', () => {
        const storyName = card.getAttribute('data-story');
        showStory(storyName);
    });
});

function showStory(storyName) {
    const story = stories[storyName];
    let wordsHtml = '';
    story.words.forEach(word => {
        wordsHtml += `<span style="background:#f0f0f0; padding:5px 12px; border-radius:20px; margin:5px; display:inline-block;">📖 ${word}</span>`;
    });
    
    document.getElementById('storyContent').innerHTML = `
        <h2>${story.title}</h2>
        <div style="margin: 20px 0; line-height: 1.8; font-size: 1.1rem;">${story.text}</div>
        <div style="margin-top: 20px;">
            <h4>📚 New Words Learned:</h4>
            <div style="margin-top: 10px;">${wordsHtml}</div>
        </div>
        <button class="check-btn" onclick="closeModal()" style="margin-top: 20px;">Close</button>
    `;
    storyModal.style.display = 'flex';
}

// ============ WRITING SECTION ============
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let currentLetterIndex = 0;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

function setupCanvas() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    });
    
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });
    
    // Touch support for mobile
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.touches[0].clientX - rect.left;
        lastY = e.touches[0].clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    });
    
    canvas.addEventListener('touchend', () => {
        isDrawing = false;
    });
    
    ctx.strokeStyle = '#f5576c';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
}

document.getElementById('clearCanvas')?.addEventListener('click', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('nextLetter')?.addEventListener('click', () => {
    currentLetterIndex = (currentLetterIndex + 1) % letters.length;
    document.getElementById('currentLetter').textContent = letters[currentLetterIndex];
    
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    totalScore += 5;
    updateScore();
});

// ============ HELPER FUNCTIONS ============
function updateScore() {
    totalScoreElement.textContent = totalScore;
}

function closeModal() {
    gameModal.style.display = 'none';
    storyModal.style.display = 'none';
}

// Close modal on outside click
window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// ============ INITIALIZE APP ============
function init() {
    loadWords();
    loadConversations();
    setupCanvas();
    updateScore();
}

init();
