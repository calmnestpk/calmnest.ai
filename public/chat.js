const SEND_URL = "/api/chat";

const messagesEl = document.getElementById("messages");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");

const state = [
  { role: "system", content: "User starts a wellness chat." } // server injects the real system prompt
];

// --- Markdown helpers ---
function normalizeMarkdown(md) {
  let text = (md || "");
  text = text
    .replace(/(\s|^)(\d+)\.\s/g, "\n$2. ")
    .replace(/(\s|^)[*-]\s/g, "\n- ");
  text = text.replace(/^\s*\*\*([^*]+)\*\*\s*$/gm, "### $1");
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}
function safeMarkdownToHtml(md) {
  const cleaned = (md || "").replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  const normalized = normalizeMarkdown(cleaned);
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

// Typing indicator
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
function hideTyping() { if (typingEl) { typingEl.remove(); typingEl = null; } }

// Greeting
addMessage("bot", "### calmnest.ai\n- What’s on your mind today?");

// Send flow
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
    const reply = data.reply || "### calmnest.ai\n- I couldn’t get a reply just now.";
    hideTyping();
    addMessage("bot", reply);
    state.push({ role: "assistant", content: reply });
  } catch (err) {
    console.error(err);
    hideTyping();
    addMessage("bot", "### calmnest.ai\n- I couldn’t reach the server. Try again in a bit.");
  }
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); sendMessage(); }
});
