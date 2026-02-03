import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const DEEPL_KEY = process.env.DEEPL_KEY;
const DEEPL_URL = "https://api-free.deepl.com/v2/translate";

app.post("/translate", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text" });

  try {
    const params = new URLSearchParams();
    params.append("auth_key", DEEPL_KEY);
    params.append("text", text);

    const isGerman = /\b(und|nicht|ich|das|ist|du|sie)\b/i.test(text);
    params.append("target_lang", isGerman ? "HU" : "DE");

    const response = await fetch(DEEPL_URL, {
      method: "POST",
      body: params
    });

    const data = await response.json();
    res.json({ result: data.translations[0].text });

  } catch {
    res.status(500).json({ error: "Translation failed" });
  }
});

app.listen(3000, () => console.log("Backend running"));
