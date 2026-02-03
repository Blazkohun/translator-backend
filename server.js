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
  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  // egyszerű, de stabil nyelvdetektálás
  const isGerman = /\b(und|nicht|ich|das|ist|du|sie|wie|was)\b/i.test(text);

  const targetLang = isGerman ? "HU" : "DE";
  const sourceLang = isGerman ? "DE" : "HU";

  try {
    const params = new URLSearchParams({
      auth_key: DEEPL_KEY,
      text: text,
      source_lang: sourceLang,
      target_lang: targetLang
    });

    const response = await fetch(DEEPL_URL, {
      method: "POST",
      body: params
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("DeepL error:", data);
      return res.status(500).json({ error: data });
    }

    res.json({ result: data.translations[0].text });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Translation failed" });
  }
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
