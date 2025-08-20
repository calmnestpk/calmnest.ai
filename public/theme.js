// Basic screen switching
const screens = ["screen-landing", "screen-personal", "screen-corporate"];
function show(id) {
  screens.forEach(s => document.getElementById(s).classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
}
document.getElementById("btn-personal").onclick = () => show("screen-personal");
document.getElementById("btn-corporate").onclick = () => show("screen-corporate");
document.querySelectorAll(".back").forEach(b => b.addEventListener("click", e => show(e.currentTarget.dataset.go)));

// Chat basics (front-end only demo)
const MESSAGE_LIMIT = 30;
const stream = document.getElementById("chat-stream");
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const limitModal = document.getElementById("limit-modal");
const closeLimit = document.getElementById("close-limit");

function appendMessage(role, text) {
  const row = document.createElement("div");
  row.className = `chat-message ${role}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerText = text;
  row.appendChild(bubble);
  stream.appendChild(row);
  stream.scrollTop = stream.scrollHeight;
  updateMessageCountAndMaybeLock();
}

function updateMessageCountAndMaybeLock() {
  const count = stream.querySelectorAll(".chat-message").length;
  if (count >= MESSAGE_LIMIT) {
    if (input) input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    if (!document.getElementById("limit-note")) {
      const note = document.createElement("div");
      note.id = "limit-note";
      note.className = "system-note";
      note.innerHTML =
        `You’ve reached today’s free support limit. For extended help, email <a href="mailto:help@calmnest.ai">help@calmnest.ai</a>.`;
      stream.appendChild(note);
      openLimitModal();
      stream.scrollTop = stream.scrollHeight;
    }
  }
}

function openLimitModal() {
  limitModal.classList.add("show");
}
function hideLimitModal() {
  limitModal.classList.remove("show");
}
closeLimit.addEventListener("click", hideLimitModal);

// Send button (mock reply)
sendBtn.addEventListener("click", () => {
  if (!input.value.trim()) return;
  appendMessage("user", input.value.trim());
  input.value = "";
  // mock bot reply
  setTimeout(() => appendMessage("bot", "Got it. Tell me a bit more."), 500);
});

// Enter key
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
