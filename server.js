import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve /public
const PUBLIC_DIR = path.join(__dirname, "public");
app.use(express.static(PUBLIC_DIR));
app.get("/", (_req, res) => res.sendFile(path.join(PUBLIC_DIR, "index.html")));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];

    // Force clean, structured Markdown with our heading
    const formatSystem = {
      role: "system",
      content:
        "You are CalmNest — a supportive, concise wellbeing guide. FORMAT STRICTLY IN MARKDOWN:\n" +
        "1) Start with the heading exactly: '### calmnest.ai'.\n" +
        "2) Then one short empathetic sentence.\n" +
        "3) Then a section '#### What to try now' with 3–6 bullets ('- ').\n" +
        "4) Optionally a section '#### If it gets heavier' with 1–2 short bullets.\n" +
        "Keep it tight. No long paragraphs. No emojis. No disclaimers unless asked."
    };

    const finalMessages = [formatSystem, ...messages.filter(Boolean)];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: finalMessages,
      temperature: 0.7
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "### calmnest.ai\n- Take one slow breath in and out.\n- Tell me a bit more so I can help.";

    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res
      .status(500)
      .json({ reply: "### calmnest.ai\n- I hit a server error. Try again in a moment." });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`CalmNest running on ${port}`));
