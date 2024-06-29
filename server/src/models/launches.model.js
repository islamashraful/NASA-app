const launchesDriver = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 102,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function saveLaunch(launch) {
  await launchesDriver.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDriver.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launchesDriver.find({});
}

async function addNewLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error("No matching planet found");
  }

  const latestFlightNumber = (await getLatestFlightNumber()) + 1;

  await saveLaunch({
    ...launch,
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "SpaceX"],
    flightNumber: latestFlightNumber,
  });
}

async function existsLaunchWithId(launchId) {
  return await launchesDriver.findOne({ flightNumber: launchId });
}

async function abortLaunchById(launchId) {
  return await launchesDriver.updateOne(
    { flightNumber: launchId },
    { success: false, upcoming: false }
  );
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
