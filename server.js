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

  const isGerman = /\b(und|nicht|ich|das|ist|du|sie|wie|was)\b/i.test(text);
  const sourceLang = isGerman ? "DE" : "HU";
  const targetLang = isGerman ? "HU" : "DE";

  try {
    const params = new URLSearchParams();
    params.append("text", text);
    params.append("source_lang", sourceLang);
    params.append("target_lang", targetLang);

    const response = await fetch(DEEPL_URL, {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${DEEPL_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("DeepL API error:", data);
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
