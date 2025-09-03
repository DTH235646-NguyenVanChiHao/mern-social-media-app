import dotenv from "dotenv";
import mongoose from "mongoose";

// Configure dotenv
dotenv.config();

async function testConnection() {
  try {
    console.log("🔄 Attempting to connect to database...");
    console.log(
      "📍 Connection URL:",
      process.env.MONGO_URL ? "Found in .env" : "❌ NOT FOUND in .env"
    );

    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Database connected successfully!");

    // List databases
    const databases = await mongoose.connection.db.admin().listDatabases();
    console.log(
      "📁 Available databases:",
      databases.databases.map((db) => db.name)
    );

    // Test creating a simple document
    const testSchema = new mongoose.Schema({ test: String });
    const TestModel = mongoose.model("Test", testSchema);

    await TestModel.create({ test: "Connection successful!" });
    console.log("📝 Test document created successfully!");

    await TestModel.deleteMany({}); // Clean up
    console.log("🧹 Test cleanup completed!");

    mongoose.connection.close();
    console.log("🔌 Connection closed");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    if (error.message.includes("authentication")) {
      console.log("💡 Check your username/password in the connection string");
    }
    if (error.message.includes("timeout")) {
      console.log("💡 Check your network access settings in MongoDB Atlas");
    }
  }
}

testConnection();
