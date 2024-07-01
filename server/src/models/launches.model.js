const axios = require("axios");

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

const SPACE_X_API_END_POINT = "https://api.spacexdata.com/v4/launches/query";

async function loadLaunchData() {
  const spaceXData = await launchesDriver.findOne({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (spaceXData) {
    console.log("Launches data already exists in database");
    return;
  }

  console.log("Loading launches data...");
  const response = await axios.post(SPACE_X_API_END_POINT, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed.");
  }

  const launchDocs = response.data.docs;

  for (let item of launchDocs) {
    const doc = {
      flightNumber: item.flight_number,
      mission: item.name,
      rocket: item.rocket.name,
      launchDate: item.date_local,
      customers: item.payloads.map((p) => p.customers.join(",")),
      upcoming: item.upcoming,
      success: item.success,
    };

    await saveLaunch(doc);
  }
  console.log("Finished saving launchs data in database");
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  loadLaunchData,
  existsLaunchWithId,
  abortLaunchById,
};
