const BACKEND_URL = "https://career-twin-backend-zocy.onrender.com/ask";

// Helper function to convert Markdown (* bullets and **bold**) into clean HTML
function formatMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\*\s*(.*)/gm, '• $1')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

// 1. Inject Self-Contained Styles
const style = document.createElement("style");
style.innerHTML = `
  /* Floating Action Button */
  #ct-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.35);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    z-index: 9999;
    animation: ct-pulse 2.2s infinite;
  }
  #ct-fab:hover {
    transform: scale(1.08);
    box-shadow: 0 12px 28px rgba(37, 99, 235, 0.5);
  }

  @keyframes ct-pulse {
    0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.5); }
    70% { box-shadow: 0 0 0 16px rgba(37, 99, 235, 0); }
    100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
  }

  /* Teaser Speech Bubble */
  #ct-teaser {
    position: fixed;
    bottom: 92px;
    right: 24px;
    background: #0f172a;
    color: #ffffff;
    padding: 10px 16px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    z-index: 9998;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: ct-float 3s ease-in-out infinite;
    max-width: 260px;
  }
  #ct-teaser::after {
    content: '';
    position: absolute;
    bottom: -6px;
    right: 24px;
    width: 12px;
    height: 12px;
    background: #0f172a;
    transform: rotate(45deg);
  }

  @keyframes ct-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  /* Chat Window */
  #ct-window {
    position: fixed;
    bottom: 96px;
    right: 24px;
    width: 390px;
    max-width: calc(100vw - 32px);
    height: 540px;
    max-height: calc(100vh - 120px);
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 9999;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: bottom right;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  #ct-window.ct-hidden {
    opacity: 0;
    transform: scale(0.85) translateY(20px);
    pointer-events: none;
  }

  /* Header */
  .ct-header {
    background: linear-gradient(135deg, #0f172a, #1e293b);
    color: white;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ct-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
    margin-right: 10px;
  }
  .ct-header-info h4 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
  }
  .ct-status {
    font-size: 0.75rem;
    color: #4ade80;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .ct-status-dot {
    width: 6px;
    height: 6px;
    background: #4ade80;
    border-radius: 50%;
  }
  .ct-close {
    background: transparent;
    border: none;
    color: #94a3b8;
    font-size: 22px;
    cursor: pointer;
  }
  .ct-close:hover { color: white; }

  /* Quick Actions Bar */
  .ct-action-bar {
    background: #f1f5f9;
    padding: 8px 12px;
    display: flex;
    gap: 6px;
    border-bottom: 1px solid #e2e8f0;
    overflow-x: auto;
  }
  .ct-action-btn {
    background: #ffffff;
    color: #0f172a;
    border: 1px solid #cbd5e1;
    padding: 4px 10px;
    border-radius: 14px;
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s;
  }
  .ct-action-btn:hover {
    background: #2563eb;
    color: white;
    border-color: #2563eb;
  }

  /* Log Area */
  #ct-log {
    flex: 1;
    padding: 14px;
    overflow-y: auto;
    background: #f8fafc;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* Messages */
  .ct-msg {
    max-width: 84%;
    padding: 10px 14px;
    border-radius: 14px;
    font-size: 0.88rem;
    line-height: 1.45;
    word-wrap: break-word;
  }
  .ct-msg.user {
    align-self: flex-end;
    background: #2563eb;
    color: white;
    border-bottom-right-radius: 4px;
  }
  .ct-msg.bot {
    align-self: flex-start;
    background: #ffffff;
    color: #1e293b;
    border-bottom-left-radius: 4px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.03);
  }

  /* Quick Preset Pills */
  .ct-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
  }
  .ct-pill {
    background: #eff6ff;
    color: #2563eb;
    border: 1px solid #bfdbfe;
    padding: 6px 10px;
    border-radius: 18px;
    font-size: 0.8rem;
    cursor: pointer;
    font-weight: 500;
  }
  .ct-pill:hover { background: #dbeafe; }

  /* Bouncing Dots Loading */
  .ct-typing {
    display: flex;
    gap: 4px;
    padding: 12px 16px;
    align-items: center;
  }
  .ct-typing span {
    width: 6px;
    height: 6px;
    background: #94a3b8;
    border-radius: 50%;
    animation: ct-bounce 1.4s infinite ease-in-out both;
  }
  .ct-typing span:nth-child(1) { animation-delay: -0.32s; }
  .ct-typing span:nth-child(2) { animation-delay: -0.16s; }

  @keyframes ct-bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }

  /* Footer Input */
  .ct-footer {
    padding: 12px;
    background: #ffffff;
    border-top: 1px solid #e2e8f0;
    display: flex;
    gap: 8px;
  }
  #ct-input {
    flex: 1;
    border: 1px solid #cbd5e1;
    border-radius: 20px;
    padding: 8px 14px;
    font-size: 0.9rem;
    outline: none;
  }
  #ct-input:focus { border-color: #2563eb; }
  #ct-send-btn {
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  #ct-send-btn:hover { background: #1d4ed8; }
`;
document.head.appendChild(style);

// 2. Render Widget Markup
const widgetRoot = document.getElementById("career-twin-widget") || document.body;
widgetRoot.innerHTML += `
  <!-- Floating Speech Bubble Teaser -->
  <div id="ct-teaser">
    <span id="ct-teaser-text">👋 Hiring for Automation? Ask me anything about Rifa!</span>
  </div>

  <!-- Floating Button -->
  <div id="ct-fab" title="Chat with Rifa's AI Twin">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
  </div>

  <!-- Chat Window -->
  <div id="ct-window" class="ct-hidden">
    <div class="ct-header">
      <div style="display:flex; align-items:center;">
        <div class="ct-avatar">R</div>
        <div class="ct-header-info">
          <h4>Rifa's Career Twin</h4>
          <div class="ct-status"><span class="ct-status-dot"></span> AI Assistant · Online</div>
        </div>
      </div>
      <button class="ct-close" id="ct-close-btn">&times;</button>
    </div>

    <!-- One-Click Resume & GitHub Bar -->
    <div class="ct-action-bar">
      <a href="Rifa_Sherin_Resume.pdf" target="_blank" class="ct-action-btn">📄 Resume (PDF)</a>
      <a href="https://github.com/rifaashrn" target="_blank" class="ct-action-btn">💻 GitHub</a>
      <button onclick="sendQuickQuestion('What locations is Rifa open to and what is her visa status?')" class="ct-action-btn">📍 Locations & Visa</button>
    </div>

    <div id="ct-log">
      <!-- Witty AI Greeting -->
      <div class="ct-msg bot">
        Hi! I'm <b>Rifa's AI Twin 🤖</b>. Ask me anything about her skills, experience, or automation projects!
      </div>
      
      <!-- Recruiter Shortcut Menu -->
      <div class="ct-pills">
        <button class="ct-pill" onclick="sendQuickQuestion('Why should we hire Rifa in 30 seconds?')">💼 Why Hire Rifa?</button>
        <button class="ct-pill" onclick="sendQuickQuestion('What is Rifa\'s availability and notice period?')">⚡ Availability & Notice</button>
        <button class="ct-pill" onclick="forwardToHiringManager()">📨 Forward to Boss</button>
      </div>
    </div>

    <div class="ct-footer">
      <input id="ct-input" type="text" placeholder="Ask a question..." />
      <button id="ct-send-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </button>
    </div>
  </div>
`;

// 3. Rotating Teaser Messages
const teaserMessages = [
  "👋 Hiring for Automation? Ask me about Rifa!",
  "🤖 Ask me about Rifa's Bank Validation system!",
  "⚡ Looking for an Intelligent Automation Dev in Qatar?",
  "💡 Ask me: 'Why should we hire Rifa?'"
];
let teaserIdx = 0;
setInterval(() => {
  teaserIdx = (teaserIdx + 1) % teaserMessages.length;
  const elem = document.getElementById("ct-teaser-text");
  if (elem) elem.innerText = teaserMessages[teaserIdx];
}, 6000);

// 4. Toggle Logic
const fab = document.getElementById("ct-fab");
const win = document.getElementById("ct-window");
const closeBtn = document.getElementById("ct-close-btn");
const teaser = document.getElementById("ct-teaser");

window.toggleChat = function() {
  win.classList.toggle("ct-hidden");
  if (!win.classList.contains("ct-hidden")) {
    teaser.style.display = "none";
    document.getElementById("ct-input").focus();
  }
};

const toggleChat = window.toggleChat;

fab.addEventListener("click", toggleChat);
teaser.addEventListener("click", toggleChat);
closeBtn.addEventListener("click", toggleChat);

// 5. Forward to Boss Email Snippet Builder
window.forwardToHiringManager = function() {
  const log = document.getElementById("ct-log");
  log.innerHTML += `<div class="ct-msg user">📨 Generate email snippet for my Hiring Manager</div>`;
  
  const snippetText = `Hi Team,\n\nI reviewed Rifa Sherin's profile — an Intelligent Automation Developer (UiPath, Python, n8n, RAG/AI) based in Doha, Qatar with a Transferable Visa (NOC).\n\nCheck out her live portfolio & AI Twin: https://rifaashrn.github.io`;
  
  log.innerHTML += `
    <div class="ct-msg bot">
      Here is a short blurb you can copy & paste directly into an email to your team lead or HR:<br><br>
      <div style="background:#f1f5f9; padding:10px; border-radius:8px; font-family:monospace; font-size:0.8rem; color:#334155; white-space:pre-wrap;">${snippetText}</div>
      <button onclick="navigator.clipboard.writeText(\`${snippetText}\`); alert('Copied to clipboard! ✅');" class="ct-action-btn" style="margin-top:8px;">📋 Copy Snippet</button>
    </div>
  `;
  log.scrollTop = log.scrollHeight;
};

// 6. Send Chat Message (With Concurrency Lock & Detailed Network Errors)
let isProcessing = false;

async function sendChatMessage(text) {
  if (isProcessing) return; // Prevent double-clicks / rapid concurrent requests

  const input = document.getElementById("ct-input");
  const sendBtn = document.getElementById("ct-send-btn");
  const log = document.getElementById("ct-log");
  const question = text || input.value.trim();
  if (!question) return;

  isProcessing = true;
  input.disabled = true;
  sendBtn.style.opacity = "0.5";

  // Add User Message
  log.innerHTML += `<div class="ct-msg user">${question}</div>`;
  if (!text) input.value = "";

  // Add Typing Indicator
  const typingId = "ct-typing-" + Date.now();
  log.innerHTML += `
    <div id="${typingId}" class="ct-msg bot ct-typing">
      <span></span><span></span><span></span>
    </div>
  `;
  log.scrollTop = log.scrollHeight;

    const maxAttempts = 2;
    let attempt = 0;
    let success = false;
    while (attempt < maxAttempts && !success) {
      try {
        const res = await fetch(BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question })
        });
        const data = await res.json();
        const typingElem = document.getElementById(typingId);
        if (res.ok && data.answer) {
          typingElem.outerHTML = `<div class="ct-msg bot">${formatMarkdown(data.answer)}</div>`;
          success = true;
        } else if (data.detail) {
          typingElem.outerHTML = `<div class="ct-msg bot" style="color:#dc2626;">Server Error (${res.status}): ${JSON.stringify(data.detail)}</div>`;
          // Do not retry on server error details
          break;
        } else {
          typingElem.outerHTML = `<div class="ct-msg bot" style="color:#dc2626;">Server Error (${res.status}): Please check backend service.</div>`;
          // Do not retry on generic server error
          break;
        }
      } catch (err) {
        attempt++;
        if (attempt >= maxAttempts) {
          const typingElem = document.getElementById(typingId);
          typingElem.outerHTML = `<div class="ct-msg bot" style="color:#dc2626;">Network Error: ${err.message || 'Connection lost. Please try again later.'}</div>`;
        } else {
          // wait a short time before retry
          await new Promise(r => setTimeout(r, 500));
        }
      }
    }
    isProcessing = false;
    input.disabled = false;
    sendBtn.style.opacity = "1";
    input.focus();
    log.scrollTop = log.scrollHeight;
}

window.sendQuickQuestion = function(text) {
  sendChatMessage(text);
};

document.getElementById("ct-send-btn").addEventListener("click", () => sendChatMessage());
document.getElementById("ct-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendChatMessage();
});