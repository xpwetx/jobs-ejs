// utils/seed_db.js
const User = require("../models/User");
const Task = require("../models/Task");
const mongoose = require("mongoose");
const { factory } = require("factory-girl");

// Define a User factory
factory.define("user", User, {
  email: factory.sequence("User.email", (n) => `user${n}@example.com`),
  name: factory.sequence("User.name", (n) => `Test User ${n}`),
  password: "TestPassword123",
});

// Define a Task factory
factory.define("task", Task, {
  name: factory.sequence("Task.name", (n) => `Task ${n}`),
  task: factory.sequence("Task.task", (n) => `Task details ${n}`),
  status: "pending",
  createdBy: factory.assoc("user", "_id"),
});

// Seed DB: create a single user and 20 tasks
async function seed_db() {
  await Promise.all(
    Object.values(mongoose.connection.collections).map((collection) =>
      collection.deleteMany({})
    )
  );

  const user = await factory.create("user");
  for (let i = 0; i < 20; i++) {
    await factory.create("task", { createdBy: user._id });
  }

  return { user, tasksCount: 20, password: "TestPassword123" };
}

module.exports = { seed_db };
