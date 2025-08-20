// Chat demo with hard cap
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
  enforceLimit();
}

function enforceLimit() {
  const count = stream.querySelectorAll(".chat-message").length; // user + bot
  if (count >= MESSAGE_LIMIT) {
    input.disabled = true;
    sendBtn.disabled = true;

    if (!document.getElementById("limit-note")) {
      const note = document.createElement("div");
      note.id = "limit-note";
      note.className = "system-note";
      note.innerHTML =
        `You’ve reached today’s free support limit. For extended help, email <a href="mailto:help@calmnest.ai">help@calmnest.ai</a>.`;
      stream.appendChild(note);
      stream.scrollTop = stream.scrollHeight;
    }
    openLimitModal();
  }
}

function openLimitModal() { limitModal.style.display = "flex"; }
function closeModal() { limitModal.style.display = "none"; }
closeLimit.addEventListener("click", closeModal);

sendBtn.addEventListener("click", () => {
  if (!input.value.trim()) return;
  appendMessage("user", input.value.trim());
  input.value = "";
  setTimeout(() => appendMessage("bot", "Got it. Tell me a bit more."), 400);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
