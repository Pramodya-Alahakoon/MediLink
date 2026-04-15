require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5005;
const MONGO_URI = process.env.MONGO_URI;

async function startServer() {
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error.message);
      process.exit(1);
    }
  } else {
    console.log("MONGO_URI not provided, notification logging disabled.");
  }

  app.listen(PORT, () => {
    console.log(`Notification service running on port ${PORT}`);
  });
}

startServer();
