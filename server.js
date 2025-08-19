// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// 1) Serve static files from /public
const PUBLIC_DIR = path.join(__dirname, "public");
app.use(express.static(PUBLIC_DIR));

// Optional: explicit root to index.html
app.get("/", (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// 2) Chat API using OPENAI_API_KEY from Render env
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];

    const hasSystem = messages.some(m => m.role === "system");
    const finalMessages = hasSystem
      ? messages
      : [{ role: "system", content: "You are CalmNest — a supportive, concise wellbeing guide." }, ...messages];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: finalMessages,
      temperature: 0.7
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I don’t have a reply right now.";

    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ reply: "Server error talking to the AI." });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`CalmNest running on ${port}`));
