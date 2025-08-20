// Frontend talks to same-origin API
const SEND_URL = "/api/chat";

const messagesEl = document.getElementById("messages");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");

const state = [
  // harmless placeholder; server injects the real system prompt
  { role: "system", content: "User starts a wellness chat." }
];

// --- Markdown helpers ---
function normalizeMarkdown(md) {
  let text = (md || "");

  // Make numbered/bullet lists start at the line start so Markdown parses
  text = text
    .replace(/(\s|^)(\d+)\.\s/g, "\n$2. ") // numbered lists
    .replace(/(\s|^)[*-]\s/g, "\n- ");     // dash/star bullets

  // Convert lines like **Title** to headings
  text = text.replace(/^\s*\*\*([^*]+)\*\*\s*$/gm, "### $1");

  // Collapse extra blank lines
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

function safeMarkdownToHtml(md) {
  const cleaned = (md || "").replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  const normalized = normalizeMarkdown(cleaned);
  // 'marked' is loaded in chat.html via CDN
  return marked.parse(normalized, { breaks: true });
}

function addMessage(role, text) {
  const row = document.createElement("div");
  row.className = "message " + (role === "user" ? "user" : "bot");

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = safeMarkdownToHtml(text);

  row.appendChild(bubble);
  messagesEl.appendChild(row);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return row;
}

// --- Typing indicator ---
let typingEl = null;
function showTyping() {
  typingEl = document.createElement("div");
  typingEl.className = "message bot";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  const dots = document.createElement("div");
  dots.className = "typing";
  dots.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
  bubble.appendChild(dots);
  typingEl.appendChild(bubble);
  messagesEl.appendChild(typingEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
function hideTyping() {
  if (typingEl) { typingEl.remove(); typingEl = null; }
}

// Greet
addMessage("bot", "### Quick support\n- What’s on your mind today?");

// --- Send flow ---
async function sendMessage() {
  const text = (input.value || "").trim();
  if (!text) return;

  addMessage("user", text);
  state.push({ role: "user", content: text });
  input.value = "";

  showTyping();
  try {
    const res = await fetch(SEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: state })
    });

    if (!res.ok) throw new Error("Bad response");

    const data = await res.json().catch(() => ({}));
    const reply = data.reply || "### Quick support\n- I couldn’t get a reply just now.";
    hideTyping();
    addMessage("bot", reply);
    state.push({ role: "assistant", content: reply });
  } catch (err) {
    console.error(err);
    hideTyping();
    addMessage("bot", "### Quick support\n- I couldn’t reach the server. Try again in a bit.");
  }
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

