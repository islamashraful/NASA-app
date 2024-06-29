const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const mongoose = require("mongoose");

async function connectMongo() {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
}

async function disconnectMongo() {
  await mongoose.disconnect();
}

module.exports = {
  connectMongo,
  disconnectMongo,
};
