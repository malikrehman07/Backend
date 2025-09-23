const mongoose = require("mongoose");
require("dotenv").config();

let isConnected = false; // track global connection

const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.aar1elp.mongodb.net/hackathon`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    isConnected = true;
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection Failed", err);
    throw err; // important so your API knows the connection failed
  }
};

module.exports = connectDB;
