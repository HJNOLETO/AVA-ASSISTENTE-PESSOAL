import "dotenv/config";

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not found in .env");

  const url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
  console.log(`Testing Gemini via OpenAI Proxy...`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gemini-2.5-flash",
      messages: [{ role: "user", content: "Responda apenas: funcionou" }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Failed:", response.status, text);
    return;
  }

  const data = await response.json();
  console.log("Success! Response:");
  console.log(JSON.stringify(data.choices[0].message, null, 2));
}

testGemini().catch(console.error);
