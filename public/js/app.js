/**
 * Scaler Connect — Frontend Application
 *
 * Handles persona switching, chat rendering, CoT reasoning toggle,
 * suggestion chips, and communication with the backend API.
 */

// ─── DOM References ──────────────────────────────────────────────
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const personaBtns = document.querySelectorAll('.persona-btn');
const activePersonaName = document.getElementById('active-persona-name');
const typingIndicator = document.getElementById('typing-indicator');
const suggestionChipsContainer = document.getElementById('suggestion-chips');

// ─── Persona Metadata ───────────────────────────────────────────
const personaData = {
  anshuman: {
    name: 'Anshuman Singh',
    welcome: 'Hello! I am Anshuman, co-founder of Scaler. How can I help you today with your learning journey?',
    suggestions: [
      'How should I prepare for coding interviews?',
      'Is competitive programming necessary?',
      'What\'s the best way to learn system design?'
    ]
  },
  abhimanyu: {
    name: 'Abhimanyu Saxena',
    welcome: 'Hello! I am Abhimanyu Saxena, co-founder of Scaler. Ready to build something that solves real-world problems? Remember, consistency leads to quality.',
    suggestions: [
      'How to prepare for a coding interview?',
      'Measure twice, cut once meaning?',
      'Skills top tech companies value?'
    ]
  },
  kshitij: {
    name: 'Kshitij Mishra',
    welcome: 'Hello! I am Kshitij Mishra, Head of Instructors at Scaler. How can I help you today with your learning journey?',
    suggestions: [
      'Can you explain how merge sort works?',
      'I am stuck on a problem for hours...',
      'Abstraction vs Encapsulation?'
    ]
  }
};

// ─── State ───────────────────────────────────────────────────────
let currentPersona = 'anshuman';
let chatHistory = [];

// ─── Initialisation ──────────────────────────────────────────────
function init() {
  switchPersona('anshuman');
  
  personaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      personaBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      switchPersona(btn.dataset.persona);
    });
  });

  sendBtn.addEventListener('click', handleSend);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
}

// ─── Persona Switching ──────────────────────────────────────────
function switchPersona(personaKey) {
  currentPersona = personaKey;
  const personaInfo = personaData[personaKey];
  
  activePersonaName.textContent = `Currently chatting with ${personaInfo.name}`;
  
  // Reset chat
  chatBox.innerHTML = '';
  chatHistory = [];
  
  // Render suggestions
  renderSuggestions(personaInfo.suggestions);
  
  // Add welcome message
  addMessage(personaInfo.welcome, 'bot');
}

// ─── Suggestion Chips ───────────────────────────────────────────
function renderSuggestions(suggestions) {
  suggestionChipsContainer.innerHTML = '';
  suggestions.forEach(text => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.textContent = text;
    chip.addEventListener('click', () => {
      userInput.value = text;
      handleSend();
    });
    suggestionChipsContainer.appendChild(chip);
  });
}

// ─── CoT Parser ─────────────────────────────────────────────────
function parseBotMessage(text) {
  const thinkRegex = /<think>([\s\S]*?)<\/think>/;
  const match = text.match(thinkRegex);
  
  if (match) {
    const reasoning = match[1].trim();
    const finalAnswer = text.replace(match[0], '').trim();
    return { reasoning, finalAnswer };
  }
  
  return { reasoning: null, finalAnswer: text };
}

// ─── Message Rendering ──────────────────────────────────────────
function addMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  
  if (sender === 'bot') {
    const parsed = parseBotMessage(text);
    
    const answerNode = document.createElement('span');
    answerNode.textContent = parsed.finalAnswer;
    msgDiv.appendChild(answerNode);
    
    if (parsed.reasoning) {
      const toggleBtn = document.createElement('div');
      toggleBtn.className = 'reasoning-toggle';
      toggleBtn.textContent = '👁️ Show inner thoughts';
      
      const reasoningDiv = document.createElement('div');
      reasoningDiv.className = 'reasoning-content';
      reasoningDiv.textContent = parsed.reasoning;
      
      toggleBtn.addEventListener('click', () => {
        reasoningDiv.classList.toggle('show');
        toggleBtn.textContent = reasoningDiv.classList.contains('show')
          ? '🙈 Hide inner thoughts'
          : '👁️ Show inner thoughts';
      });
      
      msgDiv.appendChild(toggleBtn);
      msgDiv.appendChild(reasoningDiv);
    }
  } else {
    msgDiv.textContent = text;
  }
  
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ─── API Communication ──────────────────────────────────────────
async function handleSend() {
  const text = userInput.value.trim();
  if (!text) return;
  
  suggestionChipsContainer.innerHTML = '';
  
  addMessage(text, 'user');
  userInput.value = '';
  userInput.disabled = true;
  sendBtn.disabled = true;
  typingIndicator.classList.add('visible');
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        persona: currentPersona,
        history: chatHistory
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      addMessage(data.reply, 'bot');
      chatHistory.push({ role: 'user', content: text });
      chatHistory.push({ role: 'model', content: data.reply });
    } else {
      addMessage('Error: ' + data.error, 'bot');
    }
  } catch (err) {
    addMessage('Network error. Please try again later.', 'bot');
  } finally {
    userInput.disabled = false;
    sendBtn.disabled = false;
    typingIndicator.classList.remove('visible');
    userInput.focus();
  }
}

// ─── Boot ────────────────────────────────────────────────────────
init();
