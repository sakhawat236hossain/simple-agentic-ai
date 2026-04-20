require("dotenv").config();

const OpenAI = require("openai");

// 🔐 OpenRouter config
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// 🎯 Goal Analyzer Function
const analyzeGoal = async (goal, duration = "7 days") => {
  if (!goal) {
    console.log("❌ Please provide a goal!");
    return;
  }

  const prompt = `Analyze the goal: "${goal}" and create a step-by-step learning plan to achieve it in ${duration}.
  
1. Break down the goal into smaller, manageable tasks.
2. Suggest resources (books, courses, websites) for each task.
3. Provide a timeline for completing each task within the overall duration.
4. Include tips for staying motivated and tracking progress.

Example Output:
1. Task: Learn Python basics
   - Resources: "Automate the Boring Stuff with Python" (book), Codecademy Python course (website)
   - Timeline: Day 1-2
2. Task: Build a simple project
   - Resources: "Python Crash Course" (book), freeCodeCamp Python projects (website)
   - Timeline: Day 3-5
3. Task: Practice coding challenges
   - Resources: LeetCode (website), "Cracking the Coding Interview" (book)
   - Timeline: Day 6-7
Tips:
- Set daily goals and review progress at the end of each day.
- Join online communities (e.g., Reddit, Stack Overflow) for support and motivation.
- Use tools like Trello or Notion to organize tasks and track progress.

return the learning plan in a clear, concise format.

return the output as a structured list with tasks, resources, timelines, and tips.

return the output in a format that can be easily read and followed by a user.

  return the output in a way that is actionable and provides clear steps for the user to follow.

  return the output in a way that is engaging and motivates the user to take action towards achieving their goal.

    return the output in a way that is personalized to the user's goal and provides relevant resources and tips for achieving it.



  `;

  try {
    console.log("⏳ Generating plan...\n");

    const completion = await openai.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [
        { role: "system", content: "You are a helpful assistant that creates personalized learning plans based on user goals." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      
    });

    const result = completion.choices[0].message.content;

    console.log("✅ Your Learning Plan:\n");
    console.log(result);

  } catch (error) {
    console.error("❌ Error occurred:", error.message);
  }
};

// 🚀 CLI Input Support
const userGoal = process.argv[2];

// যদি terminal থেকে input না দেন, default goal ব্যবহার করবে
analyzeGoal(userGoal || "Learn Python programming")
  .then(() => console.log("\n🎉 Done"))
  .catch((err) => console.error(err));