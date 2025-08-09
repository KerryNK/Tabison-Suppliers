const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    // MongoDB connection string
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/suppliers-db"

    console.log("🔄 Connecting to MongoDB...")

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err)
    })

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected")
    })

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected")
    })

    // Graceful shutdown
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close()
        console.log("🔒 MongoDB connection closed through app termination")
        process.exit(0)
      } catch (error) {
        console.error("❌ Error closing MongoDB connection:", error)
        process.exit(1)
      }
    })
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)
    console.error("Full error:", error)
    process.exit(1)
  }
}

module.exports = connectDB
