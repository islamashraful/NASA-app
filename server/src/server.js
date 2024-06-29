const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

(async function () {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);

  await loadPlanetsData();

  server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
})();
