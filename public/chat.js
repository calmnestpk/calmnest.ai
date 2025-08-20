<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>calmnest.ai for individuals</title>
  <link rel="stylesheet" href="/styles.css?v=6" />
</head>
<body class="bg">
  <header class="topbar">
    <a class="back" href="/index.html">←</a>
    <h1>calmnest.ai for individuals</h1>
  </header>

  <section class="chat-wrap">
    <div id="chat-stream" class="chat-stream">
      <div class="chat-message bot">
        <div class="bubble">Hi! I’m CalmNest. Share what’s on your mind and I’ll guide you step by step.</div>
      </div>
    </div>

    <div class="chat-input-row">
      <input id="chat-input" placeholder="Type here…" />
      <button id="send-btn">Send</button>
    </div>
    <p class="disclaimer">Not for emergencies. If you’re at risk, contact local emergency services.</p>
  </section>

  <!-- Limit modal (hidden by default) -->
  <div id="limit-modal" class="modal" style="display:none">
    <div class="modal-card">
      <h3>Limit reached</h3>
      <p>You’ve reached today’s free support limit.</p>
      <p>For extended help, email <a href="mailto:help@calmnest.ai">help@calmnest.ai</a>.</p>
      <div class="row">
        <a class="btn" href="mailto:help@calmnest.ai">Email support</a>
        <button class="btn outline" id="close-limit">Close</button>
      </div>
      <p class="tiny">If you’re in immediate danger, call local emergency services.</p>
    </div>
  </div>

  <script src="/chat.js?v=6"></script>
</body>
</html>
