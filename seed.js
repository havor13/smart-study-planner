import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://sampsonhavor43_db_user:Magnificent@cluster0.wbpt5n3.mongodb.net/smart_study_planner?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    const db = client.db("smart_study_planner");

    // Users
    const users = await db.collection("users").insertMany([
      { username: "sampson", email: "sampson@example.com", passwordHash: "hashed_pw_123", createdAt: new Date("2026-07-08T20:00:00Z") },
      { username: "julyanne", email: "julyanne@example.com", passwordHash: "hashed_pw_456", createdAt: new Date("2026-07-08T20:05:00Z") },
      { username: "uthman", email: "uthman@example.com", passwordHash: "hashed_pw_789", createdAt: new Date("2026-07-08T20:10:00Z") }
    ]);

    // Courses
    const courses = await db.collection("courses").insertMany([
      { userId: users.insertedIds[0], name: "CSE 499 Senior Project", description: "Smart Study Planner development", startDate: new Date("2026-07-01"), endDate: new Date("2026-12-01") },
      { userId: users.insertedIds[1], name: "Web Development Basics", description: "Intro to HTML, CSS, JS", startDate: new Date("2026-07-01"), endDate: new Date("2026-09-30") }
    ]);

    // Tasks
    const tasks = await db.collection("tasks").insertMany([
      { userId: users.insertedIds[0], courseId: courses.insertedIds[0], title: "Design Database Schema", description: "Create tables for planner", priority: 5, dueDate: new Date("2026-07-10"), status: "pending", createdAt: new Date("2026-07-08T20:00:00Z") },
      { userId: users.insertedIds[0], courseId: courses.insertedIds[0], title: "Frontend Setup", description: "Initialize React project", priority: 4, dueDate: new Date("2026-07-15"), status: "pending", createdAt: new Date("2026-07-08T20:00:00Z") },
      { userId: users.insertedIds[1], courseId: courses.insertedIds[1], title: "Build Portfolio Page", description: "HTML/CSS assignment", priority: 3, dueDate: new Date("2026-07-20"), status: "pending", createdAt: new Date("2026-07-08T20:00:00Z") }
    ]);

    // Reminders
    await db.collection("reminders").insertMany([
      { taskId: tasks.insertedIds[0], reminderTime: new Date("2026-07-09T09:00:00Z"), method: "popup" },
      { taskId: tasks.insertedIds[1], reminderTime: new Date("2026-07-14T18:00:00Z"), method: "email" }
    ]);

    // Progress
    await db.collection("progress").insertOne({
      userId: users.insertedIds[0],
      taskId: tasks.insertedIds[0],
      completedAt: new Date("2026-07-08T20:00:00Z")
    });

    // Study Suggestions
    await db.collection("study_suggestions").insertMany([
      { userId: users.insertedIds[0], suggestedTime: new Date("2026-07-09T07:00:00Z"), reason: "Morning focus block for schema work" },
      { userId: users.insertedIds[1], suggestedTime: new Date("2026-07-10T19:00:00Z"), reason: "Evening study session for portfolio" }
    ]);

    console.log("✅ Seed data inserted successfully!");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  } finally {
    await client.close();
  }
}

seed();
