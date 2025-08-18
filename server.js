import express from "express";
import cors from "cors";
import fetch from "node-fetch";


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // set this on Render

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = String(req.body.message || "").trim();
    if (!userMessage) return res.status(400).json({ error: "No message provided" });

    const systemPrompt = `
You are CalmNest AI, a warm, evidence-based workplace wellness guide.
Be concise, practical, and human. Offer small, doable steps. Avoid medical diagnosis.
If risk flags (self-harm, harm to others, acute crisis) appear, urge contacting local emergency services and provide general crisis resources.
    `.trim();

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7
      })
    });

    if (!r.ok) {
  const text = await r.text();
  console.error("OpenAI error:", text);
  return res.status(500).json({ error: text });
    }

    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn’t generate a response.";
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CalmNest AI running on http://localhost:${PORT}`);
});
