const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const FILES = {
  goals: path.join(DATA_DIR, 'goals.json'),
  tasks: path.join(DATA_DIR, 'tasks.json'),
  progress: path.join(DATA_DIR, 'progress.json'),
};

Object.values(FILES).forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2));
  }
});

const read = (file) => JSON.parse(fs.readFileSync(file));
const write = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

const storage = {
  saveGoal(goal) {
    const goals = read(FILES.goals);
    goal.id = Date.now().toString();
    goal.createdAt = new Date().toISOString();
    goals.push(goal);
    write(FILES.goals, goals);
    return goal;
  },

  getAllGoals() {
    return read(FILES.goals);
  },

  getGoal(id) {
    return this.getAllGoals().find(g => g.id === id);
  },

  saveTasks(goalId, tasks) {
    const all = read(FILES.tasks);

    const newTasks = tasks.map((t, i) => ({
      id: `${goalId}-${i}`,
      goalId,
      day: t.day,
      title: t.title,
      description: t.description,
      completed: false
    }));

    write(FILES.tasks, [...all, ...newTasks]);
    return newTasks;
  },

  getTasksByGoal(goalId) {
    return read(FILES.tasks).filter(t => t.goalId === goalId);
  },

  saveProgress(goalId, progress) {
    const all = read(FILES.progress);
    progress.id = `${goalId}-${Date.now()}`;
    all.push(progress);
    write(FILES.progress, all);
    return progress;
  }
};

module.exports = storage;