const http = require("http");
const { connectMongo } = require("./services/mongo");

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

(async function () {
  await connectMongo();
  await loadPlanetsData();
  await loadLaunchData();
  server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
})();
