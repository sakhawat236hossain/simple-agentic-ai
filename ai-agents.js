require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

/**
 * 🎯 ANALYZE GOAL
 */
const analyzeGoal = async (goal, durationDays) => {
  const prompt = `
Create a JSON learning plan for: "${goal}" in ${durationDays} days.

Return ONLY JSON in this format:
{
  "dailyTasks": [
    { "day": 1, "title": "Task title", "description": "Details" }
  ]
}
`;

  const completion = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const text = completion.choices[0].message.content;

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("❌ JSON parse error:", text);
    return null;
  }
};

/**
 * 📊 EVALUATE PROGRESS
 */
const evaluateProgress = async (goal, completed, total, daysPassed) => {
  const prompt = `
Goal: ${goal.title}
Duration: ${goal.durationDays} days
Completed tasks: ${completed}/${total}
Days passed: ${daysPassed}

Give a short evaluation and improvement advice.
`;

  const completion = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return {
    feedback: completion.choices[0].message.content
  };
};

module.exports = { analyzeGoal, evaluateProgress };