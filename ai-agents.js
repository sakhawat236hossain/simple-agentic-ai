require("dotenv").config();

const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "nvidia/nemotron-3-super-120b-a12b:free",
    messages: [
      { role: "user", content: "Say how are you?" }
    ],
  });

  console.log(completion.choices[0].message.content);
}

main();