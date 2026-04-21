require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { analyzeGoal, evaluateProgress } = require('./ai-agents');
const storage = require('./storage');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.json());

/**
 * ✅ CREATE GOAL
 */
app.post("/api/goals", async (req, res) => {
  try {
    const { goalText, durationDays } = req.body;

    if (!goalText || !durationDays) {
      return res.status(400).json({ error: "Goal and duration are required!" });
    }

    const plan = await analyzeGoal(goalText, durationDays);

    if (!plan || !plan.dailyTasks) {
      return res.status(500).json({ error: "Invalid AI response" });
    }

    const goal = storage.saveGoal({
      title: goalText,
      durationDays,
      plan,
      status: 'active'
    });

    const tasks = storage.saveTasks(goal.id, plan.dailyTasks);

    storage.saveProgress(goal.id, {
      goalId: goal.id,
      completedTasks: 0,
      totalTasks: tasks.length,
      progressPercentage: 0
    });

    res.json({ goal, tasks });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * ✅ GET ALL GOALS
 */
app.get("/api/goals", (req, res) => {
  const goals = storage.getAllGoals();
  res.json(goals);
});

/**
 * ✅ EVALUATE PROGRESS
 */
app.post("/api/goals/:goalId/evaluate", async (req, res) => {
  try {
    const goal = storage.getGoal(req.params.goalId);

    if (!goal) {
      return res.status(404).json({ error: "Goal not found!" });
    }

    const tasks = storage.getTasksByGoal(goal.id);
    const completedCount = tasks.filter(t => t.completed).length;

    const createdDays = Math.ceil(
      (Date.now() - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24)
    );

    const evaluation = await evaluateProgress(
      goal,
      completedCount,
      tasks.length,
      createdDays
    );

    res.json(evaluation);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Evaluation failed" });
  }
});

/**
 * 🚀 START SERVER
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});